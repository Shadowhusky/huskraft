export enum GAME_TYPE {
  ARCADE = 0,
  AI = 1,
}

export class Game {
  type: GAME_TYPE;
  game: Phaser.Game;
  scene: Phaser.Scene;
  player: Phaser.Physics.Matter.Sprite;

  constructor(type: GAME_TYPE, game: Phaser.Game, scene: Phaser.Scene, player: Phaser.Physics.Matter.Sprite) {
    this.type = type;
    this.scene = scene;
    this.game = game;
    this.player = player;
    if (type === GAME_TYPE.ARCADE) {
      this.startArcade();
    } else if (type === GAME_TYPE.AI) {
      this.startAI();
    }
  }

  startArcade() {
    this.generateObstacle();
  }

  startAI() {}

  generateObstacle = (type="cactus_high", x = 0, y = 0) => {
    var obstacle_shapes = this.scene.cache.json.get("obstacle-shapes");
    const obstacle = this.scene.matter.add.sprite(
      x || Number(this.game.config.width) - 100,
      y || this.player.y - 50,
      "obstacle_sheet",
      `${type}.png`
    );
    // @ts-ignore
    this.scene.matter.body.setInertia(obstacle.body, Infinity);
  };
}
