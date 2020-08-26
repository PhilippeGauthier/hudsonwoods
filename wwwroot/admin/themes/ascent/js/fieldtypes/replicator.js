;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'replicator';

	function Plugin(el, options) {
		this.el = el;
		this.$el = $(el);
		this.options = options;
		this.init();
	}

	Plugin.prototype = {

		init: function(data) {
			var self = this;
			self.$fieldWrapper = self.$el.parent();
			self.fieldId = self.$el.attr('id');
			self.$order = $('#' + self.fieldId + '-order');
			self.bindAddButtons();
			self.bindDragging();
			self.bindDelete();
			self.bindToggle();
			self.bindOptions();
			self.bindInstructions();
		},

		template: function(str) {
			// http://japhr.blogspot.com/2011/10/temporarily-overriding-template.html
			var origSettings = _.templateSettings;
			_.templateSettings = { interpolate : /%%(.+?)%%/g };
			var t = _.template(str);
			_.templateSettings = origSettings;
			return t;
		},

		buildSet: function(type, data) {
			var self = this;
			if (data === undefined) {
				data = { replicator_index: self.$el.find('.replicator-set').length };
			}
			var template = self.template(_.findWhere(self.options.templates, {type: type}).html);
			return template(data);
		},

		bindAddButtons: function() {
			var self = this;

			// Buttons at the bottom of the field
			self.$addButtons = self.$fieldWrapper.find('.replicator-buttons button');
			self.$addButtons.on('click', function(e){
				e.preventDefault();
				var $set = $(self.buildSet($(this).attr('data-set'))).hide();
				$set.hide().appendTo(self.$el);
				self.displaySet($set);
			});

			// Buttons within the options dropdown
			self.$el.on('click', '.add-set-here', function(e) {
				e.preventDefault();
				var $btn = $(this);
				var $set = $(self.buildSet($(this).attr('data-set'))).hide();
				var $thisSet = $btn.closest('.replicator-set');
				$set.hide().insertAfter($thisSet);
				self.displaySet($set);
			});
		},

		displaySet: function($set) {
			var self = this;

			$set.animate({
				'opacity': 'toggle',
				'height': 'toggle'
			}, 200);
			$('html, body').delay(200).animate({
				'scrollTop': $set.offset().top - 10
			}, 700);

			self.updateUi($set);
		},

		bindDragging: function() {
			var self = this;
			self.$el.sortable({
				axis: 'y',
				handle: '.replicator-set-move'
			});
		},

		bindDelete: function() {
			var self = this;
			self.$el.on('click', '.replicator-set-delete', function(){
				var text = $(this).attr('data-confirm-message');
				var response = confirm(text);
				if (response) {
					var $set = $(this).closest('.replicator-set');
					$set.animate({
						'opacity': 'toggle',
						'height': 'toggle'
					}, 200, function(){
						$set.remove();
					});
				}
			});
		},

		bindToggle: function() {
			var self = this;

			// Toggle a single set
			self.$el.on('click', '.replicator-set-toggle', function() {
				var $set = $(this).closest('.replicator-set');
				$set.toggleClass('contracted');
			});

			// Hide all sets
			self.$el.on('click', '.replicator-hide-sets', function() {
				self.$el.find('.replicator-set').addClass('contracted');
			});

			// Show all sets
			self.$el.on('click', '.replicator-show-sets', function() {
				self.$el.find('.replicator-set').removeClass('contracted');
			});
		},

		bindOptions: function() {
			var self = this;

			self.$el.on('click', '.replicator-set-options .ss-icon', function() {
				var $btn = $(this).parent();
				$btn.toggleClass('visible');
				$(this).outside('click', function(){
					$btn.removeClass('visible');
				});
			});
		},

		bindInstructions: function() {
			var self = this;

			self.$addButtons.tooltip({
				show: false,
				hide: false,
				track: true,
				position: { my: 'left-15 top+25', at: 'left bottom'}
			});
		},

		updateUi: function(latestSet) {
			var self = this;
			// reinitialize core stuff
			Statamic.customSelects();
			// allow addons/bundles to reinitialize themselves
			self.$el.trigger('addSet', latestSet);
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