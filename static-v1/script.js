/* ============================================================
   Jai Bhawani Enterprises — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky nav shadow ---- */
  var nav = document.querySelector(".nav");
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");

    var totop = document.querySelector(".totop");
    if (window.scrollY > 600) totop.classList.add("show");
    else totop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".mobile-menu");
  var scrim = document.querySelector(".scrim");
  var mmClose = document.querySelector(".mm-close");

  function openMenu() {
    menu.classList.add("open");
    scrim.classList.add("open");
    burger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.classList.remove("open");
    scrim.classList.remove("open");
    burger.classList.remove("open");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });
  scrim.addEventListener("click", closeMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Scroll spy (active nav link) ---- */
  var sections = ["home", "about", "materials", "process", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var id = en.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle("active", l.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revObs.unobserve(en.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  revealEls.forEach(function (el) { revObs.observe(el); });

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  var cObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = (el.getAttribute("data-dec") === "1") ? 1 : 0;
      var dur = 1400, start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = dec ? val.toFixed(1) : Math.round(val).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = dec ? target.toFixed(1) : target.toLocaleString("en-IN");
      }
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (c) { cObs.observe(c); });

  /* ---- Contact form ---- */
  var form = document.getElementById("inquiry-form");
  if (form) {
    var okBox = form.querySelector(".form-ok");

    function setInvalid(field, on) {
      field.classList.toggle("invalid", on);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      // required fields
      ["name", "message"].forEach(function (n) {
        var input = form.elements[n];
        var field = input.closest(".field");
        var empty = !input.value.trim();
        setInvalid(field, empty);
        if (empty) valid = false;
      });

      // email format (optional but validated if present)
      var email = form.elements["email"];
      if (email && email.value.trim()) {
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        setInvalid(email.closest(".field"), !ok);
        if (!ok) valid = false;
      }

      if (!valid) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      // Demo success state. To go live, set the <form action> to your
      // Formspree/EmailJS endpoint and remove e.preventDefault above.
      okBox.classList.add("show");
      form.querySelectorAll("input, textarea, select").forEach(function (el) {
        if (el.type !== "submit") el.value = "";
      });
      okBox.scrollIntoView ? null : null; // avoid scrollIntoView per guidelines
      var btn = form.querySelector(".form-submit .btn");
      if (btn) { btn.textContent = "Sent ✓"; setTimeout(function(){ btn.textContent = "Send inquiry"; }, 4000); }
      setTimeout(function () { okBox.classList.remove("show"); }, 7000);
    });

    // clear invalid state on input
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        el.closest(".field").classList.remove("invalid");
      });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

})();
