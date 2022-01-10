(function (undefined) {
  "use strict";

  // ********************************** UTILS **********************************
  const createElementFromHTML = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  // prettier-ignore
  const characterIsSupported = (character, font = getComputedStyle(document.body).fontFamily, recursion = false) => { const testCanvas = document.createElement("canvas"); const referenceCanvas = document.createElement("canvas"); testCanvas.width = referenceCanvas.width = testCanvas.height = referenceCanvas.height = 150; const testContext = testCanvas.getContext("2d"); const referenceContext = referenceCanvas.getContext("2d"); testContext.font = referenceContext.font = "100px " + font; testContext.fillStyle = referenceContext.fillStyle = "black"; testContext.fillText(character, 0, 100); referenceContext.fillText("\uffff", 0, 100); if (!recursion && characterIsSupported("\ufffe", font, true)) { testContext.fillStyle = referenceContext.fillStyle = "black"; testContext.fillRect(10, 10, 80, 80); referenceContext.fillRect(10, 10, 80, 80); } return testCanvas.toDataURL() != referenceCanvas.toDataURL(); }; // https://stackoverflow.com/a/63520666/72478

  const { min, max, random, floor, round } = Math;

  const getSecond = () => floor(new Date().getTime() / 1000);

  // ***************************** GAME CONSTANTS *****************************
  const PIXEL_RATIO = window.devicePixelRatio || 1;
  const CANVAS_MAX_SIZE = 1200;
  const CANVAS_BACKGROUND_COLOR = "#222";
  const CANVAS_WIDTH = min(CANVAS_MAX_SIZE, window.innerWidth) * PIXEL_RATIO;
  const CANVAS_HEIGHT = min(CANVAS_MAX_SIZE, window.innerHeight) * PIXEL_RATIO;
  const CANVAS_CSS_WIDTH = min(CANVAS_MAX_SIZE, window.innerWidth);
  const CANVAS_CSS_HEIGHT = min(CANVAS_MAX_SIZE, window.innerHeight);
  const CANVAS_LEFT_PAD = CANVAS_MAX_SIZE < window.innerWidth ? round((window.innerWidth - CANVAS_MAX_SIZE) / 2) : 0;
  const CANVAS_TOP_PAD = CANVAS_MAX_SIZE < window.innerHeight ? round((window.innerHeight - CANVAS_MAX_SIZE) / 2) : 0;

  // ***************************** GAME VARIABLES *****************************
  let canvas;
  let context;
  let mouseX;
  let mouseY;

  // ****************************** DOM ELEMENTS ******************************
  const fps = createElementFromHTML(
    `<span style="font-family: sans-serif; opacity: 0.5; background: #fff; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").append(fps);

  const loader = createElementFromHTML(`<div id="loader" style="display: none"></div>`);
  document.getElementById("content").append(loader);

  const splash = createElementFromHTML(
    `<div id="splash" style="display: none"><span class="logo">Space Obstacles</span><br/></div>`
  );
  const splashIcons = ["🚀", "👽", "🪐", "☄️", "⭐", "👾", "✨", "🌌"]
    .filter(character => characterIsSupported(character))
    .map(character => createElementFromHTML(`<span class="icon">${character}</span>`));
  splashIcons.forEach(splashIcon => splash.append(splashIcon));
  document.getElementById("content").append(splash);

  const message = createElementFromHTML(`<div id="message" style="display: none"></div>`);
  document.getElementById("content").append(message);

  // ********************** GAME SCENE OR LOGIC FUNCTIONS **********************
  const initializeCanvas = () => {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH; // The actual pixels rendered through this canvas.
    canvas.height = CANVAS_HEIGHT; // The actual pixels rendered through this canvas.
    canvas.style.width = CANVAS_CSS_WIDTH + "px";
    canvas.style.height = CANVAS_CSS_HEIGHT + "px";
    // context.imageSmoothingEnabled = false;
    canvas.style.marginLeft = CANVAS_LEFT_PAD + "px";
    canvas.style.marginTop = CANVAS_TOP_PAD + "px";
    document.getElementById("content").prepend(canvas);

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX - CANVAS_LEFT_PAD;
      mouseY = e.clientY - CANVAS_TOP_PAD;
    });
    canvas.addEventListener("touchmove", e => {
      mouseX = e.touches[0].clientX - CANVAS_LEFT_PAD;
      mouseY = e.touches[0].clientY - CANVAS_TOP_PAD;
    });
  };

  const runDemo = itemsCount => {
    const emptyCanvas = () => {
      context.fillStyle = CANVAS_BACKGROUND_COLOR;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const renderDot = () => {
      context.fillStyle = "#ff0";
      context.beginPath();
      context.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, false);
      context.fill();
    };

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      const obstacle = window.GAME.data.obstacles[i % window.GAME.data.obstacles.length];

      items[i] = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: random() * 6 - 3,
        dy: random() * 6 - 3,
        sizex: round((CANVAS_WIDTH / 100) * obstacle.size),
        data: obstacle,
        image: new Image(),
        opacity: 1,
        radiusPixels: round(CANVAS_WIDTH * (obstacle.size / 100) * (obstacle.radius / 100)) / 2
      };
      items[i].image.src = obstacle.image;
    }

    let count = 0;
    let second = getSecond();
    function gameLoop(timestamp) {
      const now = window.performance.now();

      emptyCanvas();

      renderDot();

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.x += item.dx;
        item.y += item.dy;
        if (item.x - item.radiusPixels + item.dx < 0 || item.x + item.radiusPixels + item.dx > CANVAS_WIDTH)
          item.dx = -item.dx;
        if (item.y - item.radiusPixels + item.dy < 0 || item.y + item.radiusPixels + item.dy > CANVAS_HEIGHT)
          item.dy = -item.dy;
        // item.opacity = timestamp % 500 < 250 ? 1 : 0.5; // blink
      }

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
        } canvas: ${CANVAS_WIDTH}x${CANVAS_HEIGHT} pixel ratio: ${PIXEL_RATIO}`;
        count = 0;
      }

      window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(timestamp => {
      gameLoop(timestamp);
      window.requestAnimationFrame(() => (canvas.style.opacity = 1));
    });
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
    loader.innerHTML = percent + "%";
    if (percent === 0) {
      console.log("Loading 0%");
      loader.style.display = "block";
    }
    if (percent === 100) {
      console.log("Loading 100%");
      loader.style.opacity = 0;
      setTimeout(() => (loader.style.display = "none"), 2000);
    }
  };

  const displayErrorAndRetryButton = () => {
    console.log("Error. Please try again");
    message.innerHTML = 'Error loading assets &#x1F631. Please <a href="/">try again!</a>';
    message.style.display = "block";
  };

  const showSplashLogo = () => {
    window.requestAnimationFrame(() => {
      splash.style.display = "block";
      splash.style.top = "-10vh";
      window.requestAnimationFrame(() => {
        splash.style.top = "25vh";
      });
    });
  };

  const hideSplashLogo = () => {
    window.setTimeout(() => {
      splash.classList.add("out");
      splash.style.opacity = 0;
      splash.style.top = "-20vh";
      window.setTimeout(() => (splash.style.display = "none"), 5000); // Fully remove it after a while.
    }, 1000); // Delay "hide" just to make sure that CSS transition of "show" has finished.
  };

  const startGame = () => {
    console.log("Starting game");
    // playBackgroundMusic();
    initializeCanvas();
    runDemo(50);
  };

  // ******************************* START GAME *******************************
  displayPercentLoader(0);
  showSplashLogo();
  loadAssets(displayPercentLoader, displayErrorAndRetryButton, [startGame, hideSplashLogo]);
})();
