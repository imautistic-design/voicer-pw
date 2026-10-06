const CACHE_NAME = "voicer-pwa-v44";
const APP_SHELL = [
	"./",
	"./index.html",
	"./style.css",
	"./garsai/noriu.mp3",
	"./garsai/eiti.mp3",
	"./garsai/padėk.mp3",
	"./garsai/taip.mp3",
	"./garsai/ne.mp3",
	"./emocijų garsai/įsimylėjęs.mp3",
	"./emocijų garsai/VERKIU.mp3",
	"./emocijų garsai/ramybė.mp3",
	"./emocijų garsai/piktas.mp3",
	"./emocijų garsai/pavargęs.mp3",
	"./emocijų garsai/patinka.mp3",
	"./emocijų garsai/panika.mp3",
	"./emocijų garsai/nuobodu.mp3",
	"./emocijų garsai/nerimas.mp3",
	"./emocijų garsai/LIŪDNA.mp3",
	"./emocijų garsai/laimė.mp3",
	"./emocijų garsai/irzlus.mp3",
	"./patiekalu garsai/virti kiaušiniai.mp3",
	"./patiekalu garsai/sriuba.mp3",
	"./patiekalu garsai/spagečiai.mp3",
	"./patiekalu garsai/salotos.mp3",
	"./patiekalu garsai/pica.mp3",
	"./patiekalu garsai/omletas.mp3",
	"./patiekalu garsai/maltinukas.mp3",
	"./patiekalu garsai/lietiniai.mp3",
	"./patiekalu garsai/lazanija.mp3",
	"./patiekalu garsai/kepti kiaušiniai.mp3",
	"./patiekalu garsai/kepsnys.mp3",
	"./patiekalu garsai/dešrelės.mp3",
	"./patiekalu garsai/burgeris.mp3",
	"./patiekalu garsai/blynai.mp3",
	"./ikonos/NORIU.svg",
	"./ikonos/padėk.svg",
	"./ikonos/taip.svg",
	"./ikonos/ne.svg",
	"./ikonos/eiti.svg",
	"./ikonos/Car.svg",
	"./ikonos/valgyti.svg",
	"./ikonos/gerti.svg",
	"./ikonos/Plus.svg",
	"./kategoriju-ikonos/EMOCIJOS.svg",
	"./kategoriju-ikonos/VALGYTI.svg",
	"./kategoriju-ikonos/GERTI.svg",
	"./kategoriju-ikonos/TUALETAS.svg",
	"./kategoriju-ikonos/BENDRAUKIME.svg",
	"./kategoriju-ikonos/SKAUDA.svg",
	"./kategoriju-ikonos/ŽMONĖS.svg",
	"./kategoriju-ikonos/VEIKLOS.svg",
	"./kategoriju-ikonos/VIETOS.svg",
	"./kategoriju-ikonos/TRANSPORTAS.svg",
	"./kategoriju-ikonos/GAMINTI.svg",
	"./kategoriju-ikonos/SPORTAS.svg",
	"./kategoriju-ikonos/DAIKTAI.svg",
	"./kategoriju-ikonos/LAIKAS.svg",
	"./kategoriju-ikonos/SKAIČIAI.svg",
	"./kategoriju-ikonos/SPALVOS.svg",
	"./IKONOS POGRUPIAI/PATIEKLAI.svg",
	"./IKONOS POGRUPIAI/KEPINIAI.svg",
	"./IKONOS POGRUPIAI/UŽKANDŽIAI.svg",
	"./IKONOS POGRUPIAI/SALDUMYNAI.svg",
	"./IKONOS POGRUPIAI/NAMŲ RUOŠA.svg",
	"./IKONOS POGRUPIAI/POILSIS.svg",
	"./IKONOS POGRUPIAI/PRAMOGOS.svg",
	"./IKONOS POGRUPIAI/NAMAI.svg",
	"./IKONOS POGRUPIAI/VIEŠOS ERDVĖS.svg",
	"./IKONOS POGRUPIAI/GAMTA.svg",
	"./IKONOS POGRUPIAI/MAISTO PRODUKTAI.svg",
	"./IKONOS POGRUPIAI/GAMINIMO PROCESAS.svg",
	"./IKONOS POGRUPIAI/INDAI.svg",
	"./IKONOS POGRUPIAI/VAISIAI.svg",
	"./IKONOS POGRUPIAI/UOGOS.svg",
	"./IKONOS POGRUPIAI/DARŽOVĖS.svg",
	"./IKONOS POGRUPIAI/DUONA.svg",
	"./IKONOS POGRUPIAI/KIAUŠINIAI.svg",
	"./IKONOS POGRUPIAI/PIENAS.svg",
	"./IKONOS POGRUPIAI/MĖSA.svg",
	"./IKONOS POGRUPIAI/ŽUVIS.svg",
	"./IKONOS POGRUPIAI/MAKARONAI.svg",
	"./IKONOS POGRUPIAI/PADAŽAI.svg",
	"./IKONOS POGRUPIAI/KRUOPOS.svg",
	"./IKONOS POGRUPIAI/PRIESKONIAI.svg",
	"./IKONOS POGRUPIAI/ASMENINIAI DAIKTAI.svg",
	"./IKONOS POGRUPIAI/APRANGA.svg",
	"./IKONOS POGRUPIAI/HIGIENA.svg",
	"./IKONOS POGRUPIAI/DEŠRELĖS.svg",
	"./NAVIGACIJOA IKONOS/emocijjos.svg",
	"./NAVIGACIJOA IKONOS/megstamiausi.svg",
	"./NAVIGACIJOA IKONOS/SpeakerSimpleHigh.svg"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(APP_SHELL))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys()
			.then((cacheNames) => Promise.all(
				cacheNames
					.filter((cacheName) => cacheName.startsWith("voicer-pwa-") && cacheName !== CACHE_NAME)
					.map((cacheName) => caches.delete(cacheName))
			))
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const requestUrl = new URL(event.request.url);
	if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return fetch(event.request).catch(() => caches.match("./index.html"));
		})
	);
});
