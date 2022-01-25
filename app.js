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

  const { min, max, random, floor, round, cos, sin } = Math;

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
  const BACKGROUND_ITEMS_COUNT = 200;

  // ***************************** GAME VARIABLES *****************************
  let canvas;
  let context;
  let mouseX = CANVAS_WIDTH / 2;
  let mouseY = CANVAS_HEIGHT / 2;
  let backgroundDX = 0;
  let backgroundDY = 0;

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
  const calculateObstacleLevels = () =>
    window.GAME.data.obstacles.forEach(
      obstacle =>
        (obstacle.level = floor(
          random() * 100 +
            obstacle.radius * 1 +
            obstacle.size * 3 +
            obstacle.speed * 4 +
            obstacle.rotation * 0.25 +
            obstacle.damage * 3
        ))
    );

  const sortObtaclesByLevel = () =>
    window.GAME.data.obstacles.sort((obstacleA, obstacleB) => obstacleA.level - obstacleB.level);

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
      mouseX = e.clientX * PIXEL_RATIO - CANVAS_LEFT_PAD;
      mouseY = e.clientY * PIXEL_RATIO - CANVAS_TOP_PAD;
    });
    canvas.addEventListener("touchmove", e => {
      mouseX = e.touches[0].clientX * PIXEL_RATIO - CANVAS_LEFT_PAD;
      mouseY = e.touches[0].clientY * PIXEL_RATIO - CANVAS_TOP_PAD;
    });
  };

  const generateRandomBackgroundItem = () => {
    const proximity = random(); // 0.1 is far away, 0.7 is close.
    const item = {
      x: random() * CANVAS_WIDTH,
      y: random() * CANVAS_HEIGHT,
      sizex: round((CANVAS_WIDTH / 500) * proximity * 5 + 1),
      speed: proximity,
      image: new Image(),
      opacity: proximity * 0.5 + 0.1
    };
    item.image.src = window.GAME.data.backgrounds[floor(random() * window.GAME.data.backgrounds.length)].image;
    return item;
  };

  const runGame = itemsCount => {
    let count = 0;
    let second = getSecond();

    const backgroundItems = [];
    for (let i = 0; i < BACKGROUND_ITEMS_COUNT; i++) {
      backgroundItems[i] = generateRandomBackgroundItem(true);
    }

    const player = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      sizex: round((CANVAS_WIDTH / 100) * window.GAME.data.players[0].size),
      data: window.GAME.data.players[0],
      image: new Image(),
      radiusPixels:
        round(CANVAS_WIDTH * (window.GAME.data.players[0].size / 100) * (window.GAME.data.players[0].radius / 100)) / 2
    };
    player.image.src = player.data.image;

    calculateObstacleLevels();
    sortObtaclesByLevel();

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

    const emptyCanvas = () => {
      context.globalAlpha = 1;
      context.fillStyle = CANVAS_BACKGROUND_COLOR;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const moveBackground = (timestamp, timeDiff) => {
      if (floor(timestamp) % 10 === 0) {
        backgroundDX = cos(timestamp / 10000);
        backgroundDY = sin(timestamp / 10000);
      }
      backgroundItems.forEach((item, index) => {
        item.x += ((item.speed * timeDiff) / 5) * backgroundDX;
        item.y += ((item.speed * timeDiff) / 5) * backgroundDY;
        item.x = (item.x + CANVAS_WIDTH) % CANVAS_WIDTH;
        item.y = (item.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;
      });
    };

    const movePlayer = () => {
      player.x += ((mouseX || 0) - player.x) / 8;
      player.y += ((mouseY || 0) - player.y) / 8;
    };

    const moveObstacles = () => {
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
    };

    const renderBackground = timestamp => {
      backgroundItems.forEach(backgroundItem => {
        if (!(backgroundItem.image.complete && backgroundItem.image.naturalWidth)) return;
        if (!backgroundItem.sizey) {
          backgroundItem.sizey = round(
            (backgroundItem.image.naturalHeight * backgroundItem.sizex) / backgroundItem.image.naturalWidth
          );
        }

        context.globalAlpha = backgroundItem.opacity;
        context.translate(backgroundItem.x, backgroundItem.y);
        context.drawImage(
          backgroundItem.image,
          round(backgroundItem.sizex / 2 - backgroundItem.sizex),
          round(backgroundItem.sizey / 2 - backgroundItem.sizey),
          round(backgroundItem.sizex),
          round(backgroundItem.sizey)
        );
        context.translate(-backgroundItem.x, -backgroundItem.y);
      });
    };

    const renderPlayer = timestamp => {
      if (!(player.image.complete && player.image.naturalWidth)) return;
      if (!player.sizey) {
        player.sizey = round((player.image.naturalHeight * player.sizex) / player.image.naturalWidth);
      }
      context.globalAlpha = 1;
      context.translate(player.x, player.y);
      context.drawImage(
        player.image,
        round(player.sizex / 2 - player.sizex),
        round(player.sizey / 2 - player.sizey),
        round(player.sizex),
        round(player.sizey)
      );
      context.translate(-player.x, -player.y);
      context.setTransform(1, 0, 0, 1, 0, 0);
    };

    const renderObstacles = timestamp => {
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
        context.drawImage(
          item.image,
          round(item.sizex / 2 - item.sizex),
          round(item.sizey / 2 - item.sizey),
          round(item.sizex),
          round(item.sizey)
        );
        // if (item.data.hue) context.filter = "hue-rotate(0deg)"; // Note: Slow on chrome desktop.
        // context.strokeStyle = "#ff0000";
        // context.beginPath();
        // context.rect(item.sizex / 2 - item.sizex, item.sizey / 2 - item.sizey, item.sizex, item.sizey);
        // context.stroke();
        context.translate(-item.x, -item.y);
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
    };

    const calculateAndRenderFPS = now => {
      count++;
      if (second !== getSecond()) {
        second = getSecond();
        fps.innerHTML = `${count} fps / ${(window.performance.now() - now).toFixed(4)}ms window: ${window.innerWidth}x${
          window.innerHeight
        } canvas: ${CANVAS_WIDTH}x${CANVAS_HEIGHT} pixel ratio: ${PIXEL_RATIO}`;
        count = 0;
      }
    };

    let previousTimestamp = 0;

    function gameLoop(timestamp) {
      const now = window.performance.now();
      moveBackground(timestamp, timestamp - previousTimestamp);
      movePlayer();
      moveObstacles();
      emptyCanvas();
      renderBackground(timestamp);
      renderPlayer(timestamp);
      renderObstacles(timestamp);
      calculateAndRenderFPS(now);
      previousTimestamp = timestamp;
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
    runGame(50);
  };

  // ******************************* START GAME *******************************
  displayPercentLoader(0);
  showSplashLogo();
  loadAssets(displayPercentLoader, displayErrorAndRetryButton, [startGame, hideSplashLogo]);
})();
