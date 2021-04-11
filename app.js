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

  const { min, max, random, floor, round } = Math;

  const getSecond = () => floor(new Date().getTime() / 1000);

  // fps.
  const fps = createElementFromHTML(
    `<span style="font-family: sans-serif; opacity: 0.5; background: #fff; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").prepend(fps);

  const demoCanvas = itemsCount => {
    const width = min(MAX_CANVAS_SIZE, window.innerWidth);
    const height = min(MAX_CANVAS_SIZE, window.innerHeight);

    const canvas = createElementFromHTML(`<canvas></canvas>`);
    document.getElementById("content").append(canvas);
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    if (MAX_CANVAS_SIZE < window.innerWidth) {
      canvas.style.marginLeft = round((window.innerWidth - MAX_CANVAS_SIZE) / 2) + "px";
    }
    if (MAX_CANVAS_SIZE < window.innerHeight) {
      canvas.style.marginTop = round((window.innerHeight - MAX_CANVAS_SIZE) / 2) + "px";
    }

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      items[i] = {
        x: width / 2,
        y: height / 2,
        dx: random() * 6 - 3,
        dy: random() * 6 - 3,
        sizex: round(random() * 100 + 50),
        data: window.GAME.data.obstacles[i % window.GAME.data.obstacles.length],
        image: new Image(),
        opacity: random() * 0.5 + 0.5,
        dr: random() - 0.5
      };
      items[i].image.src = window.GAME.data.obstacles[i % window.GAME.data.obstacles.length].image;
    }

    let count = 0;
    let second = getSecond();
    function animate(timestamp) {
      const now = window.performance.now();

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.x += item.dx;
        item.y += item.dy;
        if (item.x + item.dx < 0 || item.x + item.dx > window.innerWidth - item.sizex / 2) item.dx = -item.dx;
        if (item.y + item.dy < 0 || item.y + item.dy > window.innerHeight - item.sizey / 2) item.dy = -item.dy;
      }
      context.globalAlpha = 1;
      context.fillStyle = BACKGROUND_COLOR;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        if (!(item.image.complete && item.image.naturalWidth)) continue;
        if (!item.sizey) {
          item.sizey = round((item.image.naturalHeight * item.sizex) / item.image.naturalWidth);
        }
        context.globalAlpha = item.opacity;
        context.translate(item.x, item.y);
        context.rotate((timestamp / 100) * item.dr);
        context.drawImage(
          item.image,
          round(item.sizex / 2 - item.sizex),
          round(item.sizey / 2 - item.sizey),
          round(item.sizex),
          round(item.sizey)
        );
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
        } canvas: ${width}x${height}`;
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
