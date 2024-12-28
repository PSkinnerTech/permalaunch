module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	rules: {
		// Allow console statements in our CLI tool
		'no-console': 'off',
		
		// Enforce return types except for test files
		'@typescript-eslint/explicit-function-return-type': ['error', {
			allowExpressions: true,
			allowTypedFunctionExpressions: true,
			allowHigherOrderFunctions: true,
			allowDirectConstAssertionInArrowFunctions: true,
			allowConciseArrowFunctionExpressionsStartingWithVoid: true,
			allowedNames: ['test', 'it', 'describe', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll']
		}],

		// Be explicit about unused vars
		'@typescript-eslint/no-unused-vars': ['error', {
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_'
		}],

		// Allow any in specific cases
		'@typescript-eslint/no-explicit-any': ['error', {
			ignoreRestArgs: true,
			fixToUnknown: false
		}]
	},
	overrides: [
		{
			// Relax rules for test files
			files: ['**/*.test.ts'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off'
			}
		}
	]
};