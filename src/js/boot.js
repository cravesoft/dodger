(function () {
    'use strict';

    function Boot() {}

    Boot.prototype = {
        
        init: function () {
            // Unless you specifically know your game needs to support
            // multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            // Phaser will automatically pause if the browser tab the game is
            // in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;

            // Loading screen will have a black background
            this.stage.backgroundColor = '#000';

            if(this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
            } else {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1280, 720);

                // Have the game centered
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;

                // Screen size will be set automatically
                this.scale.setScreenSize(true);

                this.scale.refresh();
            }
        },

        preload: function () {
            this.load.image('preloader', 'assets/preloader.gif');
        },

        create: function () {
            this.game.state.start('preloader');
        }
    };

    window['dodger'] = window['dodger'] || {};
    window['dodger'].Boot = Boot;

}());

