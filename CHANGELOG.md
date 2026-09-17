Changelog
=========

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


## [2.3.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v2.2.5...v2.3.0) (April 1, 2026)

### Features

* Add utilities that make it easier to detect the availability of features on certain versions of CKEditor. See [ckeditor/ckeditor5-react#658](https://github.com/ckeditor/ckeditor5-react/issues/658), [ckeditor/ckeditor5-vue#400](https://github.com/ckeditor/ckeditor5-vue/issues/400), [ckeditor/ckeditor5-angular#550](https://github.com/ckeditor/ckeditor5-angular/issues/550).

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-integrations-common/releases).
