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
  const slides = Array.from(pager.querySelectorAll(".slide"));
  const dotsContainer = document.getElementById("pagerDots");
  const startButton = document.getElementById("startButton");
  const belovedName = document.getElementById("belovedName");
  const audio = document.getElementById("weddingAudio");

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

  // Track current slide via scroll
  let scrollTimer;
  pager.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const index = Math.round(pager.scrollLeft / window.innerWidth);
      updateDots(index);
    }, 80);
  }, { passive: true });

  // ── Audio & visibility ──
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
    startButton.style.display = "none";
    belovedName.style.display = "none";
    document.querySelector(".pager-overlay").style.opacity = "0.25";
    audio.play().catch(() => {});
    goToSlide(1);
  });

  // ── Language strings ──
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
    document.getElementById("quote").childNodes[0].nodeValue = s.quote + " ";
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

    // Show / hide RSVP
    const isValidName = sanitizedName.trim() !== "";
    if (!isValidName) {
      document.querySelector(".rsvp-form-card").style.display = "none";
    }

    // Show beloved name
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

    // Guest number select
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

    // RTL support
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
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function tick() {
      const diff = targetDate - new Date();
      if (diff <= 0) {
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.textContent = Number(0).toLocaleString(locale));
        clearInterval(timer);
        return;
      }
      daysEl.textContent = Number(Math.floor(diff / 86400000)).toLocaleString(locale);
      hoursEl.textContent = Number(Math.floor((diff / 3600000) % 24)).toLocaleString(locale);
      minutesEl.textContent = Number(Math.floor((diff / 60000) % 60)).toLocaleString(locale);
      secondsEl.textContent = Number(Math.floor((diff / 1000) % 60)).toLocaleString(locale);
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