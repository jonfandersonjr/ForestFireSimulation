var socket = io.connect("http://24.16.255.56:8888");
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            var circle = new Circle(0, i, j)
            circleArray[i][j] = circle;
            gameEngine.addEntity(circle);
        }
    }

    for (var i = 0; i < 5; i++) {
        circle = new Circle(1, Math.floor(Math.random() * (((circleArray.length - 1) - 0))), Math.floor(Math.random() * (((circleArray.length - 1) - 0))));
        gameEngine.addEntity(circle);
    }

    // event handlers
    document.getElementById('saveState').onclick = () => { socket.emit("save", { studentname: "Jon Anderson", statename: "entities", data: circleArray }) };
    document.getElementById('loadState').onclick = () => { socket.emit("load", { studentname: "Jon Anderson", statename: "entities" }) };
    socket.on("load", function (data) {
        gameEngine.entities = [];
        gameEngine = new GameEngine();
        console.log(data);
        circleArray = data.data;
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                //circleArray[i][j].removeFromWorld = true;
                var circle = new Circle(circleArray[i][j].colorNum, i, j)
                gameEngine.addEntity(circle);
            }
        }

        gameEngine.init(ctx);
        gameEngine.start();
    });

    gameEngine.init(ctx);
    gameEngine.start();
});