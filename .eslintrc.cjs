/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* use strict */

module.exports = {
	env: {
		es6: true,
		node: true,
		mocha: true
	},
	extends: [ 'eslint:recommended', 'ckeditor5' ],
	globals: {
		expect: true,
		sinon: true,
		shallow: true,
		mount: true
	},
	rules: {
		'no-console': 'off',
		'no-trailing-spaces': 'error',
		'ckeditor5-rules/allow-imports-only-from-main-package-entry-point':
			'off',
		'ckeditor5-rules/license-header': [
			'error',
			{
				headerLines: [
					'/**',
					' * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options',
					' */'
				]
			}
		]
	},
	ignorePatterns: [ '**/*.d.ts', 'dist/**', 'coverage/**', 'node_modules' ],
	overrides: [
		{
			files: [ '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx' ],
			rules: {
				'ckeditor5-rules/ckeditor-error-message': 'off'
			}
		},
		{
			files: [
				'tests/**/*.js',
				'tests/**/*.jsx',
				'tests/**/*.ts',
				'tests/**/*.tsx'
			],
			rules: {
				'no-unused-expressions': 'off'
			}
		},
		{
			files: [ 'demo*/**/*.ts', 'demo*/**/*.tsx' ],
			rules: {
				'ckeditor5-rules/license-header': 'off'
			}
		},
		{
			files: [ '**/tests/**/*.ts', '**/tests/**/*.tsx' ],
			rules: {
				'@typescript-eslint/no-unused-expressions': 'off'
			}
		}
	]
};
