;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'statamicMarkitup';

	function Plugin(el, options) {
		this.field = el;
		this.$field = $(el);
		this.$container = this.$field.parent();
		this.options = options;
		this.options = $.extend({}, this.options, this.$container.data('config'));
		this.init();
	}

	Plugin.prototype = {

		/**
		 * Start the engine
		 */
		init: function() {
			var self = this;
			self.setupLanguage();
			self.initEditor();
		},


		/**
		 * Button definitions for each supported language
		 */
		setupLanguage: function() {
			var self = this;

			// content_type is defined at the top of the html
			switch (content_type.toLowerCase()) {

				case 'md':
				case 'markdown':
					self.langDefs = [
						{id: 'h1', name:'Heading 1', openWith:'# ', placeHolder:'Your title here...' },
						{id: 'h2', name:'Heading 2', openWith:'## ', placeHolder:'Your title here...' },
						{id: 'h3', name:'Heading 3', openWith:'### ', placeHolder:'Your title here...' },
						{id: 'h4', name:'Heading 4', openWith:'#### ', placeHolder:'Your title here...' },
						{id: 'h5', name:'Heading 5', openWith:'##### ', placeHolder:'Your title here...' },
						{id: 'h6', name:'Heading 6', openWith:'###### ', placeHolder:'Your title here...' },
						{id: 'bold', name:'Bold', key:'B', openWith:'**', closeWith:'**'},
						{id: 'italic', name:'Italic', key:'I', openWith:'_', closeWith:'_'},
						{id: 'unorderedlist', name:'Bulleted List', openWith:'- ' },
						{id: 'orderedlist', name:'Numeric List', openWith:function(markItUp) {
							return markItUp.line+'. ';
						}},
						{id: 'image', name:'Picture', key:'P', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'image', 'markdown');
						}},
						{id: 'file', name:'File', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'file', 'markdown');
						}},
						{id: 'link', name:'Link', key:'L', openWith:'[', closeWith:']([![Url:!:http://]!])', placeHolder:'Your text to link' +
						' here...' },
						{id: 'blockquote', name:'Quotes', openWith:'> '},
						{id: 'code', name:'Code Block / Code', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'}
					];
					break;

				case 'textile':
					self.langDefs = [
						{id: 'h1', name:'Heading 1', openWith:'h1. ', placeHolder:'Your title here...' },
						{id: 'h2', name:'Heading 2', openWith:'h2. ', placeHolder:'Your title here...' },
						{id: 'h3', name:'Heading 3', openWith:'h3. ', placeHolder:'Your title here...' },
						{id: 'h4', name:'Heading 4', openWith:'h4. ', placeHolder:'Your title here...' },
						{id: 'h5', name:'Heading 5', openWith:'h5. ', placeHolder:'Your title here...' },
						{id: 'h6', name:'Heading 6', openWith:'h6. ', placeHolder:'Your title here...' },
						{id: 'bold', name:'Bold', key:'B', openWith:'*', closeWith:'*'},
						{id: 'italic', name:'Italic', key:'I', openWith:'_', closeWith:'_'},
						{id: 'unorderedlist', name:'Bulleted List', openWith:'(!(* |!|*)!)'},
						{id: 'orderedlist', name:'Numeric List', openWith:'(!(# |!|#)!)'},
						{id: 'image', name:'Picture', key:'P', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'image', 'textile');
						}},
						{id: 'file', name:'File', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'file', 'textile');
						}},
						{id: 'link', name:'Link', key:'L', openWith:'"', closeWith:'([![Title]!])":[![Link:!:http://]!]', placeHolder:'Your text to link here...' },
						{id: 'blockquote', name:'Quotes', openWith:'bq. '},
						{id: 'code', name:'Code Block / Code', openWith:'bc. '}
					];
					break;

				default:
					self.langDefs = [
						{id: 'h1', name:'Heading 1', openWith:'<h1>', closeWith:'</h1>', placeHolder:'Your title here...' },
						{id: 'h2', name:'Heading 2', openWith:'<h2>', closeWith:'</h2>', placeHolder:'Your title here...' },
						{id: 'h3', name:'Heading 3', openWith:'<h3>', closeWith:'</h3>', placeHolder:'Your title here...' },
						{id: 'h4', name:'Heading 4', openWith:'<h4>', closeWith:'</h4>', placeHolder:'Your title here...' },
						{id: 'h5', name:'Heading 5', openWith:'<h5>', closeWith:'</h5>', placeHolder:'Your title here...' },
						{id: 'h6', name:'Heading 6', openWith:'<h6>', closeWith:'</h6>', placeHolder:'Your title here...' },
						{id: 'bold', name:'Bold', key:'B', openWith:'<strong>', closeWith:'</strong>'},
						{id: 'italic', name:'Italic', key:'I', openWith:'<em>', closeWith:'</em>'},
						{id: 'unorderedlist', name:'Bulleted List', openWith:'<ul>\n\t<li>', closeWith: '</li>\n</ul>' },
						{id: 'orderedlist', name:'Numeric List', openWith:'<ol>\n\t<li>', closeWith: '</li>\n</ol>' },
						{id: 'image', name:'Picture', key:'P', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'image', 'html');
						}},
						{id: 'file', name:'File', beforeInsert: function(markItUp) {
							self.showUploader(markItUp, 'file', 'html');
						}},
						{id: 'link', name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
						{id: 'blockquote', name:'Quotes', openWith:'<blockquote>\n\t<p>', closeWith:'\n</p></blockquote>'},
						{id: 'code', name:'Code Block / Code', openWith:'<pre><code>', closeWith:'</code></pre>'},
					];

					break;
			};

			self.adjustButtons();
		},


		/**
		 * Filter down the language/button definitions to the ones defined
		 * in our configuration.
		 */
		adjustButtons: function() {
			var self = this;

			// Filter them down
			self.langDefs = _.filter(self.langDefs, function(def) {
				return _.contains(self.options.buttons, def.id);
			});

			// Change order
			self.langDefs = _.sortBy(self.langDefs, function(def) {
				return _.indexOf(self.options.buttons, def.id);
			});

			// Remove file button if a path hasn't been set
			if ( ! self.options.fileUrl) {
				self.langDefs = _.reject(self.langDefs, function(def) {
					return def.id == 'file';
				});
			}

			// Remove image button if a path hasn't been set
			if ( ! self.options.imageUrl) {
				self.langDefs = _.reject(self.langDefs, function(def) {
					return def.id == 'image';
				});
			}
		},


		/**
		 * Initialize the markitup field
		 */
		initEditor: function() {
			var self = this;

			var markitupSettings = {
				previewParserPath: '',
				onShiftEnter: { keepDefault:false, openWith:'\n\n' },
				markupSet:    self.langDefs
			};

			self.$field.markItUp(markitupSettings);
			self.addButtonClasses();
		},


		/**
		 * Markitup puts dumb .markItUpButton1 classes. Not helpful.
		 * Lets add .bold, .italic, etc
		 */
		addButtonClasses: function() {
			var self = this;
			var $buttons = self.$container.find('.markItUpButton');
			_.each(self.langDefs, function(def, i) {
				$buttons.eq(i).addClass(def.id);
			});
		},

		/**
		 * Initialize and open the uploader modal interface
		 */
		showUploader: function(markItUp, uploadType, lang) {
			var self = this;

			// Update the dropzone.
			// This will get called when the dropzone is added to the DOM below.
			$('body').one('init.dropzone', function(e, dz){
				// Get out if its the wrong one somehow
				if ($(e.target).attr('id') != 'markituploader') {
					return;
				}

				// Determine whether its an image or a file, then update the url
				var url = self.options[uploadType + 'Url'];
				dz.options.url = dz.options.url.replace('UPLOAD_PATH/', url);

				// Add resize config to url
				if (self.options.resize) {
					dz.options.url += '&resize=1&' + $.param(self.options.resize);
				}
			});

			// Add it to DOM
			$(Statamic.markituploader).appendTo('body');
			var $modal = $('#markituploader-modal');
			$modal.modal('show');

			// Only show the alt field if its an image
			$modal.find('.alt').toggle(uploadType == 'image');
			// Inject highlighted text into the alt field
			$modal.find('.alt-text').val(markItUp.selection);

			// Bind the insert button
			$modal.find('.btn').on('click', function(){
				var alt = $modal.find('.alt-text').val();
				var url = $.parseJSON($modal.find('.file-values').val())[0];
				self.replace(url, alt, uploadType, lang);
				$modal.modal('hide');
			});

			// Remove the modal and dropzone when its closed 
			$modal.on('hidden', function() {
				$modal.find('.drop-area').get(0).dropzone.destroy();
				$modal.remove();
			});
		},


		/**
		 * Replace the selected text in the textarea with the
		 * appropriately generated tag.
		 */
		replace: function(url, alt, uploadType, lang) {
			var str;

			// No file uploaded? 
			// Use a blank string instead of displaying 'undefined'
			if (! url) {
				url = '';
			}

			if (uploadType == 'image') {

				if (lang === 'markdown') {
					str = '!['+alt+']('+url+')';
				} else if (lang === 'textile') {
					alt = (alt) ? '['+alt+']' : '';
					str = '!'+url+alt+'!';
				} else { // html
					str = '<img src="'+url+'" alt="'+alt+'" />';
				}

			} else {

				var text = alt;
				if (lang === 'markdown') {
					str = '['+text+']('+url+')';
				} else if (lang === 'textile') {
					str = '"'+text+'":'+url;
				} else { // html
					str = '<a href="'+url+'">'+text+'</a>';
				}

			}
			$.markItUp({ replaceWith: str });			
		}

	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);


/**
 * Rename Markitup field
 * The Grid calls this function when creating rows.
 * We want to replace the rename_me parts and initialize the field.
 */
function renameMarkitupField($el) {
    var currentId = $el.attr('id');
    var name = $el.attr('name');
    name = name.replace(/\[|\]/g, '');
    var newId = currentId.replace('rename_me', name);

    $el.attr('id', newId);

    $el.statamicMarkitup();
}