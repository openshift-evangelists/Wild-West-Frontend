var game = new Phaser.Game(800,600, Phase.AUTO, '', {preload: preload, create: create, update: update });


function preload() {
    game.load.image('playfield', 'assets/playfield.png');
}

function create() {
    var s = game.add.spring(80, 0, 'playfield');
}

function update() {

}

