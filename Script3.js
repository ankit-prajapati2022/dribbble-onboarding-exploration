(Dribbble.Carousel = function (t) {
  this.create(t);
}),
  (Dribbble.Carousel.prototype = {
    create: function (t) {
      if (
        (this.applyOptions(t),
        (this.selector =
          "string" == typeof this.selector
            ? document.querySelector(this.selector)
            : this.selector),
        null === this.selector)
      )
        throw new Error("Something wrong with your selector");
        (this.selectorWidth = this.selector.offsetWidth),
        (this.innerElements = [].slice.call(this.selector.children)),
        (this.slidesCount = this.innerElements.length),
        (this.currentSlideIndex = Math.max(
          0,
          Math.min(this.startIndex, this.slidesCount - this.perPage)
        )),
        (this.transformProperty = this.getTransformProperty()),
        (this.resizeTimer = null),
        Dribbble.Globals.throttle().then(
          function (t) {
            (this.resizeHandler = t(
              function () {
                this.recalculateSlides();
              }.bind(this),
              100
            )),
              window.addEventListener("resize", this.resizeHandler);
          }.bind(this)
        );
      var e = [
        "touchstartHandler",
        "touchendHandler",
        "touchmoveHandler",
        "mousedownHandler",
        "mouseupHandler",
        "mouseleaveHandler",
        "mousemoveHandler",
        "clickHandler",
      ];
      this.resizeObserverSelector && this.observeResize();
      for (var i = 0; i < e.length; i++) this[e[i]] = this[e[i]].bind(this);
      this.initialize();
    },
    applyOptions: function (t) {
      var e = t || {},
        i = {
          selector: ".dribbble-carousel",
          wrapperClass: "dribbble-carousel-wrapper display-flex",
          slideClass: "dribbble-carousel-slide",
          disableAnimation: !1,
          duration: 200,
          easing: "ease-out",
          perPage: 1,
          spaceBetween: 0,
          previewPadding: 0,
          preventClickOnDrag: !1,
          preview: !1,
          breakpoints: {},
          startIndex: 0,
          draggable: !0,
          multipleDrag: !0,
          threshold: 20,
          resizeObserverSelector: "",
          onInit: function () {},
          onBeforeChange: function () {},
          onChange: function () {},
        };
      for (var n in i) this[n] = e.hasOwnProperty(n) ? e[n] : i[n];
      this.preview && (this.previewPadding = 2 * this.spaceBetween);
    },
    initialize: function () {
      this.bindEventListeners(),
        (this.selector.style.overflow = "hidden"),
        this.buildSliderFrame(),
        this.onInit(this);
    },
    bindEventListeners: function () {
      this.bindDragEvent(), (this.eventsBinded = !0);
    },
    bindDragEvent: function () {
      this.draggable &&
        ((this.pointerDown = !1),
        (this.drag = {
          startX: 0,
          endX: 0,
          startY: 0,
          letItGo: null,
          preventClick: !1,
        }),
        this.selector.addEventListener("touchstart", this.touchstartHandler, {
          passive: !0,
        }),
        this.selector.addEventListener("touchend", this.touchendHandler),
        this.selector.addEventListener("touchmove", this.touchmoveHandler),
        this.selector.addEventListener("mousedown", this.mousedownHandler),
        this.selector.addEventListener("mouseup", this.mouseupHandler),
        this.selector.addEventListener("mouseleave", this.mouseleaveHandler),
        this.selector.addEventListener("mousemove", this.mousemoveHandler),
        this.selector.addEventListener("click", this.clickHandler));
    },
    removeDragEvents: function () {
      this.selector.removeEventListener("touchstart", this.touchstartHandler),
        this.selector.removeEventListener("touchend", this.touchendHandler),
        this.selector.removeEventListener("touchmove", this.touchmoveHandler),
        this.selector.removeEventListener("mousedown", this.mousedownHandler),
        this.selector.removeEventListener("mouseup", this.mouseupHandler),
        this.selector.removeEventListener("mouseleave", this.mouseleaveHandler),
        this.selector.removeEventListener("mousemove", this.mousemoveHandler),
        this.selector.removeEventListener("click", this.clickHandler);
    },
    removeAllEventListeners: function () {
      window.removeEventListener("resize", this.resizeHandler),
        this.removeDragEvents();
    },
    buildSliderFrame: function () {
      (this.sliderFrame = document.createElement("div")),
        (this.sliderFrame.className = this.wrapperClass),
        (this.sliderFrame.style.width =
          this.getSlideWidth(!0) * this.slidesCount +
          this.previewPadding +
          "px"),
        this.enableTransition(),
        (this.selector.style.cursor = this.draggable
          ? "-webkit-grab"
          : "inherit");
      for (
        var t = document.createDocumentFragment(), e = 0;
        e < this.slidesCount;
        e++
      ) {
        var i = this.buildSliderFrameItem(this.innerElements[e], 0 === e);
        t.appendChild(i);
      }
      this.sliderFrame.appendChild(t),
        (this.selector.innerHTML = ""),
        this.selector.appendChild(this.sliderFrame),
        this.slideToCurrent();
    },
    buildSliderFrameItem: function (t, e) {
      var i = document.createElement("div");
      return (
        (i.className = this.slideClass),
        this.spaceBetween
          ? ((i.style.width = this.getSlideWidth() + "px"),
            e &&
              this.preview &&
              (i.style.marginLeft = this.previewPadding + "px"),
            (i.style.marginRight = this.spaceBetween + "px"))
          : (i.style.width = 100 / this.slidesCount + "%"),
        i.appendChild(t),
        i
      );
    },
    getSlideWidth: function (t) {
      var e = this.selectorWidth / this.perPage;
      if (this.spaceBetween) {
        if (this.preview) var i = this.perPage * (2 * this.previewPadding);
        else i = (this.perPage - 1) * this.spaceBetween;
        (e = (this.selectorWidth - i) / this.perPage),
          t && (e += this.spaceBetween);
      }
      return e;
    },
    slideToCurrent: function (t, e) {
      var i = -1 * this.currentSlideIndex * this.getSlideWidth(!0);
      if (
        (this.disableAnimation && this.disableTransition(),
        (this.sliderFrame.style[this.transformProperty] =
          "translate3d(" + i + "px, 0, 0)"),
        t)
      )
        if (
          (this.onBeforeChange(e, this.currentSlideIndex),
          this.disableAnimation)
        )
          this.onChange(e, this.currentSlideIndex);
        else {
          var n = this;
          window.setTimeout(function () {
            n.onChange(e, n.currentSlideIndex);
          }, n.duration);
        }
    },
    prev: function (t, e) {
      var i = t || 1;
      if (!(this.slidesCount <= this.perPage)) {
        var n = this.currentSlideIndex;
        (this.currentSlideIndex = Math.max(this.currentSlideIndex - i, 0)),
          isNaN(this.currentSlideIndex) ||
            this.currentSlideIndex === n ||
            (this.slideToCurrent(!0, n), e && e.call(this));
      }
    },
    next: function (t, e) {
      var i = t || 1;
      if (!(this.slidesCount <= this.perPage)) {
        var n = this.currentSlideIndex;
        (this.currentSlideIndex = Math.min(
          this.currentSlideIndex + i,
          this.slidesCount - this.perPage
        )),
          isNaN(this.currentSlideIndex) ||
            this.currentSlideIndex === n ||
            (this.slideToCurrent(!0, n), e && e.call(this));
      }
    },
    goTo: function (t, e) {
      if (!(this.slidesCount <= this.perPage)) {
        var i = this.currentSlideIndex;
        (this.currentSlideIndex = Math.min(
          Math.max(t, 0),
          this.slidesCount - this.perPage
        )),
          isNaN(this.currentSlideIndex) ||
            this.currentSlideIndex === i ||
            (this.slideToCurrent(!0, i), e && e.call(this));
      }
    },
    recalculateSlides: function () {
      this.updateFromBreakpoint(),
        this.currentSlideIndex + this.perPage > this.slidesCount &&
          (this.currentSlideIndex =
            this.slidesCount <= this.perPage
              ? 0
              : this.slidesCount - this.perPage),
        (this.selectorWidth = this.selector.offsetWidth),
        this.buildSliderFrame();
    },
    observeResize: function () {
      var t = new ResizeObserver(
          function () {
            this.recalculateSlides();
          }.bind(this)
        ),
        e = document.querySelector(this.resizeObserverSelector);
      e && t.observe(e);
    },
    touchstartHandler: function (t) {
      -1 !==
        ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(t.target.nodeName) ||
        (t.stopPropagation(),
        (this.pointerDown = !0),
        (this.drag.startX = t.touches[0].pageX),
        (this.drag.startY = t.touches[0].pageY));
    },
    touchendHandler: function (t) {
      t.stopPropagation(),
        (this.pointerDown = !1),
        this.enableTransition(),
        this.drag.endX && this.updateAfterDrag(),
        this.clearDrag();
    },
    touchmoveHandler: function (t) {
      if (
        (t.stopPropagation(),
        null === this.drag.letItGo &&
          (this.drag.letItGo =
            Math.abs(this.drag.startY - t.touches[0].pageY) <
            Math.abs(this.drag.startX - t.touches[0].pageX)),
        this.pointerDown && this.drag.letItGo)
      ) {
        t.preventDefault(), (this.drag.endX = t.touches[0].pageX);
        var e = "all 0ms " + this.easing;
        (this.sliderFrame.style.webkitTransition = e),
          (this.sliderFrame.style.transition = e);
        var i =
          -1 *
          (this.currentSlideIndex * this.getSlideWidth(!0) -
            (this.drag.endX - this.drag.startX));
        this.sliderFrame.style[this.transformProperty] =
          "translate3d(" + i + "px, 0, 0)";
      }
    },
    mousedownHandler: function (t) {
      -1 !==
        ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(t.target.nodeName) ||
        (t.preventDefault(),
        t.stopPropagation(),
        (this.pointerDown = !0),
        (this.drag.startX = t.pageX));
    },
    mouseupHandler: function (t) {
      t.stopPropagation(),
        (this.pointerDown = !1),
        (this.selector.style.cursor = "-webkit-grab"),
        this.enableTransition(),
        this.drag.endX && this.updateAfterDrag(),
        this.clearDrag();
    },
    mouseleaveHandler: function (t) {
      this.pointerDown &&
        ((this.pointerDown = !1),
        (this.selector.style.cursor = "-webkit-grab"),
        (this.drag.endX = t.pageX),
        (this.drag.preventClick = !1),
        this.enableTransition(),
        this.updateAfterDrag(),
        this.clearDrag());
    },
    mousemoveHandler: function (t) {
      if ((t.preventDefault(), this.pointerDown)) {
        ("A" === t.target.nodeName || this.preventClickOnDrag) &&
          (this.drag.preventClick = !0),
          (this.drag.endX = t.pageX),
          (this.selector.style.cursor = "-webkit-grabbing");
        var e = "all 0ms " + this.easing;
        (this.sliderFrame.style.webkitTransition = e),
          (this.sliderFrame.style.transition = e);
        var i =
          -1 *
          (this.currentSlideIndex * this.getSlideWidth(!0) -
            (this.drag.endX - this.drag.startX));
        this.sliderFrame.style[this.transformProperty] =
          "translate3d(" + i + "px, 0, 0)";
      }
    },
    clickHandler: function (t) {
      this.drag.preventClick && t.preventDefault(),
        (this.drag.preventClick = !1);
    },
    updateAfterDrag: function () {
      var t = 1 * (this.drag.endX - this.drag.startX),
        e = Math.abs(t),
        i = this.multipleDrag ? Math.ceil(e / this.getSlideWidth(!0)) : 1;
      0 < t && e > this.threshold && this.slidesCount > this.perPage
        ? this.prev(i)
        : t < 0 &&
          e > this.threshold &&
          this.slidesCount > this.perPage &&
          this.next(i),
        this.slideToCurrent();
    },
    remove: function (t, e) {
      if (t < 0 || t >= this.slidesCount)
        throw new Error("Item to remove doesn't exist");
      var i = t < this.currentSlideIndex,
        n = this.currentSlideIndex + this.perPage - 1 === t;
      (i || n) && this.currentSlideIndex--,
        this.innerElements.splice(t, 1),
        (this.slidesCount = this.innerElements.length),
        this.buildSliderFrame(),
        e && e.call(this);
    },
    insert: function (t, e, i) {
      if (e < 0 || e > this.slidesCount + 1)
        throw new Error("Unable to inset it at this index");
      if (-1 !== this.innerElements.indexOf(t))
        throw new Error("Can't insert the same item");
      var n = 0 < (e <= this.currentSlideIndex) && this.slidesCount;
      (this.currentSlideIndex = n
        ? this.currentSlideIndex + 1
        : this.currentSlideIndex),
        this.innerElements.splice(e, 0, t),
        (this.slidesCount = this.innerElements.length),
        this.buildSliderFrame(),
        i && i.call(this);
    },
    prepend: function (t, e) {
      this.insert(t, 0), e && e.call(this);
    },
    append: function (t, e) {
      this.insert(t, this.slidesCount + 1), e && e.call(this);
    },
    destroy: function (t, e) {
      var i = t || !1;
      if (
        (this.removeAllEventListeners(),
        (this.selector.style.cursor = "auto"),
        i)
      ) {
        for (
          var n = document.createDocumentFragment(), s = 0;
          s < this.slidesCount;
          s++
        )
          n.appendChild(this.innerElements[s]);
        (this.selector.innerHTML = ""),
          this.selector.appendChild(n),
          this.selector.removeAttribute("style");
      }
      e && e.call(this);
    },
    enableTransition: function () {
      var t = "transform " + this.duration + "ms " + this.easing;
      (this.sliderFrame.style.webkitTransition = t),
        (this.sliderFrame.style.transition = t);
    },
    disableTransition: function () {
      var t = "transform 0ms " + this.easing;
      (this.sliderFrame.style.webkitTransition = t),
        (this.sliderFrame.style.transition = t);
    },
    clearDrag: function () {
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: this.drag.preventClick,
      };
    },
    getTransformProperty: function () {
      return "string" == typeof document.documentElement.style.transform
        ? "transform"
        : "WebkitTransform";
    },
  }),
  (Dribbble.MediaGallery = {
    initialize: function () {
      (this.mediaContainer = document.querySelector(".js-media-container")),
        null !== this.mediaContainer &&
          ((this.media =
            this.mediaContainer.querySelectorAll(".js-media-shot") || []),
          (this.hasGallery =
            this.mediaContainer.classList.contains("has-gallery")),
          (this.galleryThumbnailsContainer =
            this.mediaContainer.querySelector(".js-media-gallery-thumbnails") ||
            null),
          (this.galleryThumbnailsMedia = this.galleryThumbnailsContainer
            ? this.galleryThumbnailsContainer.querySelectorAll(
                ".js-media-shot-small"
              )
            : []),
          (this.previousButtonTarget = this.mediaContainer.querySelector(
            ".js-media-gallery-navigation-target.previous"
          )),
          (this.nextButtonTarget = this.mediaContainer.querySelector(
            ".js-media-gallery-navigation-target.next"
          )),
          (this.previousButton = this.mediaContainer.querySelector(
            ".js-media-gallery-navigation.previous"
          )),
          (this.nextButton = this.mediaContainer.querySelector(
            ".js-media-gallery-navigation.next"
          )),
          (this.intersectionObserver = null),
          this.hasGallery &&
            (this.setupGallery(),
            this.galleryThumbnailsContainer &&
              this.galleryThumbnailsMedia.length &&
              this.setupGalleryThumbnails()),
          Dribbble.isMobile() && this.setupMobile());
    },
    setupGallery: function () {
      this.Gallery = new Dribbble.Carousel({
        selector: ".js-media-gallery",
        spaceBetween: 0,
        onInit: this.onGalleryInit.bind(this),
        onBeforeChange: this.onGalleryBeforeChange.bind(this),
        onChange: this.onGalleryChange.bind(this),
        resizeObserverSelector: ".js-media-content",
        breakpoints: {
          1e3: { spaceBetween: 0, disableAnimation: !1, draggable: !1 },
        },
      });
    },
    setupGalleryThumbnails: function () {
      this.galleryThumbnailsMedia.forEach(
        function (t) {
          var e = this;
          t.addEventListener("click", function () {
            e.Gallery.goTo(this.dataset.index);
          });
        }.bind(this)
      ),
        this.checkScroll(),
        Dribbble.Globals.debounce().then(
          function (t) {
            var e = t(this.handleResize.bind(this), 100);
            window.addEventListener("resize", e);
          }.bind(this)
        );
    },
    onGalleryInit: function (t) {
      var e = t.currentSlideIndex + 1;
      this.media[t.currentSlideIndex].getAttribute("data-media-id");
      this.previousButtonTarget.addEventListener("click", function () {
        t.prev();
      }),
        this.nextButtonTarget.addEventListener("click", function () {
          t.next();
        }),
        (this.previousButtonTarget.style.cursor = "pointer"),
        (this.nextButtonTarget.style.cursor = "pointer"),
        1 === e &&
          (this.previousButton.classList.add("d-none"),
          (this.previousButtonTarget.style.cursor = "default")),
        this.addActiveThumbnailClass(t.currentSlideIndex);
    },
    onGalleryBeforeChange: function (t, e) {
      this.removeActiveThumbnailClass(t),
        this.addActiveThumbnailClass(e),
        this.shouldScrollThumbnails(e);
      var i = this.media[t].querySelector("video");
      null !== i && i.pause();
    },
    onGalleryChange: function (t, e) {
      var i = this.media[e],
        n = this.media[e].querySelector("video"),
        s = e + 1;
      i.getAttribute("data-media-id");
      this.previousButton.classList.remove("d-none"),
        this.nextButton.classList.remove("d-none"),
        (this.previousButtonTarget.style.cursor = "pointer"),
        (this.nextButtonTarget.style.cursor = "pointer"),
        1 === s &&
          (this.previousButton.classList.add("d-none"),
          (this.previousButtonTarget.style.cursor = "default")),
        s === this.media.length &&
          (this.nextButton.classList.add("d-none"),
          (this.previousButtonTarget.style.cursor = "default")),
        null === n || i.hasAttribute("data-lazy") || n.play();
    },
    addActiveThumbnailClass: function (t) {
      this.galleryThumbnailsMedia[t].classList.add("active");
    },
    removeActiveThumbnailClass: function (t) {
      this.galleryThumbnailsMedia[t].classList.remove("active");
    },
  }),
  Dribbble.LargeShotViewRecorder.start();
