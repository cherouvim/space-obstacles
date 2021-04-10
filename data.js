(function (undefined) {
  "use strict";

  /**
   * Data rules:
   * 1) The hypothetically square virtual board is 100x100 pixels.
   * This means that:
   * - for a screen resolution of 1024x768 (HDTV), the visible virtual board is 100x75 pixels.
   * - for a screen resolution of 1080x2160 (PIXEL 3), the visible virtual board is 50x100 pixels.
   * 2) All object properties should be integers 0 to 100. Some properties allow values to go above 100.
   * This means the following for properties:
   * - size: a square obstacle of size 100 will render 100x100 virtual pixels, which on PIXEL 3 would mean 2160x2160 pixels.
   * - size: a square obstacle of size 50 will render 50x50 virtual pixels, which on PIXEL 3 would mean 1080x1080 pixels.
   * - speed: an obstacle with speed 100 will require 1 second to move 100 virtual pixels.
   * - speed: an obstacle with speed 25 will require 4 second2 to move 100 virtual pixels.
   * - speed: an obstacle with speed 100 will require 1 second to move 100 virtual pixels.
   * - rotation: an obstacle with rotation 0 does not rotate.
   * - rotation: an obstacle with rotation 100 will require 1 second to rotate 360 degrees.
   * - rotation: an obstacle with rotation 200 will require 0.5 second to rotate 360 degrees.
   * - damage: an obstacle with damage 100 will imediatelly kill the player.
   * - damage: an obstacle with damage 50 will remove 50% of the player's health.
   * - hue: an obstacle with hue 0 does not change its hue (palette).
   * - hue: an obstacle with hue 5 will require 20 seconds to fully rotate its hue (palette).
   */

  window.GAME.data = {};

  window.GAME.data.backgrounds = [
    { name: "background-particle-1", image: "assets/iasonas-background-particle-1.png" },
    { name: "background-particle-2", image: "assets/iasonas-background-particle-2.png" },
    { name: "background-particle-3", image: "assets/iasonas-background-particle-3.png" },
    { name: "background-particle-4", image: "assets/iasonas-background-particle-4.png" },
    { name: "background-particle-5", image: "assets/iasonas-background-particle-5.png" },
    { name: "background-particle-6", image: "assets/iasonas-background-particle-6.png" },
    { name: "background-particle-7", image: "assets/iasonas-background-particle-7.png" },
    { name: "background-particle-8", image: "assets/iasonas-background-particle-8.png" },
    { name: "background-particle-9", image: "assets/iasonas-background-particle-9.png" },
    { name: "background-particle-10", image: "assets/iasonas-background-particle-10.png" },
    { name: "background-particle-11", image: "assets/iasonas-background-particle-11.png" },
    { name: "background-particle-12", image: "assets/iasonas-background-particle-12.png" },
    { name: "background-particle-13", image: "assets/iasonas-background-particle-13.png" },
    { name: "background-particle-14", image: "assets/iasonas-background-particle-14.png" },
    { name: "background-particle-15", image: "assets/iasonas-background-particle-15.png" },
    { name: "background-particle-16", image: "assets/orestis-background-particle-16.png" },
    { name: "background-particle-17", image: "assets/orestis-background-particle-17.png" },
    { name: "background-particle-18", image: "assets/orestis-background-particle-18.png" },
    { name: "background-particle-19", image: "assets/orestis-background-particle-19.png" },
    { name: "background-particle-20", image: "assets/orestis-background-particle-20.png" },
    { name: "background-particle-21", image: "assets/orestis-background-particle-21.png" },
    { name: "background-particle-22", image: "assets/orestis-background-particle-22.png" },
    { name: "background-particle-23", image: "assets/orestis-background-particle-23.png" },
    { name: "background-particle-24", image: "assets/iasonas-background-particle-24.png" },
    { name: "background-particle-25", image: "assets/iasonas-background-particle-25.png" },
    { name: "background-particle-26", image: "assets/iasonas-background-particle-26.png" },
    { name: "background-particle-27", image: "assets/iasonas-background-particle-27.png" },
    { name: "background-particle-28", image: "assets/iasonas-background-particle-28.png" },
    { name: "background-particle-29", image: "assets/iasonas-background-particle-29.png" },
    { name: "background-particle-30", image: "assets/iasonas-background-particle-30.png" },
    { name: "background-particle-31", image: "assets/iasonas-background-particle-31.png" }
  ];

  window.GAME.data.obstacles = [
    {
      name: "bad-big-alien-8-legs-5-hands",
      image: "assets/iasonas-bad-big-alien-8-legs-5-hands.png",
      radius: 115,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-big-alien-8-legs-5-hands.webm", "assets/iasonas-bad-big-alien-8-legs-5-hands.mp3"]
      }),
      speed: 100,
      rotation: 15,
      damage: 40,
      hue: 25
    },
    {
      name: "bad-creature-with-thorns",
      image: "assets/iasonas-bad-creature-with-thorns.png",
      radius: 100,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-creature-with-thorns.webm", "assets/iasonas-bad-creature-with-thorns.mp3"]
      }),
      speed: 33,
      rotation: 0,
      damage: 0,
      hue: 0
    },
    {
      name: "bad-flame-ball",
      image: "assets/iasonas-bad-flame-ball.png",
      radius: 45,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-flame-ball.webm", "assets/iasonas-bad-flame-ball.mp3"]
      }),
      speed: 30,
      rotation: 500,
      damage: 10,
      hue: 0
    },
    {
      name: "bad-humanoid-creature",
      image: "assets/iasonas-bad-humanoid-creature.png",
      radius: 80,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-humanoid-creature.webm", "assets/iasonas-bad-humanoid-creature.mp3"]
      }),
      speed: 45,
      rotation: 0,
      damage: 5,
      hue: 50
    },
    {
      name: "bad-katsarida",
      image: "assets/iasonas-bad-katsarida.png",
      radius: 35,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-katsarida.webm", "assets/iasonas-bad-katsarida.mp3"]
      }),
      speed: 20,
      rotation: 1,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-meteor-cloud",
      image: "assets/iasonas-bad-meteor-cloud.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-meteor-cloud.webm", "assets/iasonas-bad-meteor-cloud.mp3"]
      }),
      speed: 50,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-meteor-cutter",
      image: "assets/iasonas-bad-meteor-cutter.png",
      radius: 60,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-meteor-cutter.webm", "assets/iasonas-bad-meteor-cutter.mp3"]
      }),
      speed: 60,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-meteor-with-shields",
      image: "assets/iasonas-bad-meteor-with-shields.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-meteor-with-shields.webm", "assets/iasonas-bad-meteor-with-shields.mp3"]
      }),
      speed: 30,
      rotation: 0,
      damage: 7,
      hue: 100
    },
    {
      name: "bad-flaming-ice",
      image: "assets/iasonas-bad-flaming-ice.png",
      radius: 75,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-flaming-ice.webm", "assets/iasonas-bad-flaming-ice.mp3"]
      }),
      speed: 20,
      rotation: 10,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-rocket",
      image: "assets/iasonas-bad-rocket.png",
      radius: 120,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-rocket.webm", "assets/iasonas-bad-rocket.mp3"]
      }),
      speed: 30,
      rotation: 3,
      damage: 7,
      hue: 0
    },
    {
      name: "bad-small-tentacle",
      image: "assets/iasonas-bad-small-tentacle.png",
      radius: 80,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-small-tentacle.webm", "assets/iasonas-bad-small-tentacle.mp3"]
      }),
      speed: 20,
      rotation: 20,
      damage: 7,
      hue: 0
    },
    {
      name: "bad-irritating-rocket-powered-obstacle",
      image: "assets/iasonas-bad-irritating-rocket-powered-obstacle.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: [
          "assets/iasonas-bad-irritating-rocket-powered-obstacle.webm",
          "assets/iasonas-bad-irritating-rocket-powered-obstacle.mp3"
        ]
      }),
      speed: 50,
      rotation: 10,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-racing-car",
      image: "assets/iasonas-bad-racing-car.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-racing-car.webm", "assets/iasonas-bad-racing-car.mp3"]
      }),
      speed: 70,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-tv-set",
      image: "assets/iasonas-bad-tv-set.png",
      radius: 80,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-tv-set.webm", "assets/iasonas-bad-tv-set.mp3"]
      }),
      speed: 60,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-big-alien",
      image: "assets/katerina-bad-big-alien.png",
      radius: 130,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-big-alien.webm", "assets/katerina-bad-big-alien.mp3"]
      }),
      speed: 120,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-burger",
      image: "assets/katerina-bad-burger.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-burger.webm", "assets/katerina-bad-burger.mp3"]
      }),
      speed: 75,
      rotation: 10,
      damage: 13,
      hue: 0
    },
    {
      name: "bad-corona",
      image: "assets/katerina-bad-corona.png",
      radius: 86,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-corona.webm", "assets/katerina-bad-corona.mp3"]
      }),
      speed: 25,
      rotation: 5,
      damage: 5,
      hue: 100
    },
    {
      name: "bad-flower",
      image: "assets/katerina-bad-flower.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-flower.webm", "assets/katerina-bad-flower.mp3"]
      }),
      speed: 77,
      rotation: 5,
      damage: 5,
      hue: 0
    },
    {
      name: "bad-internet-explorer",
      image: "assets/katerina-bad-internet-explorer.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-internet-explorer.webm", "assets/katerina-bad-internet-explorer.mp3"]
      }),
      speed: 50,
      rotation: 3,
      damage: 7,
      hue: 0
    },
    {
      name: "bad-meteor",
      image: "assets/katerina-bad-meteor.png",
      radius: 95,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-meteor.webm", "assets/katerina-bad-meteor.mp3"]
      }),
      speed: 50,
      rotation: 20,
      damage: 10,
      hue: 0
    },
    {
      name: "bad-red-bomb",
      image: "assets/katerina-bad-red-bomb.png",
      radius: 82,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-red-bomb.webm", "assets/katerina-bad-red-bomb.mp3"]
      }),
      speed: 25,
      rotation: 20,
      damage: 2,
      hue: 0
    },
    {
      name: "bad-spaceship",
      image: "assets/katerina-bad-spaceship.png",
      radius: 85,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-spaceship.webm", "assets/katerina-bad-spaceship.mp3"]
      }),
      speed: 110,
      rotation: 0,
      damage: 3,
      hue: 0
    },
    {
      name: "bad-star",
      image: "assets/katerina-bad-star.png",
      radius: 80,
      size: 10,
      sound: new Howl({
        src: ["assets/katerina-bad-star.webm", "assets/katerina-bad-star.mp3"]
      }),
      speed: 33,
      rotation: 10,
      damage: 20,
      hue: 100
    },
    {
      name: "bad-ahinos",
      image: "assets/orestis-bad-ahinos.png",
      radius: 82,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-ahinos.webm", "assets/orestis-bad-ahinos.mp3"]
      }),
      speed: 33,
      rotation: 10,
      damage: 20,
      hue: 0
    },
    {
      name: "bad-bean-meteor",
      image: "assets/orestis-bad-bean-meteor.png",
      radius: 80,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-bean-meteor.webm", "assets/orestis-bad-bean-meteor.mp3"]
      }),
      speed: 50,
      rotation: 0,
      damage: 15,
      hue: 100
    },
    {
      name: "bad-hairy-salamandra",
      image: "assets/orestis-bad-hairy-salamandra.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-hairy-salamandra.webm", "assets/orestis-bad-hairy-salamandra.mp3"]
      }),
      speed: 33,
      rotation: 300,
      damage: 20,
      hue: 0
    },
    {
      name: "bad-tsouhtra",
      image: "assets/orestis-bad-tsouhtra.png",
      radius: 125,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-tsouhtra.webm", "assets/orestis-bad-tsouhtra.mp3"]
      }),
      speed: 25,
      rotation: 0,
      damage: 20,
      hue: 100
    },
    {
      name: "bad-colored-monster",
      image: "assets/iasonas-bad-colored-monster.png",
      radius: 100,
      size: 10,
      sound: new Howl({
        src: ["assets/iasonas-bad-colored-monster.webm", "assets/iasonas-bad-colored-monster.mp3"]
      }),
      speed: 90,
      rotation: 0,
      damage: 20,
      hue: 0
    },
    {
      name: "bad-spaceship-with-ants",
      image: "assets/orestis-bad-spaceship-with-ants.png",
      radius: 95,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-spaceship-with-ants.webm", "assets/orestis-bad-spaceship-with-ants.mp3"]
      }),
      speed: 70,
      rotation: 0,
      damage: 20,
      hue: 0
    },
    {
      name: "bad-spaceship-with-astronauts",
      image: "assets/orestis-bad-spaceship-with-astronauts.png",
      radius: 90,
      size: 10,
      sound: new Howl({
        src: ["assets/orestis-bad-spaceship-with-astronauts.webm", "assets/orestis-bad-spaceship-with-astronauts.mp3"]
      }),
      speed: 75,
      rotation: 0,
      damage: 20,
      hue: 0
    }
  ];

  window.GAME.data.players = [
    {
      name: "player-medusa",
      image: "assets/iasonas-player-medusa.png",
      size: 6,
      radius: 90
    },
    {
      name: "player-diplomatos",
      image: "assets/iasonas-player-diplomatos.png",
      size: 6,
      radius: 90
    },
    {
      name: "player-eksoheros",
      image: "assets/iasonas-player-eksoheros.png",
      size: 7,
      radius: 95
    },
    {
      name: "player-hromatistopodos",
      image: "assets/iasonas-player-hromatistopodos.png",
      size: 7,
      radius: 85
    },
    {
      name: "player-koftometeoritis",
      image: "assets/iasonas-player-koftometeoritis.png",
      size: 8,
      radius: 85
    },
    {
      name: "player-pyravlodiastimoplio",
      image: "assets/iasonas-player-pyravlodiastimoplio.png",
      size: 8,
      radius: 85
    },
    {
      name: "player-space-cockroach",
      image: "assets/orestis-player-space-cockroach.png",
      size: 9,
      radius: 85
    }
  ];
})();
