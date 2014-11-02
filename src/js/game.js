(function() {
    'use strict';

    var BADDIE_MIN_SIZE = 10
      , BADDIE_MAX_SIZE = 40
      , BADDIE_MIN_SPEED = 100
      , BADDIE_MAX_SPEED = 800
      , BADDIE_START_RATE = 0.15
      , BADDIE_INCREASE_RATE = 0.01
      , LEVEL_SCORE_THRESHOLD = 500;

    function Game() {
        this.player = null;
    }

    Game.prototype = {

        create: function () {

            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');

            this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
            this.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = false;

            this.baddies = this.add.group();
            this.baddies.enableBody = true;
            this.baddies.physicsBodyType = Phaser.Physics.ARCADE;

            this.baddieRate = BADDIE_START_RATE;
            this.baddieGenerator = this.time.events.loop(Phaser.Timer.SECOND * this.baddieRate, this.generateBaddie, this);
            this.baddieGenerator.timer.start();

            this.score = 0;
            var text = 'Score\n\n' + this.score;
            this.style = { font: '20px Arial', fill: '#ffffff', align: 'center' };
            this.scoreText = this.add.text(15, this.world.height - 50, text, this.style);
            this.scoreText.anchor.set(0, 0.5);


            if(!!localStorage) {
                this.bestScore = localStorage.getItem('bestScore');
                if(!this.bestScore) {
                    this.bestScore = 'N/A';
                }
            } else {
                this.bestScore = 'N/A';
            }
            text = 'Best\n\n' + this.bestScore;
            this.bestText = this.add.text(this.world.width - 15, this.world.height - 50, text, this.style);
            this.bestText.anchor.set(1.0, 0.5);

            this.level = 1;
            text = 'Level ' + this.level;
            this.levelText = this.add.text(this.world.centerX, this.world.centerY, text, this.style);
            this.levelText.anchor.set(0.5, 0.5);
            this.levelTween = this.add.tween(this.levelText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

            this.input.onDown.add(this.onInputDown, this);
            this.gameover = false;
        },

        update: function () {
            this.background.tilePosition.y += 2;

            if(this.gameover) {
                return;
            }

            this.score += 1;
            this.scoreText.setText('Score\n\n' + this.score);
            if(this.score % LEVEL_SCORE_THRESHOLD === 0) {
                this.level++;
                this.baddieGenerator.timer.stop();
                this.baddieRate -= BADDIE_INCREASE_RATE;
                this.baddieGenerator = this.time.events.loop(Phaser.Timer.SECOND * this.baddieRate, this.generateBaddie, this);
                this.baddieGenerator.timer.start();
                this.levelText.setText('Level ' + this.level);
                this.levelText.alpha = 1;
                this.levelTween.start();
            }

            this.physics.arcade.overlap(this.player, this.baddies, this.collisionHandler, null, this);

            var x = this.input.x
              , y = this.input.y;
            if(this.input.x > this.world.width - this.player.body.width) {
                x = this.world.width - this.player.body.width;
            } else if(this.input.x < 0) {
                x = 0;
            }
            if(this.input.y > this.world.height - this.player.body.height) {
                y = this.world.height - this.player.body.height;
            } else if(this.input.y < 0) {
                y = 0;
            }
            this.player.body.x = x;
            this.player.body.y = y;
        },

        onInputDown: function () {
            this.state.start('menu');
        },

        render: function () {
        	//this.game.debug.inputInfo(32, 32);
        },

        collisionHandler: function(player, baddie) {
            player.kill();
            baddie.kill();
            this.gameover = true;
            if(!!localStorage) {
                this.bestScore = localStorage.getItem('bestScore');
                if(!this.bestScore || this.bestScore < this.score) {
                    this.bestScore = this.score;
                    localStorage.setItem('bestScore', this.bestScore);
                }
            } else {
                this.bestScore = 'N/A';
            }
        },

        resetBaddie: function(baddie) {
            baddie.kill();
        },

        generateBaddie: function() {
            var baddieSize = this.rnd.integerInRange(BADDIE_MIN_SIZE, BADDIE_MAX_SIZE)
              , baddie = this.baddies.getFirstExists(false)
              , x = this.rnd.integerInRange(0, this.world.width-baddieSize)
              , speed = this.rnd.integerInRange(BADDIE_MIN_SPEED, BADDIE_MAX_SPEED);
            if(!baddie) {
                baddie = this.baddies.create(x, -baddieSize, 'baddie');
                baddie.checkWorldBounds = true;
                baddie.events.onOutOfBounds.add(this.resetBaddie, this);
            } else {
                baddie.reset(x, -baddieSize);
            }
            baddie.width = baddieSize;
            baddie.height = baddieSize;
            baddie.body.velocity.y = speed;
        }

    };

    window['dodger'] = window['dodger'] || {};
    window['dodger'].Game = Game;

}());
