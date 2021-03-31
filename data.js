(function (undefined) {
  "use strict";

  window.GAME.data = {
    backgrounds: [
      {
        name: "background-particle-1",
        image: "assets/iasonas-background-particle-1.png",
        size: 1,
      },
      {
        name: "background-particle-2",
        image: "assets/iasonas-background-particle-2.png",
        size: 1,
      },
      {
        name: "background-particle-3",
        image: "assets/iasonas-background-particle-3.png",
        size: 1,
      },
      {
        name: "background-particle-4",
        image: "assets/iasonas-background-particle-4.png",
        size: 1,
      },
      {
        name: "background-particle-5",
        image: "assets/iasonas-background-particle-5.png",
        size: 1,
      },
      {
        name: "background-particle-6",
        image: "assets/iasonas-background-particle-6.png",
        size: 1,
      },
      {
        name: "background-particle-7",
        image: "assets/iasonas-background-particle-7.png",
        size: 1,
      },
      {
        name: "background-particle-8",
        image: "assets/iasonas-background-particle-8.png",
        size: 1,
      },
      {
        name: "background-particle-9",
        image: "assets/iasonas-background-particle-9.png",
        size: 1,
      },
      {
        name: "background-particle-10",
        image: "assets/iasonas-background-particle-10.png",
        size: 1,
      },
      {
        name: "background-particle-11",
        image: "assets/iasonas-background-particle-11.png",
        size: 1,
      },
      {
        name: "background-particle-12",
        image: "assets/iasonas-background-particle-12.png",
        size: 1,
      },
      {
        name: "background-particle-13",
        image: "assets/iasonas-background-particle-13.png",
        size: 1,
      },
      {
        name: "background-particle-14",
        image: "assets/iasonas-background-particle-14.png",
        size: 1,
      },
      {
        name: "background-particle-15",
        image: "assets/iasonas-background-particle-15.png",
        size: 1,
      },
      {
        name: "background-particle-16",
        image: "assets/orestis-background-particle-16.png",
        size: 1,
      },
      {
        name: "background-particle-17",
        image: "assets/orestis-background-particle-17.png",
        size: 1,
      },
      {
        name: "background-particle-18",
        image: "assets/orestis-background-particle-18.png",
        size: 1,
      },
      {
        name: "background-particle-19",
        image: "assets/orestis-background-particle-19.png",
        size: 1,
      },
      {
        name: "background-particle-20",
        image: "assets/orestis-background-particle-20.png",
        size: 1,
      },
      {
        name: "background-particle-21",
        image: "assets/orestis-background-particle-21.png",
        size: 1,
      },
      {
        name: "background-particle-22",
        image: "assets/orestis-background-particle-22.png",
        size: 1,
      },
      {
        name: "background-particle-23",
        image: "assets/orestis-background-particle-23.png",
        size: 1,
      },
      {
        name: "background-particle-24",
        image: "assets/iasonas-background-particle-24.png",
        size: 1,
      },
      {
        name: "background-particle-25",
        image: "assets/iasonas-background-particle-25.png",
        size: 1,
      },
      {
        name: "background-particle-26",
        image: "assets/iasonas-background-particle-26.png",
        size: 1,
      },
      {
        name: "background-particle-27",
        image: "assets/iasonas-background-particle-27.png",
        size: 1,
      },
      {
        name: "background-particle-28",
        image: "assets/iasonas-background-particle-28.png",
        size: 1,
      },
      {
        name: "background-particle-29",
        image: "assets/iasonas-background-particle-29.png",
        size: 1,
      },
      {
        name: "background-particle-30",
        image: "assets/iasonas-background-particle-30.png",
        size: 1,
      },
      {
        name: "background-particle-31",
        image: "assets/iasonas-background-particle-31.png",
        size: 1,
      },
    ],
    obstacles: [
      {
        name: "bad-big-alien-8-legs-5-hands",
        image: "assets/iasonas-bad-big-alien-8-legs-5-hands.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-big-alien-8-legs-5-hands.webm",
            "assets/iasonas-bad-big-alien-8-legs-5-hands.mp3",
          ],
        }),
        speed: 1000,
        rotation: 4000,
        damage: 40,
        hue: 5000,
      },
      {
        name: "bad-creature-with-thorns",
        image: "assets/iasonas-bad-creature-with-thorns.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-creature-with-thorns.webm",
            "assets/iasonas-bad-creature-with-thorns.mp3",
          ],
        }),
        speed: 3000,
        rotation: 0,
        damage: 0,
        hue: 0,
      },
      {
        name: "bad-flame-ball",
        image: "assets/iasonas-bad-flame-ball.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-flame-ball.webm",
            "assets/iasonas-bad-flame-ball.mp3",
          ],
        }),
        speed: 6000,
        rotation: 0,
        damage: 0,
        hue: 0,
      },
      {
        name: "bad-humanoid-creature",
        image: "assets/iasonas-bad-humanoid-creature.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-humanoid-creature.webm",
            "assets/iasonas-bad-humanoid-creature.mp3",
          ],
        }),
        speed: 2400,
        rotation: 0,
        damage: 5,
        hue: 2000,
      },
      {
        name: "bad-katsarida",
        image: "assets/iasonas-bad-katsarida.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-katsarida.webm",
            "assets/iasonas-bad-katsarida.mp3",
          ],
        }),
        speed: 5000,
        rotation: 50000,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-meteor-cloud",
        image: "assets/iasonas-bad-meteor-cloud.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-meteor-cloud.webm",
            "assets/iasonas-bad-meteor-cloud.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-meteor-cutter",
        image: "assets/iasonas-bad-meteor-cutter.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-meteor-cutter.webm",
            "assets/iasonas-bad-meteor-cutter.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-meteor-with-shields",
        image: "assets/iasonas-bad-meteor-with-shields.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-meteor-with-shields.webm",
            "assets/iasonas-bad-meteor-with-shields.mp3",
          ],
        }),
        speed: 3500,
        rotation: 0,
        damage: 7,
        hue: 1000,
      },
      {
        name: "bad-flaming-ice",
        image: "assets/iasonas-bad-flaming-ice.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-flaming-ice.webm",
            "assets/iasonas-bad-flaming-ice.mp3",
          ],
        }),
        speed: 5000,
        rotation: 5000,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-rocket",
        image: "assets/iasonas-bad-rocket.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-rocket.webm",
            "assets/iasonas-bad-rocket.mp3",
          ],
        }),
        speed: 3500,
        rotation: 10000,
        damage: 7,
        hue: 0,
      },
      {
        name: "bad-small-tentacle",
        image: "assets/iasonas-bad-small-tentacle.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-small-tentacle.webm",
            "assets/iasonas-bad-small-tentacle.mp3",
          ],
        }),
        speed: 5000,
        rotation: 1000,
        damage: 7,
        hue: 0,
      },
      {
        name: "bad-irritating-rocket-powered-obstacle",
        image: "assets/iasonas-bad-irritating-rocket-powered-obstacle.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-irritating-rocket-powered-obstacle.webm",
            "assets/iasonas-bad-irritating-rocket-powered-obstacle.mp3",
          ],
        }),
        speed: 2000,
        rotation: 5000,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-racing-car",
        image: "assets/iasonas-bad-racing-car.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-racing-car.webm",
            "assets/iasonas-bad-racing-car.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-tv-set",
        image: "assets/iasonas-bad-tv-set.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-tv-set.webm",
            "assets/iasonas-bad-tv-set.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-big-alien",
        image: "assets/katerina-bad-big-alien.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-big-alien.webm",
            "assets/katerina-bad-big-alien.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-burger",
        image: "assets/katerina-bad-burger.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-burger.webm",
            "assets/katerina-bad-burger.mp3",
          ],
        }),
        speed: 1500,
        rotation: 5000,
        damage: 13,
        hue: 0,
      },
      {
        name: "bad-corona",
        image: "assets/katerina-bad-corona.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-corona.webm",
            "assets/katerina-bad-corona.mp3",
          ],
        }),
        speed: 4000,
        rotation: 9000,
        damage: 5,
        hue: 10000,
      },
      {
        name: "bad-flower",
        image: "assets/katerina-bad-flower.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-flower.webm",
            "assets/katerina-bad-flower.mp3",
          ],
        }),
      },
      {
        name: "bad-internet-explorer",
        image: "assets/katerina-bad-internet-explorer.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-internet-explorer.webm",
            "assets/katerina-bad-internet-explorer.mp3",
          ],
        }),
        speed: 2000,
        rotation: 10000,
        damage: 7,
        hue: 0,
      },
      {
        name: "bad-meteor",
        image: "assets/katerina-bad-meteor.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-meteor.webm",
            "assets/katerina-bad-meteor.mp3",
          ],
        }),
        speed: 2000,
        rotation: 1000,
        damage: 10,
        hue: 0,
      },
      {
        name: "bad-red-bomb",
        image: "assets/katerina-bad-red-bomb.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-red-bomb.webm",
            "assets/katerina-bad-red-bomb.mp3",
          ],
        }),
        speed: 4000,
        rotation: 1000,
        damage: 2,
        hue: 0,
      },
      {
        name: "bad-spaceship",
        image: "assets/katerina-bad-spaceship.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-spaceship.webm",
            "assets/katerina-bad-spaceship.mp3",
          ],
        }),
        speed: 0,
        rotation: 0,
        damage: 3,
        hue: 0,
      },
      {
        name: "bad-star",
        image: "assets/katerina-bad-star.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/katerina-bad-star.webm",
            "assets/katerina-bad-star.mp3",
          ],
        }),
        speed: 3000,
        rotation: 5000,
        damage: 20,
        hue: 1000,
      },
      {
        name: "bad-ahinos",
        image: "assets/orestis-bad-ahinos.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-ahinos.webm",
            "assets/orestis-bad-ahinos.mp3",
          ],
        }),
        speed: 3000,
        rotation: 5000,
        damage: 20,
        hue: 0,
      },
      {
        name: "bad-bean-meteor",
        image: "assets/orestis-bad-bean-meteor.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-bean-meteor.webm",
            "assets/orestis-bad-bean-meteor.mp3",
          ],
        }),
        speed: 2000,
        rotation: 0,
        damage: 15,
        hue: 1000,
      },
      {
        name: "bad-hairy-salamandra",
        image: "assets/orestis-bad-hairy-salamandra.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-hairy-salamandra.webm",
            "assets/orestis-bad-hairy-salamandra.mp3",
          ],
        }),
        speed: 3000,
        rotation: 100,
        damage: 20,
        hue: 0,
      },
      {
        name: "bad-tsouhtra",
        image: "assets/orestis-bad-tsouhtra.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-tsouhtra.webm",
            "assets/orestis-bad-tsouhtra.mp3",
          ],
        }),
        speed: 4000,
        rotation: 0,
        damage: 20,
        hue: 10000,
      },
      {
        name: "bad-colored-monster",
        image: "assets/iasonas-bad-colored-monster.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/iasonas-bad-colored-monster.webm",
            "assets/iasonas-bad-colored-monster.mp3",
          ],
        }),
        speed: 1200,
        rotation: 0,
        damage: 20,
        hue: 0,
      },
      {
        name: "bad-spaceship-with-ants",
        image: "assets/orestis-bad-spaceship-with-ants.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-spaceship-with-ants.webm",
            "assets/orestis-bad-spaceship-with-ants.mp3",
          ],
        }),
        speed: 1700,
        rotation: 0,
        damage: 20,
        hue: 0,
      },
      {
        name: "bad-spaceship-with-astronauts",
        image: "assets/orestis-bad-spaceship-with-astronauts.png",
        size: 1,
        sound: new Howl({
          src: [
            "assets/orestis-bad-spaceship-with-astronauts.webm",
            "assets/orestis-bad-spaceship-with-astronauts.mp3",
          ],
        }),
        speed: 1500,
        rotation: 0,
        damage: 20,
        hue: 0,
      },
    ],
    players: [
      {
        name: "player-medusa",
        image: "assets/iasonas-player-medusa.png",
        size: 1,
      },
      {
        name: "player-diplomatos",
        image: "assets/iasonas-player-diplomatos.png",
        size: 1,
      },
      {
        name: "player-eksoheros",
        image: "assets/iasonas-player-eksoheros.png",
        size: 1,
      },
      {
        name: "player-hromatistopodos",
        image: "assets/iasonas-player-hromatistopodos.png",
        size: 1,
      },
      {
        name: "player-koftometeoritis",
        image: "assets/iasonas-player-koftometeoritis.png",
        size: 1,
      },
      {
        name: "player-pyravlodiastimoplio",
        image: "assets/iasonas-player-pyravlodiastimoplio.png",
        size: 1,
      },
      {
        name: "player-space-cockroach",
        image: "assets/orestis-player-space-cockroach.png",
        size: 1,
      },
    ],
  };
})();
