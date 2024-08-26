/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import './globals.d';
import './cdn/ck/globals.d';
import './cdn/ckbox/globals.d';

export type { Awaitable } from './types/Awaitable';

export { createDefer, type Defer } from './utils/defer';
export { waitFor, type WaitForConfig } from './utils/waitFor';
export { injectScript, injectScriptsInParallel, INJECTED_SCRIPTS } from './utils/injectScript';
export { injectStylesheet, INJECTED_STYLESHEETS } from './utils/injectStylesheet';
export { isSSR } from './utils/isSSR';
export { once } from './utils/once';
export { overwriteArray } from './utils/overwriteArray';
export { overwriteObject } from './utils/overwriteObject';
export { preloadResource } from './utils/preloadResource';
export { shallowCompareArrays } from './utils/shallowCompareArrays';
export { uid } from './utils/uid';
export { uniq } from './utils/uniq';
export { waitForWindowEntry } from './utils/waitForWindowEntry';
export { filterObjectValues } from './utils/filterObjectValues';
export { filterBlankObjectValues } from './utils/filterBlankObjectValues';
export { mapObjectValues } from './utils/mapObjectValues';

export {
	CK_CDN_URL,
	createCKCdnUrl
} from './cdn/ck/createCKCdnUrl';

export {
	CKBOX_CDN_URL,
	createCKBoxCdnUrl
} from './cdn/ckbox/createCKBoxCdnUrl';

export {
	loadCKEditorCloud,
	type CKEditorCloudConfig,
	type CKEditorCloudResult
} from './cdn/loadCKEditorCloud';
