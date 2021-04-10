self.addEventListener("install", function (event) {});

const offline = `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><meta content="width=device-width,initial-scale=1" name="viewport"><title>Offline</title><script>const interval=setInterval(()=>{if(window.navigator.onLine){clearInterval(interval);window.location.reload();}},1000);</script><body style="font-family:Helvetica,Arial,sans-serif;font-size:calc(15px + .35vw);text-align:center;background:#000;color:#dda"><h1 style="font-size:calc(28px + 1vw);margin:15vw 0 0 0;color:#dda"><svg style="display:block;width:calc(60px + 1.8vw);margin:0 auto calc(25px + 1vw) auto" viewBox="0 0 27 21"><path d="M19.078 14.04a1 1 0 11-1.39 1.436 5.347 5.347 0 00-7.378 0 1 1 0 01-1.39-1.437 7.347 7.347 0 0110.158 0zM24.414 4l2.293-2.293A1 1 0 1025.293.293L23 2.586 20.707.293a1 1 0 00-1.414 1.414L21.586 4l-2.293 2.293a1 1 0 101.414 1.414L23 5.414l2.293 2.293a1 1 0 101.414-1.414L24.414 4zm-8.521-1.898a1 1 0 10.215-1.988C15.408.038 14.703 0 13.998 0A19.17 19.17 0 00.43 5.562a1 1 0 001.407 1.421C5.07 3.776 9.444 1.983 13.999 2c.633 0 1.265.034 1.894.102zm-.05 6.046a1 1 0 10.32-1.974A13.524 13.524 0 0013.999 6 13.217 13.217 0 004.67 9.802a1 1 0 101.402 1.426A11.229 11.229 0 0114 8c.617 0 1.234.05 1.843.148zM14 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#ff8"/></svg> You are offline.</h1><p style="line-height:1.6">Please check your connection or <a onclick="window.location.reload()" style="padding-bottom:2px;text-decoration:none;color:#dda;border-bottom:1px dotted #aa3;cursor:pointer">try again</a>.</p></body></html>`;

self.addEventListener("fetch", function (event) {
  // Offline response should only be available on navigation fetches (i.e the user visits a URL or refreshes the page).
  if (event.request.mode !== "navigate") return;

  // Offline response handling.
  event.respondWith(
    (async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        // Always try the network first.
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // Fetch failed. Returning offline page instead.
        return new Response(offline, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    })()
  );
});
