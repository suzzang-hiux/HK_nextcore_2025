/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		'/',
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'align', 'list', 'indent', 'blocks', 'bidi', 'paragraph' ] },
		{ name: 'about', groups: [ 'about' ] },
		'/',
		{ name: 'others', groups: [ 'others' ] }
	];

	config.removeButtons = 'Scayt,Form,Radio,Checkbox,TextField,Textarea,Select,Button,ImageButton,HiddenField,BidiLtr,BidiRtl,Language,Iframe,PageBreak,ExportPdf,Save,Unlink,CreateDiv,Flash,Templates,RemoveFormat,CopyFormatting,Blockquote,Paste,PasteText,PasteFromWord,About';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';
	
	config.fontSize_defaultLabel = '15'; 
	config.fontSize_sizes = '8px;9px;10px;11px;12px;13px;14px;15px;16px;18px;20px;22px;24px;26px;28px;36px;48px;72px'; 

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.image_previewText = ' ';
};
