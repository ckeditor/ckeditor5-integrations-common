/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { EditorConfig } from 'ckeditor5';

import { getInitialDataFromEditorConfig } from './getInitialDataFromEditorConfig.js';
import { getInstalledCKBaseFeatures } from '../installation-info/getInstalledCKBaseFeatures.js';

import type { EditorRelaxedConfig } from '../types/EditorRelaxedConfig.js';

/**
 * Assigns the `data` property to the appropriate field in the editor configuration,
 * ensuring compatibility with different CKEditor 5 versions.
 *
 * Version differences:
 * 1. LTS (47.x): Uses the top-level `initialData` property and does not support per-root configurations.
 * 2. Latest (48.x+): Uses `roots.main.initialData` and deprecates the top-level `initialData`.
 *
 * @param config The editor configuration object.
 * @param data The editor data. Used to log warnings if data is passed both via config and component properties.
 * @param ignoreConfigInitialData If `true`, the provided `data` argument will override any initial data defined in the `config`.
 */
export function assignInitialDataToEditorConfig(
	config: EditorRelaxedConfig,
	data: string,
	ignoreConfigInitialData?: boolean
): EditorConfig {
	const supports = getInstalledCKBaseFeatures();
	const configInitialData = ignoreConfigInitialData ? null : getInitialDataFromEditorConfig( config );

	// Handle >= 48.x versions: Map data to the `roots.main.initialData` property.
	if ( supports.rootsConfigEntry ) {
		const normalizedConfig: any = {
			...config,
			roots: {
				...config.roots,
				main: {
					...config.root,
					...config.roots?.main,
					initialData: configInitialData || data || ''
				}
			}
		};

		if ( data && configInitialData ) {
			console.warn(
				'Editor data should be provided either via the config ' +
                '(`config.root.initialData`) or the component\'s `data` ' +
                'property, but not both. The configuration value takes precedence.'
			);
		}

		delete normalizedConfig.root;
		delete normalizedConfig.initialData;

		return normalizedConfig as unknown as EditorConfig;
	}

	// Fallback for <= 47.x versions: Use the legacy top-level `initialData` property.
	if ( data && configInitialData ) {
		console.warn(
			'Editor data should be provided either via the config ' +
            '(`config.initialData`) or the component\'s `data` ' +
            'property, but not both. The configuration value takes precedence.'
		);
	}

	return {
		...config,
		initialData: configInitialData || data || ''
	} as unknown as EditorConfig;
}
