(function () {
  let isStarted = false;
  const supportedLangs = ["en", "ar"];
  const parsedLang = new URL(window.location.href).pathname.split('/')[1];
  const lang = supportedLangs.includes(parsedLang) ? parsedLang : "en";
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id")) || 1;
  const validatedId = isNaN(id) ? 1 : id;
  const locale = lang === "ar" ? "ar-lb" : lang;
  const maxGuests = parseInt(urlParams.get("for")) || 5;
  const validatedMaxGuests = isNaN(maxGuests) || maxGuests < 1 ? 5 : Math.min(maxGuests, 5);
  const isSingleGuest = validatedMaxGuests === 1;
  const rawName = urlParams.get("name") || "";
  const sanitizedName = rawName.trim().replace(/[<>"]/g, "");

  const pager = document.getElementById("pager");
  const introScreen = document.getElementById("introScreen");
  const dotsContainer = document.getElementById("pagerDots");
  const startButton = document.getElementById("startButton");
  const belovedName = document.getElementById("belovedName");
  const audio = document.getElementById("weddingAudio");
  const slides = Array.from(pager.querySelectorAll(".slide"));

  // ── Dots ──
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(index) {
    dotsContainer.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goToSlide(index) {
    pager.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });
  }

  // ── IntersectionObserver for dots + slide-3 pinning ──
  const PINNED_SLIDE = 3;
  const PINNED_IMAGE = "hug3.jpg";

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
      const index = slides.indexOf(entry.target);
      if (index === -1) return;
      updateDots(index);
      if (index === PINNED_SLIDE) {
        pauseAndPin(PINNED_IMAGE);
      } else if (bgPaused) {
        resumeCycle();
      }
    });
  }, { root: pager, threshold: 0.5 });
  slides.forEach(slide => slideObserver.observe(slide));

  // ── Background image system ──
  // Two layers: A (bottom) and B (top). We always fade B in over A, then swap.
  const bgImages = ["hug1.jpg", "hug2.jpg", "hug3.jpg", "hug4.jpg", "hug5.jpg", "hug6.jpg"];
  let bgIndex = 0;
  let bgPaused = false;
  let bgCycleTimer = null;
  let bgFadeTimer = null;

  const bgA = document.querySelector(".pager-bg");   // starts with hug.jpg in CSS
  const bgB = document.createElement("div");
  bgB.className = "pager-bg2";
  bgA.parentNode.insertBefore(bgB, bgA.nextSibling);

  // Preload an image, resolve when loaded (or immediately on error)
  function preload(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    });
  }

  // Crossfade bgA → new image. bgB fades in on top, then bgA is updated underneath, bgB fades out.
  function crossfadeTo(src, done) {
    clearTimeout(bgFadeTimer);
    preload(src).then(() => {
      bgB.style.backgroundImage = 'url("' + src + '")';
      // Force reflow so transition fires
      bgB.offsetHeight; // eslint-disable-line no-unused-expressions
      bgB.style.opacity = "1";
      bgFadeTimer = setTimeout(() => {
        bgA.style.backgroundImage = 'url("' + src + '")';
        bgB.style.opacity = "0";
        if (done) done();
      }, 2500);
    });
  }

  function scheduleCycle() {
    clearTimeout(bgCycleTimer);
    bgCycleTimer = setTimeout(() => {
      if (bgPaused) return;
      bgIndex = (bgIndex + 1) % bgImages.length;
      crossfadeTo(bgImages[bgIndex], () => {
        if (!bgPaused) scheduleCycle();
      });
    }, 5000);
  }

  function pauseAndPin(src) {
    bgPaused = true;
    clearTimeout(bgCycleTimer);
    clearTimeout(bgFadeTimer);
    crossfadeTo(src);
  }

  function resumeCycle() {
    bgPaused = false;
    crossfadeTo(bgImages[bgIndex], scheduleCycle);
  }

  // ── Audio ──
  audio.src = "audio1.mp3";
  audio.load();
  let wasPlayingBeforeHidden = false;

  document.addEventListener("visibilitychange", () => {
    if (!isStarted) return;
    if (document.hidden) {
      wasPlayingBeforeHidden = !audio.paused;
      if (!audio.paused) audio.pause();
    } else {
      if (wasPlayingBeforeHidden) audio.play().catch(() => {});
    }
  });

  // ── Start button ──
  startButton.addEventListener("click", () => {
    isStarted = true;
    introScreen.classList.add("hidden");
    pager.classList.add("visible");
    dotsContainer.classList.add("visible");
    audio.play().catch(() => {});
    pager.scrollLeft = 0;
    updateDots(0);
    // Begin bg cycling after a short delay
    scheduleCycle();
  });

  // ── Language strings ──
  async function loadStrings(lang) {
    try {
      const res = await fetch(`/lang/${lang}.json`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch { return null; }
  }

  function applyStrings(s) {
    if (!s) return;
    startButton.textContent = s.start;

    const quoteEl = document.getElementById("quote");
    let textNode = null;
    for (const n of quoteEl.childNodes) { if (n.nodeType === Node.TEXT_NODE) { textNode = n; break; } }
    if (textNode) textNode.nodeValue = s.quote + " ";
    else quoteEl.insertBefore(document.createTextNode(s.quote + " "), quoteEl.firstChild);

    document.getElementById("quoteAuthor").textContent = s.quoteAuthor;
    document.getElementById("groom").textContent = s.groom;
    document.getElementById("and").textContent = s.and;
    document.getElementById("bride").textContent = s.bride;
    document.getElementById("hosts").innerHTML = s.hosts.replace(/\n/g, "<br />");
    document.getElementById("invitationText").textContent = s.invitation;
    document.getElementById("date").textContent = s.date;
    document.getElementById("daysLabel").textContent = s.countdownLabels.days;
    document.getElementById("hoursLabel").textContent = s.countdownLabels.hours;
    document.getElementById("minutesLabel").textContent = s.countdownLabels.minutes;
    document.getElementById("secondsLabel").textContent = s.countdownLabels.seconds;
    document.getElementById("locationTitle").textContent = s.locationTitle;
    document.getElementById("time").textContent = s.time;
    document.getElementById("reception").textContent = s.reception;
    document.getElementById("locationTitle2").textContent = s.locationTitle2;
    document.getElementById("time2").textContent = s.time2;
    document.getElementById("locationMap").textContent = s.locationMap;
    document.getElementById("locationMap2").textContent = s.locationMap2;
    document.getElementById("giftRegistryTitle").textContent = s.giftRegistryTitle;
    document.getElementById("giftRegistryDesc").textContent = s.giftRegistryDesc;
    document.getElementById("accountNumber").textContent = s.accountNumber;
    document.getElementById("rsvpTitle").textContent = s.rsvpTitle;
    document.getElementById("attendanceLabel").textContent = s.formLabels.attendance;
    document.getElementById("numberLabel").textContent = s.formLabels.number;
    const att = document.getElementById("attendance");
    att.options[0].text = s.formLabels.attendancePlaceholder;
    att.options[1].text = s.formLabels.yes;
    att.options[2].text = s.formLabels.no;
    document.getElementById("submitBtn").textContent = s.formLabels.submit;

    const isValidName = sanitizedName.trim() !== "";
    if (!isValidName) document.querySelector(".rsvp-form-card").style.display = "none";

    if (isValidName) {
      const nameParts = sanitizedName.replace(/,/g, "&").replace(/_/g, " ").split(";");
      const formatted = nameParts.map(p => p.trim()).filter(Boolean)
        .map(p => p.split("&").map(sub => `<span>${sub.trim()}</span>`).join("<span>&nbsp;&&nbsp;</span>"))
        .join("<br>");
      belovedName.innerHTML = formatted;
      belovedName.style.visibility = "visible";
    }

    const numberSelect = document.getElementById("number");
    if (isSingleGuest) {
      numberSelect.innerHTML = `<option value="1" selected>${Number(1).toLocaleString(locale)}</option>`;
      numberSelect.setAttribute("disabled", "disabled");
      numberSelect.classList.add("single-guest");
    } else {
      numberSelect.innerHTML = `<option value="" disabled selected>${s.formLabels.numberPlaceholder}</option>`;
      for (let i = 1; i <= validatedMaxGuests; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = Number(i).toLocaleString(locale);
        numberSelect.appendChild(opt);
      }
    }

    startButton.style.visibility = "visible";

    if (lang === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      document.body.style.direction = "rtl";
      document.querySelectorAll(".rsvp-form-card select:not(.single-guest)").forEach(sel => {
        sel.style.backgroundPosition = "left 0.75rem center";
      });
    } else {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    }
  }

  function startCountdown(targetDate) {
    const els = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
    function tick() {
      const diff = targetDate - new Date();
      if (diff <= 0) { Object.values(els).forEach(el => el.textContent = Number(0).toLocaleString(locale)); clearInterval(timer); return; }
      els.days.textContent = Number(Math.floor(diff / 86400000)).toLocaleString(locale);
      els.hours.textContent = Number(Math.floor((diff / 3600000) % 24)).toLocaleString(locale);
      els.minutes.textContent = Number(Math.floor((diff / 60000) % 60)).toLocaleString(locale);
      els.seconds.textContent = Number(Math.floor((diff / 1000) % 60)).toLocaleString(locale);
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  function initRSVP(s) {
    const attSel = document.getElementById("attendance");
    const numSel = document.getElementById("number");
    const btn = document.getElementById("submitBtn");
    const formName = sanitizedName.replace(/,/g, " & ").replace(/[;_]/g, " ").replace(/\s+/g, " ").trim();

    function validate() {
      const attOk = attSel.value === "yes" || attSel.value === "no";
      const numOk = isSingleGuest ? true : numSel.value !== "";
      if (!isSingleGuest) {
        if (attSel.value === "yes") numSel.removeAttribute("disabled");
        else { numSel.value = ""; numSel.setAttribute("disabled", "disabled"); }
      }
      btn.disabled = !(attOk && (attSel.value === "no" || isSingleGuest || numOk));
    }

    attSel.addEventListener("change", validate);
    attSel.addEventListener("input", validate);
    if (!isSingleGuest) { numSel.addEventListener("change", validate); numSel.addEventListener("input", validate); }

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const attendance = attSel.value === "yes" ? s.formLabels.yes : s.formLabels.no;
      const number = isSingleGuest ? "1" : (attSel.value === "yes" ? Number(numSel.value).toLocaleString(locale) : "0");
      let msg = `${s.messageTitle}\n\n${s.formLabels.name}: ${formName}`;
      if (number !== "0") msg += `\n${s.formLabels.number}: ${number}`;
      msg += `\n${s.formLabels.attendance}: ${attendance}`;
      const phone = validatedId === 1 ? "+96176158615" : "+96176606875";
      window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    });

    validate();
  }

  (async () => {
    const strings = await loadStrings(lang);
    if (!strings) return;
    applyStrings(strings);
    startCountdown(new Date("2026-07-18T18:00:00"));
    initRSVP(strings);
  })();
})();