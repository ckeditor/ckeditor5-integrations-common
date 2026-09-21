Changelog
=========

## [3.1.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v3.0.0...v3.1.0) (September 21, 2026)

### Features

* Added the `extractCKTestingChannel()` and `isCKTestingChannel()` helpers for working with CKEditor 5 testing channels.

### Bug fixes

* Requesting a testing channel such as `nightly` no longer throws an error when the same channel is already loaded from the CDN. Closes [#132](https://github.com/ckeditor/ckeditor5-integrations-common/issues/132).

  Testing channels are aliases resolved by the CDN to concrete semantic versions, for example `nightly` resolves to `0.0.0-nightly-20260917.0`. The installation guard compared the requested alias to the resolved version by strict equality, so loading a pack twice in the same page reported a version conflict with itself. Aliases are now compared by channel, while exact versions still require an exact match.


## [3.0.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v2.4.1...v3.0.0) (September 17, 2026)

### BREAKING CHANGES

* The `placementInHead` option of `injectStylesheet()` has been removed and replaced by `placement`, which takes the same `'start'` and `'end'` values and now applies to `document.head` as well as to a custom `targetNode`.

  The `INJECTED_SCRIPTS` and `INJECTED_STYLESHEETS` maps are no longer exported. Injected elements now carry their own load state, so there is no global cache to read or clear. Code that reached for these maps (mostly test setup calling `INJECTED_SCRIPTS.clear()`) should remove the injected `<script>` and `<link>` elements from the DOM instead, which now forgets them synchronously.

  A failed injection is no longer cached. The element is removed from the DOM, so the next call retries rather than returning the same rejected promise forever.

  ```js
  // Before:
  injectStylesheet( { href, placementInHead: 'end' } );

  // After:
  injectStylesheet( { href, placement: 'end' } );
  ```

### Features

* Added support for shadow roots. The stylesheets loaded from the CDN can now be injected into a shadow root instead of `document.head`, so the editor styles stay scoped to a web component rather than leaking into the page.

  `loadCKEditorCloud()` accepts an `injectedStylesheetsLocation` option that decides where those stylesheets land. It takes a `targetNode` (an element or a shadow root, defaulting to `document.head`) and a `placement` (`'start'` or `'end'`, defaulting to `'start'`), and applies to every stylesheet of the loaded pack — the base bundle, premium features, CKBox and plugins alike. The same option is available as `stylesheetsLocation` in `loadCKCdnResourcesPack()` and as `targetNode` in `injectStylesheet()`, and the `InjectStylesheetLocation` type is exported from the package.

  ```ts
  class MyEditorElement extends HTMLElement {
  	public async connectedCallback(): Promise<void> {
  		const shadowRoot = this.attachShadow( { mode: 'open' } );
  		const container = shadowRoot.appendChild( document.createElement( 'div' ) );

  		const { CKEditor } = await loadCKEditorCloud( {
  			version: '48.0.0',
  			injectedStylesheetsLocation: {
  				targetNode: shadowRoot,
  				placement: 'end'
  			}
  		} );

  		const { ClassicEditor, Essentials, Paragraph } = CKEditor;

  		await ClassicEditor.create( {
  			attachTo: container,
  			plugins: [ Essentials, Paragraph ]
  		} );
  	}
  }
  ```


## [2.4.1](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v2.4.0...v2.4.1) (June 15, 2026)

### Other changes

* Readme simplification.


## [2.4.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v2.3.1...v2.4.0) (May 25, 2026)

### Features

* Added `mapObjectKeys` helper for transforming object keys and `kebabToCamelCase` for converting strings from kebab-case to camelCase.


## [2.3.1](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v2.3.0...v2.3.1) (April 15, 2026)

### Bug fixes

* Fixed an issue where the editor's alpha version was being compared incorrectly.

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-integrations-common/releases).
