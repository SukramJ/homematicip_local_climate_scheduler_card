# Contributing to HomematicIP Local Climate Scheduler Card

First off, thank you for considering contributing to this project! It's people like you that make this card better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include your Home Assistant version
- Include your browser and version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the TypeScript styleguide
- Include screenshots and animated GIFs in your pull request whenever possible
- End all files with a newline
- Write tests for new features
- Ensure all tests pass before submitting

## Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/homematicip_local_climate_scheduler_card.git
   cd homematicip_local_climate_scheduler_card
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a branch:

   ```bash
   git checkout -b feature/my-new-feature
   ```

5. Make your changes and test them:

   ```bash
   npm run build
   npm test
   npm run lint
   ```

6. Commit your changes:

   ```bash
   git commit -m "Add some feature"
   ```

7. Push to your fork:

   ```bash
   git push origin feature/my-new-feature
   ```

8. Create a Pull Request

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Use ESLint to check your code

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting
- Aim for high code coverage
- Test edge cases

## Project Structure

```
.
├── src/
│   ├── homematicip-local-climate-scheduler-card.ts  # Main card component
│   ├── types.ts                                     # Type definitions
│   ├── utils.ts                                     # Utility functions
│   ├── *.test.ts                                    # Test files
├── dist/                                            # Build output
├── .github/
│   └── workflows/                  # CI/CD workflows
├── hacs.json                       # HACS configuration
├── info.md                         # HACS info
├── package.json                    # Dependencies
├── rollup.config.mjs              # Build configuration
└── tsconfig.json                   # TypeScript configuration
```

## Testing Locally

To test your changes locally in Home Assistant:

1. Build the card:

   ```bash
   npm run build
   ```

2. Copy the built file to your Home Assistant:

   ```bash
   cp dist/homematicip-local-climate-scheduler-card.js \
      /path/to/homeassistant/config/www/
   ```

3. Add or update the resource in Lovelace
4. Hard refresh your browser (Ctrl+F5)

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
