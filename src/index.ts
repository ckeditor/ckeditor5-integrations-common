/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import './globals.d';
import './cdn/ck/globals.js';
import './cdn/ckbox/globals.js';

export type { Awaitable } from './types/Awaitable.js';

export { createDefer, type Defer } from './utils/defer.js';
export { waitFor, type WaitForConfig } from './utils/waitFor.js';
export { injectScript, injectScriptsInParallel, INJECTED_SCRIPTS } from './utils/injectScript.js';
export { injectStylesheet, INJECTED_STYLESHEETS } from './utils/injectStylesheet.js';
export { isSSR } from './utils/isSSR.js';
export { once } from './utils/once.js';
export { overwriteArray } from './utils/overwriteArray.js';
export { overwriteObject } from './utils/overwriteObject.js';
export { preloadResource } from './utils/preloadResource.js';
export { shallowCompareArrays } from './utils/shallowCompareArrays.js';
export { uid } from './utils/uid.js';
export { uniq } from './utils/uniq.js';
export { waitForWindowEntry } from './utils/waitForWindowEntry.js';
export { filterObjectValues } from './utils/filterObjectValues.js';
export { filterBlankObjectValues } from './utils/filterBlankObjectValues.js';
export { mapObjectValues } from './utils/mapObjectValues.js';
export { without } from './utils/without.js';

export { appendExtraPluginsToEditorConfig } from './plugins/appendExtraPluginsToEditorConfig.js';
export {
	createIntegrationUsageDataPlugin,
	type IntegrationUsageDataPlugin
} from './plugins/IntegrationUsageDataPlugin.js';

export { isCKEditorFreeLicense } from './license/isCKEditorFreeLicense.js';

export {
	CK_CDN_URL,
	createCKCdnUrl,
	type CKCdnUrlCreator
} from './cdn/ck/createCKCdnUrl.js';

export {
	CKBOX_CDN_URL,
	createCKBoxCdnUrl
} from './cdn/ckbox/createCKBoxCdnUrl.js';

export {
	loadCKEditorCloud,
	type CKEditorCloudConfig,
	type CKEditorCloudResult
} from './cdn/loadCKEditorCloud.js';

export type {
	CdnPluginsPacks
} from './cdn/plugins/combineCdnPluginsPacks.js';
