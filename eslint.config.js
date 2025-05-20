/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import globals from 'globals';
// import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import ckeditor5Config from 'eslint-config-ckeditor5';

import tseslint from 'typescript-eslint';

export default tseslint.config(
	tseslint.configs.recommended,

	{
		ignores: [
			'coverage/**',
			'dist/**',
			'release/**'
		]
	},
	{
		extends: ckeditor5Config,

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},

		linterOptions: {
			reportUnusedDisableDirectives: 'warn',
			reportUnusedInlineConfigs: 'warn'
		},

		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},

		rules: {
			'no-console': 'off',
			'@stylistic/no-trailing-spaces': 'error',
			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'off',
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
		}
	},
	{
		files: [ '**/*.{js,jsx,ts,tsx}' ],

		rules: {
			'ckeditor5-rules/ckeditor-error-message': 'off'
		}
	},
	{
		files: [ 'tests/**/*.{js,jsx,ts,tsx}' ],

		rules: {
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	},
	{
		files: [ 'demo*/**/*.{ts,tsx}' ],

		rules: {
			'ckeditor5-rules/license-header': 'off'
		}
	},
	{
		files: [ 'scripts/**/*' ],

		languageOptions: {
			globals: {
				...globals.node
			}
		}
	}
);
