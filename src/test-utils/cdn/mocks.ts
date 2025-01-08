/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { createCKCdnUrl } from '../../cdn/ck/createCKCdnUrl.js';
import { createCKBoxCdnUrl } from '../../cdn/ckbox/createCKBoxCdnUrl.js';

/**
 * The URL of the CKEditor CDN.
 */
export const CDN_MOCK_SCRIPT_URL = createCKCdnUrl( 'ckeditor5', 'ckeditor5.umd.js', '43.0.0' );

/**
 * The URL of the CKEditor CDN.
 */
export const CDN_MOCK_STYLESHEET_URL = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '43.0.0' );

/**
 * The URL of the CKBox CDN.
 */
export const CKBOX_CDN_MOCK_SCRIPT_URL = createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' );

/**
 * The URL of the CKBox CDN.
 */
export const CKBOX_CDN_MOCK_STYLESHEET_URL = createCKBoxCdnUrl( 'ckbox', 'styles/themes/lark.css', '2.5.1' );
