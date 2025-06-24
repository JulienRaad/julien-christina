 fetch("invitation-content.html")
      .then((res) => res.text())
      .then((html) => {
        document.getElementById("content").innerHTML = html;
        const script = document.createElement("script");
        script.src = "invitation.js";
        document.body.appendChild(script);
      });
