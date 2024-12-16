module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
	extends: [
	  'eslint:recommended',
	  'plugin:@typescript-eslint/recommended',
	],
	rules: {
	  'import/no-duplicates': 'error',
	  'simple-import-sort/imports': 'error',
	  'simple-import-sort/exports': 'error'
	},
	overrides: [
	  {
		files: ['*.ts'],
		rules: {
		  'simple-import-sort/imports': [
			'error',
			{
			  groups: [
				['^react', '^@?\\w'],
				['^arweave', '@irys/sdk', '@permaweb/aoconnect', '^@?\\w'],
				['^\\u0000'],
				['^\\.\\.(?!/?$)', '^\\.\\./?$'],
				['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
			  ],
			},
		  ],
		},
	  },
	],
  };