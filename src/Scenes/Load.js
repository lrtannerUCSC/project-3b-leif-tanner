class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        //Load character run sprites
        this.load.image("player_idle", "Tiles/tile_0045.png");
        this.load.image("player_run", "Tiles/tile_0046.png");

        //Load jump audio
        this.load.audio("jumpSound", "Audio/phaseJump2.ogg");

        //Load mushroom sprite
        this.load.image("mushroom", "tiles/Tile_0030.png")
        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //Load mushroom audio
        this.load.audio("mushroomSound", "Audio/impactMetal_medium_004.ogg");
    }

    create() {
        this.collectSound = this.sound.add('mushroomSound');

        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'player_idle' },
                { key: 'player_run' }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [
                { key: "player_idle" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                { key: "player_run" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}