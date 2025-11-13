# Pre-Commit Hooks Documentation

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to ensure code quality before commits.

## What Happens on Commit?

When you run `git commit`, the following checks are automatically executed:

### 1. Lint-staged (on staged files only)

- **ESLint**: Fixes code style issues automatically
  ```bash
  eslint --fix *.ts
  ```
- **Prettier**: Formats code (TS, JS, JSON, MD)
  ```bash
  prettier --write *.{ts,js,json,md}
  ```
- **Jest**: Runs tests related to changed files
  ```bash
  jest --bail --findRelatedTests --passWithNoTests
  ```

### 2. Type Check

Validates TypeScript types across the entire project:

```bash
npm run type-check
```

### 3. Test Suite

Runs all unit tests:

```bash
npm test
```

### 4. Build

Creates a production build to ensure everything compiles:

```bash
npm run build
```

## Installation

Pre-commit hooks are automatically installed when you run:

```bash
npm install
```

This happens through the `prepare` script in `package.json`.

## Configuration Files

- `.husky/pre-commit`: The actual Git hook script
- `.prettierrc`: Prettier configuration
- `.prettierignore`: Files to ignore by Prettier
- `.eslintrc.js`: ESLint rules
- `package.json` → `lint-staged`: Defines what runs on staged files

## What Gets Checked?

### TypeScript Files (\*.ts)

1. Auto-fixed by ESLint
2. Formatted by Prettier
3. Related tests are run

### Other Files (_.js, _.json, \*.md)

- Formatted by Prettier

## Bypassing Hooks (Emergency Only)

If you absolutely need to bypass the hooks:

```bash
git commit --no-verify -m "emergency: bypass hooks"
```

⚠️ **Warning**: Only use this in emergencies. Your commit might break CI/CD pipelines.

## Hook Performance

Average execution time:

- Lint-staged: ~2-5 seconds (depending on files changed)
- Type check: ~3-5 seconds
- Tests: ~1-2 seconds
- Build: ~0.6 seconds

**Total**: ~7-13 seconds per commit

## Troubleshooting

### Hook doesn't run

```bash
# Reinstall Husky
npm run prepare
```

### Hook fails with errors

```bash
# Run checks manually to see detailed errors
npm run lint
npm run type-check
npm test
npm run build
```

### Want to skip a specific check temporarily

Modify `.husky/pre-commit` and comment out the check you want to skip.

## Benefits

✅ **Consistent Code Style**: Automatic formatting with Prettier
✅ **Catch Errors Early**: Type checking and linting before commit
✅ **Prevent Breaking Changes**: Build and tests must pass
✅ **Clean Git History**: Only working code gets committed
✅ **Faster Code Reviews**: Automated checks reduce manual review time

## Examples

### Successful Commit

```bash
$ git commit -m "Add new feature"
🔍 Running pre-commit checks...
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
🔎 Type checking...
🧪 Running tests...
 PASS  src/utils.test.ts
 PASS  src/types.test.ts
🔨 Building project...
✓ Copied to root for HACS
✅ All pre-commit checks passed!
[main abc1234] Add new feature
 2 files changed, 10 insertions(+)
```

### Failed Commit (Linting Error)

```bash
$ git commit -m "Add feature with error"
🔍 Running pre-commit checks...
✖ eslint --fix:
  /path/to/file.ts
    12:5  error  'unused' is defined but never used  @typescript-eslint/no-unused-vars

✖ lint-staged failed!
```

Fix the error, stage the changes, and commit again.

## Updating Hooks

To modify what runs in the pre-commit hook, edit:

- `.husky/pre-commit` - The main hook script
- `package.json` → `lint-staged` - What runs on staged files

## Further Reading

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Prettier Documentation](https://prettier.io/)
- [ESLint Documentation](https://eslint.org/)
