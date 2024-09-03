Changelog
=========

## [1.0.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v0.2.1...v1.0.0) (2024-09-03)

### Features

* The API has been stabilized and the package is now considered stable.
* CSS scripts are now injected at the beginning of the document head, allowing for easier overriding of editor styles. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/cd61e7ce7baad29adefd275661c9ca7ef5006095))

### Bug fixes

* Ensure that preload link tags are injected before stylesheet link tags. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/d61b83e8ffede29debcc11c4be2798ad30d527e4))


## [0.2.1](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v0.2.0...v0.2.1) (2024-08-27)

### Bug fixes

* Export missing `CdnPluginsPacks` typing, which is used in integrations. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/43e7c51e0e3d79ae27bf3edef77a4c2991880801))


## [0.2.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v0.1.1...v0.2.0) (2024-08-27)

### Bug fixes

* No longer raise `export modifier cannot be applied to ambient modules` error on older TS versions. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/15bca0a5f559738558dde08603d16445cb91d349))

### Features

The API interface of the `loadCKEditorCloud` method has been simplified, and the ability to specify the `CKBox` theme has been added. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/tree/e45c569661b1686d153e12a31c146c46751396e6))

## [0.1.1](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v0.1.0...v0.1.1) (2024-08-20)

### Bug fixes

* Add missing CKEditor window variables to the final `index.d.ts` bundle. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/09e84c8270633c38c7857754219776659a4cfee2))


## [0.1.0](https://github.com/ckeditor/ckeditor5-integrations-common/compare/v0.0.1...v0.1.0) (2024-08-20)

### Features

The initial version of the cloud integration utils implementation. ([commit](https://github.com/ckeditor/ckeditor5-integrations-common/commit/c7e447058302a9f788a7a5abababe787b721b5f5))


## 0.0.1 (2024-08-19)

This is an initial package for development purposes. It does not contain code yet.
