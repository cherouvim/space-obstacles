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
})();
