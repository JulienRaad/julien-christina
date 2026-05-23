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

  // ── Build dots ──
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(index) {
    dotsContainer.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function goToSlide(index) {
    pager.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });
  }

  // ── Instant dot update via IntersectionObserver ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const index = slides.indexOf(entry.target);
        if (index !== -1) updateDots(index);
      }
    });
  }, { root: pager, threshold: 0.5 });
  slides.forEach(slide => observer.observe(slide));

  // ── Background image cycling with crossfade ──
  const bgImages = ["hug.jpg", "hug1.jpg", "hug2.jpg", "hug3.jpg"];
  let bgIndex = 0;
  const bgEl = document.querySelector(".pager-bg");
  const bgEl2 = document.createElement("div");
  bgEl2.className = "pager-bg pager-bg2";
  bgEl2.style.cssText = "opacity:0;transition:opacity 1s ease;";
  bgEl.parentNode.insertBefore(bgEl2, bgEl.nextSibling);

  setInterval(() => {
    bgIndex = (bgIndex + 1) % bgImages.length;
    bgEl2.style.backgroundImage = 'url("' + bgImages[bgIndex] + '")';
    bgEl2.style.opacity = "1";
    setTimeout(() => {
      bgEl.style.backgroundImage = 'url("' + bgImages[bgIndex] + '")';
      bgEl2.style.opacity = "0";
    }, 1000);
  }, 5000);

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

  // ── Start button: hide intro, show pager ──
  startButton.addEventListener("click", () => {
    isStarted = true;
    introScreen.classList.add("hidden");
    pager.classList.add("visible");
    dotsContainer.classList.add("visible");
    audio.play().catch(() => {});
    // Ensure pager starts at slide 0
    pager.scrollLeft = 0;
    updateDots(0);
  });

  // ── Load language strings ──
  async function loadStrings(lang) {
    try {
      const res = await fetch(`/lang/${lang}.json`);
      if (!res.ok) throw new Error("lang file not found");
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function applyStrings(s) {
    if (!s) return;

    startButton.textContent = s.start;
    const quoteEl = document.getElementById("quote");
    // Set quote text as a text node before the author span
    let quoteTextNode = null;
    for (const node of quoteEl.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) { quoteTextNode = node; break; }
    }
    if (quoteTextNode) {
      quoteTextNode.nodeValue = s.quote + " ";
    } else {
      quoteEl.insertBefore(document.createTextNode(s.quote + " "), quoteEl.firstChild);
    }
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

    // Show / hide RSVP card
    const isValidName = sanitizedName.trim() !== "";
    if (!isValidName) {
      document.querySelector(".rsvp-form-card").style.display = "none";
    }

    // Beloved name on intro
    if (isValidName) {
      const nameParts = sanitizedName
        .replace(/,/g, "&")
        .replace(/_/g, " ")
        .split(";");
      const formatted = nameParts
        .map(p => p.trim()).filter(Boolean)
        .map(p =>
          p.split("&").map(sub => `<span>${sub.trim()}</span>`).join("<span>&nbsp;&&nbsp;</span>")
        ).join("<br>");
      belovedName.innerHTML = formatted;
      belovedName.style.visibility = "visible";
    }

    // Number select
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

    // Show start button
    startButton.style.visibility = "visible";

    // RTL
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
      if (diff <= 0) {
        Object.values(els).forEach(el => el.textContent = Number(0).toLocaleString(locale));
        clearInterval(timer);
        return;
      }
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

    const formName = sanitizedName
      .replace(/,/g, " & ")
      .replace(/[;_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    function validate() {
      const attOk = attSel.value === "yes" || attSel.value === "no";
      const numOk = isSingleGuest ? true : numSel.value !== "";
      if (!isSingleGuest) {
        if (attSel.value === "yes") {
          numSel.removeAttribute("disabled");
        } else {
          numSel.value = "";
          numSel.setAttribute("disabled", "disabled");
        }
      }
      btn.disabled = !(attOk && (attSel.value === "no" || isSingleGuest || numOk));
    }

    attSel.addEventListener("change", validate);
    attSel.addEventListener("input", validate);
    if (!isSingleGuest) {
      numSel.addEventListener("change", validate);
      numSel.addEventListener("input", validate);
    }

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