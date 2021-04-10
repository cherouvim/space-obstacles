(function (undefined) {
  "use strict";

  // utils.
  const createElementFromHTML = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  const round = Math.round;

  const getSecond = () => Math.floor(new Date().getTime() / 1000);

  // fps.
  const fps = createElementFromHTML(
    `<span style="opacity: 0.5; zoom: 3; border: 1px solid red; background: green; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").prepend(fps);

  const demoCanvas = itemsCount => {
    const canvas = createElementFromHTML(`<canvas></canvas>`);
    document.getElementById("content").append(canvas);
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      items[i] = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: Math.random() * 6 - 3,
        dy: Math.random() * 6 - 3,
        sizex: round(Math.random() * 100 + 50),
        data: window.GAME.data.obstacles[i % window.GAME.data.obstacles.length],
        image: new Image(),
        opacity: Math.random() * 0.5 + 0.5,
        dr: Math.random() - 0.5
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
      context.fillStyle = "#3c3c3c";
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
        fps.innerHTML = count + "fps / " + (window.performance.now() - now).toFixed(4) + "ms";
        count = 0;
      }

      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  };

  const playBackgroundMusic = () => {
    const game1sound = new Howl({
      src: ["assets/game-1.webm", "assets/game-1.mp3"],
      loop: true,
      volume: 1
    });
    game1sound.play();
  };

  const renderLibrary = () => {
    document.getElementById("content").append(
      createElementFromHTML(
        `<div><fieldset id="backgrounds"><legend>background elements</legend></fieldset>
          <fieldset id="obstacles"><legend>obstacles/enemies</legend></fieldset>
          <fieldset id="players"><legend>players</legend></fieldset></div>`
      )
    );

    window.GAME.data.backgrounds.map(function (background) {
      document
        .getElementById("backgrounds")
        .appendChild(createElementFromHTML(`<div><h3>${background.name}</h3><img src="${background.image}" /></div>`));
    });
    let i = 0;
    window.GAME.data.obstacles.map(function (obstacle) {
      i++;
      const imgAnimation = [];
      if (obstacle.rotation) {
        imgAnimation.push(`rotate ${(100 / obstacle.rotation) * 1000}ms linear infinite`);
      }
      const spanAnimation = [];
      if (obstacle.speed) {
        spanAnimation.push(`translate ${(100 / obstacle.speed) * 1000}ms linear infinite`);
      }
      if (obstacle.hue) {
        imgAnimation.push(`hue-rotate ${(100 / obstacle.hue) * 1000}ms linear infinite`);
      }
      const obstacleDom = createElementFromHTML(
        `<div><h3>${i}) ${obstacle.name} [<abbr title="size">S: ${obstacle.size}</abbr>, <abbr title="speed">s: ${
          obstacle.speed
        }</abbr>, <abbr title="rotation">r: ${obstacle.rotation}</abbr>, <abbr title="damage">d: ${
          obstacle.damage
        }</abbr>, <abbr title="hue">h: ${obstacle.hue}</abbr>]</h3><span style="animation: ${spanAnimation.join(
          ", "
        )}"><img src="${obstacle.image}" title="${obstacle.image}" style="animation: ${imgAnimation.join(
          ", "
        )}" /></span><canvas style="margin-top: 100px"></canvas></div>`
      );
      obstacleDom.querySelector("img").addEventListener("click", function () {
        obstacle.sound.play();
      });
      const canvas = obstacleDom.querySelector("canvas");
      const context = canvas.getContext("2d");
      canvas.width = (window.innerWidth / 100) * obstacle.size;
      canvas.height = round((canvas.width * obstacle.imageHeight) / obstacle.imageWidth);
      context.drawImage(obstacle.imageElement, 0, 0, canvas.width, canvas.height);

      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        ((obstacle.radius / 2) * canvas.width) / 100,
        0,
        2 * Math.PI,
        false
      );
      context.lineWidth = 1;
      context.strokeStyle = "#ffff00";
      context.globalAlpha = 0.5;
      context.stroke();
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.moveTo(0, canvas.height / 2);
      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
      document.getElementById("obstacles").appendChild(obstacleDom);
    });

    window.GAME.data.players.map(function (player) {
      document
        .getElementById("players")
        .appendChild(createElementFromHTML(`<div><h3>${player.name}</h3><img src="${player.image}" /></div>`));
    });
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
        onImageLoad(Math.floor((loadedImages / totalImages) * 100));

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
    // setTimeout(() => {
    //   loadImages(displayPercentLoader, displayErrorAndRetryButton, startGame);
    // }, 1000);
  };

  const startGame = () => {
    console.log("backgrounds", window.GAME.data.backgrounds);
    console.log("obstacles", window.GAME.data.obstacles);
    console.log("players", window.GAME.data.players);
    console.log("start game");
    // playBackgroundMusic();
    renderLibrary();

    // demoCanvas(50);
  };

  loadImages(displayPercentLoader, displayErrorAndRetryButton, startGame);
})();
