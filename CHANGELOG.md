# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please refer to the [SDK docs](https://www.datocms.com/docs/building-plugins/sdk-reference) for furthe information about APIs.

## [0.1.0] - 2020-11-09

### Added

- `selectItem(itemTypeId, { multiple })` - Plugins can use this method do show the modal dialog to select one or multiple existing records.
- `selectUpload({ multiple: boolean })` - Plugins can use this method do show the modal dialog to select one or multiple uploads.
- `editUpload(uploadId)` - Plugins can use this method to show the modal dialog to edit an upload.
- `editUploadMetadata(uploadMetadata)` - Plugins can use this method to show the modal dialog to edit an upload metadata.

## [0.0.9] - 2020-03-04

### Added

- `scrollToField(...pathChunks)` - Plugins can use this method to navigate the record form.
- `saveCurrentItem()` - Plugins can use this method to trigger a record save action without pushing the save button.
- `notice(message)` and `alert(message)` - Use these methods to display UI consistent notifications and alerts.
- `itemStatus` - Information about the publishing status of the record the plugin is attached to.
- `isSubmitting` - Information about the record's form submitting status.
