class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 1000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.MAX_X_VELOCITY = 200;
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -550;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0
        this.score = 0;
        this.scoreToWin = 15;
        this.gameOver = false;
        // this.dashing = false;
        // this.dashSpeed = 5000;
        // this.dashingLength = 5;
        // this.dashingLengthTimer = 0;
        // this.dashCD = 30;
        // this.dashCDTimer = 0;
    }

    create() {
        
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 16, 16, 24, 16);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.mushrooms = this.map.createFromObjects("Objects", {
            name: "mushroom",
            key: "mushroom",
        });

        // this.bees = this.map.createFromObjects("Objects", {
        //     name: "bee",
        //     key: "bee",
        // })



        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.mushrooms, Phaser.Physics.Arcade.STATIC_BODY);

        // this.physics.world.enable(this.bees, Phaser.Physics.Arcade.STATIC_BODY);
        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.mushroomGroup = this.add.group(this.mushrooms);

        // this.beeGroup = this.add.group(this.bees);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "player_idle");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // TODO: Add coin collision handler
        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.mushroomGroup, (obj1, obj2) => {
            this.score++;
            // console.log(this.score);
            my.vfx.collectMushroom.explode(10, obj2.x, obj2.y);
            this.sound.play("mushroomSound");
            obj2.destroy(); // remove coin on overlap
        });

        // this.physics.add.overlap(my.sprite.player, this.beeGroup, (obj1, obj2) => {
        //     if (this.dashing){
        //         obj2.destroy(); // remove coin on overlap
        //         this.dashCD = 0;
        //     }else{
        //         this.gameLost();
        //     }
            
        // });
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            // dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            stats: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        };
        //Create win text background
        this.winTextBg = this.add.graphics();
        this.winTextBg.fillStyle(0x77DD77, .9);
        this.winTextBg.setVisible(false);

        //Create level won text
        this.winText = this.add.text(my.sprite.player.x, my.sprite.player.y, '', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        });
        this.winText.setOrigin(0.5);
        this.winText.setVisible(false);

        //Create lose text background
        this.loseTextBg = this.add.graphics();
        this.loseTextBg.fillStyle(0xC2185B, .9);
        this.loseTextBg.setVisible(false);

        //Create level lost text
        this.loseText = this.add.text(my.sprite.player.x, my.sprite.player.y, '', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        });
        this.loseText.setOrigin(0.5);
        this.loseText.setVisible(false);

        

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to B key)
        this.input.keyboard.on('keydown-B', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['scorch_01.png', 'scorch_02.png'],
            // TODO: Try: add random: true
            scale: {start: 0.02, end: 0.08},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 700,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        // Create particle effects for jumping
        my.vfx.jumping = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['scorch_01.png', 'scorch_02.png'],
            scale: { start: 0.05, end: 0.2 },
            // speed: 100,
            lifespan: 400,
            alpha: { start: 1, end: 0.1 },
        });
        // my.vfx.jumping.setAngle({ min: 160, max: 200 });

        // Create particle effects for collecting mushrooms
        my.vfx.collectMushroom = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['spark_01.png', 'spark_02.png'],
            scale: { start: 0.1, end: 0 },
            speed: 200,
            lifespan: 500,
            alpha: { start: 1, end: 0 },
        });

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(48, 48);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        // this.dashCDTimer--;
        if (this.gameOver){
            my.sprite.player.setAccelerationX(0);
            if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scene.restart();
            }
            my.sprite.player.anims.stop();
            my.vfx.walking.stop();
            return;
        }
        this.winCheck();
        this.checkBounds();
        this.checkSpeed();
        // if (!this.dashing){
        //     this.checkSpeed();
        // }
        
        if(cursors.left.isDown || this.wasd.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown || this.wasd.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip(); 
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);

            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        if (this.wasd.stats.isDown){
            console.log("Player X:" + my.sprite.player.x)
            console.log("Player Y:" + my.sprite.player.y)
        }

        // if(this.wasd.dash.isDown) {
        //     this.dashCheck();
        //     my.sprite.player.setFlip(true, false);
        //     my.sprite.player.anims.play('walk', true);
        //     // TODO: add particle following code here
        //     my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);

        //     my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

        //     // Only play smoke effect if touching the ground

        //     if (my.sprite.player.body.blocked.down) {

        //         my.vfx.walking.start();

        //     }

        // } 
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            
        }
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up) || Phaser.Input.Keyboard.JustDown(this.wasd.space))) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound");
            my.vfx.jumping.explode(10, my.sprite.player.x, my.sprite.player.y);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
    gameWon(){
        this.winText.setText('Level Complete!\n'+'Score:'+this.score+'/'+this.scoreToWin+'\nPress R to Restart');
        this.winText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.winText.y = this.cameras.main.scrollY + this.cameras.main.height / 2;
        this.winTextBg.clear();
        this.winTextBg.fillStyle(0x77DD77, .9);
        this.winTextBg.fillRect(
            this.winText.x - this.winText.width/2-20,
            this.winText.y - this.winText.height/2-20,
            this.winText.width+40,
            this.winText.height+40
        );
        this.winTextBg.setVisible(true);
        this.winText.setVisible(true);
        this.gameOver = true;
    }

    gameLost(){
        this.loseText.setText('Level Failed!\n'+'Score:'+this.score+'/'+this.scoreToWin+'\nPress R to Restart');
        this.loseText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.loseText.y = this.cameras.main.scrollY + this.cameras.main.height / 2;
        this.loseTextBg.clear();
        this.loseTextBg.fillStyle(0xC2185B, .9);
        this.loseTextBg.fillRect(
            this.loseText.x - this.loseText.width/2-20,
            this.loseText.y - this.loseText.height/2-20,
            this.loseText.width+40,
            this.loseText.height+40
        );
        this.loseTextBg.setVisible(true);
        this.loseText.setVisible(true);
        this.gameOver = true;
    }

    winCheck(){
        if (this.score >= this.scoreToWin) {
            this.gameWon();   
        }
    }

    checkBounds() {
        if (my.sprite.player.y > this.map.heightInPixels - my.sprite.player.displayHeight / 2) {
            this.gameLost();
        }
    }

    checkSpeed() {
        if (my.sprite.player.body.velocity.x > this.MAX_X_VELOCITY) {
            my.sprite.player.body.velocity.x = this.MAX_X_VELOCITY;
        } else if (my.sprite.player.body.velocity.x < -this.MAX_X_VELOCITY) {
            my.sprite.player.body.velocity.x = -this.MAX_X_VELOCITY;
        }
    }

    // dashCheck(){
    //     if (this.dashCDTimer <= 0) {
    //         console.log("dash accepted");
    //         this.dashing = true;
    //         this.ACCELERATION = this.dashSpeed;
    //         this.dashCDTimer = this.dashCD;
    //         this.dashCDTimer = this.dashCD;
    //     }
    //     if (this.dashing){
    //         this.dashingLengthTimer--;
    //         console.log("dashing...");
    //         if (this.dashingLengthTimer <= 0){
    //             this.dashing = false;
    //             this.ACCELERATION = 1000;
    //         }
    //     }

    // }
}