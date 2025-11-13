# Husky Git Hooks

This directory contains Git hooks managed by Husky.

## Pre-commit Hook

The pre-commit hook runs automatically before each commit and performs:

1. **Lint-staged**: Runs ESLint and Prettier on staged files
2. **Type Check**: Validates TypeScript types
3. **Tests**: Runs all unit tests
4. **Build**: Creates production build

## Bypassing Hooks (Not Recommended)

If you need to bypass the hooks (emergency only):

```bash
git commit --no-verify -m "emergency commit"
```

## Hooks Overview

- `pre-commit`: Runs code quality checks before commit
