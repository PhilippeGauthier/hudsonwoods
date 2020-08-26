;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'statamicSuggest';

	function Plugin(el, options) {
		this.container = el;
		this.$container = $(el);
		this.options = $.extend({}, options, this.$container.data('config'));
		this.init();
	}

	Plugin.prototype = {

		/**
		 * Start the engine
		 */
		init: function() {
			this.initSelectize();
		},


		/**
		 * Initialize the Selectize field
		 */
		initSelectize: function() {
			var self = this;
			self.$container.find('select').selectize(self.options);
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
 * Rename suggest field
 * The Grid calls this function when creating rows.
 * We want to replace the rename_me parts and initialize the field.
 */
function renameSuggestField($el) {
	var currentId = $el.attr('id');
	var name = $el.find('select').attr('name');
	name = name.replace(/\[|\]/g, '');
	var newId = currentId.replace('rename_me', name);

	$el.attr('id', newId);

	$el.statamicSuggest();
}