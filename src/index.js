import Game from './classes/game.js'

(function() {
    'use strict';  

    // start game when page has finished loading
    window.addEventListener('load', function() {
        let game = new Game();
    });
})()