
function Circle(color, column, row) {
    this.radius = 800 / (circleArray.length * 2);
    this.diameter = this.radius * 2;
    this.colors = ["White", "Green", "Red", "DimGray"];
    this.colorNum = color;
    this.row = row;
    this.column = column;
    this.x = this.column * this.diameter + this.radius;
    this.y = this.row * this.diameter + this.radius;
    this.growthTime = .1;
    this.ashDuration = 1;
    circleArray[this.column][this.row] = this;
    //Entity.call(this, game, this.x, this.y);
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.update = function (gameEngine) {
    //check nearby squares
    switch (this.colorNum) {
        case 0:
            break;
        case 1:
            if (Math.floor((Math.random() * ((80000 - 0)))) < 1) {
                this.colorNum = 2;
            } else {
                this.growthTime -= gameEngine.clockTick;
                if (this.growthTime <= 0) {
                    this.isTree();
                    this.growthTime = .1;
                }
            }

            break;
        case 2:
            this.isFire();
            break;
        case 3:
            this.ashDuration -= gameEngine.clockTick;
            if (this.ashDuration <= 0) {
                this.colorNum = 1;
                this.ashDuration = 1;
            }
            break;
        default:
            console.log("Not a valid color");
    }


    Entity.prototype.update.call(this);
};

Circle.prototype.isTree = function () {
    if (this.row < circleArray.length - 1 && circleArray[this.column][this.row + 1].colorNum === 0) {
        circleArray[this.column][this.row + 1].colorNum = 1;
    }
    if (this.row > 0 && circleArray[this.column][this.row - 1].colorNum === 0) {
        circleArray[this.column][this.row - 1].colorNum = 1;
    }
    if (this.column < circleArray.length - 1 && circleArray[this.column + 1][this.row].colorNum === 0) {
        circleArray[this.column + 1][this.row].colorNum = 1;
    }
    if (this.column > 0 && circleArray[this.column - 1][this.row].colorNum === 0) {
        circleArray[this.column - 1][this.row].colorNum = 1;
    }
}

Circle.prototype.isFire = function () {
    if (this.row < circleArray.length-1 && circleArray[this.column][this.row + 1].colorNum === 1) {
        if ((Math.random() * ((10 - 0) - 0)) < 5) circleArray[this.column][this.row + 1].colorNum = 2;
        }
        if (this.row > 0 && circleArray[this.column][this.row - 1].colorNum === 1) {
            if ((Math.random() * ((10 - 0) - 0)) < 5) circleArray[this.column][this.row - 1].colorNum = 2;
        }
        if (this.column < circleArray.length - 1 && circleArray[this.column + 1][this.row].colorNum === 1) {
            if ((Math.random() * ((10 - 0) - 0)) < 5) circleArray[this.column + 1][this.row].colorNum = 2;
        }
        if (this.column > 0 && circleArray[this.column - 1][this.row].colorNum === 1) {
            if ((Math.random() * ((10 - 0) - 0)) < 5) circleArray[this.column - 1][this.row].colorNum = 2;
        }
    this.colorNum = 3;
}

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.colorNum];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

