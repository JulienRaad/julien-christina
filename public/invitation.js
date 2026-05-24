(function () {
  let isStarted = false;
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = urlParams.get("referrer");
  const locale = "en";

const guests = [
    { id: 1, name: "Emile Abou Samra & Family", allowed: 3 },
    { id: 2, name: "Nagham Haddad", allowed: 1 },
    { id: 3, name: "Antoine Abou Samra & Family", allowed: 4 },
    { id: 4, name: "Wafaa Abou Samra", allowed: 1 },
    { id: 5, name: "Georges Kafrouny & Family", allowed: 5 },
    { id: 6, name: "Mikhael Kafrouny", allowed: 1 },
    { id: 7, name: "Joseph Kafrouny & Family", allowed: 3 },
    { id: 8, name: "Milad Aoun & Family", allowed: 5 },
    { id: 9, name: "Jihad & Farida Awil", allowed: 2 },
    { id: 10, name: "Toufic Daccache & Family", allowed: 3 },
    { id: 11, name: "Chadi Awil & Family", allowed: 3 },
    { id: 12, name: "Raghida Abou Samra", allowed: 1 },
    { id: 13, name: "Michel & Rita Abou Samra", allowed: 2 },
    { id: 14, name: "Ibrahim & Rania Sarkis", allowed: 2 },
    { id: 15, name: "Sanaa Sarkis", allowed: 1 },
    { id: 16, name: "Elie Jbeily & Family", allowed: 3 },
    { id: 17, name: "Elie Chalhoub", allowed: 1 },
    { id: 18, name: "Charles Torfeh & Family", allowed: 3 },
    { id: 19, name: "Pascal Moubarak & Family", allowed: 4 },
    { id: 20, name: "Ibrahim Torfeh & Family", allowed: 3 },
    { id: 21, name: "Ziad Torfeh & Family", allowed: 2 },
    { id: 22, name: "Georges Kafrouny & Family", allowed: 3 },
    { id: 23, name: "Elie & Sohaila Sassine", allowed: 2 },
    { id: 24, name: "Joseph Sassine & Family", allowed: 5 },
    { id: 25, name: "Wahib Al Ahmar & Family", allowed: 4 },
    { id: 26, name: "Joseph & Josephine Nahas", allowed: 2 },
    { id: 27, name: "Georges Zghaib & Family", allowed: 5 },
    { id: 28, name: "Michel El Helou & Family", allowed: 3 },
    { id: 29, name: "Dory Nahas & Family", allowed: 3 },
    { id: 30, name: "Joseph Kafrouny & Family", allowed: 3 },
    { id: 31, name: "Naji Kafrouny & Family", allowed: 4 },
    { id: 32, name: "Adele & Rita Naccour", allowed: 2 },
    { id: 33, name: "Joseph & Siham Jwan", allowed: 2 },
    { id: 34, name: "Younes & Rita Younes", allowed: 2 },
    { id: 35, name: "Ibtissam Kafrouny", allowed: 1 },
    { id: 36, name: "Perla Kafrouny", allowed: 1 },
    { id: 37, name: "Arze Kafrouny", allowed: 1 },
    { id: 38, name: "Juana Hamam", allowed: 1 },
    { id: 39, name: "Hassan & Svetlana Hamam", allowed: 2 },
    { id: 40, name: "Mohamad & Caroline Hamam", allowed: 2 },
    { id: 41, name: "Ayla & Jana Hamam", allowed: 2 },
    { id: 42, name: "Jamil & Camilla Hamam", allowed: 2 },
    { id: 43, name: "Hassan & Nancy El Omeiss", allowed: 2 },
    { id: 44, name: "Mohamad & Fatima Hayek", allowed: 2 },
    { id: 45, name: "Tarek Sassine", allowed: 1 },
    { id: 46, name: "Maria Scarlett Elges", allowed: 1 },
    { id: 47, name: "Nadia & Pascale Tabet", allowed: 2 },
    { id: 48, name: "Elias & Mireille Maroun", allowed: 2 },
    { id: 49, name: "Ghassan Kalash & Family", allowed: 3 },
    { id: 50, name: "Ghazi & Nazha Tabet", allowed: 2 },
    { id: 51, name: "Khalil & Almaza Obeid", allowed: 2 },
    { id: 52, name: "Chadi & Sandy Berro", allowed: 2 },
    { id: 53, name: "Nadia Attieh", allowed: 1 },
    { id: 54, name: "Laudy El Hajj", allowed: 1 },
    { id: 55, name: "Ziad & Marilyne", allowed: 2 },
    { id: 56, name: "Alain & Mia Dahdal", allowed: 2 },
    { id: 57, name: "Perla & Antoine", allowed: 2 },
    { id: 58, name: "Cynthia Saad", allowed: 1 },
    { id: 59, name: "Ibrahim & Jennifer Kawhach", allowed: 2 },
    { id: 60, name: "Georges Selwan", allowed: 1 },
    { id: 61, name: "Robert & Rouba Zaarour", allowed: 2 },
    { id: 62, name: "Elias El Rassi", allowed: 1 },
    { id: 63, name: "Yara Kordahi", allowed: 1 },
    { id: 64, name: "Karam & Remie", allowed: 2 },
    { id: 65, name: "Ali Zaid", allowed: 1 },
    { id: 66, name: "Hanna Dib & Family", allowed: 3 },
    { id: 67, name: "Joseph Dib & Family", allowed: 3 },
    { id: 68, name: "Jad Dib & Family", allowed: 4 },
    { id: 69, name: "Georges Rahme & Family", allowed: 4 },
    { id: 70, name: "Sassine & Vera Akl", allowed: 2 },
    { id: 71, name: "Amer Nehme & Family", allowed: 3 },
    { id: 72, name: "Badih & Salwa Nehme", allowed: 2 },
    { id: 73, name: "Tony & Annita Abou Serhal", allowed: 2 },
    { id: 74, name: "Rosette Nehme", allowed: 1 },
    { id: 75, name: "Raji & Georgette Ghattas", allowed: 2 },
    { id: 76, name: "Mikhael Nehme", allowed: 1 },
    { id: 77, name: "Caroline Nehme", allowed: 1 },
    { id: 78, name: "Raymond & Nazira Dib", allowed: 2 },
    { id: 79, name: "Rabih Dib", allowed: 1 },
    { id: 80, name: "Mounir Raad", allowed: 1 },
    { id: 81, name: "Elias & Nada Raad", allowed: 2 },
    { id: 82, name: "Therese Raad", allowed: 1 },
    { id: 83, name: "Nidal & Zahia Khleif", allowed: 2 },
    { id: 84, name: "Majid & Claude Hanna", allowed: 2 },
    { id: 85, name: "Paul & Ghada Khoury", allowed: 2 },
    { id: 86, name: "Elias & Manale Raad", allowed: 2 },
    { id: 87, name: "Sleiman Raad", allowed: 1 },
    { id: 88, name: "Dani & Tania El Amm", allowed: 2 },
    { id: 89, name: "Joseph & Favi Sabine Raad", allowed: 2 },
    { id: 90, name: "Pierre & Fadia Raad", allowed: 2 },
    { id: 91, name: "Georges & Tracy Raad", allowed: 2 },
    { id: 92, name: "Julien & Christina Raad", allowed: 2 },
    { id: 93, name: "Salim & Liliane Raad", allowed: 3 },
    { id: 94, name: "Joseph Raad & Family", allowed: 4 },
    { id: 95, name: "Naji & Hala Khoury", allowed: 2 },
    { id: 96, name: "Toni Maydaa & Family", allowed: 4 },
    { id: 97, name: "Salwa Raad", allowed: 1 },
    { id: 98, name: "Jihane & Elie-Joe Tanios", allowed: 2 },
    { id: 99, name: "Rita Tanios", allowed: 1 },
    { id: 100, name: "Fady Tanios & Family", allowed: 5 },
    { id: 101, name: "Charbel & Christine Kmeid", allowed: 2 },
    { id: 102, name: "Adib & Latife Naaman", allowed: 2 },
    { id: 103, name: "Elias & Caroline Chahoud", allowed: 2 },
    { id: 104, name: "Hanna & Chiraz Tannous", allowed: 2 },
    { id: 105, name: "Joe Aoun", allowed: 1 },
    { id: 106, name: "Joseph Haddad", allowed: 1 },
    { id: 107, name: "Elie & Patricia", allowed: 2 },
    { id: 108, name: "Bassel & Rassel Farhat", allowed: 2 },
    { id: 109, name: "Charbel Fares", allowed: 1 },
    { id: 110, name: "Elie Klayaani & Family", allowed: 4 },
    { id: 111, name: "Christopher Klayaani", allowed: 1 },
    { id: 112, name: "Antoine & Mona El Saliby", allowed: 2 },
    { id: 113, name: "Michel El Saliby", allowed: 1 },
    { id: 114, name: "Georges Aoun", allowed: 1 },
    { id: 115, name: "Rodolph & Christelle", allowed: 2 },
    { id: 116, name: "Bilal & Kinda Obeid", allowed: 2 },
    { id: 117, name: "Nicolas Asmar", allowed: 1 },
    { id: 118, name: "Nazih Ibrahim & Family", allowed: 3 },
    { id: 119, name: "Chadi Abboud & Family", allowed: 4 },
    { id: 120, name: "Pere Ayoub El Said", allowed: 1 },
    { id: 121, name: "Pere Botrous Azar", allowed: 1 },
    { id: 122, name: "Marcos & Lea", allowed: 2 },
    { id: 123, name: "Nadim & Vera Tanios", allowed: 2 },
    { id: 124, name: "Georges & Maya Elia", allowed: 2 },
    { id: 125, name: "Michel & Nisrine Mansour", allowed: 2 },
    { id: 126, name: "Khalil Bou Khalil", allowed: 1 },
    { id: 127, name: "Leonie & Helena Dib", allowed: 2 },
    { id: 128, name: "Georges Hage", allowed: 1 },
    { id: 129, name: "Chadi & Sanaa Elias", allowed: 2 },
    { id: 130, name: "James Raad", allowed: 1 },
    { id: 131, name: "Cynthia Raad", allowed: 1 },
    { id: 132, name: "Anthony Raad", allowed: 1 },
    { id: 133, name: "Elise Raad", allowed: 1 },
    { id: 134, name: "Elie & Nancy Moughamess", allowed: 2 },
    { id: 135, name: "Elie & Zalfa Tanios", allowed: 2 },
    { id: 136, name: "Charbel & Marie-Noel Ibrahim", allowed: 2 },
    { id: 137, name: "Nasri & Clara Ghsoub", allowed: 2 },
    { id: 138, name: "Charles Mhanna", allowed: 2 },
    { id: 139, name: "Rita Faraj", allowed: 1 },
    { id: 140, name: "Christelle Abi Kanaan", allowed: 1 },
    { id: 141, name: "Jack & Tatiana Antoun", allowed: 2 },
    { id: 142, name: "Marie Moussa", allowed: 4 },
    { id: 143, name: "Elie & Marie Ghanem", allowed: 2 },
    { id: 144, name: "Miled Dib", allowed: 1 },
    { id: 145, name: "Père Wissam Harb", allowed: 1},
  ];

  const guestId = parseInt(urlParams.get("id"));
  const guest = guests.find(g => g.id === guestId) ?? null;
  const guestName = guest?.name ?? "";
  const guestsNumber = guest?.allowed ?? 0;
  const isSingleGuest = guestsNumber === 1;

  const pager = document.getElementById("pager");
  const introScreen = document.getElementById("introScreen");
  const dotsContainer = document.getElementById("pagerDots");
  const startButton = document.getElementById("startButton");
  const belovedName = document.getElementById("belovedName");
  const audio = document.getElementById("weddingAudio");
  const slides = Array.from(pager.querySelectorAll(".slide"));

  // ── Audio Setup ──
  audio.src = "audio1.mp3";
  audio.load();

  let wasPlayingBeforeHidden = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      wasPlayingBeforeHidden = !audio.paused;
      if (!audio.paused) audio.pause();
    } else {
      if (wasPlayingBeforeHidden) audio.play().catch(() => {});
    }
  });

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

  // ── Instagram-Style Slide Navigation ──
  pager.addEventListener("click", (e) => {
    if (e.target.closest("button, a, select, input, label, .rsvp-form-card, .dot, .account-num")) {
      return;
    }

    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    const currentIndex = Math.round(pager.scrollLeft / screenWidth);

    if (clickX < screenWidth * 0.33) {
      if (currentIndex > 0) goToSlide(currentIndex - 1);
    } else {
      if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
    }
  });

  // ── IntersectionObserver for dots + slide pinning ──
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
      const index = slides.indexOf(entry.target);
      if (index === -1) return;
      updateDots(index);

      if (index === 3) {
        pauseAndPin("hug3.jpg");
      } else if (index === 4) {
        pauseAndPin("hug4.jpg");
      } else if (bgPaused) {
        resumeCycle();
      }
    });
  }, { root: pager, threshold: 0.5 });
  slides.forEach(slide => slideObserver.observe(slide));

  // ── Background image system ──
  const bgImages = ["hug.jpg", "hug1.jpg", "hug2.jpg", "hug5.jpg", "hug6.jpg", "hug7.jpg"];
  let bgIndex = 0;
  let bgPaused = false;
  let bgCycleTimer = null;
  let currentSrc = "hug.jpg";

  const bgContainer = document.getElementById("bgContainer");

  function preload(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    });
  }

  function crossfadeTo(src, done) {
    if (src === currentSrc) { if (done) done(); return; }
    currentSrc = src;

    preload(src).then(() => {
      if (src !== currentSrc) {
        if (done) done();
        return;
      }

      const newBg = document.createElement("div");
      newBg.className = "pager-bg-slide";
      newBg.style.backgroundImage = 'url("' + src + '")';
      bgContainer.appendChild(newBg);

      newBg.offsetHeight;
      newBg.style.opacity = "1";

      setTimeout(() => {
        const toRemove = [];
        for (let child of bgContainer.children) {
          if (child === newBg) break;
          toRemove.push(child);
        }
        toRemove.forEach(c => bgContainer.removeChild(c));

        if (done) done();
      }, 1500);
    });
  }

  function scheduleCycle() {
    clearTimeout(bgCycleTimer);
    bgCycleTimer = setTimeout(() => {
      if (bgPaused) return;
      crossfadeTo(bgImages[bgIndex], () => {
        bgIndex = (bgIndex + 1) % bgImages.length;
        if (!bgPaused) scheduleCycle();
      });
    }, 3800);
  }

  function pauseAndPin(src) {
    bgPaused = true;
    clearTimeout(bgCycleTimer);
    crossfadeTo(src);
  }

  function resumeCycle() {
    bgPaused = false;
    crossfadeTo(bgImages[bgIndex], () => {
      bgIndex = (bgIndex + 1) % bgImages.length;
      if (!bgPaused) scheduleCycle();
    });
  }

  // ── Start button ──
  startButton.addEventListener("click", () => {
    isStarted = true;
    introScreen.classList.add("hidden");
    pager.classList.add("visible");
    dotsContainer.classList.add("visible");
    pager.scrollLeft = 0;
    updateDots(0);
    audio.play().catch(() => {});
  });

  async function loadStrings() {
    try {
      const res = await fetch(`/lang/en.json`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch { return null; }
  }

  function applyStrings(s) {
    if (!s) return;

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
    document.getElementById("locationTitle").innerHTML = s.locationTitle.replace(/\n/g, "<br>");
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

    if (!guest) document.querySelector(".rsvp-form-card").style.display = "none";

    if (guest) {
      belovedName.innerHTML = guestName;
      belovedName.style.visibility = "visible";
    }

    const numberSelect = document.getElementById("number");
    if (isSingleGuest) {
      numberSelect.innerHTML = `<option value="1" selected>${Number(1).toLocaleString(locale)}</option>`;
      numberSelect.setAttribute("disabled", "disabled");
      numberSelect.classList.add("single-guest");
    } else {
      numberSelect.innerHTML = `<option value="" disabled selected>${s.formLabels.numberPlaceholder}</option>`;
      for (let i = 1; i <= guestsNumber; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = Number(i).toLocaleString(locale);
        numberSelect.appendChild(opt);
      }
    }

    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
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
    const formName = guestName;

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
      const phone = referrer ? "+96176606875" : "+96176158615";
      window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    });

    validate();
  }

  (async () => {
    const strings = await loadStrings();
    if (!strings) return;
    applyStrings(strings);
    startCountdown(new Date("2026-07-18T18:00:00"));
    initRSVP(strings);
    scheduleCycle();
    introScreen.classList.add("ready");
  })();
})();
