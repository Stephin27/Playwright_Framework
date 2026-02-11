export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
    AGENT = 'AGENT',
    ENV = 'ENV',
}

export class Logger {
    /**
     * Get a formatted timestamp.
     */
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Core logging method.
     */
    private static log(level: LogLevel, message: string, classification?: string) {
        const timestamp = this.getTimestamp();
        const category = classification ? ` [${classification}]` : '';
        const output = `[${timestamp}] [${level}]${category}: ${message}`;

        switch (level) {
            case LogLevel.ERROR:
                console.error(output);
                break;
            case LogLevel.WARN:
            case LogLevel.AGENT:
            case LogLevel.ENV:
                console.warn(output);
                break;
            default:
                console.log(output);
        }
    }

    static info(message: string) {
        this.log(LogLevel.INFO, message);
    }

    static warn(message: string, classification?: string) {
        this.log(LogLevel.WARN, message, classification);
    }

    static error(message: string, classification?: string) {
        this.log(LogLevel.ERROR, message, classification);
    }

    static debug(message: string) {
        this.log(LogLevel.DEBUG, message);
    }

    static agent(message: string, intent?: string) {
        this.log(LogLevel.AGENT, message, intent ? `INTENT: ${intent}` : 'AGENTIC_FLOW');
    }

    static env(message: string) {
        this.log(LogLevel.ENV, message, 'ENVIRONMENT');
    }
}
