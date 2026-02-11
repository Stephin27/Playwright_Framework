# Execution Guide: Playwright Multi-Agent Framework

This guide provides detailed instructions on running, configuring, and maintaining the Multi-Agent Playwright framework.

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- **npm**: Version 8.0.0 or higher.
- **Java**: Required for Allure report generation.

## ⚙️ Environment Management

The framework supports dynamic configuration via `.env` files. This allows you to switch between different environments (Staging, Production) without changing the code.

### Configuration Files
- **`.env`**: Your local configuration file (ignored by git).
- **`.env.example`**: A template containing all required variables.

### Key Variables
- `BASE_URL`: The entry point for element tests.
- `BROWSER`: Choose between `chromium`, `firefox`, or `webkit`.
- `HEADLESS`: Set to `true` for background execution.
- `WORKERS`: Number of parallel workers.

## 🏃 Running Tests

### Standard Execution
To run all tests and generate a single-file report:
```bash
npm test
```

### Running Specific Tests
To run a specific test file or directory:
```bash
npx playwright test tests/foms/practiceForm.spec.ts
```

### Headless vs. Headed Mode
Modify `playwright.config.ts`:
- Set `headless: true` for CI environments.
- Set `headless: false` for local debugging.

## 📊 Reporting

The framework uses **Allure** for advanced reporting.

1. **Local View**:
   ```bash
   npm run report
   ```
2. **Output Location**: Results are stored in `allure-results/`, and the report is generated in `allure-report/`.

## 🔍 Understanding Logs & Classification

The framework categorizes failures in the terminal and report logs:

- **[INFO]**: General execution steps.
- **[AGENT]**: Logs relating to semantic discovery or agentic decision-making.
- **[RECOVERY]**: Alerts when an agentic threshold is reached and a fallback is triggered.
- **[HEAL_REQUIRED]**: Suggestions for updating POM selectors based on successful fallbacks.
- **[ENV]**: Failures likely caused by environment issues (timeouts, latency).
- **[FUNC]**: Functional application failures (broken features).

## 💡 Adding New Tests

1. Create a Page Object in `pages/` extending `BasePage`.
2. Use `safeClick` and `safeFill` for critical interactions to enable the self-healing fallback strategy.
3. Define the test case in `tests/` using standard Playwright syntax.
