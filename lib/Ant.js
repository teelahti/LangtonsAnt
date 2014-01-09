var Direction = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
};

function Ant(x, y, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || "#000";
    this.steps = 0;
    this.direction = Direction.Right;
};

Ant.prototype.move = function (gridSize, underlyingColor) {
    this.steps++;
    this.turn(underlyingColor);
    
    if (this.direction === Direction.Up) {
        this.y--;
    }
    
    if (this.direction === Direction.Down) {
        this.y++;
    }
    
    if (this.direction === Direction.Left) {
        this.x--;
    }
    
    if (this.direction === Direction.Right) {
        this.x++;
    }

    if (this.x >= gridSize) {
        this.x = 0;
    }
    
    if (this.y >= gridSize) {
        this.y = 0;
    }
    
    if (this.x < 0) {
        this.x = gridSize - 1;
    }
    
    if (this.y < 0) {
        this.y = gridSize - 1;
    }
};

Ant.prototype.turn = function (underlyingColor) {
    if (underlyingColor) {
        // At a black square, turn 90° left, flip the color of the square, 
        // move forward one unit
        this.direction--;
    } else {
        // At a white square, turn 90° right, flip the color of the square, 
        // move forward one unit
        this.direction++;
    }

    if (this.direction > Direction.Left) {
        this.direction = Direction.Up;
    }

    if (this.direction < Direction.Up) {
        this.direction = Direction.Left;
    }
};