(function (undefined) {
  "use strict";

  const MAX_CANVAS_SIZE = 1200;
  const BACKGROUND_COLOR = "#111";

  // utils.
  const createElementFromHTML = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  const { min, max, random, floor, round } = Math;

  const getSecond = () => floor(new Date().getTime() / 1000);

  // fps.
  const fps = createElementFromHTML(
    `<span style="font-family: sans-serif; opacity: 0.5; background: #fff; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").prepend(fps);

  const loader = createElementFromHTML(`<div id="loader" style="display: none"></span>`);
  document.getElementById("content").prepend(loader);

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

  const loadImages = (onImageLoad, onImageError, onAllImagesLoaded) => {
    let loadedImages = 0;
    const itemsWithImages = [].concat(
      window.GAME.data.backgrounds,
      window.GAME.data.obstacles,
      window.GAME.data.players
    );
    const totalImages = itemsWithImages.length;
    itemsWithImages.map(item => {
      item.imageElement = new Image();
      item.imageElement.onload = () => {
        item.imageWidth = item.imageElement.naturalWidth;
        item.imageHeight = item.imageElement.naturalHeight;
        loadedImages++;
        onImageLoad(floor((loadedImages / totalImages) * 100));

        if (loadedImages === totalImages) onAllImagesLoaded();
      };
      item.imageElement.onerror = () => {
        console.log("ERROR loading image");
        onImageError();
      };
      item.imageElement.src = item.image;
    });
  };

  const displayPercentLoader = percent => {
    console.log("Loading: " + percent + "%");
    loader.innerHTML = percent + "%";
    loader.style.display = percent < 100 ? "block" : "none";
  };

  const displayErrorAndRetryButton = () => {
    console.log("Error. Please try again");
  };

  const startGame = () => {
    console.log("start game");
    // playBackgroundMusic();
    demoCanvas(50);
  };

  loadImages(displayPercentLoader, displayErrorAndRetryButton, startGame);
})();
