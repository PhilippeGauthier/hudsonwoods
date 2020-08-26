var Statamic = {};

$(function() {


  /////////////////////////////////////////
  //
  // Hide iPhone address bar
  //
  /////////////////////////////////////////

  window.addEventListener("load",function() {
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 0);
  });



  /////////////////////////////////////////
  //
  // Custom select box styling
  //
  /////////////////////////////////////////

  Statamic.customSelects = function() {
    $('.input-select-wrap select').not('.cell-select select').not('.replaced').each(function() {
      title = $('option:selected', this).text();

      $(this)
        .addClass('replaced')
        .css({'z-index':10,'opacity':0,'appearance':'none', '-khtml-appearance':'none', '-webkit-appearance': 'none'})
        .after('<span class="select value-' + title + '">' + title + '</span>')
        .change(function() {
          var val = $('option:selected', this).text();
          $(this).next().removeClass(function(index, css) {
            return (css.match(/\bvalue-\S+/g) || []).join(' ');
          })
          .addClass('value-' + val)
          .text(val);
        });
    });
  };
  
  Statamic.customSelects();


  if ($("#date-submit").length) {
    $("#date-submit").find('input[type=submit]').remove();
    $("#date-submit").on("change", "select", function() {
      $(this).closest("form").submit();
    });
  }



  /////////////////////////////////////////
  //
  // Tablesorter
  //
  /////////////////////////////////////////
  

  // Tablesorter
  $.tablesorter.addParser({
    id: "hidden-date",
    is: function(s) {
      return false;
    },
    format: function(s, table, cell) {
      return parseInt($(cell).data("fulldate"), 10);
    },
    type: 'numeric'
  });

  $('.log-sortable').tablesorter({
    headers: {
      1: {
        sorter: "hidden-date"
      }
    }
  });
  
  $('.entries-sortable').tablesorter({ 
    headers: {
  2: {
    sorter: "hidden-date"
  }
    }
  });

  $('.sortable').tablesorter();


  /////////////////////////////////////////
  //
  // Datepicker
  //
  /////////////////////////////////////////

  var dateOptions = {
    format: 'yyyy-mm-dd',
  };

  $('.datepicker').datepicker(dateOptions)
    .on('changeDate', function() {
      $(this).datepicker('hide');
    });

  $('body').on('addRow', '.grid', function() {
    $('.grid .datepicker').datepicker(dateOptions)
      .on('changeDate', function() {
        $(this).datepicker('hide');
      });
  });

  $('body').on('addSet', function(e, set) {
    $(set).find('.datepicker').datepicker(dateOptions)
	  .on('changeDate', function() {
	    $(this).datepicker('hide');
    });
  });


  /////////////////////////////////////////
  //
  // Timepicker
  //
  /////////////////////////////////////////


  var timeOptions = { defaultTime: 'value' };

  $('.timepicker').timepicker(timeOptions);

  $('body').on('addRow', '.grid', function() {
    $('.grid .timepicker').timepicker(timeOptions);
  });

  $('body').on('addSet', function(e, set) {
    $(set).find('.timepicker').timepicker(dateOptions)
      .on('changeDate', function() {
        $(this).timepicker('hide');
    });
  });


  /////////////////////////////////////////
  //
  // Auto Slugger
  //
  /////////////////////////////////////////

    $(document).ready(function() {
        var $slug =  $('#publish-slug.new-slug'),
            $title = $('#publish-title');
        
        if ($slug.length) {
            // the slug field is on this page
            // slug does not already exist in the system
            $title.on('keyup', function() {
                var options = { "lang": $("html").attr("lang") };
                
                // if the last action was to erase the title, restart auto-slugging again
                if ($(this).val() === '') {
                    $(this).data('slug-edited', false);
                }
                
                // if the slug is edited manually, don't auto-slug
                if ($(this).data('slug-edited')) {
                    return true;
                }

                // enable transliteration
                if (transliterate) {
                    options.custom = transliterate;
                }

                // generate slug
                $working_slug = getSlug($(this).val(), options)
                
                // Check for duplicate URLs
                $.ajax({
                    url: '/admin.php/url/unique',
                    data: {
                        url: $working_slug,
                        folder: getUrlParameter('path')
                    },
                    success: function($data) {
                        if ($data.exists === true) {
                            $slug.val($working_slug + '-1')
                        } else {
                            $slug.val($working_slug);      
                        }
                    },
                    error: function() {
                      $slug.val($working_slug);
                    }
                });
            });
                
            $slug.on('keyup', function() {
                // if someone edits the slug manually, don't allow title to auto-slug
                $title.data('slug-edited', true);
            });
        }
    });

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
      
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
              return sParameterName[1];
            }
        }
    }


  /////////////////////////////////////////
  //
  // Tags
  //
  /////////////////////////////////////////

	var initSelectize = function() {
		$('input.selectize').not('.selectized').selectize({
			delimiter: ',',
			persist: false,
			create: function(input) {
				return {
					value: input,
					text: input
				}
			},
			plugins: ['drag_drop']
		});
	};

	$('body').on('addRow', '.grid', function(){
		initSelectize();
	});

	$('body').on('addSet', function(e, set) {
		initSelectize();
	});

	initSelectize();



  /////////////////////////////////////////
  //
  // The Grid
  //
  /////////////////////////////////////////

  // Patch to rename the ids to something, anything unique
  var renameMeReplacement = function() {
    $('[id^=rename_me]').each(function(){
      var $el = $(this);


      // Special handling for file fields
      if ($el.hasClass('file-field-container')) {
        renameFileField($el);
        return false;
      }
      // and Markitup fields
      else if ($el.hasClass('markitup')) {
        renameMarkitupField($el);
        return false;
      }
      // and Suggest fields
      else if ($el.hasClass('suggest-field-container')) {
        renameSuggestField($el);
        return false;
      }
      // and Redactor fields
      else if ($el.hasClass('redactor')) {
        renameRedactorField($el);
        return false;
      }

      var currentId = $el.attr('id');
      var name = $el.attr('name');
      name = name.replace(/\[|\]/g, '');
      var newId = currentId.replace('rename_me', name);

      $el.attr('id', newId);

      // Radio and checkbox handling
      if ($el.attr('type') == 'checkbox' || $el.attr('type') == 'radio') {
        $el.next().attr('for', newId);
      }
    });
  }
  renameMeReplacement();

  var checkGridState = function($grid) {
    var opacity,
      max_rows = parseInt($grid.data("maxRows"), 10) || Infinity,
      rows = $grid.find("> tbody > tr").length;

    opacity = (rows >= max_rows) ? 0.2 : 1.0;
    $grid.next("a.grid-add-row").css("opacity", opacity);
  }

  var updateGrid = function($grid) {
    $grid.children("tbody").children("tr").each(function(i) {
      var row_number = i + 1;
      $(this).children("th").html("<div class='count'>" + row_number + "</div><a href='#' class='grid-delete-row confirm'><span class='ss-icon'>delete</span></a>");
    });
  };

  var renameInputs = function($grid) {

    $grid
      // Only look for inputs with a specified name attribute
      // to prevent UI-driven inputs from interferring
      .find("input[name], textarea[name], select[name]")
      .each(function() {

        var positions = [];

        // get positioning of each parent <tr> within their set of <tr>s
        $(this).parents("tr").each(function() {
          positions.push($(this).parent().children("tr").index($(this)));
        });

        // reverse the array, so that root <tr> is first
        positions.reverse();

        // We need a different regex depending on whether a grid is in a replicator or not.
        // Well, maybe not. But that sort of regex makes my mind explode. This works!
        // C'mon v2. Refactor City.
        //
		// Example field names, for reference:
        // Regular grid, non-nested
        // page[yaml][grid] [0][row_label]
        // Regular grid, nested
        // page[yaml][grid] [0][row_grid][0][nested_1]
        // Replicator, grid, non-nested
        // page[yaml][replicator][0][grid] [0][row_label]
        // Replicator, grid, nested
        // page[yaml][replicator][0][grid] [0][row_grid][0][nested_1]
		var submatchRegex = ($(this).parents('.replicator-set').length > 0)
			? /(page\[yaml\]\[[\w\d\-_]+\]\[\d+\]\[[\w\d\-_]+\])((?:\[\d+\]\[[\w\d\-_]+\])+)/gi
			: /(page\[yaml\]\[[\w\d\-_]+\])((?:\[\d+\]\[[\w\d\-_]+\])+)/gi;

        // regex time
        var newName = $(this).attr("name").replace(/page\[yaml\]\[[\w\d\-_]+](?:\[\d+\]\[[\w\d_\-]+\])+/ig, function(match) {
          return match.replace(submatchRegex, function(submatch, p1, p2) {
            var i = 0;
            var output = p1 + p2.replace(/\[\d+\]/ig, function(subsubmatch) {
              var $output = '['+positions[i]+']';
              i++;
              return $output;
            });
            return output;
          });
        });
        
        $(this).attr("name", newName);

        // adjust the 'rename_me' fields
        renameMeReplacement();

      }
    );
  };

  var stick_helper_width = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.css("width", "100%").children().each(function(index) {
      $(this).width($originals.eq(index).width())
    });
    return $helper;
  };

  var sortable_options = {
    helper: stick_helper_width,
    handle: 'th.drag-indicator',
    placeholder: 'drag-placeholder',
    forcePlaceholderSize: true,
    axis: 'y',

    start: function (event, ui) {
      var num_cols = $(this).find('tr')[0].cells.length;
      ui.placeholder.html('<td colspan='+num_cols+'>&nbsp;</td>');
    },

    update: function(event, ui) {
      $(event.target).find('> tr').each(function() {
        var row_number = $(this).index() + 1,
            $grid = $(this).closest(".grid");

        $(this).children("th:first-child").html("<div class='count'>" + row_number + "</div><a href='#' class='grid-delete-row confirm'><span class='ss-icon'>delete</span></a>");
        renameInputs($grid);
      });
    }
  };

  // add a new row to the grid
  $(".primary-form").on("click", "a.grid-add-row", function () {
    var $grid = $(this).parent().children(".grid:first"),
        row_count = $grid.children("tbody").children("tr").length,
        max_rows = $grid.data("maxRows") || Infinity,
        empty_row = $grid.data("emptyRow");

    if (row_count >= max_rows) {
      return false;
    }

    $grid.append(empty_row).find("table.grid tbody").sortable(sortable_options);

    renameInputs($grid);
    checkGridState($grid);
    updateGrid($grid);

    $grid.trigger('addRow');

    return false;
  });

  $(document).on('click', 'a.grid-delete-row', function() {
    var message, sublevel_target,
        $grid = $(this).closest(".grid"),
        min_rows = $grid.data("minRows") || 0;

    // if we haven't asked to confirm, do that now
    if ($(this).is(".confirm")) {
      var text = $(this).attr('data-confirm-message') || 'Are you sure?';

      response = confirm(text);

      // prevent row deletion if min_rows is set and this would go under that
      if ($grid.children("tbody").children("tr").length <= min_rows) {
        if (min_rows > 0) {
          message = "This grid requires at least " + min_rows + " row";
          message += (min_rows === 1) ? "." : "s.";
          alert(message);
        }

        $(this).addClass("confirm").html('<span class="icon">u</span>');
        checkGridState($grid);
        updateGrid($grid);
        return false;
      }

      if (response === true) {
        // ok, remove this row
        $(this).closest('tr').remove();
      }

      //if there are no rows, add an empty one.
      if($grid.children("tbody").children("tr").length == 0) {
          $grid.append($grid.data("emptyRow")).find("table.grid tbody").sortable(sortable_options);
          $grid.trigger('addRow');
      }

      // rename inputs
      renameInputs($grid);
      checkGridState($grid);
      updateGrid($grid);
      return false;
    }
  });

  $(".grid").each(function(){
    var $grid = $(this);
    $grid.find("tbody").sortable(sortable_options);
    renameInputs($grid);
    checkGridState($grid);
    updateGrid($grid);
  });

  $('body').on('addSet', function(e, set) {
    $(set).find(".grid").each(function(){
      var $grid = $(this);
      $grid.find("tbody").sortable(sortable_options);
      renameInputs($grid);
      checkGridState($grid);
      updateGrid($grid);
    });
  });

  // Set focus on field when clicking a cell for fields that have no borders
  $('body').on('click', '.cell-text, .cell-date, .cell-time, .cell-textarea', function() {
	$(this).find('input, textarea').focus();
  });



  /////////////////////////////////////////
  //
  // Confirm Something (Do it!)
  //
  /////////////////////////////////////////

  $('.confirm').click(function() {
    var text = $(this).attr('data-confirm-message') || 'Are you sure?';

    return confirm(text);
  });



  /////////////////////////////////////////
  //
  // Faux Submit
  //
  /////////////////////////////////////////

  $('.faux-submit').click(function(e) {
    e.preventDefault();
    $('.primary-form').submit();
  });



  /////////////////////////////////////////
  //
  // Go Back
  //
  /////////////////////////////////////////

  $('.go-back').click(function(e) {
    e.preventDefault();
    window.history.back();
  });


  /////////////////////////////////////////
  //
  // Inline Help
  //
  /////////////////////////////////////////


  // KeyboardJS.on('ctrl + m', function() {
  //   $('#markdown-modal').modal();
  // }, function() {
  //     //do stuff on release
  // });

  function randomString(length) {
      var string = '',
          length = length || 32,
          possible = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxwz0123456789";

      for (var i=0; i < length; i++)
          string += possible.charAt(Math.floor(Math.random() * possible.length));

      return string;
  }


  /////////////////////////////////////////
  //
  // Expandable Pages
  //
  /////////////////////////////////////////

  function supportsLocalStorage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  $(function(){
    var hiddenPages = {};

    // Hide previously closed nodes on load
    if (supportsLocalStorage && localStorage['hiddenPages']) {
      hiddenPages = JSON.parse(localStorage['hiddenPages']);
      console.log(hiddenPages);
      var tree = $('#page-tree');
      _.each(hiddenPages, function(val, url) {
        var node = tree.find('.page[data-url="'+url+'"]');
        node.children('.subpages').hide();
        node.find('.toggle-children .ss-icon').text('directright')
      });
    }

    // Toggle on click
    $('.toggle-children').on('click', function() {
      console.log('toggling');
      var btn      = $(this);
      var page     = btn.closest('.page');
      var url      = page.attr('data-url');
      var icon     = btn.find('.ss-icon');
      var hidden   = (icon.text() == 'directright');
      var iconText = (hidden) ? 'directdown' : 'directright';
      icon.text(iconText);
      $(this).parent().siblings('.subpages').toggle();

      // Save state to local storage
      if (supportsLocalStorage) {
        if (!(url in hiddenPages)) {
          hiddenPages[url] = true;
        } else {
          delete hiddenPages[url];
        }
        localStorage['hiddenPages'] = JSON.stringify(hiddenPages);
      }
    });
  });


    /////////////////////////////////////////
    //
    // Capitalization
    //
    /////////////////////////////////////////
    $('.capitalize')
        .on('click', function(e) {
            e.preventDefault();
            
            var titleInput = $(this).closest('.input-block').find('input');
            
            titleInput.val(titleInput.val().toTitleCase());
        });


  /////////////////////////////////////////
  //
  // Static Site Generation
  //
  /////////////////////////////////////////
  
  var StaticSiteGenerator = {
    init: function() {
      this.bindButton();
    },

    bindButton: function() {
      var self = this;

      $('#generate-site').on('click', function(e){
        e.preventDefault();

        self.$container = $('#generated-files-wrap');
        self.$container.html('<h2>Please wait. Generating files...</h2>');

        var url = $(this).attr('href');
        var request = $.ajax(url, {
          dataType: 'json'
        });

        request.done(function(data){
          self.fileList = data.files;
          self.buildTable();
          self.generateFiles();
        });

      });
    },

    buildTable: function() {
      var tmpl = $('#generated-files-tmpl').html();
      var template = _.template(tmpl);
      var output = template({ 'files': this.fileList });
      this.$container.html(output);
    },

    generateFiles: function() {
      var self = this;

      _.each(this.fileList, function(file) {
        var url = '/admin.php/system/export/generatefile?url=' + file.url;
        var request = $.ajax(url);
        request.done(function(data){
          self.markComplete(file.url);
        });
      });
    },

    markComplete: function(url) {
      this.$container.find('tr[data-url="'+url+'"]')
        .find('.status').addClass('success')
        .find('.ss-icon').text('check');
    }
  };

  StaticSiteGenerator.init();

});


/////////////////////////////////////////
//
// Revisions
//
/////////////////////////////////////////

$(function() {
    if ($('#revision-message').length) {
        // reset the form
        $('#publish .primary-form')[0].reset();
        
        // Bind the revisions modal
        $('#revisions-rollback').on('click', function(e){
            e.preventDefault();
            $('#revisions-selector').modal();
        });

        // Allow a click of the row to activate the radio button
        var $modal = $('#revisions-selector');
        $modal.find('tr').on('click', function(){
            $(this).find('input').prop('checked', true);
        });

        // Select a revision via ajax
        $modal.find('.modal-footer').on('click', '.btn:not(.nevermind)', function(e){
            e.preventDefault();
            e.stopPropagation();

            // add or replace new revision parameter
            var url = location.href,
                value = new RegExp('(\\?|\\&)revision=.*?(?=(&|$))'),
                query_string = new RegExp('\\?.+$'),
                new_url = '';

            if (value.test(url)) {
                new_url = url.replace(value, '$1revision=' + $modal.find('[name=revision]:checked').val());
            } else if (query_string.test(url)) {
                new_url = url + '&revision=' + $modal.find('[name=revision]:checked').val();
            } else {
                new_url = url + '?revision=' + $modal.find('[name=revision]:checked').val();
            }

            location.href = new_url;
        });

        // unbind faux submit
        $('#publish .faux-submit').unbind('click');

        // store initial data
        $('#publish .primary-form').data('serialized', $('#publish .primary-form').serialize());

        $('#publish')
            .on('click', '#publish-submit, #publish-continue-submit, .faux-submit', function(e) {

                // Put "continue" back into the form
                if (e.currentTarget.id === 'publish-continue-submit') {
                    $('#publish .primary-form').append($("<input>").attr('type', 'hidden').attr('name', 'continue').val('true'));
                }

                // whoa there
                e.preventDefault();
                e.stopPropagation();

                // check for changes
                var changed = ($('#publish .primary-form').data('serialized') !== $('#publish .primary-form').serialize());

                if (changed) {
                    // pop modal
                    $('#revisions-save-message').modal();
                } else {
                    $('.primary-form').submit();
                }
            });

        // publish button in save message modal
        $("#revisions-save-message .btn-publish")
            .on('click', function(e) {
                // update hidden field
                $("#revision-message").val($('#modal-save-message').val());

                $("#publish .primary-form").submit();
            });

    }
});


// $.outside plugin
// Lets you trigger a click on *not* a div.
(function($){
    $.fn.outside = function(ename, cb){
        return this.each(function(){
            var $this = $(this),
                self = this;

            $(document).bind(ename, function tempo(e){
                if(e.target !== self && !$.contains(self, e.target)){
                    cb.apply(self, [e]);
                    if(!self.parentNode) $(document.body).unbind(ename, tempo);
                }
            });
        });
    };
}(jQuery));