
// Smooth Scroll

$(function() {
  $('a[href*=\\#]:not([href=\\#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

$(function(){
  $('a.scroll').click(function() {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    });
  });
});




// Generated by CoffeeScript 1.6.2
/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/

(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery', 'waypoints'], factory);
    } else {
      return factory(root.jQuery);
    }
  })(this, function($) {
    var defaults, wrap;

    defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'stuck'
    };
    wrap = function($elements, options) {
      $elements.wrap(options.wrapper);
      return $elements.parent();
    };
    $.waypoints('extendFn', 'sticky', function(opt) {
      var $wrap, options, originalHandler;

      options = $.extend({}, $.fn.waypoint.defaults, defaults, opt);
      $wrap = wrap(this, options);
      originalHandler = options.handler;
      options.handler = function(direction) {
        var $sticky, shouldBeStuck;

        $sticky = $(this).children(':first');
        shouldBeStuck = direction === 'down' || direction === 'right';
        $sticky.toggleClass(options.stuckClass, shouldBeStuck);
        $wrap.height(shouldBeStuck ? $sticky.outerHeight() : '');
        if (originalHandler != null) {
          return originalHandler.call(this, direction);
        }
      };
      $wrap.waypoint(options);
      return this.data('stuckClass', options.stuckClass);
    });
    return $.waypoints('extendFn', 'unsticky', function() {
      this.parent().waypoint('destroy');
      this.unwrap();
      return this.removeClass(this.data('stuckClass'));
    });
  });

}).call(this);

var navbarHeight = $('.navbar').height();

$(window).scroll(function() {
  var navbarColor = "214,212,203";//color attr for rgba
  var navbarTextColor ="#fff";
  var smallLogoHeight = $('.small-logo').height();
  var bigLogoHeight = $('.big-logo').height();


  var smallLogoEndPos = 0;
  var smallSpeed = (smallLogoHeight / bigLogoHeight);

  var ySmall = ($(window).scrollTop() * smallSpeed);

  var smallPadding = navbarHeight - ySmall;
  if (smallPadding > navbarHeight) { smallPadding = navbarHeight; }
  if (smallPadding < smallLogoEndPos) { smallPadding = smallLogoEndPos; }
  if (smallPadding < 0) { smallPadding = 0; }

  $('.small-logo-container ').css({ "padding-top": smallPadding});

  var navOpacity = ySmall / smallLogoHeight;
  if  (navOpacity > 1) { navOpacity = 1; }
  if (navOpacity < 0 ) { navOpacity = 0; }
  var navBackColor = 'rgba(' + navbarColor + ',' + navOpacity + ')';
  $('.navbar').css({"background-color": navBackColor});
  $('.navbar-inverse .navbar-nav > li > a').css({"color": navbarTextColor});

  var shadowOpacity = navOpacity * 0.4;
  if ( ySmall > 1) {
    $('.navbar').css({"box-shadow": "0 2px 3px rgba(0,0,0," + shadowOpacity + ")"});
  } else {
    $('.navbar').css({"box-shadow": "none"});
  }


});




$('.sticky-wrapper-primary').waypoint(function() {
  $(this).find('.navbar').toggleClass('stuck');
}, { offset: -80 });



$(document).ready(function() {
    $('#secondary-nav').waypoint('sticky', {
    offset: 80 // Apply "stuck" when element 30px from top
  });
});




$('body').scrollspy({ target: '#secondary-nav-list', offset:1});

// Upgrades content filtering

$('#upgrades-nav #all').click(function(event){
    $('.all').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #house').click(function(event){
    $('.all').hide(200);
    $('.house').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #site').click(function(event){
    $('.all').hide(200);
    $('.site').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #land').click(function(event){
    $('.all').hide(200);
    $('.land').show(200);
    event.preventDefault();
    return false;
});

$('#upgrades-nav #equipment').click(function(event){
    $('.all').hide(200);
    $('.equipment').show(200);
    event.preventDefault();
    return false;
});

// Upgrades slideshow code

//randomize landing page slideshow
$("#slideshow .slideshow-image").sort(function(){
    return Math.random()*10 > 5 ? 1 : -1;
}).each(function(){
    var $t = $(this),
        color = $t.attr("class");
    $t.css({}).appendTo( $t.parent() );
});

// slideshow code
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(2000)
    .next()
    .fadeIn(2000)
    .end()
    .appendTo('#slideshow');
},  3500);

// Slick Carousel Initializer 

$('.slick-carousel-upgrades').slick({
  dots: false,
  arrows: false,
  infinite: true,
  speed: 2000,
  autoplaySpeed: 1000,
  fade: true,
  autoplay: true
});

$('.slick-carousel-landing').slick({
  dots: true,
  arrows: false,
  infinite: true,
  speed: 2000,
  autoplaySpeed: 1000,
  fade: true,
  autoplay: true
});

// Activate Upgrades Bootstrap Tabs
$('#upgrades-nav li a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

// Activate Availability Lot Tabs
$('.map-mobile-container li a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

// Update dropdown values on click

$(document).on('click','.dropdown ul a',function(){
    var text = $(this).text();
    $(this).closest('.dropdown').children('a.dropdown-toggle').text(text).append("<i class='fa fa-chevron-down'></i>");
});

$('.map-mobile-content .tab-pane:first').addClass('in active');

// Initialize fitvids (100% width video embeds)
$(document).ready(function(){
  // Target your .container, .wrapper, .post, etc.
  $(".video").fitVids();
});

if ($('#lot_individual').length) {
  $('body').addClass('lighter-gray');
}

// upgrades scroll position hack

$('.upgrades-scroll').click(function () {
    $('html,body').animate({
        scrollTop: $("#upgrades-anchor").offset().top
    }, 800);
});

$('#upgrades').css({'min-height':(($(window).height())-254)+'px'});

$('#map').css({'height':(($(window).height())-254)+'px'});

if ($('#instafeed').length) {
var feed = new Instafeed({
    get: 'user',
    clientId: 'f61fb2669e734e2da2587b457f0afe57',
    accessToken: '501656935.f61fb26.c99de54c939c432bb20f5dd282ef4e33',
    userId: 501656935,
    resolution: 'standard_resolution',
    template: '<div class="instagram-wrapper"><div class="flipcard"><a target=_blank href="{{link}}"><div class="front"><img src="{{image}}" /></div><div class="back"><p>{{caption}}</p></div></a></div></div>',
    limit: 15
      });
feed.run();
}


$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})


var disqus_shortname = 'hudsonwoodsny'; // required: replace example with your forum shortname

/* * * DON'T EDIT BELOW THIS LINE * * */
(function () {
var s = document.createElement('script'); s.async = true;
s.type = 'text/javascript';
s.src = 'https://' + disqus_shortname + '.disqus.com/count.js';
(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());

// Google Analytics Code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46418002-1', 'auto');
ga('send', 'pageview');


$('#contact-submit').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SubmitForm'});
});

$('#sales-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SalesContact'});
});

$('#media-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'PressContact'});
});


// Update dropdown values on click

$(document).on('click','.land-item',function(e){
  e.preventDefault()
  var text = $(this).text();
  console.log(text);
  $('#dropdownMenuButtonLicense').text(text).append("<i class='fa fa-angle-down'></i>");
  $('#land-status').attr("value", text);
});

$(document).on('click','.inquiry-item',function(e){
  e.preventDefault()
  var text = $(this).text();
  console.log(text);
  $('#dropdownMenuButtonLand').text(text).append("<i class='fa fa-angle-down'></i>");
  $('#inquiry-type').attr("value", text);
});

