;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'statamicFile';

	function Plugin(el, options) {
		this.container = el;
		this.$container = $(el);
		this.$dropzone = this.$container.find('.drop-area');
		this.$hidden = this.$container.find('.file-values');
		this.files = [];
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
			self.initUploader();
			self.bindPreview();
			self.bindSortable();
			self.formatExistingFiles();
			self.save();
			self.bindModal();
		},


		/**
		 * Take the existingFiles object and extract the paths
		 * into an array that we'll use for saving.
		 */
		formatExistingFiles: function() {
			var self = this;
			_.each(self.options.existingFiles, function(file) {
				self.files.push(file.path);
			});
		},


		/**
		 * Set up the Dropzone plugin for this field.
		 */
		initUploader: function() {
			var self = this;

			self.$dropzone.dropzone({
				url: self.$dropzone.attr('data-destination'),
				paramName: self.$dropzone.attr('data-id'),
				uploadMultiple: true,
				acceptedFiles: self.options.acceptedFiles,
				maxFiles: self.options.maxFiles,
				clickable: self.$dropzone.find('.click-target').get(0),
				previewsContainer: self.$container.find('.existing-files').get(0),
				createImageThumbnails: true,
				thumbnailWidth: 125,
				thumbnailHeight: 125,
				autoProcessQueue: true,
				addRemoveLinks: false,
				previewTemplate: '\
					<div class="dz-preview dz-file-preview">\
						<div class="dz-details">\
							<img data-dz-thumbnail />\
							<div class="dz-filename"><span data-dz-name></span></div>\
							<div class="dz-size" data-dz-size></div>\
						</div>\
						<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\
						<span class="ss-icon remove-file" data-dz-remove>close</span>\
					</div>\
				',
				successmultiple: function (files, response) {
					// Add files to the array
					_.each(response.files, function(file) {
						self.addToFiles(file);
					});
					// Reset the progressbar
					self.$container.find('.progress-bar').fadeOut(function(){
						$(this).hide().css('width', 0).show();
					});
					// Update the filename to its full server path
					_.each(files, function(file, i){
						$(file.previewTemplate).find('.dz-filename span').text(response.files[i].path);
					});
				},
				init: function() {
					var dz = this;
					self.bindDropZoneEvents(dz);
					var existingFiles = 0;
					_.each(self.options.existingFiles, function(file) {
						var mockFile = { name: file.path, accepted: true, type: (file.thumbnail != '') ? 'image' : 'file' };
						dz.emit('addedfile', mockFile);
						if (file.thumbnail != '') {
							dz.emit('thumbnail', mockFile, file.thumbnail);
						}
						dz.files.push(mockFile);
						if (dz.options.maxFiles == dz.files.length) {
							dz.emit('maxfilesreached');
						}
					});
					// Let others know that this dropzone is initialized.
					self.$container.trigger('init.dropzone', dz);

					// Add some style hooks
					if (self.options.maxFiles == 1) {
						self.$container.addClass('single-file');
					}
				}
			});
		},

		/**
		 * Bind the dropzone events
		 */
		bindDropZoneEvents: function(dz) {
			var self = this;

			// When a file is added to the queue
			dz.on('addedfile', function(file) {
				// Not an image? Add our generic thumbnail.
				if ( ! file.type.match(/image.*/)) {
					dz.emit('thumbnail', file, self.options.fileThumb);
				}
				// Remove the empty class
				self.$container.removeClass('empty');
			});

			// When a file is removed.
			// This is called when you click the x on a file,
			// or when you try to upload a file and you've already reached the limit
			dz.on('removedfile', function(file) {
				// Only do this if the file was accepted (ie. uploaded and saved in the array, or was an existing file)
				if (file.accepted) {
					var filename = $(file.previewElement).find('.dz-filename').text();
					self.removeFromFiles(filename);
				}
				// Remove the max files reached class
				var accepted = _.filter(dz.files, function(file){ return file.accepted; });
				if (accepted.length < dz.options.maxFiles) { 
					self.$container.removeClass('max-files-reached');
				}
			});

			// When you've hit the limit
			dz.on('maxfilesreached', function(file) {
				self.$container.addClass('max-files-reached');
			});

			// error
			dz.on('error', function(file, error) {
				this.removeFile(file);
				alert(error);
			});

		},


		/**
		 * 'View file' action
		 */
		bindPreview: function() {
			var self = this;
			self.$container.on('click', '.dz-preview', function() {
				window.open($(this).find('.dz-filename').text());
			});
		},


		/**
		 * Make the files sortable
		 */
		bindSortable: function() {
			var self = this;
			var itemIndex;
			self.$container.find('.existing-files').sortable({
				handle: 'div',
				forcePlaceholderSize: true
			}).bind('sortstart', function(event, ui) {
				itemIndex = ui.item.index();
			}).bind('sortupdate', function(event, ui) {
				// remove
				var file = self.files.splice(itemIndex, 1);

				// put in new place
				self.files.splice(ui.item.index(), 0, file[0]);
				self.save();
			});
		},


		/**
		 * Add a file to the files array
		 */
		addToFiles: function(file) {
			var self = this;
			self.files.push(file.path);
			self.save();

			// Reload sortable
			self.$container.find('.existing-files').sortable('refresh');
		},


		/**
		 * Remove a file from the files array
		 */
		removeFromFiles: function(file) {
			var self = this;
			var index = $.inArray(file, self.files);
			self.files.splice(index, 1);
			self.save()
		},


		/**
		 * Save the array into the hidden field which
		 * is what Statamic will use as the value.
		 */
		save: function() {
			var self = this;
			self.$hidden.val(JSON.stringify(self.files));
		},


		/**
		 * Bind Modal behavior
		 */
		bindModal: function() {
			var self = this;
			var dz = self.$dropzone.get(0).dropzone;

			if (!self.options.browse) return false;

			self.$container.find('.choose-existing-file').on('click', function(){
				var $textEl = $(this).find('span');
				var text = $textEl.text();
				$textEl.text('Loading...');

				var request = $.get(self.options.browse);
				request.done(function (data) {
					self.$modal = $(data);
					self.$modal.hide().appendTo('body');
					self.bindModalEvents(dz);
					self.openModal();
					$textEl.text(text);
				});
			});
		},


		openModal: function() {
			// Open the modal
			this.$modal.modal('show');
			// Scroll to the top, and trigger the scroll so lazy loading can start
			this.$modal.find('.modal-body').scrollTop(0).trigger('scroll');
		},


		bindModalEvents: function(dz) {
			var self = this;

			var $imgs = self.$modal.find('img');
			$imgs.unveil(500, null, $imgs.closest('.modal-body'));

			self.$modal.find('.select').on('click', function(e) {
				e.preventDefault();
				var filename = $(this).closest('.file').attr('data-filename');
				var mockFile = { name: filename, accepted: true, type: 'image' };
				dz.emit('addedfile', mockFile);
				$.get(Statamic.triggerUrl+'/file/thumbnail?path=' + filename).done(function(thumbnail){
					dz.emit('thumbnail', mockFile, thumbnail);
				});
				dz.files.push(mockFile);
				self.addToFiles({ path: filename });
				if (dz.options.maxFiles == dz.files.length) {
					dz.emit('maxfilesreached');
				}
				self.$modal.modal('hide');
			});

			self.$modal.find('.file').on('dblclick', function() {
				$(this).find('.select').click();
			});

			self.$modal.find('.delete').on('click', function(e) {
				e.preventDefault();

				if ( ! confirm(self.$modal.attr('data-deletemessage'))) {
					return false;
				}

				var $file = $(this).closest('.file');
				var url = self.$modal.attr('data-cpurl') 
				          + '/file/delete?path='
				          + $file.attr('data-filename')
				          + '&config='
				          + self.$modal.attr('data-destination');
				
				var req = $.ajax(url);
				req.done(function(data){
					if (data.success) {
						$file.fadeOut(200, function(){
							$file.remove();
						});
					}
				});
			});

			self.$modal.on('hidden.bs.modal', function(e) {
				self.$modal.remove();
				self.$modal = undefined;
			});
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
 * Rename file field
 * The Grid calls this function when creating rows.
 * We want to replace the rename_me parts and initialize the field.
 */
function renameFileField($el) {
	var currentId = $el.attr('id');
	var name = $el.find('.file-values').attr('name');
	name = name.replace(/\[|\]/g, '');
	var newId = currentId.replace('rename_me', name);

  $el.attr('id', newId);

  var $dropzone = $el.find('.drop-area');
  var dest = $dropzone.attr('data-destination');
  $dropzone.attr({
  	'data-id': newId,
  	'data-destination': dest.replace('rename_me', newId)
  });

  $el.statamicFile();
}