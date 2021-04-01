(function (undefined) {
  "use strict";

  // utils.
  const createElementFromHTML = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  const round = Math.round;
  // const round = (a) => a;

  const getSecond = () => Math.floor(new Date().getTime() / 1000);

  // fps.
  const fps = createElementFromHTML(
    `<span style="opacity: 0.5; zoom: 3; border: 1px solid red; background: green; position: fixed; top: 0; left: 0"></span>`
  );
  document.getElementById("content").prepend(fps);

  const demoHtml = itemsCount => {
    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      const size = Math.random() * 40 + 50;
      items[i] = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        dx: Math.random() * 4,
        dy: Math.random() * 4,
        size: size,
        data: window.GAME.data.obstacles[i % window.GAME.data.obstacles.length],
        elem: createElementFromHTML(
          `<img width="${size}px" src="${
            window.GAME.data.obstacles[i % window.GAME.data.obstacles.length].image
          }" style="position: absolute; opacity: ${Math.random()}" />`
        )
      };
      document.getElementById("content").appendChild(items[i].elem);
    }

    let count = 0;
    let second = getSecond();
    function animate(timestamp) {
      const now = window.performance.now();

      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.x += item.dx;
        item.y += item.dy;
        if (item.x < 0 || item.x > window.innerWidth - item.size * 2) item.dx = -item.dx;
        if (item.y < 0 || item.y > window.innerHeight - item.size - 100) item.dy = -item.dy;
      }
      for (let i = 0; i < itemsCount; i++) {
        const item = items[i];
        item.elem.style.left = round(item.x) + "px";
        item.elem.style.top = round(item.y) + "px";
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

  const demoCanvas = itemsCount => {
    const canvas = createElementFromHTML(`<canvas></canvas>`);
    document.getElementById("content").append(canvas);
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      items[i] = {
        x: 0,
        y: 0,
        dx: Math.random() * 4,
        dy: Math.random() * 4,
        sizex: round(Math.random() * 40 + 40),
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
        // context.rect(
        //   item.sizex / 2 - item.sizex,
        //   item.sizey / 2 - item.sizey,
        //   item.sizex,
        //   item.sizey
        // );
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
        )}" /></span></div>`
      );
      obstacleDom.querySelector("img").addEventListener("click", function () {
        obstacle.sound.play();
      });
      document.getElementById("obstacles").appendChild(obstacleDom);
    });

    window.GAME.data.players.map(function (player) {
      document
        .getElementById("players")
        .appendChild(createElementFromHTML(`<div><h3>${player.name}</h3><img src="${player.image}" /></div>`));
    });
  };

  // playBackgroundMusic();
  renderLibrary();

  // canvas:
  // + speed
  // - lower level
  // - no css tricks
  // - no zoom detail (don't need it)
  // - no DOM events on elements (don't need it)
  // demoHtml(10);
  // demoHtml(100); // 40 fps mobile, 40 fps pc.
  // demoHtml(300); // 13 fps pc
  // demoCanvas(10);
  demoCanvas(100); // 60 fps mobile, 50 fps pc!
  // demoCanvas(300); // 60 fps
})();
