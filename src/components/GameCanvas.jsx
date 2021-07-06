// Styles
import "./GameCanvas.scss";

// Components
import Menu from "./Menu";

// Utils
import { useState, useEffect, useRef } from "react";
import * as Phaser from "phaser";

const prefix = "GameCanvas-";

let jumpCount = 2;
let jumpKey;

function GameCanvas() {
  const [scene, setScene] = useState();
  // 0: Pending 1: Paused(Arcade) 2:Paused(AI) 3: Runnning(Arcade) 4: Running(AI)
  const [gameState, setGameState] = useState(0);
  const [player, setPlayer] = useState();
  const canvasRef = useRef(null);

  const initialGame = (canvas) => {
    const { width, height } = canvas.getBoundingClientRect();

    var config = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      parent: canvas,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "matter",
      },
      scene: {
        preload: preload,
        create: create,
      },
    };
    var game = new Phaser.Game(config);

    function preload() {
      this.load.tilemapTiledJSON("map", "assets/background_map.json");
      // tiles in spritesheet
      this.load.spritesheet("block-sprites", "assets/block-sprites.png", {
        frameWidth: 100,
        frameHeight: 100,
      });

      this.load.atlas(
        "sheet",
        "assets/dog-sprites.png",
        "assets/dog-sprites.json"
      );

      // Load body shapes from JSON file generated using PhysicsEditor
      this.load.json("shapes", "assets/dog-shapes.json");
    }

    function create() {
      var shapes = this.cache.json.get("shapes");
      this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

      // load the map
      const map = this.make.tilemap({ key: "map" });

      // tiles for the ground layer
      var groundTiles = map.addTilesetImage("block-sprites");
      // create the ground layer

      const groundLayer = map.createLayer(
        "backgroundLayer",
        groundTiles,
        0,
        game.config.height - map.heightInPixels
      );

      // the player will collide with this layer
      groundLayer.setCollisionByExclusion([-1, 0], true);

      map.setCollisionBetween(1, 1000);
      map.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(groundLayer);

      const player = this.matter.add.sprite(100, 0, "sheet", "Dog_Right0.png", {
        shape: shapes.Dog_Right0,
        restitution: 0,
      });

      this.matter.body.setInertia(player.body, Infinity);

      // Reset jump count when player touch the ground
      this.matter.world.on(
        "collisionstart",
        function (event, player, groundLayer) {
          jumpCount = 2;
        }
      );

      this.cameras.main.setBounds(0, 0, game.config.width, groundLayer.height);

      this.cameras.main.startFollow(player);

      setScene(this);

      setPlayer(player);

      window.addEventListener("resize", () => {
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    initialGame(canvasRef.current);
  }, []);

  useEffect(() => {
    if (!scene || !player) return;
    scene.input.keyboard.removeAllKeys(true);
    // Keyboard Events
    if (jumpKey) jumpKey.destroy();
    jumpKey = scene.input.keyboard.addKey("SPACE");
    jumpKey.on("down", function (event) {
      // Player can only jump if the game is running and the jump count is sufficient
      if (gameState > 2 && jumpCount > 0) {
        player.setVelocityY(-10);
        // Reduce Jump Count after player jumped
        jumpCount--;
      }
    });
  }, [gameState, player, scene]);

  return (
    <div ref={canvasRef} className={prefix + "wrapper"}>
      <Menu gameState={gameState} setGameState={setGameState} />
    </div>
  );
}

export default GameCanvas;
