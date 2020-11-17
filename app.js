(function (undefined) {
  "use strict";

  console.log("app.js");

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  window.GAME.data.backgrounds.map(function (background) {
    document
      .getElementById("backgrounds")
      .appendChild(
        createElementFromHTML(
          `<div><h3>${background.name}</h3><img src="${background.image}" /></div>`
        )
      );
  });

  window.GAME.data.obstacles.map(function (obstacle) {
    const obstacleDom = createElementFromHTML(
      `<div><h3>${obstacle.name}</h3><img src="${obstacle.image}" /></div>`
    );
    obstacleDom.querySelector("img").addEventListener("click", function () {
      obstacle.sound.play();
    });
    document.getElementById("obstacles").appendChild(obstacleDom);
  });

  window.GAME.data.players.map(function (player) {
    document
      .getElementById("players")
      .appendChild(
        createElementFromHTML(
          `<div><h3>${player.name}</h3><img src="${player.image}" /></div>`
        )
      );
  });
})();
