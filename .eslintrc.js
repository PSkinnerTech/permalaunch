module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	rules: {
		// Disable console warnings for CLI tool
		'no-console': 'off',
		
		// Handle unused vars
		'@typescript-eslint/no-unused-vars': ['error', {
			'argsIgnorePattern': '^_',
			'varsIgnorePattern': '^_'
		}],

		// Allow any in specific cases
		'@typescript-eslint/no-explicit-any': ['error', {
			'ignoreRestArgs': true
		}],

		// Return types
		'@typescript-eslint/explicit-function-return-type': ['error', {
			'allowExpressions': true,
			'allowTypedFunctionExpressions': true,
			'allowHigherOrderFunctions': true,
			'allowDirectConstAssertionInArrowFunctions': true,
			'allowConciseArrowFunctionExpressionsStartingWithVoid': true
		}]
	},
	overrides: [
		{
			// Relax rules for test files
			files: ['**/*.test.ts', '**/*.spec.ts'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off'
			}
		}
	],
	env: {
		node: true,
		es2021: true
	}
};