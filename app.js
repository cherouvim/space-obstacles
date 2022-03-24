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

  const { min, max, random, floor, round, cos, sin, pow, sqrt } = Math;

  // ***************************** GAME CONSTANTS *****************************
  const PIXEL_RATIO = window.devicePixelRatio || 1;
  const CANVAS_MAX_SIZE = 1200;
  const CANVAS_BACKGROUND_COLOR = "#222";
  const BACKGROUND_ITEMS_COUNT = 200;

  // **************************** GLOBAL VARIABLES ****************************
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let canvasWidth;
  let canvasHeight;
  let canvasCssWidth;
  let canvasCssHeight;
  let canvasLeftPad;
  let canvasTopPad;
  let mouseX;
  let mouseY;
  let resizeText = "";
  let timeSpentOnAnotherTab = 0;

  // ****************************** DOM ELEMENTS ******************************
  document.getElementById("content").prepend(canvas);

  const healthDom = createElementFromHTML(`<div id="health"><span></span></div>`);
  document.getElementById("content").append(healthDom);
  const healthDomContent = healthDom.querySelector("span");

  const scoreDom = createElementFromHTML(`<span id="score"></span>`);
  document.getElementById("content").append(scoreDom);

  const fpsDom = createElementFromHTML(`<span id="fps"></span>`);
  document.getElementById("content").append(fpsDom);

  const loaderDom = createElementFromHTML(`<div id="loader" style="display: none"></div>`);
  document.getElementById("content").append(loaderDom);

  const splashDom = createElementFromHTML(
    `<div id="splash" style="display: none"><span class="logo">Space Obstacles</span><br/></div>`
  );
  const splashIcons = ["🚀", "👽", "🪐", "☄️", "⭐", "👾", "✨", "🌌"]
    .filter(character => characterIsSupported(character))
    .map(character => createElementFromHTML(`<span class="icon">${character}</span>`));
  splashIcons.forEach(splashIcon => splashDom.append(splashIcon));
  document.getElementById("content").append(splashDom);

  const messageDom = createElementFromHTML(`<div id="message" style="display: none"></div>`);
  document.getElementById("content").append(messageDom);

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
    console.log("Initializing canvas (and some other HTML elements).");
    canvasWidth = min(CANVAS_MAX_SIZE, window.innerWidth) * PIXEL_RATIO;
    canvasHeight = min(CANVAS_MAX_SIZE, window.innerHeight) * PIXEL_RATIO;
    canvasCssWidth = min(CANVAS_MAX_SIZE, window.innerWidth);
    canvasCssHeight = min(CANVAS_MAX_SIZE, window.innerHeight);
    canvasLeftPad = CANVAS_MAX_SIZE < window.innerWidth ? round((window.innerWidth - CANVAS_MAX_SIZE) / 2) : 0;
    canvasTopPad = CANVAS_MAX_SIZE < window.innerHeight ? round((window.innerHeight - CANVAS_MAX_SIZE) / 2) : 0;

    healthDom.style.marginTop = canvasTopPad + "px";
    healthDom.style.marginLeft = canvasLeftPad + "px";
    healthDom.style.width = canvasCssWidth / 3 + "px";
    healthDom.style.opacity = 1;

    scoreDom.style.marginTop = canvasTopPad + "px";
    scoreDom.style.marginRight = canvasLeftPad + "px";
    scoreDom.style.opacity = 1;

    fpsDom.style.marginBottom = canvasTopPad + "px";
    fpsDom.style.marginRight = canvasLeftPad + "px";
    fpsDom.style.opacity = 0.5;

    mouseX = canvasWidth / 2;
    mouseY = canvasHeight / 2;

    canvas.width = canvasWidth; // The actual pixels rendered through this canvas.
    canvas.height = canvasHeight; // The actual pixels rendered through this canvas.
    canvas.style.width = canvasCssWidth + "px";
    canvas.style.height = canvasCssHeight + "px";
    // context.imageSmoothingEnabled = false;
    canvas.style.marginLeft = canvasLeftPad + "px";
    canvas.style.marginTop = canvasTopPad + "px";
  };

  const attachEventListeners = () => {
    console.log("Attaching event listeners.");
    window.addEventListener("mousemove", e => {
      mouseX = e.clientX * PIXEL_RATIO - canvasLeftPad;
      mouseY = e.clientY * PIXEL_RATIO - canvasTopPad;
    });
    canvas.addEventListener("touchmove", e => {
      mouseX = e.touches[0].clientX * PIXEL_RATIO - canvasLeftPad;
      mouseY = e.touches[0].clientY * PIXEL_RATIO - canvasTopPad;
    });
    window.addEventListener("resize", () => {
      resizeText +=
        "<br/>resize inner: " +
        window.innerWidth +
        " " +
        window.innerHeight +
        " outer: " +
        window.outerWidth +
        " " +
        window.outerHeight;
      initializeCanvas();
    });
    let timestampThatUserLeftTab = undefined;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        timestampThatUserLeftTab = Date.now();
      }
      if (document.visibilityState === "visible") {
        timeSpentOnAnotherTab = Date.now() - timestampThatUserLeftTab;
        console.log("Milliseconds spent on another tab: " + timeSpentOnAnotherTab + ".");
      }
    });
  };

  const generateRandomBackgroundItem = () => {
    const proximity = random(); // 0.1 is far away, 0.7 is close.
    const item = {
      x: random() * canvasWidth,
      y: random() * canvasHeight,
      sizex: round((canvasWidth / 500) * proximity * 5 + 1),
      speed: proximity,
      image: new Image(),
      opacity: proximity * 0.5 + 0.1
    };
    item.image.src = window.GAME.data.backgrounds[floor(random() * window.GAME.data.backgrounds.length)].image;
    return item;
  };

  const startNewGame = () => {
    console.log("Starting new game.");
    const itemsCount = 50; // TODO: Remove and implement levels.
    let score = 0;
    let health = 100;

    const backgroundItems = [];
    for (let i = 0; i < BACKGROUND_ITEMS_COUNT; i++) {
      backgroundItems[i] = generateRandomBackgroundItem(true);
    }

    const player = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      sizex: round((canvasWidth / 100) * window.GAME.data.players[0].size),
      data: window.GAME.data.players[0],
      image: new Image(),
      radiusPixels:
        round(canvasWidth * (window.GAME.data.players[0].size / 100) * (window.GAME.data.players[0].radius / 100)) / 2
    };
    player.image.src = player.data.image;

    calculateObstacleLevels();
    sortObtaclesByLevel();

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      const obstacle = window.GAME.data.obstacles[i % window.GAME.data.obstacles.length];

      items[i] = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        dx: random() * 6 - 3,
        dy: random() * 6 - 3,
        sizex: round((canvasWidth / 100) * obstacle.size),
        data: obstacle,
        image: new Image(),
        opacity: 1,
        radiusPixels: round(canvasWidth * (obstacle.size / 100) * (obstacle.radius / 100)) / 2
      };
      items[i].image.src = obstacle.image;
    }

    const emptyCanvas = () => {
      context.globalAlpha = 1;
      context.fillStyle = CANVAS_BACKGROUND_COLOR;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    let backgroundDX = 0;
    let backgroundDY = 0;
    let previousBackgroundDirectionChangeTick = 0;
    const moveBackground = (timestamp, timestampDiff) => {
      const backgroundDirectionChangeTick = floor(timestamp / 1000);
      if (backgroundDirectionChangeTick !== previousBackgroundDirectionChangeTick) {
        previousBackgroundDirectionChangeTick = backgroundDirectionChangeTick;
        backgroundDX = cos(timestamp / 10000);
        backgroundDY = sin(timestamp / 10000);
      }
      backgroundItems.forEach(item => {
        item.x += ((item.speed * timestampDiff) / 5) * backgroundDX;
        item.y += ((item.speed * timestampDiff) / 5) * backgroundDY;
        item.x = (item.x + canvasWidth) % canvasWidth;
        item.y = (item.y + canvasHeight) % canvasHeight;
      });
    };

    const movePlayer = timestampDiff => {
      player.x += (((mouseX || 0) - player.x) / timestampDiff) * 2;
      player.y += (((mouseY || 0) - player.y) / timestampDiff) * 2;
      if (player.x < player.radiusPixels) player.x = player.radiusPixels;
      if (player.y < player.radiusPixels) player.y = player.radiusPixels;
      if (player.x > canvasWidth - player.radiusPixels) player.x = canvasWidth - player.radiusPixels;
      if (player.y > canvasHeight - player.radiusPixels) player.y = canvasHeight - player.radiusPixels;
    };

    const moveObstacles = () => {
      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.x += item.dx;
        item.y += item.dy;
        if (item.x - item.radiusPixels + item.dx < 0 || item.x + item.radiusPixels + item.dx > canvasWidth)
          item.dx = -item.dx;
        if (item.y - item.radiusPixels + item.dy < 0 || item.y + item.radiusPixels + item.dy > canvasHeight)
          item.dy = -item.dy;
        // item.opacity = timestamp % 500 < 250 ? 1 : 0.5; // blink
      }
    };

    const getCollidingItem = () => {
      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        if (sqrt(pow(item.x - player.x, 2) + pow(item.y - player.y, 2)) < player.radiusPixels + item.radiusPixels) {
          return item;
        }
      }
    };

    let lastCollidingItem = undefined;
    const detectCollisions = () => {
      const collidingItem = getCollidingItem();
      if (collidingItem && collidingItem !== lastCollidingItem) {
        console.log(
          "Detected player collision with " +
            collidingItem.data.name +
            ". Reducing health by " +
            collidingItem.data.damage +
            "."
        );
        health = max(health - collidingItem.data.damage, 0);
        // TODO: play damage sound
      }
      lastCollidingItem = collidingItem;
    };

    let previousHealthTick = 0;
    let previousScoreTick = 0;
    const increaseHealthAndScore = timestamp => {
      const healthTick = floor(timestamp / 1000);
      if (healthTick !== previousHealthTick) {
        health = min(health + (healthTick - previousHealthTick) * 1, 100);
        previousHealthTick = healthTick;
      }
      const scoreTick = floor(timestamp / 500);
      if (scoreTick !== previousScoreTick) {
        const distanceFromCenter = sqrt(pow(player.x - canvasWidth / 2, 2) + pow(player.y - canvasHeight / 2, 2));
        const scoreToAddBasedOnDistanceFromCenter = round(
          5 * (1 - (0.5 * distanceFromCenter) / sqrt(pow(canvasWidth / 2, 2) + pow(canvasHeight / 2, 2)))
        );
        score += scoreToAddBasedOnDistanceFromCenter;
        previousScoreTick = scoreTick;
      }
    };

    const renderBackground = () => {
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

    const renderScore = () => {
      scoreDom.innerHTML = score;
    };

    const renderHealth = () => {
      healthDomContent.style.width = health + "%";
    };

    const gameover = () => {
      console.log("Game Over.");
      messageDom.innerHTML = "Game Over!&nbsp;&nbsp;<button>Play again ⟳</button>";
      messageDom.querySelector("button").onclick = () => {
        messageDom.style.display = "none";
        startNewGame();
      };
      messageDom.style.display = "block";
    };

    let fps = 0;
    let fpsTick = 0;
    const calculateAndRenderFPS = workStartTimestamp => {
      fps++;
      const second = floor(window.performance.now() / 1000);
      if (fpsTick !== second) {
        fpsTick = second;
        // For dev only:
        // fpsDom.innerHTML =
        //   `${fps} fps / ${(window.performance.now() - workStartTimestamp).toFixed(4)}ms<br/>` +
        //   `canvas: ${canvasWidth}x${canvasHeight}<br/>` +
        //   `window.innerWidth: ${window.innerWidth}x${window.innerHeight}<br/>` +
        //   `window.outerWidth: ${window.outerWidth}x${window.outerHeight}<br/>` +
        //   `pixel ratio: ${PIXEL_RATIO}` +
        //   resizeText;
        fpsDom.innerHTML = `${fps} fps`
        fps = 0;
      }
    };

    let previousTimestamp = 0;
    let totalTimeSpentOnAnotherTab = 0;
    function gameLoop(timestamp) {
      // Reduce timestamp by the total time user spent on another tab. We need this so time based action (background position, player health) does not progress heavily when player returns to the game browser tab after leaving it.
      if (timeSpentOnAnotherTab) {
        totalTimeSpentOnAnotherTab += timeSpentOnAnotherTab;
        timeSpentOnAnotherTab = 0;
      }
      timestamp -= totalTimeSpentOnAnotherTab;
      const timestampDiff = timestamp - previousTimestamp;
      const workStartTimestamp = window.performance.now();
      moveBackground(timestamp, timestampDiff);
      movePlayer(timestampDiff);
      moveObstacles(); // TODO: Make use of obstacle.speed together with timestampDiff.
      detectCollisions();
      increaseHealthAndScore(timestamp);
      emptyCanvas();
      renderBackground();
      renderPlayer();
      renderObstacles(timestamp);
      renderHealth();
      renderScore();
      calculateAndRenderFPS(workStartTimestamp);
      if (health === 0) {
        gameover();
      } else {
        window.requestAnimationFrame(gameLoop);
      }
      previousTimestamp = timestamp;
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
        console.log("Error loading image for " + item.name + ".");
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
          console.log("Error loading sound for " + item.name + ".");
          onAssetLoadError();
        }
      });
    });
  };

  const displayPercentLoader = percent => {
    loaderDom.innerHTML = percent + "%";
    if (percent === 0) {
      console.log("Loading 0%");
      loaderDom.style.display = "block";
    }
    if (percent === 100) {
      console.log("Loading 100%");
      loaderDom.style.opacity = 0;
      setTimeout(() => (loaderDom.style.display = "none"), 2000);
    }
  };

  const displayErrorAndRetryButton = () => {
    console.log("Error loading assets. Please try again.");
    messageDom.innerHTML = 'Error loading assets &#x1F631. Please <a href="/">try again!</a>';
    messageDom.style.display = "block";
  };

  const showSplashLogo = () => {
    window.requestAnimationFrame(() => {
      splashDom.style.display = "block";
      splashDom.style.top = "-10vh";
      window.requestAnimationFrame(() => {
        splashDom.style.top = "25vh";
      });
    });
  };

  const hideSplashLogo = () => {
    window.setTimeout(() => {
      splashDom.classList.add("out");
      splashDom.style.opacity = 0;
      splashDom.style.top = "-20vh";
      window.setTimeout(() => (splashDom.style.display = "none"), 5000); // Fully remove it after a while.
    }, 1000); // Delay "hide" just to make sure that CSS transition of "show" has finished.
  };

  const startGame = () => {
    // playBackgroundMusic();
    attachEventListeners();
    initializeCanvas();
    startNewGame();
  };

  // ******************************* START GAME *******************************
  displayPercentLoader(0);
  showSplashLogo();
  loadAssets(displayPercentLoader, displayErrorAndRetryButton, [startGame, hideSplashLogo]);
})();
