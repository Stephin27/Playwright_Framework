import { Page, Locator } from '@playwright/test';
import { Logger } from './Logger';

export interface AgenticOptions {
    intent: string;
    fallbackLocator: Locator;
    retryLimit?: number;
}

export class RecoveryManager {
    private readonly page: Page;
    private readonly defaultRetryLimit = 3;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Executes an action with an agentic intent, falling back to a traditional locator if needed.
     * @param options Options for the agentic action and fallback.
     * @param action The action to perform (e.g., click, fill).
     */
    async executeWithFallback(
        options: AgenticOptions,
        action: (locator: Locator) => Promise<void>
    ): Promise<void> {
        const retryLimit = options.retryLimit || this.defaultRetryLimit;
        let lastError: Error | null = null;

        Logger.agent(`Action intent: "${options.intent}"`, options.intent);

        // 1. Try Traditional POM Locator first
        try {
            await action(options.fallbackLocator);
            return;
        } catch (error) {
            Logger.warn(`POM Locator failed: ${options.fallbackLocator.toString()}. Entering Recovery...`, 'RECOVERY');
            lastError = error as Error;
        }

        // 2. Fallback to Healer Agent (Semantic Discovery)
        Logger.agent(`Healer Agent intervening for intent: "${options.intent}"`, 'HEALER');

        for (let attempt = 1; attempt <= retryLimit; attempt++) {
            try {
                // 1. Try finding a button with the text directly
                let healedLocator = this.page.getByRole('button', { name: options.intent, exact: false }).first();

                if (!(await healedLocator.isVisible({ timeout: 1000 }))) {
                    // 2. If no button matches, find the text anywhere
                    const textLocator = this.page.getByText(options.intent, { exact: false }).first();

                    if (await textLocator.isVisible({ timeout: 1000 })) {
                        // Check if this element is a button. If not, look for a button nearby (sibling or parent's child)
                        const isButton = await textLocator.evaluate(el => el.tagName === 'BUTTON');

                        if (isButton) {
                            healedLocator = textLocator;
                        } else {
                            Logger.info(`Matched label "${options.intent}". Searching for associated button in the same container...`);
                            // Go up to the nearest row/container and find the button within it
                            // This handles common UI grids/forms where label and button are in the same 'row'
                            const rowContainer = textLocator.locator('xpath=./ancestor::*[contains(@class, "row") or contains(@class, "section") or self::tr][1]');
                            healedLocator = rowContainer.locator('button').first();
                        }
                    }
                }

                if (await healedLocator.isVisible({ timeout: 2000 })) {
                    Logger.info(`Healer Agent found matching button for "${options.intent}"`);
                    await action(healedLocator);
                    this.alertHealedSelector(options.intent, healedLocator);
                    return;
                }

                throw new Error(`Could not find interactive element matching intent: "${options.intent}"`);

            } catch (error) {
                lastError = error as Error;
                Logger.warn(`Healing attempt ${attempt}/${retryLimit} failed.`, 'HEALER');
                await this.page.waitForTimeout(1000);
            }
        }

        this.classifyAndLogError(lastError!, options.intent);
        throw lastError;
    }

    /**
     * Classifies the error to provide better root cause analysis.
     */
    private classifyAndLogError(error: Error, intent: string) {
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            Logger.error(`CRITICAL: Healing failed due to TIMEOUT for "${intent}"`, 'ENV');
        } else {
            Logger.error(`CRITICAL: Healing failed for "${intent}": ${error.message}`, 'UNKNOWN');
        }
    }

    /**
     * Alerts the system/user that a fallback was required, suggesting a "Healed" state.
     */
    private alertHealedSelector(intent: string, healedLocator: Locator) {
        Logger.warn(`HEALED: Used semantic locator for "${intent}". Suggested update: page.getByText('${intent}')`, 'HEALER');
    }
}
