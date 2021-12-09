(function (undefined) {
  "use strict";

  const MAX_CANVAS_SIZE = 1200;
  const BACKGROUND_COLOR = "#222";

  // utils.
  const createElementFromHTML = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  // https://stackoverflow.com/a/63520666/72478
  //The first argument is the character you want to test, and the second argument is the font you want to test it in.
  //If the second argument is left out, it defaults to the font of the <body> element.
  //The third argument isn't used under normal circumstances, it's just used internally to avoid infinite recursion.
  const characterIsSupported = (character, font = getComputedStyle(document.body).fontFamily, recursion = false) => {
    //Create the canvases
    let testCanvas = document.createElement("canvas");
    let referenceCanvas = document.createElement("canvas");
    testCanvas.width = referenceCanvas.width = testCanvas.height = referenceCanvas.height = 150;

    //Render the characters
    let testContext = testCanvas.getContext("2d");
    let referenceContext = referenceCanvas.getContext("2d");
    testContext.font = referenceContext.font = "100px " + font;
    testContext.fillStyle = referenceContext.fillStyle = "black";
    testContext.fillText(character, 0, 100);
    referenceContext.fillText("\uffff", 0, 100);

    //Firefox renders unsupported characters by placing their character code inside the rectangle making each unsupported character look different.
    //As a workaround, in Firefox, we hide the inside of the character by placing a black rectangle on top of it.
    //The rectangle we use to hide the inside has an offset of 10px so it can still see part of the character, reducing the risk of false positives.
    //We check for Firefox and browers that behave similarly by checking if U+FFFE is supported, since U+FFFE is, just like U+FFFF, guaranteed not to be supported.
    if (!recursion && characterIsSupported("\ufffe", font, true)) {
      testContext.fillStyle = referenceContext.fillStyle = "black";
      testContext.fillRect(10, 10, 80, 80);
      referenceContext.fillRect(10, 10, 80, 80);
    }

    //Check if the canvases are identical
    return testCanvas.toDataURL() != referenceCanvas.toDataURL();
  };

  const { min, max, random, floor, round } = Math;

  const getSecond = () => floor(new Date().getTime() / 1000);

  // fps.
  const fps = createElementFromHTML(
    `<span style="font-family: sans-serif; opacity: 0.5; background: #fff; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").prepend(fps);

  const loader = createElementFromHTML(`<div id="loader" style="display: none"></div>`);
  document.getElementById("content").prepend(loader);

  const splash = createElementFromHTML(
    `<div id="splash" style="display: none"><span class="logo">Space Obstacles</span><br/></div>`
  );
  const splashIcons = ["🚀", "👽", "🪐", "☄️", "⭐", "👾", "✨", "🌌"]
    .filter(character => characterIsSupported(character))
    .map(character => createElementFromHTML(`<span class="icon">${character}</span>`));
  splashIcons.forEach(splashIcon => splash.append(splashIcon));
  document.getElementById("content").prepend(splash);

  const message = createElementFromHTML(`<div id="message" style="display: none"></div>`);
  document.getElementById("content").prepend(message);

  const demoCanvas = itemsCount => {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = min(MAX_CANVAS_SIZE, window.innerWidth) * pixelRatio;
    const height = min(MAX_CANVAS_SIZE, window.innerHeight) * pixelRatio;
    const cssWidth = min(MAX_CANVAS_SIZE, window.innerWidth);
    const cssHeight = min(MAX_CANVAS_SIZE, window.innerHeight);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = width; // The actual pixels rendered through this canvas.
    canvas.height = height; // The actual pixels rendered through this canvas.
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    // context.imageSmoothingEnabled = false;
    if (MAX_CANVAS_SIZE < window.innerWidth) {
      canvas.style.marginLeft = round((window.innerWidth - MAX_CANVAS_SIZE) / 2) + "px";
    }
    if (MAX_CANVAS_SIZE < window.innerHeight) {
      canvas.style.marginTop = round((window.innerHeight - MAX_CANVAS_SIZE) / 2) + "px";
    }
    document.getElementById("content").append(canvas);

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      const obstacle = window.GAME.data.obstacles[i % window.GAME.data.obstacles.length];

      items[i] = {
        x: width / 2,
        y: height / 2,
        dx: random() * 6 - 3,
        dy: random() * 6 - 3,
        sizex: round((width / 100) * obstacle.size),
        data: obstacle,
        image: new Image(),
        opacity: 1,
        radiusPixels: round(width * (obstacle.size / 100) * (obstacle.radius / 100)) / 2
      };
      items[i].image.src = obstacle.image;
    }

    let count = 0;
    let second = getSecond();
    function animate(timestamp) {
      const now = window.performance.now();

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.x += item.dx;
        item.y += item.dy;
        if (item.x - item.radiusPixels + item.dx < 0 || item.x + item.radiusPixels + item.dx > width)
          item.dx = -item.dx;
        if (item.y - item.radiusPixels + item.dy < 0 || item.y + item.radiusPixels + item.dy > height)
          item.dy = -item.dy;
        // item.opacity = timestamp % 500 < 250 ? 1 : 0.5; // blink
      }
      context.fillStyle = BACKGROUND_COLOR;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        if (!(item.image.complete && item.image.naturalWidth)) continue;
        if (!item.sizey) {
          item.sizey = round((item.image.naturalHeight * item.sizex) / item.image.naturalWidth);
        }
        context.globalAlpha = item.opacity;
        context.translate(item.x, item.y);
        if (item.data.rotation)
          context.rotate((((((timestamp * 360) / 1000) * item.data.rotation) / 100) * Math.PI) / 180);
        // if (item.data.hue) context.filter = "hue-rotate(" + (((timestamp * 360) / 1000) * item.data.hue) / 100 + "deg)"; // Note: Slow on chrome desktop.
        if (item.opacity < 1) context.globalAlpha = item.opacity;
        context.drawImage(
          item.image,
          round(item.sizex / 2 - item.sizex),
          round(item.sizey / 2 - item.sizey),
          round(item.sizex),
          round(item.sizey)
        );
        if (item.opacity < 1) context.globalAlpha = 1;
        // if (item.data.hue) context.filter = "hue-rotate(0deg)"; // Note: Slow on chrome desktop.
        // context.strokeStyle = "#ff0000";
        // context.beginPath();
        // context.rect(item.sizex / 2 - item.sizex, item.sizey / 2 - item.sizey, item.sizex, item.sizey);
        // context.stroke();
        context.translate(-item.x, -item.y);
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
      count++;
      if (second !== getSecond()) {
        second = getSecond();
        fps.innerHTML = `${count} fps / ${(window.performance.now() - now).toFixed(4)}ms window: ${window.innerWidth}x${
          window.innerHeight
        } canvas: ${width}x${height} pixel ratio: ${pixelRatio}`;
        count = 0;
      }

      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  };

  const loadAssets = (onAssetLoad, onAssetLoadError, functionsToExecuteWhenAllAssetsHaveLoaded = []) => {
    let loadedAssets = 0;
    const itemsWithImages = [].concat(
      window.GAME.data.backgrounds,
      window.GAME.data.obstacles,
      window.GAME.data.players
    );
    const itemsWithSounds = [].concat(window.GAME.data.obstacles);
    const totalAssets = itemsWithImages.length + itemsWithSounds.length;
    itemsWithImages.map(item => {
      item.imageElement = new Image();
      item.imageElement.onload = () => {
        item.imageWidth = item.imageElement.naturalWidth;
        item.imageHeight = item.imageElement.naturalHeight;
        loadedAssets++;
        onAssetLoad(floor((loadedAssets / totalAssets) * 100));
        if (loadedAssets === totalAssets)
          functionsToExecuteWhenAllAssetsHaveLoaded.forEach(functionToExecute => functionToExecute());
      };
      item.imageElement.onerror = () => {
        console.log("ERROR loading image");
        onAssetLoadError();
      };
      item.imageElement.src = item.image;
    });
    itemsWithSounds.map(item => {
      item.sound = new Howl({
        ...item.sound,
        onload: () => {
          loadedAssets++;
          onAssetLoad(floor((loadedAssets / totalAssets) * 100));
          if (loadedAssets === totalAssets)
            functionsToExecuteWhenAllAssetsHaveLoaded.forEach(functionToExecute => functionToExecute());
        },
        onloaderror: () => {
          console.log("ERROR loading sound");
          onAssetLoadError();
        }
      });
    });
  };

  const displayPercentLoader = percent => {
    console.log("Loading: " + percent + "%");
    loader.innerHTML = percent + "%";
    if (percent === 0) {
      loader.style.display = "block";
    }
    if (percent === 100) {
      loader.style.opacity = 0;
      setTimeout(() => (loader.style.display = "none"), 1000);
    }
  };

  const displayErrorAndRetryButton = () => {
    console.log("Error. Please try again");
    message.innerHTML = 'Error loading assets &#x1F631. Please <a href="/">try again!</a>';
    message.style.display = "block";
  };

  const showSplashLogo = () => {
    splash.style.display = "block";
    splash.style.top = "-5vh";
    window.setTimeout(() => (splash.style.top = "15vh"), 1);
  };

  const hideSplashLogo = () => {
    splash.style.opacity = 0;
    splash.style.top = "-10vh";
    window.setTimeout(() => (splash.style.display = "none"), 1000);
  };

  const startGame = () => {
    console.log("start game");
    // playBackgroundMusic();
    demoCanvas(50);
  };

  displayPercentLoader(0);
  showSplashLogo();
  loadAssets(displayPercentLoader, displayErrorAndRetryButton, [startGame, hideSplashLogo]);
})();
