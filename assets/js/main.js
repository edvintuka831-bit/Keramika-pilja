/* =========================================================
   KERAMIKA PILJA — interakcije
   ========================================================= */

/*
 * KONTAKT PODACI — popunjava se nakon potvrde vlasnika.
 * Dok su polja prazna, dugmad prikazuju obavještenje umjesto da otvaraju poziv/poruku.
 *   phone:         "+38761000000"  (međunarodni format, bez razmaka)
 *   whatsapp:      "38761000000"   (bez + i razmaka)
 *   viber:         "+38761000000"
 *   googleReviews: "https://g.page/r/..." (link na Google profil)
 */
const CONFIG = {
  phone: "",
  whatsapp: "",
  viber: "",
  googleReviews: ""
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 3800);
  };

  /* ---------- Godina u footeru ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Fotografije koje se nisu učitale prije skripte ---------- */
  $$("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      img.classList.add("img-failed");
      img.parentElement && img.parentElement.classList.add("has-failed-img");
    }
  });

  /* ---------- Header ---------- */
  const header = $("#header");
  const demoBar = $(".demo-bar");
  const setBarHeight = () => document.documentElement.style.setProperty("--bar-h", demoBar.offsetHeight + "px");
  setBarHeight();
  window.addEventListener("resize", setBarHeight);

  const heroEl = $(".hero");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > Math.min(heroEl.offsetHeight * 0.5, 400));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobilni meni ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const toggleMenu = (open) => {
    const isOpen = open ?? !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Zatvori meni" : "Otvori meni");
    document.body.classList.toggle("no-scroll", isOpen);
  };
  burger.addEventListener("click", () => toggleMenu());
  $$("a", nav).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) toggleMenu(false);
  });

  /* ---------- Aktivni link u navigaciji ---------- */
  const navLinks = $$(".nav__link");
  const sections = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Animacije pri skrolanju ---------- */
  const reveals = $$(".reveal");
  // Blagi kaskadni efekat za elemente u istoj grupi
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i * 0.08, 0.48) + "s");
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Paralaksa hero fotografije ---------- */
  const heroImg = $(".hero__media");
  if (!reduceMotion && heroImg) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) heroImg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Galerija: filteri ---------- */
  const filters = $$(".filter");
  const items = $$(".g-item");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      items.forEach((it) => {
        const show = cat === "sve" || it.dataset.cat === cat;
        it.classList.toggle("is-hidden", !show);
        if (show) {
          it.classList.add("is-visible");
          it.classList.remove("is-entering");
          void it.offsetWidth;
          it.classList.add("is-entering");
        }
      });
    });
  });

  /* ---------- Galerija: lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $("figcaption", lb);
  let lbIndex = 0;
  let lastFocus = null;
  const visibleItems = () => items.filter((i) => !i.classList.contains("is-hidden"));
  const showLb = (idx) => {
    const list = visibleItems();
    if (!list.length) return;
    lbIndex = (idx + list.length) % list.length;
    const img = $("img", list[lbIndex]);
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt.replace(" (primjer)", "") + " — demonstracijska fotografija";
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
  };
  const openLb = (idx) => {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    showLb(idx);
    $(".lightbox__close", lb).focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.classList.remove("no-scroll");
    lastFocus && lastFocus.focus();
  };
  items.forEach((it) => {
    $(".g-item__btn", it).addEventListener("click", () => openLb(visibleItems().indexOf(it)));
  });
  $(".lightbox__close", lb).addEventListener("click", closeLb);
  $(".lightbox__prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lightbox__next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });
  // Swipe na mobitelu
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Prije / poslije ---------- */
  const slider = $("#baSlider");
  if (slider) {
    const range = $(".ba__range", slider);
    const setPos = (v) => slider.style.setProperty("--pos", v + "%");
    range.addEventListener("input", () => setPos(range.value));

    // Mala animacija koja nagovještava interakciju kad slider uđe u ekran
    if (!reduceMotion) {
      const hint = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        hint.disconnect();
        const start = performance.now();
        const anim = (t) => {
          const p = Math.min((t - start) / 1800, 1);
          const v = 50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p);
          setPos(v); range.value = v;
          if (p < 1) requestAnimationFrame(anim);
        };
        setTimeout(() => requestAnimationFrame(anim), 600);
      }, { threshold: 0.5 });
      hint.observe(slider);
    }

    const tabs = $$(".ba__tab");
    const imgs = $$(".ba__img img", slider);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", String(t === tab));
        });
        imgs.forEach((im) => { im.style.opacity = 0; });
        setTimeout(() => {
          imgs.forEach((im) => {
            im.onload = () => { im.style.opacity = 1; };
            im.src = tab.dataset.img;
            if (im.complete) im.style.opacity = 1;
          });
          imgs[0].alt = `Stanje poslije: ${tab.dataset.label.toLowerCase()} s keramikom (demonstracija)`;
          setPos(50); range.value = 50;
        }, 250);
      });
    });
  }

  /* ---------- Forma za procjenu (DEMO — ne šalje podatke) ---------- */
  const form = $("#quoteForm");
  const fileInput = $("#f-foto");
  const drop = $("#drop");
  const previews = $("#previews");
  const MAX_FILES = 6;
  let files = [];

  const renderPreviews = () => {
    previews.innerHTML = "";
    files.forEach((file, i) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);
      const rm = document.createElement("button");
      rm.type = "button";
      rm.setAttribute("aria-label", "Ukloni " + file.name);
      rm.innerHTML = "&times;";
      rm.addEventListener("click", () => { files.splice(i, 1); renderPreviews(); });
      li.append(img, rm);
      previews.append(li);
    });
  };
  const addFiles = (list) => {
    const imgsOnly = [...list].filter((f) => f.type.startsWith("image/") || /\.heic$/i.test(f.name));
    if (files.length + imgsOnly.length > MAX_FILES) showToast(`Možete priložiti najviše ${MAX_FILES} fotografija.`);
    files = files.concat(imgsOnly).slice(0, MAX_FILES);
    renderPreviews();
  };
  fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  const validateField = (input) => {
    const field = input.closest(".field");
    if (!field) return input.checkValidity();
    let ok = input.checkValidity();
    if (ok && input.required && !input.value.trim()) ok = false;
    field.classList.toggle("is-invalid", !ok);
    return ok;
  };
  $$("input, textarea", form).forEach((el) => {
    if (el.type === "checkbox" || el.type === "file") return;
    el.addEventListener("blur", () => { if (el.value) validateField(el); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("is-invalid")) validateField(el); });
  });
  const consent = $("#f-consent");
  const consentErr = $(".field__err--consent");
  consent.addEventListener("change", () => consentErr.classList.toggle("is-shown", !consent.checked));

  const modal = $("#modal");
  const closeModal = () => { modal.hidden = true; document.body.classList.remove("no-scroll"); };
  $("[data-close-modal]", modal).addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input:not([type=checkbox]):not([type=file]), textarea", form);
    const results = fields.map(validateField);
    const consentOk = consent.checked;
    consentErr.classList.toggle("is-shown", !consentOk);
    if (results.includes(false) || !consentOk) {
      const firstBad = $(".field.is-invalid input, .field.is-invalid textarea", form) || consent;
      firstBad.focus();
      showToast("Molimo provjerite označena polja.");
      return;
    }
    // DEMO: ništa se ne šalje niti pohranjuje.
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    btn.style.opacity = .7;
    setTimeout(() => {
      btn.disabled = false;
      btn.style.opacity = "";
      form.reset();
      files = [];
      renderPreviews();
      modal.hidden = false;
      document.body.classList.add("no-scroll");
      $("[data-close-modal]", modal).focus();
    }, 700);
  });

  /* ---------- Kontakt dugmad ---------- */
  const contactLinks = {
    phone: CONFIG.phone && `tel:${CONFIG.phone}`,
    whatsapp: CONFIG.whatsapp && `https://wa.me/${CONFIG.whatsapp}`,
    viber: CONFIG.viber && `viber://chat?number=${encodeURIComponent(CONFIG.viber)}`
  };
  const contactNames = { phone: "Broj telefona", whatsapp: "WhatsApp kontakt", viber: "Viber kontakt" };
  $$("[data-contact]").forEach((a) => {
    const type = a.dataset.contact;
    if (contactLinks[type]) {
      a.href = contactLinks[type];
      if (type === "whatsapp") { a.target = "_blank"; a.rel = "noopener"; }
    } else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showToast(`Demo verzija: ${contactNames[type]} bit će dodan nakon potvrde vlasnika.`);
      });
    }
  });
  $$("[data-config-link]").forEach((a) => {
    const url = CONFIG[a.dataset.configLink];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else a.addEventListener("click", (e) => { e.preventDefault(); showToast("Demo verzija: link na Google profil bit će dodan naknadno."); });
  });

  /* ---------- Plutajuće dugme ---------- */
  const fab = $("#fab");
  const fabBtn = $("#fabBtn");
  const fabMenu = $("#fabMenu");
  const toggleFab = (open) => {
    const isOpen = open ?? !fab.classList.contains("is-open");
    fab.classList.toggle("is-open", isOpen);
    fabBtn.setAttribute("aria-expanded", String(isOpen));
    fabBtn.setAttribute("aria-label", isOpen ? "Zatvori kontakt opcije" : "Otvori kontakt opcije");
    fabMenu.setAttribute("aria-hidden", String(!isOpen));
    $$("a", fabMenu).forEach((a) => (a.tabIndex = isOpen ? 0 : -1));
  };
  fabBtn.addEventListener("click", () => toggleFab());
  $$("a", fabMenu).forEach((a) => a.addEventListener("click", () => toggleFab(false)));
  document.addEventListener("click", (e) => { if (!fab.contains(e.target)) toggleFab(false); });
})();
