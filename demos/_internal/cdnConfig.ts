/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { CKBoxCdnVersion } from '@/cdn/ckbox/createCKBoxCdnUrl.js';
import type { CKVersion } from '@/utils/version/isCKVersion.js';

/**
 * What to load from the CDN. Kept in the query string so that changing it reloads the page.
 */
export type CdnConfig = {
	version: CKVersion;
	ckboxVersion: CKBoxCdnVersion;
	premium: boolean;
	ckbox: boolean;
};

/**
 * Reads the config from the query string.
 */
export function readCdnConfig(): CdnConfig {
	const params = new URLSearchParams( window.location.search );

	return {
		version: ( params.get( 'version' ) || 'nightly' ) as CKVersion,
		ckboxVersion: ( params.get( 'ckboxVersion' ) || '2.13.1' ) as CKBoxCdnVersion,
		premium: params.has( 'premium' ),
		ckbox: params.has( 'ckbox' )
	};
}

/**
 * Writes the config to the query string, which reloads the page. The bundles are fetched once per
 * page load, so a reload is the only honest way to change them.
 *
 * @param config The config to apply.
 */
export function writeCdnConfig( { version, ckboxVersion, premium, ckbox }: CdnConfig ): void {
	const params = new URLSearchParams( { version, ckboxVersion } );

	if ( premium ) {
		params.set( 'premium', '1' );
	}

	if ( ckbox ) {
		params.set( 'ckbox', '1' );
	}

	window.location.search = params.toString();
}
