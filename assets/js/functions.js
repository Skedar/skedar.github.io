/*================================================
*
* Template name : Gray
* Version       : 1.3.1
* Author        : FlaTheme
* Author URL    : http://themeforest.net/user/flatheme
*
* Table of Contents :
* 1.  Page Preloader
* 2.  Scroll Anchors
* 3.  Toggle Menu
* 4.  Mobile Menu
* 5.  Background Image
* 6.  Sliders
* 7.  Counter
* 8.  Portfolio Filter
* 9.  Lightbox
* 10. Contact Form
* 11. Maps
*
================================================*/
"use strict";

var $body = $("body");

/*===============================================
  1. Page Preloader
===============================================*/
$(window).on("load", function () {
  $body.addClass("loaded");
});

if ($body.attr("data-preloader") === "true") {
  $body.append($("<div class='preloader'><div><span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span></div></div>"));
}


/*===============================================
  2. Scroll Anchors
===============================================*/
$('a[href^=\\#]').on('click', function(event){     
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top + -24}, 0);
});


/*===============================================
  3. Toggle Menu
===============================================*/
var toggleMenu = $(".toggle-menu");

if (toggleMenu.length) {
  var toggleBtn = $(".menu-dots");
  var toggleClose = $(".toggle-close");
  //
  // Open //
  //
  toggleBtn.on("click", function() {
    if (toggleMenu.hasClass("show")) {
      toggleMenu.removeClass("show");
      toggleBtn.removeClass("active");
    }
    else {
      toggleMenu.addClass("show");
      toggleBtn.addClass("active");
    }
  });
  //
  // Close //
  //
  toggleClose.on("click", function() {
    toggleMenu.removeClass("show");
    toggleBtn.removeClass("active");
  });
  $(document).on("click", function(e) {
    if ( $(e.target).closest(".toggle-menu, .menu-dots").length === 0 ) {
      if (toggleMenu.hasClass("show")) {
        toggleMenu.removeClass("show");
        toggleBtn.removeClass("active");
      }
    }
  });
}

/*===============================================
  4. Mobile Menu
===============================================*/
var windowWidth = window.innerWidth;
var headerHeight = document.getElementById("header").offsetHeight;
var sectionNav = document.querySelector(".section-nav");

if (windowWidth < 992) {
  window.addEventListener("scroll", function() {
    if (window.scrollY >= headerHeight) {
      sectionNav.classList.add("fixed");
    } else {
      sectionNav.classList.remove("fixed");
    }
  });
}


/*===============================================
  5. Background Image
===============================================*/
var bgImages = document.querySelectorAll(".bg-image");

if (bgImages) {
  bgImages.forEach(function(bgImage) {
    var bgData = bgImage.getAttribute("data-bg-src");
    bgImage.style.backgroundImage = 'url("' + bgData + '")';
  });
}


/*===============================================
  6. Sliders
===============================================*/
var swiper = new Swiper(".clients-swiper", {
  slidesPerView: 2,
  spaceBetween: 30,
  grabCursor: true,
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      spaceBetween: 40
    },
    // when window width is >= 1200px
    1200: {
      slidesPerView: 5,
      spaceBetween: 40
    }
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});

var swiper = new Swiper(".testimonial-swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 1,
      spaceBetween: 30
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 1,
      spaceBetween: 40
    },
    // when window width is >= 1200px
    1200: {
      slidesPerView: 2,
      spaceBetween: 40
    }
  },
  navigation: {
    nextEl: ".swiper-custom-next",
    prevEl: ".swiper-custom-prev",
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});


/*===============================================
  7. Counter
===============================================*/
$(".counter").appear(function() {

  $(this).each(function () {
    $(this).prop("Counter",0).animate({
        Counter: $(this).text()
    }, {
        duration: 2400,
        easing: "swing",
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
  });
  
},{accX: 0, accY: -10});


/*===============================================
  8. Portfolio Filter
===============================================*/
var pGrid = $(".portfolio-grid");

if (pGrid.length) {
  var mixer = mixitup('.portfolio-grid', {
    selectors: {
        target: '.portfolio-item'
    },
    animation: {
        duration: 250
    }
  });
}


/*===============================================
  9. Lightbox
===============================================*/
//
// Lightbox - Image //
//
var $lightboxImage = $(".lightbox-image-box");

$lightboxImage.each(function () {
  var $this = $(this);
  $this.magnificPopup({
    type: 'image',
    fixedContentPos: false,
    removalDelay: 200,
    closeOnContentClick: true, 
    image: {
      titleSrc: 'data-image-title'
    }
  });
});

//
// Lightbox - Media //
//
var $lightboxMedia = $(".lightbox-media-box");

$lightboxMedia.each(function() {
  var $this = $(this);
  $this.magnificPopup({
    type: "iframe",
    fixedContentPos: false,
    removalDelay: 200,
    preloader: false,
    iframe: {
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
        },
          vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1'
        }
      },
      srcAction: "iframe_src" 
    }
  });
});


/*===============================================
  10. Contact Form
===============================================*/
$("#contactform").on("submit", function(e) {
  var name = $("#name").val();
  var email = $("#email").val();
  var subject = $("#subject").val();
  var message = $("#message").val();

  if (name === "") {
    $("#name").addClass("error-color");
  }
  if (email === "") {
    $("#email").addClass("error-color");
  }
  if (subject === "") {
    $("#subject").addClass("error-color");
  }
  if (message === "") {
    $("#message").addClass("error-color");
  }

  else {
    $.ajax({
      url:"assets/php/contact-form.php",
      data:$(this).serialize(),
      type:"POST",
      success:function(data){
        $("#success").addClass("show-result"); //=== Show Success Message==
        $("#contactform").each(function(){
          this.reset();
        });
      },
      error:function(data){
        $("#error").addClass("show-result"); //===Show Error Message====
      }
    });
    var forms = $("#contactform input, #contactform textarea");
    forms.removeClass("error-color");
  }

  e.preventDefault();
});


/*===============================================
  11. Google Maps
===============================================*/
var mapCanvas = $(".gmap");

if (mapCanvas.length) {
  var m,divId,initLatitude, initLongitude, map;

  for (var i = 0; i < mapCanvas.length; i++) {
    m = mapCanvas[i];

    initLatitude = m.dataset["latitude"];
    initLongitude = m.dataset["longitude"];
    divId = "#"+ m["id"];

    map = new GMaps({
      el: divId,
      lat: initLatitude,
      lng: initLongitude,
      zoom: 16,
      scrollwheel: false,
      styles: [
          /* style your map at https://snazzymaps.com/editor and paste JSON here */
      ]
    });

    map.addMarker({
      lat : initLatitude,
      lng : initLongitude
    });
  }
}