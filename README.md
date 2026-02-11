# Playwright Multi-Agent Framework

This repository implements a high-resilience, multi-agent automation framework built on top of Playwright. It leverages the Model Context Protocol (MCP) and specialized agents (Navigator, Validator, Recovery, Reporter) to minimize flakiness and maintenance overhead.

## 🚀 Key Features

- **Multi-Agent Architecture**: Discrete roles for discovery, validation, recovery, and reporting.
- **Autonomous Recovery (Self-Healing)**: Automatically reverts to POM fallbacks if agentic discovery fails.
- **Structured Logging**: Categorized failure classification (ENV, FUNC, AGENT) for faster root cause analysis.
- **Data-Driven Testing**: Integrated support for Excel-based data-driven scenarios.
- **Rich Reporting**: Comprehensive Allure reports with embedded failure snapshots and classification tags.

## 📁 Repository Structure

```text
.
├── .github/agents/      # Agent definition files (Navigator, Planner, Healer)
├── data/                # Test data files (Excel, JSON)
├── pages/               # Page Object Model (POM) classes
│   ├── BasePage.ts      # Agentic-aware base class
│   └── ...
├── tests/               # Playwright test suites
├── utils/               # Shared utilities
│   ├── Logger.ts        # Structured logging logic
│   ├── RecoveryManager.ts # Orchestrates retries and fallbacks
│   └── ...
└── Multi_Agent_Playwright_Architecture.md # Detailed design spec
```

## ⚙️ Environment Configuration

The framework uses `dotenv` for managing environment-specific settings. 

1. **Setup**: Copy the template to create your local environment file:
   ```bash
   cp .env.example .env
   ```
2. **Configuration**: Edit `.env` to set your target URLs, browser preferences, and execution parameters.

## 🛠️ Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Execute Tests**:
   ```bash
   npm test
   ```

3. **Generate Report**:
   ```bash
   npm run report
   ```

For detailed instructions, refer to the [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md).
