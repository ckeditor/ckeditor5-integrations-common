/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { EditorConfig } from 'ckeditor5';
import type { EditorRelaxedConfig } from '../types/EditorRelaxedConfig.js';

import { getInstalledCKBaseFeatures } from '../installation-info/getInstalledCKBaseFeatures.js';
import { uniq } from '../utils/uniq.js';

/**
 * Assigns the `initialData` property to multiroot configuration.
 *
 * @param data The editor data from the bound component property to be assigned.
 * @param config The editor configuration.
 * @returns The editor configuration with assigned `initialData` property.
 */
export function assignInitialDataToMultirootEditorConfig(
	data: Record<string, string> | undefined,
	config: EditorRelaxedConfig
): EditorRelaxedConfig {
	const supports = getInstalledCKBaseFeatures();

	// For >= 48.x versions, the `initialData` property should be assigned to `root.initialData` field in the configuration object.
	if ( supports.rootsConfigEntry ) {
		const knownRootsKeys = uniq( [
			...Object.keys( data || {} ),
			...Object.keys( config.roots || {} ),
			...typeof config.initialData === 'string' ? [] : Object.keys( config.initialData || {} )
		] );

		const roots = knownRootsKeys.reduce( ( acc, rootName ) => {
			const rootConfig = config.roots?.[ rootName ];
			const rootInitialData = rootConfig?.initialData;

			if ( rootInitialData && data?.[ rootName ] ) {
				console.warn(
					`Editor data should be provided either using \`config.roots['${ rootName }'].initialData\` ` +
                    'or the bound component property. The config value takes precedence ' +
                    'over the bound component property and will be used when both are specified.'
				);
			}

			acc[ rootName ] = {
				...rootConfig,
				initialData: rootInitialData || data?.[ rootName ] || config.initialData?.[ rootName ] || ''
			};

			return acc;
		}, Object.create( null ) );

		const normalizedConfig: EditorRelaxedConfig = {
			...config,
			roots
		};

		delete normalizedConfig.initialData;

		return normalizedConfig as unknown as EditorConfig;
	}

	// Fallback for <= 47.x versions which uses `initialData` field in the configuration object.
	if ( data && config?.initialData ) {
		console.warn(
			'Editor data should be provided either using `config.initialData` ' +
            'or the bound component property. The config value takes precedence ' +
            'over the bound component property and will be used when both are specified.'
		);
	}

	return {
		...config,
		initialData: config?.initialData || data
	} as unknown as EditorConfig;
}
