(function () {
    'use strict';

    function Boot() {}

    Boot.prototype = {
        
        preload: function () {
            this.load.image('preloader', 'assets/preloader.gif');
        },

        create: function () {
            // Loading screen will have a black background
            this.game.stage.backgroundColor = '#000';

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            // Have the game centered horizontally
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            // Screen size will be set automatically
            this.scale.setScreenSize(true);

            this.game.state.start('preloader');
        }
    };

    window['dodger'] = window['dodger'] || {};
    window['dodger'].Boot = Boot;

}());

