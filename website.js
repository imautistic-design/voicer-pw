"use strict";

const mobileMenu = document.querySelector(".mobile-menu");
mobileMenu.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => { mobileMenu.open = false; });
});

const heroWord = document.querySelector(".hero-word");
if (heroWord) {
	const words = ["Augti", "Bendrauti", "Kurti"];
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let wordIndex = 0;
	let wordInterval;
	let wordTimeout;

	function updateWordAnimation() {
		clearInterval(wordInterval);
		clearTimeout(wordTimeout);
		heroWord.classList.remove("is-changing");
		if (reducedMotion.matches) {
			return;
		}
		wordInterval = setInterval(() => {
			heroWord.classList.add("is-changing");
			wordTimeout = setTimeout(() => {
				wordIndex = (wordIndex + 1) % words.length;
				heroWord.textContent = words[wordIndex];
				heroWord.classList.remove("is-changing");
			}, 400);
		}, 5000);
	}

	reducedMotion.addEventListener("change", updateWordAnimation);
	updateWordAnimation();
}

const installDialog = document.querySelector("#install-dialog");
if (installDialog) {
	const installButton = document.querySelector("#install-button");
	const installInstructions = document.querySelector("#install-instructions");
	let installPrompt = null;
	const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
		|| (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
	const isMobile = isIos || /Android/i.test(navigator.userAgent);

	function updateInstallDialog() {
		installButton.hidden = !installPrompt;
		if (isIos) {
			installInstructions.textContent = "Safari naršyklėje paspausk „Bendrinti“, tada pasirink „Pridėti prie pagrindinio ekrano“.";
		} else if (installPrompt) {
			installInstructions.textContent = "";
		} else {
			installInstructions.textContent = "Naršyklės meniu pasirink „Įdiegti programą“ arba „Pridėti prie pagrindinio ekrano“, jei ši galimybė rodoma.";
		}
	}

	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();
		installPrompt = event;
		updateInstallDialog();
	});

	window.addEventListener("appinstalled", () => {
		installPrompt = null;
		updateInstallDialog();
	});

	document.querySelectorAll("[data-open-app]").forEach((link) => {
		link.addEventListener("click", (event) => {
			if (!isMobile || window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) {
				return;
			}
			event.preventDefault();
			updateInstallDialog();
			installDialog.showModal();
		});
	});

	document.querySelector("[data-close-install]").addEventListener("click", () => installDialog.close());

	installButton.addEventListener("click", async () => {
		if (!installPrompt) {
			return;
		}
		const prompt = installPrompt;
		installPrompt = null;
		installButton.hidden = true;
		try {
			await prompt.prompt();
			const choice = await prompt.userChoice;
			if (choice.outcome === "accepted") {
				window.location.assign("app.html");
			} else {
				updateInstallDialog();
			}
		} catch (error) {
			console.error("Nepavyko atidaryti įdiegimo lango:", error);
			installInstructions.textContent = "Nepavyko atidaryti įdiegimo lango. Programėlę gali atidaryti naršyklėje.";
		}
	});
}

document.querySelectorAll("#share-site, [data-footer-share]").forEach((button) => {
	button.addEventListener("click", async () => {
		const status = button.parentElement.querySelector(".share-status");
		const url = window.location.href.split("#")[0];
		try {
			if (navigator.share) {
				await navigator.share({ title: "I'm Autistic – Voicer", url });
			} else if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(url);
				status.textContent = "Nuoroda nukopijuota.";
			} else {
				status.textContent = `Pasidalink šia nuoroda: ${url}`;
			}
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Nepavyko pasidalinti nuoroda:", error);
				status.textContent = `Nepavyko pasidalinti. Nukopijuok šią nuorodą: ${url}`;
			}
		}
	});
});

if ("serviceWorker" in navigator && window.isSecureContext) {
	navigator.serviceWorker.register("./service-worker.js").catch((error) => {
		console.error("Nepavyko įjungti Voicer veikimo be interneto:", error);
	});
}
