;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'statamicRedactor';

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
		 * Initialize the redactor field
		 */
		init: function() {
			var self = this;

			var opts = $.extend({}, self.options.redactorOptions,
			{
				imageUploadErrorCallback: function(json) {
					alert(json.error);
				},

				sourceCallback: function(html) {
					self.$container.addClass('source-visible').removeClass('source-hidden');
				},

				visualCallback: function(html) {
					self.$container.addClass('source-hidden').removeClass('source-visible');
				},

				initCallback: function() {
					self.reorderButtons();
					self.$container.addClass('source-hidden');
				}
			});

			self.$field.redactor(opts);
		},


		/**
		 * Redactor puts plugin buttons at the end.
		 * We want to maintain the order in the fieldset.
		 */
		reorderButtons: function() {
			var self = this;
			var $toolbar = self.$container.find('.redactor-toolbar');
			_.each(self.options.redactorOptions.buttons, function(button) {
				if (button != '|')
					self.$container.find('.re-' + button).parent().appendTo($toolbar);
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
 * Rename Redactor field
 * The Grid calls this function when creating rows.
 * We want to replace the rename_me parts and initialize the field.
 */
function renameRedactorField($el) {
	var currentId = $el.attr('id');
	var name = $el.attr('name');
	name = name.replace(/\[|\]/g, '');
	var newId = currentId.replace('rename_me', name);

  $el.attr('id', newId);

  $el.statamicRedactor();
}