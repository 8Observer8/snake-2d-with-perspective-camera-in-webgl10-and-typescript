define(["require", "exports", "./ShaderProgram", "./Camera"], function (require, exports, ShaderProgram_1, Camera_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Playground: https://plnkr.co/edit/532NwXvgR0uS3rpNmIUh?p=preview
    // Color Calculator: http://doc.instantreality.org/tools/color_calculator/
    var sp;
    var gl;
    var interval = 200;
    var snake = [];
    var food = [];
    var snakeDir = { x: 0, y: 1 };
    var score = 0;
    var hudContext;
    function drawSnake() {
        sp.Color = [1.0, 1.0, 1.0];
        snake.forEach(function (element) {
            sp.DrawRect(element.x, element.y, 1, 1);
        });
    }
    function drawFood() {
        sp.Color = [0.5, 0.5, 1.0];
        food.forEach(function (element) {
            sp.DrawRect(element.x, element.y, 1, 1);
        });
    }
    function drawBorders() {
        // Top
        sp.DrawRect(-1, sp.fieldHeight, sp.fieldWidth + 2, 1);
        // Bottom
        sp.DrawRect(-1, -1, sp.fieldWidth + 1, 1);
        // Left
        sp.DrawRect(-1, -1, 1, sp.fieldHeight + 1);
        // Right
        sp.DrawRect(sp.fieldWidth, -1, 1, sp.fieldHeight + 1);
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    function drawScore() {
        hudContext.clearRect(0, 0, hudContext.canvas.width, hudContext.canvas.height);
        hudContext.fillText('Score = ' + score.toString(), 10, 20);
    }
    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawBorders();
        drawFood();
        drawSnake();
        drawScore();
    }
    function update() {
        var newPosX = snake[0].x + snakeDir.x;
        var newPosY = snake[0].y + snakeDir.y;
        snake.unshift({ x: newPosX, y: newPosY });
        snake.pop();
        var headX = snake[0].x;
        var headY = snake[0].y;
        food.forEach(function (f, index) {
            if (headX === f.x && headY === f.y) {
                snake.push({ x: f.x, y: f.y });
                food.splice(index, 1);
                score++;
            }
        });
        /*
            This value is between 0 and 20. Then we check if the
            value is 0 (which happens with a 5% chance because 100 divided by 20 is 5)
        */
        var r = getRandomInt(20); // Spawn food with 5% chance
        if (r === 0) {
            var x = getRandomInt(sp.fieldWidth);
            var y = getRandomInt(sp.fieldHeight);
            console.log("New food: (" + x + ", " + y + ")");
            food.push({ x: x, y: y });
        }
        draw();
        setTimeout(update, interval);
    }
    function keyboard(keyEvent) {
        switch (keyEvent.key) {
            case "w":
            case "ArrowUp":
                snakeDir.x = 0;
                snakeDir.y = 1;
                break;
            case "a":
            case "ArrowLeft":
                snakeDir.x = -1;
                snakeDir.y = 0;
                break;
            case "s":
            case "ArrowDown":
                snakeDir.x = 0;
                snakeDir.y = -1;
                break;
            case "d":
            case "ArrowRight":
                snakeDir.x = 1;
                snakeDir.y = 0;
                break;
            default:
                console.log("This key is not used.");
                break;
        }
    }
    function onStartGame(button) {
        update();
        button.style.visibility = "hidden";
    }
    function setButtonOnCenter(button, canvas) {
        var halfOfButtonWidth = button.offsetWidth / 2;
        var halfOfButtonHeight = button.offsetHeight / 2;
        var halfOfCanvasWidth = canvas.offsetWidth / 2;
        var halfOfCanvasHeight = canvas.offsetHeight / 2;
        var x = canvas.offsetLeft + (halfOfCanvasWidth - halfOfButtonWidth);
        var y = canvas.offsetTop + (halfOfCanvasHeight - halfOfButtonHeight);
        button.style.left = x.toString() + "px";
        button.style.top = y.toString() + "px";
    }
    function setHudOverRenderCanvas(renderCanvas, hudCanvas) {
        hudCanvas.width = 256;
        hudCanvas.height = 256;
        hudCanvas.style.left = renderCanvas.offsetLeft.toString() + 'px';
        hudCanvas.style.top = renderCanvas.offsetTop.toString() + 'px';
    }
    function main() {
        var renderCanvas = document.getElementById("renderCanvas");
        var hudCanvas = document.getElementById("hudCanvas");
        if (renderCanvas === null || hudCanvas === null) {
            console.log("Failed to find a canvas element");
            return;
        }
        setHudOverRenderCanvas(renderCanvas, hudCanvas);
        hudContext = hudCanvas.getContext('2d');
        hudContext.font = '14px serif';
        hudContext.fillStyle = 'white';
        var btnStartName = "startGame";
        var btnStart = document.getElementById(btnStartName);
        setButtonOnCenter(btnStart, renderCanvas);
        sp = new ShaderProgram_1.ShaderProgram(renderCanvas);
        gl = sp.gl;
        var xTarget = sp.fieldWidth / 2;
        var yTarget = sp.fieldHeight / 2;
        var xCameraPos = sp.fieldWidth / 2;
        var yCameraPos = sp.fieldHeight / 2 - 4;
        var camera = new Camera_1.Camera(gl, sp.program, [xCameraPos, yCameraPos, 12], [xTarget, yTarget, 0]);
        snake.push({ x: sp.fieldWidth / 2, y: 1 });
        gl.clearColor(0.0, 0.1, 0.1, 1.0);
        draw();
        window.onkeydown = keyboard;
        btnStart.onclick = function () { onStartGame(btnStart); };
    }
    ;
    main();
});
//# sourceMappingURL=main.js.map