/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

export type EditorPreset = Record<string, any> & {
	editor?: string;
	plugins?: Array<string>;
};

export const EDITOR_PRESETS: Record<string, EditorPreset> = {
	base: {
		editor: 'ClassicEditor',
		licenseKey: import.meta.env.CKEDITOR_LICENSE_KEY || 'GPL',
		plugins: [ 'Essentials', 'Paragraph', 'Heading', 'Bold', 'Italic' ],
		toolbar: [ 'undo', 'redo', '|', 'heading', '|', 'bold', 'italic' ],
		initialData: '<p>Loaded straight from the CKEditor CDN.</p>'
	},

	premium: {
		plugins: [ 'FormatPainter' ],
		toolbar: [ '|', 'formatPainter' ]
	},

	ckbox: {
		plugins: [
			'CKBox', 'CKBoxImageEdit', 'PictureEditing', 'ImageUpload',
			'ImageBlock', 'ImageInline', 'ImageToolbar'
		],
		toolbar: [ '|', 'ckbox', 'ckboxImageEdit' ],
		ckbox: {
			tokenUrl: import.meta.env.CKBOX_TOKEN_URL || 'https://api.ckbox.io/token/demo',
			theme: 'lark'
		}
	}
};
