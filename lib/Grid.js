function Grid(root, size) {
    var _this = this;
    
    if (!root) {
        throw new Error("Must give canvas root element for grid drawing");
    }

    var s = isNaN(size) ? 50 : size,
        width = root.width;

    this.ants = [];
    this.ctx = root.getContext('2d');  
    this.grid = this.createArray(s, s);
    this.cellSize = width / s;
    this.renderQueue = new Queue();

    // Render initial grid
    this.renderBaseGrid();

    // Set ant change loop
    (function moveAnts() {
        var i, ant, current;
        
        for (i = 0; i < _this.ants.length; i++) {
            ant = _this.ants[i];
            current = _this.grid[ant.x][ant.y];

            // Per rules, the cell under ant always changes color
            _this.grid[ant.x][ant.y] = current ? 0 : 1;
            _this.renderQueue.enqueue({ x: ant.x, y: ant.y, color: current ? null : ant.color });
            
            // Give grid size
            ant.move(s, current);
            
            // TODO: Render ant with direction
        }

        // HTML specs says 4 ms is the minimun allowed. Changing this to setImmediate will make 
        // rendering _very_ fast.
        setTimeout(moveAnts, 4);
    })();

    // Set animation loop
    (function animationLoop() {
        // Chrome and IE only, mozRequestAnimimationFrame could be added
        window.requestAnimationFrame(animationLoop);
        _this.render();
    })();
};

Grid.prototype.injectAnt = function(ant) {
    this.ants.push(ant);
};

Grid.prototype.createArray = function (length) {
    var a = new Array(length || 0);

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < length; i++) {
            a[i] = this.createArray.apply(this, args);
        }
    }

    return a;
};

// Render changed cells since last call
Grid.prototype.render = function () {
    var d = this.renderQueue.dequeue(),
        s = this.cellSize,
        args;
    
    while (d) {
        args = [d.x * s, d.y * s, s, s];
        
        // Fill if needed
        this.ctx.fillStyle = d.color || "#fff";

        this.ctx.strokeRect.apply(this.ctx, args);
        this.ctx.fillRect.apply(this.ctx, args);

        d = this.renderQueue.dequeue();
    }
};

Grid.prototype.renderBaseGrid = function () {
    var x,
        y,
        length = this.grid.length,
        i = length,
        k = length,
        s = this.cellSize;

    this.ctx.strokeStyle = "#ccc";
    this.ctx.fillStyle = "#fff";

    // Draw grid to root canvas
    while (i--) {
        x = i * s;

        while (k--) {
            y = k * s;

            this.ctx.strokeRect(x, y, s, s);
            this.ctx.fillRect(x, y, s, s);
        }

        k = length;
    }
};
