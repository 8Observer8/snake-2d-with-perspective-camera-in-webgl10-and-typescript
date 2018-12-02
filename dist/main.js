define(["require", "exports", "./ShaderProgram", "./Camera"], function (require, exports, ShaderProgram_1, Camera_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Playground: https://plnkr.co/edit/532NwXvgR0uS3rpNmIUh?p=preview
    // Color Calculator: http://doc.instantreality.org/tools/color_calculator/
    var sp;
    var gl;
    var interval = 200;
    var snake = [];
    var food = { x: 1000, y: 1000 };
    var obstacles = [];
    var snakeDir;
    var eatSound = new Audio();
    eatSound.volume = 0.3;
    var loseSound = new Audio();
    loseSound.volume = 0.3;
    var music = new Audio();
    music.volume = 0.2;
    music.loop = true;
    var score = 0;
    var hudContext;
    function drawSnake() {
        sp.Color = [0.635, 0.827, 0.235];
        snake.forEach(function (element) {
            sp.DrawRect(element.x, element.y, 1, 1);
        });
    }
    function drawObstacles() {
        sp.Color = [0.827, 0.556, 0.235];
        obstacles.forEach(function (element) {
            sp.DrawRect(element.x, element.y, 1, 1);
        });
    }
    function drawFood() {
        sp.Color = [0.5, 0.5, 1.0];
        sp.DrawRect(food.x, food.y, 1, 1);
    }
    function drawBorders() {
        sp.Color = [0.827, 0.556, 0.235];
        // Top
        sp.DrawRect(-1, sp.fieldHeight, sp.fieldWidth + 2, 1);
        // Bottom
        sp.DrawRect(-1, -1, sp.fieldWidth + 1, 1);
        // Left
        sp.DrawRect(-1, -1, 1, sp.fieldHeight + 2);
        // Right
        sp.DrawRect(sp.fieldWidth, -1, 1, sp.fieldHeight + 2);
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
        drawObstacles();
        drawFood();
        drawSnake();
        drawScore();
    }
    function isCollision(newPosX, newPosY) {
        if (newPosX < 0 || sp.fieldWidth <= newPosX ||
            newPosY < 0 || sp.fieldHeight <= newPosY) {
            return true;
        }
        if (snake.length !== 1) {
            // Snake with itself
            for (var i = 1; i < snake.length; i++) {
                if (newPosX === snake[i].x && newPosY === snake[i].y) {
                    return true;
                }
            }
        }
        if (newPosX === 3 && newPosY === 3) {
            console.log("he");
        }
        // Snake with obstacles
        for (var i = 0; i < obstacles.length; i++) {
            if (newPosX === obstacles[i].x && newPosY === obstacles[i].y) {
                return true;
            }
        }
        return false;
    }
    function generateFood() {
        var next;
        var x;
        var y;
        do {
            x = getRandomInt(sp.fieldWidth);
            y = getRandomInt(sp.fieldHeight);
            next = false;
            for (var i = 0; i < snake.length; i++) {
                if (x === snake[i].x && y === snake[i].y) {
                    next = true;
                    break;
                }
            }
            if (!next) {
                for (var i = 0; i < obstacles.length; i++) {
                    if (x === obstacles[i].x && y === obstacles[i].y) {
                        next = true;
                        break;
                    }
                }
            }
        } while (next);
        food.x = x;
        food.y = y;
    }
    function update() {
        var newPosX = snake[0].x + snakeDir.x;
        var newPosY = snake[0].y + snakeDir.y;
        if (!isCollision(newPosX, newPosY)) {
            snake.unshift({ x: newPosX, y: newPosY });
            snake.pop();
            var headX = snake[0].x;
            var headY = snake[0].y;
            if (headX === food.x && headY === food.y) {
                snake.push({ x: food.x, y: food.y });
                score++;
                generateFood();
                eatSound.play();
            }
        }
        else {
            startGame();
            loseSound.play();
        }
        draw();
        setTimeout(update, interval);
    }
    function keyboard(keyEvent) {
        switch (keyEvent.key) {
            case "w":
            case "ArrowUp":
                if (snakeDir.y !== -1) {
                    snakeDir.x = 0;
                    snakeDir.y = 1;
                }
                break;
            case "a":
            case "ArrowLeft":
                if (snakeDir.x !== 1) {
                    snakeDir.x = -1;
                    snakeDir.y = 0;
                }
                break;
            case "s":
            case "ArrowDown":
                if (snakeDir.y !== 1) {
                    snakeDir.x = 0;
                    snakeDir.y = -1;
                }
                break;
            case "d":
            case "ArrowRight":
                if (snakeDir.x !== -1) {
                    snakeDir.x = 1;
                    snakeDir.y = 0;
                }
                break;
            default:
                console.log("This key is not used.");
                break;
        }
    }
    function startGame() {
        snakeDir = { x: 0, y: 1 };
        snake = [];
        snake.push({ x: sp.fieldWidth / 2, y: 1 });
        generateFood();
        score = 0;
    }
    function onStartGameButtonClick(button) {
        startGame();
        button.style.visibility = "hidden";
        createObstacles();
        music.play();
        update();
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
    function createObstacles() {
        obstacles.push({ x: 2, y: 3 });
        obstacles.push({ x: 3, y: 3 });
        obstacles.push({ x: 7, y: 7 });
        obstacles.push({ x: 7, y: 8 });
        obstacles.push({ x: 7, y: 9 });
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
        gl.clearColor(0.0, 0.1, 0.1, 1.0);
        // eatSound.src = "https://dl.dropboxusercontent.com/s/m2nnha5awgw4az7/snake_barell.wav";
        // loseSound.src = "https://dl.dropboxusercontent.com/s/5w1nctadil0s8d8/lose.wav";
        // music.src = "https://dl.dropboxusercontent.com/s/p5wsi6vz5814bii/music.wav";
        eatSound.src = "audio/snake_barell.wav";
        loseSound.src = "audio/lose.wav";
        music.src = "audio/music.wav";
        draw();
        window.onkeydown = keyboard;
        btnStart.onclick = function () { onStartGameButtonClick(btnStart); };
    }
    ;
    main();
});
//# sourceMappingURL=main.js.map