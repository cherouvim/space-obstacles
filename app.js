(function (undefined) {
  "use strict";

  console.log(123);

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    console.log("Registering service worker");
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).then(
      function () {
        console.log("Service worker has been registered");
      },
      function (e) {
        console.error("Service worker registration failed", e);
      }
    );
  }

  registerServiceWorker();

  const sound = new Howl({
    src: [
      "assets/iasonas-bad-flame-ball.webm",
      "assets/iasonas-bad-flame-ball.mp3",
    ],
    loop: true,
    rate: 0.5,
    volume: 0.2,
    stereo: -0.4,
    pos: [1, 1, 0],
  });

  document.getElementById("play").addEventListener("click", function () {
    sound.play();
  });
  document.getElementById("stop").addEventListener("click", function () {
    sound.stop();
  });
})();
