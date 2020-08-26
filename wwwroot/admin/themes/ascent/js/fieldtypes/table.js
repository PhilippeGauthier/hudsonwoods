;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'table';

	function Plugin(el, options) {
		this.el = el;
		this.$el = $(el);
		this.$container = this.$el.closest('.input-table');
		this.options = options;
		this.rows = options.data;
		this.init();
	}

	Plugin.prototype = {

		init: function() {
			var self = this;
			self.buildTable();
			self.bindActions();
			self.bindRowDrag();
			self.bindSave();
			self.bindDeleteRow();
			self.bindDeleteColumn();
		},

		buildTable: function() {
			var self = this;
			var template = _.template($('#template-' + self.el.id).html());
			var html = template({ rows: self.rows });
			self.$el.html(html);
			self.bindRowDrag();
		},

		bindActions: function() {
			var self = this;
			self.$container.on('click', '.add-row', function(e){
				e.preventDefault();
				self.addRow();
			});
			self.$container.on('click', '.add-column', function(e){
				e.preventDefault();
				self.addColumn();
			});
		},

		addRow: function(cols) {
			var self = this;
			var cols = cols || self.rows[0].cells.length;
			var cells = [];
			for (var i = 0; i < cols; i++) {
				cells.push('');
			}
			self.rows.push({ cells: cells });
			self.buildTable();
		},

		addColumn: function() {
			var self = this;
			var rows = self.rows.length;
			for (var i = 0; i < rows; i++) {
				self.rows[i].cells.push('');
			}
			self.buildTable();
		},

		bindRowDrag: function() {
			var self = this;
			self.$el.find('tbody').sortable({
				handle: 'th.drag-indicator',
				placeholder: 'drag-placeholder',
				forcePlaceholderSize: true,
				axis: 'y',
				update: function(event, ui) {
					self.updateRows(parseInt(ui.item.attr('data-index')), ui.item.index());
				}
			});
		},

		updateRows: function(before, after) {
			var self = this;
			self.rows.splice(after, 0, self.rows.splice(before, 1)[0]);
			self.buildTable();
		},

		bindSave: function() {
			var self = this;
			self.$el.on('keyup', 'textarea', function() {
				var input = $(this);
				var row = input.attr('data-row');
				var cell = input.attr('data-cell');
				self.rows[row].cells[cell] = input.val();
			});
		},

		bindDeleteRow: function() {
			var self = this;
			self.$el.on('click', '.row-count .delete', function(e){
				var cols = self.rows[0].cells.length;
				var row = $(this).closest('tr').attr('data-index');
				delete self.rows[row];
				self.rows = _.compact(self.rows);
				// Add an initial row if you delete the last one
				if ( ! self.rows.length) {
					self.addRow(cols);
				}
				self.buildTable();
			});
		},

		bindDeleteColumn: function() {
			var self = this;
			self.$el.on('click', '.column-count .delete', function(e){
				var cell = parseInt($(this).closest('th').attr('data-index'));
				for (var i = 0; i < self.rows.length; i++) {
					delete self.rows[i].cells[cell];
					self.rows[i].cells = self.rows[i].cells.filter(function(){ return true; });
				}
				// Add an initial column if you delete the last one
				if ( ! self.rows[0].cells.length) {
					self.addColumn();
				}
				self.buildTable();
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