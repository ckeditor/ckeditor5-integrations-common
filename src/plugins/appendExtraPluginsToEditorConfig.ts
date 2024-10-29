/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { EditorConfig, PluginConstructor } from 'ckeditor5';

/**
 * Appends plugins to the editor configuration.
 * It uses the `extraPlugins` property to append the plugins to avoid dealing with built-in constructor plugins.
 *
 * @param config The editor configuration.
 * @param plugins The plugins to append.
 * @returns The editor configuration with the plugins appended.
 * @example
 * ```ts
 * const editorConfig = appendExtraPluginsToEditorConfig(
 * 	{
 * 		extraPlugins: [ 'Plugin1' ]
 * 	},
 * 	[ 'Plugin2' ]
 * );
 *
 * console.log( editorConfig.extraPlugins ); // [ 'Plugin1', 'Plugin2' ]
 * ```
 */
export function appendExtraPluginsToEditorConfig(
	config: EditorConfig,
	plugins: Array<PluginConstructor>
): EditorConfig {
	const extraPlugins = config.extraPlugins || [];

	// Do not use `uniq`. There might be integrations with duplicated plugins, so to
	// make it backward compatible, we need to keep the order of the plugins.
	return {
		...config,
		extraPlugins: [
			...extraPlugins,
			...plugins.filter( item => !extraPlugins.includes( item ) )
		]
	};
}
