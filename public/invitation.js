    const supportedLangs = ["en", "ar"];
    const urlParams = new URLSearchParams(window.location.search);
    const parsedLang = window.location.pathname.split('/')[1];
    const lang = validLangs.includes(parsedLang) ? parsedLang : "en";
    const id = parseInt(urlParams.get("id")) || 1;
    const validatedId = isNaN(id) ? 1 : id;
    const locale = lang === "ar" ? "ar-lb" : lang;
    const maxGuests = parseInt(urlParams.get("for")) || 5;
    const validatedMaxGuests = isNaN(maxGuests) || maxGuests < 1 ? 5 : Math.min(maxGuests, 5); // Ensure max is between 1 and 5
    const isSingleGuest = validatedMaxGuests === 1;
    const rawName = urlParams.get("name") || "";
    const sanitizedName = rawName
        .trim() // Remove leading/trailing whitespace
        .replace(/[<>"]/g, "") // Remove <, >, and quotes for safety

    async function loadStrings(lang = "en") {
        try {
            const response = await fetch(`/lang/${lang}.json`);
            if (!response.ok) throw new Error("Failed to load language file");
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    function applyStrings(strings) {
        if (!strings) return;
        document.getElementById("playMusicBtn").textContent = strings.playMusic;
        document.getElementById("quote").childNodes[0].nodeValue = strings.quote + " ";
        document.getElementById("quoteAuthor").textContent = strings.quoteAuthor;
        document.getElementById("groom").textContent = strings.groom;
        document.getElementById("and").textContent = strings.and;
        document.getElementById("bride").textContent = strings.bride;
        document.getElementById("hosts").innerHTML = strings.hosts.replace(/\n/g, "<br />");
        document.getElementById("invitationText").textContent = strings.invitation;
        document.getElementById("date").textContent = strings.date;
        document.getElementById("daysLabel").textContent = strings.countdownLabels.days;
        document.getElementById("hoursLabel").textContent = strings.countdownLabels.hours;
        document.getElementById("minutesLabel").textContent = strings.countdownLabels.minutes;
        document.getElementById("secondsLabel").textContent = strings.countdownLabels.seconds;
        document.getElementById("locationTitle").textContent = strings.locationTitle;
        document.getElementById("time").textContent = strings.time;
        document.getElementById("reception").textContent = strings.reception;
        document.getElementById("locationMap").textContent = strings.locationMap;
        document.getElementById("giftRegistryTitle").textContent = strings.giftRegistryTitle;
        document.getElementById("giftRegistryDesc").textContent = strings.giftRegistryDesc;
        document.getElementById("accountNumber").textContent = strings.accountNumber;
        document.getElementById("rsvpTitle").textContent = strings.rsvpTitle;
        document.getElementById("attendanceLabel").textContent = strings.formLabels.attendance;
        document.getElementById("numberLabel").textContent = strings.formLabels.number;
        document.getElementById("attendance").options[0].text = strings.formLabels.attendancePlaceholder;
        document.getElementById("attendance").options[1].text = strings.formLabels.yes;
        document.getElementById("attendance").options[2].text = strings.formLabels.no;

        const belovedSection = document.getElementById("belovedSection");
        // Validate name: non-empty after sanitization
        const isValidName = sanitizedName.trim() !== "";

        if (isValidName) {
            const nameParts = sanitizedName
                .replace(/,/g, "&") // Convert commas to &
                .replace(/_/g, " ") // Convert underscores to space
                .split(";"); // Split on ; for line breaks
            const formattedName = nameParts
                .map(part => part.trim()) // Trim each part
                .filter(part => part !== "") // Remove empty parts
                .map(part =>
                    part.split("&")
                    .map(subPart => `<span>${subPart.trim()}</span>`)
                    .join("<span>&nbsp;&&nbsp;</span>")
                ) // Split on &, wrap each sub-part in span, insert & on its own line
                .join("<br>"); // Join parts with <br>
            document.getElementById("belovedName").innerHTML = formattedName;
            belovedSection.classList.add("show");
        } else {
            belovedSection.style.display = "none";
        }

        const numberSelect = document.getElementById("number");
        if (isSingleGuest) {
            numberSelect.innerHTML = `<option value="1" selected>${Number(1).toLocaleString(locale)}</option>`;
            numberSelect.setAttribute("disabled", "disabled");
            numberSelect.classList.add("single-guest");
        } else {
            numberSelect.innerHTML = `<option value="" disabled selected>${strings.formLabels.numberPlaceholder}</option>`;
            for (let i = 1; i <= validatedMaxGuests; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.text = Number(i).toLocaleString(locale);
                numberSelect.appendChild(option);
            }
        }

        document.getElementById("submitBtn").textContent = strings.formLabels.submit;
        document.documentElement.lang = lang;
        if (lang === "ar") {
            document.documentElement.dir = "rtl";
            document.body.style.direction = "rtl";
            const selects = document.querySelectorAll(".rsvp-form-card select:not(.single-guest)");
            selects.forEach((select) => {
                select.style.backgroundPosition = "left 0.75rem center";
            });
        } else {
            document.documentElement.dir = "ltr";
            document.body.style.direction = "ltr";
        }
    }

    function startCountdown(targetDate, lang) {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                const zero = Number(0).toLocaleString(locale);
                daysEl.textContent = zero;
                hoursEl.textContent = zero;
                minutesEl.textContent = zero;
                secondsEl.textContent = zero;
                clearInterval(timer);
                return;
            }

            const days = Number(Math.floor(diff / (1000 * 60 * 60 * 24))).toLocaleString(locale);
            const hours = Number(Math.floor((diff / (1000 * 60 * 60)) % 24)).toLocaleString(locale);
            const minutes = Number(Math.floor((diff / (1000 * 60)) % 60)).toLocaleString(locale);
            const seconds = Number(Math.floor((diff / 1000) % 60)).toLocaleString(locale);

            daysEl.textContent = days;
            hoursEl.textContent = hours;
            minutesEl.textContent = minutes;
            secondsEl.textContent = seconds;
        }

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
    }

    function initializeRSVPForm(strings) {
        const attendanceSelect = document.getElementById("attendance");
        const numberSelect = document.getElementById("number");
        const submitBtn = document.getElementById("submitBtn");


        const formName = sanitizedName
            .replace(/,/g, " & ") // Convert commas to &
            .replace(/[;_]/g, " ") // Convert ; and _ to space
            .replace(/\s+/g, " ") // Normalize spaces
            .trim();


        function validate() {
            const attendanceOk = attendanceSelect.value === "yes" || attendanceSelect.value === "no";
            const numberOk = isSingleGuest ? true : numberSelect.value !== "";

            // Enable numberSelect only if attendance is "yes" and not a single guest
            if (!isSingleGuest && attendanceSelect.value === "yes") {
                numberSelect.removeAttribute("disabled");
            } else if (!isSingleGuest) {
                numberSelect.value = "";
                numberSelect.setAttribute("disabled", "disabled");
            }

            // Enable submit button if attendance is valid, and if attendance is "yes", number must be valid
            submitBtn.disabled = !(attendanceOk && (attendanceSelect.value === "no" || isSingleGuest || numberOk));
        }
        attendanceSelect.addEventListener("input", validate);
        attendanceSelect.addEventListener("change", validate);

        if (!isSingleGuest) {
            numberSelect.addEventListener("input", validate);
            numberSelect.addEventListener("change", validate);
        }

        submitBtn.addEventListener("click", () => {
            if (!submitBtn.disabled) {
                const attendance = attendanceSelect.value === "yes" ? strings.formLabels.yes : strings.formLabels.no;
                const number = isSingleGuest ? "1" : (attendanceSelect.value === "yes" ? Number(numberSelect.value).toLocaleString(locale) : "0");
                let message = `${strings.messageTitle}\n\n${strings.formLabels.name}: ${formName}`;
                if (number !== "0" && number !== 0) {
                    message += `\n${strings.formLabels.number}: ${number}`;
                }
                message += `\n${strings.formLabels.attendance}: ${attendance}`;
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = validatedId === 1 ? "+31687606064" : "+31621491472";
                const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                window.location.href = whatsappLink;
            }
        });

        validate();
    }

    const playMusicBtn = document.getElementById("playMusicBtn");
    const audio = document.getElementById("weddingAudio");
    let userStartedPlayback = false;
    let wasPlayingBeforeHidden = false;

    playMusicBtn.addEventListener("click", () => {
        audio
            .play()
            .then(() => {
                userStartedPlayback = true;
                playMusicBtn.remove();
            })
            .catch((err) => {
                console.warn("Autoplay blocked:", err);
            });
    });

    document.addEventListener("visibilitychange", () => {
        if (!userStartedPlayback) return;

        if (document.hidden) {
            if (!audio.paused) {
                audio.pause();
                wasPlayingBeforeHidden = true;
            } else {
                wasPlayingBeforeHidden = false;
            }
        } else {
            if (wasPlayingBeforeHidden) {
                audio.play().catch(() => {
                    console.warn("Resuming playback blocked by browser.");
                });
            }
        }
    });

    function parallaxEffect() {
        const introSlide = document.querySelector(".intro-slide");
        if (!introSlide) return;

        let isScrolling = false;
        window.addEventListener("scroll", function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    const scrollPosition = window.scrollY;
                    const offset = scrollPosition * 0.6;
                    introSlide.style.backgroundPositionY = `${offset}px`;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    (async () => {
        const strings = await loadStrings(lang);
        if (!strings) {
            console.error("Failed to load strings, using fallback");
            return;
        }
        applyStrings(strings);
        const weddingDate = new Date("2025-08-31T18:00:00");
        startCountdown(weddingDate, lang);
        initializeRSVPForm(strings);
        if (window.innerWidth > 320 && "requestAnimationFrame" in window) {
            parallaxEffect();
        }
    })();
