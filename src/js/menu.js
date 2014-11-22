(function() {
    'use strict';

    function Menu() {
        this.titleTxt = null;
        this.startTxt = null;
    }

    Menu.prototype = {

        create: function () {
            this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');

            var text = 'Dodger'
              , style = { font: '40px Arial', fill: '#ffffff', align: 'center' }
              , t = this.add.text(this.game.world.centerX, this.game.world.centerY, text, style);
            t.anchor.set(0.5, 0.5);

            if(this.game.device.desktop) {
                text = 'Click to start';
            } else {
                text = 'Touch to start';
            }
            style = { font: '30px Arial', fill: '#ffffff', align: 'center' };
            t = this.add.text(this.game.world.centerX, this.game.world.centerY + 80, text, style);
            t.anchor.set(0.5, 0.5);

            this.input.onDown.add(this.onDown, this);
        },

        update: function () {
            this.background.tilePosition.y += 2;
        },

        onDown: function () {
            this.game.state.start('game');
        }
    };

    window['dodger'] = window['dodger'] || {};
    window['dodger'].Menu = Menu;

}());
