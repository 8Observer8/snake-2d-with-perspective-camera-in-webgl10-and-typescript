
import { ShaderProgram } from "./ShaderProgram";
import { Camera } from "./Camera";

// Playground: https://plnkr.co/edit/532NwXvgR0uS3rpNmIUh?p=preview
// Color Calculator: http://doc.instantreality.org/tools/color_calculator/

let sp: ShaderProgram;
let gl: WebGLRenderingContext;

let interval = 200;
let snake: { x: number, y: number }[] = [];
let food = { x: 1000, y: 1000 };
let obstacles: { x: number, y: number }[] = [];
let snakeDir: { x: number, y: number };

let eatSound: HTMLAudioElement = new Audio();
eatSound.volume = 0.3;
let loseSound: HTMLAudioElement = new Audio();
loseSound.volume = 0.3;
let music: HTMLAudioElement = new Audio();
music.volume = 0.2;
music.loop = true;

let score = 0;
let hudContext: CanvasRenderingContext2D;

function drawSnake()
{
    sp.Color = [0.635, 0.827, 0.235];
    snake.forEach((element) =>
    {
        sp.DrawRect(element.x, element.y, 1, 1);
    });
}

function drawObstacles()
{
    sp.Color = [0.827, 0.556, 0.235];
    obstacles.forEach((element) =>
    {
        sp.DrawRect(element.x, element.y, 1, 1);
    });
}

function drawFood()
{
    sp.Color = [0.5, 0.5, 1.0];
    sp.DrawRect(food.x, food.y, 1, 1);
}

function drawBorders()
{
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

function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function drawScore()
{
    hudContext.clearRect(0, 0, hudContext.canvas.width, hudContext.canvas.height);
    hudContext.fillText('Score = ' + score.toString(), 10, 20);
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawBorders();
    drawObstacles();
    drawFood();
    drawSnake();
    drawScore();
}

function isCollision(newPosX: number, newPosY: number): boolean
{
    if (newPosX < 0 || sp.fieldWidth <= newPosX ||
        newPosY < 0 || sp.fieldHeight <= newPosY)
    {
        return true;
    }

    if (snake.length !== 1)
    {
        // Snake with itself
        for (let i = 1; i < snake.length; i++)
        {
            if (newPosX === snake[i].x && newPosY === snake[i].y)
            {
                return true;
            }
        }
    }

    if (newPosX === 3 && newPosY === 3)
    {
        console.log("he");
    }

    // Snake with obstacles
    for (let i = 0; i < obstacles.length; i++)
    {
        if (newPosX === obstacles[i].x && newPosY === obstacles[i].y)
        {
            return true;
        }
    }

    return false;
}

function generateFood()
{
    let next: boolean;
    let x: number;
    let y: number;

    do
    {
        x = getRandomInt(sp.fieldWidth);
        y = getRandomInt(sp.fieldHeight);
        next = false;
        for (let i = 0; i < snake.length; i++)
        {
            if (x === snake[i].x && y === snake[i].y)
            {
                next = true;
                break;
            }
        }

        if (!next)
        {
            for (let i = 0; i < obstacles.length; i++)
            {
                if (x === obstacles[i].x && y === obstacles[i].y)
                {
                    next = true;
                    break;
                }
            }
        }

    } while (next);

    food.x = x;
    food.y = y;
}

function update()
{
    let newPosX = snake[0].x + snakeDir.x;
    let newPosY = snake[0].y + snakeDir.y;

    if (!isCollision(newPosX, newPosY))
    {
        snake.unshift({ x: newPosX, y: newPosY });
        snake.pop();

        let headX = snake[0].x;
        let headY = snake[0].y;

        if (headX === food.x && headY === food.y)
        {
            snake.push({ x: food.x, y: food.y });
            score++;
            generateFood();
            eatSound.play();
        }
    }
    else
    {
        startGame();
        loseSound.play();
    }

    draw();
    setTimeout(update, interval);
}

function keyboard(keyEvent: KeyboardEvent)
{
    switch (keyEvent.key)
    {
        case "w":
        case "ArrowUp":
            if (snakeDir.y !== -1)
            {
                snakeDir.x = 0;
                snakeDir.y = 1;
            }
            break;
        case "a":
        case "ArrowLeft":
            if (snakeDir.x !== 1)
            {
                snakeDir.x = -1;
                snakeDir.y = 0;
            }
            break;
        case "s":
        case "ArrowDown":
            if (snakeDir.y !== 1)
            {
                snakeDir.x = 0;
                snakeDir.y = -1;
            }
            break;
        case "d":
        case "ArrowRight":
            if (snakeDir.x !== -1)
            {
                snakeDir.x = 1;
                snakeDir.y = 0;
            }
            break;
        default:
            console.log("This key is not used.");
            break;
    }
}

function startGame()
{
    snakeDir = { x: 0, y: 1 };
    snake = [];
    snake.push({ x: sp.fieldWidth / 2, y: 1 });
    generateFood();
    score = 0;
}

function onStartGameButtonClick(button: HTMLButtonElement)
{
    startGame();
    button.style.visibility = "hidden";
    createObstacles();
    music.play();
    update();
}

function setButtonOnCenter(button: HTMLButtonElement, canvas: HTMLCanvasElement)
{
    let halfOfButtonWidth = button.offsetWidth / 2;
    let halfOfButtonHeight = button.offsetHeight / 2;
    let halfOfCanvasWidth = canvas.offsetWidth / 2;
    let halfOfCanvasHeight = canvas.offsetHeight / 2;

    let x = canvas.offsetLeft + (halfOfCanvasWidth - halfOfButtonWidth);
    let y = canvas.offsetTop + (halfOfCanvasHeight - halfOfButtonHeight);
    button.style.left = x.toString() + "px";
    button.style.top = y.toString() + "px";
}

function setHudOverRenderCanvas(renderCanvas: HTMLCanvasElement, hudCanvas: HTMLCanvasElement)
{
    hudCanvas.width = 256;
    hudCanvas.height = 256;
    hudCanvas.style.left = renderCanvas.offsetLeft.toString() + 'px';
    hudCanvas.style.top = renderCanvas.offsetTop.toString() + 'px';
}

function createObstacles()
{
    obstacles.push({ x: 2, y: 3 });
    obstacles.push({ x: 3, y: 3 });

    obstacles.push({ x: 7, y: 7 });
    obstacles.push({ x: 7, y: 8 });
    obstacles.push({ x: 7, y: 9 });
}

function main()
{
    let renderCanvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
    let hudCanvas = <HTMLCanvasElement>document.getElementById("hudCanvas");
    if (renderCanvas === null || hudCanvas === null)
    {
        console.log("Failed to find a canvas element");
        return;
    }
    setHudOverRenderCanvas(renderCanvas, hudCanvas);

    hudContext = hudCanvas.getContext('2d');
    hudContext.font = '14px serif';
    hudContext.fillStyle = 'white';

    let btnStartName = "startGame";
    let btnStart = <HTMLButtonElement>document.getElementById(btnStartName);
    setButtonOnCenter(btnStart, renderCanvas);

    sp = new ShaderProgram(renderCanvas);
    gl = sp.gl;

    let xTarget = sp.fieldWidth / 2;
    let yTarget = sp.fieldHeight / 2;
    let xCameraPos = sp.fieldWidth / 2;
    let yCameraPos = sp.fieldHeight / 2 - 4;
    let camera = new Camera(gl, sp.program, [xCameraPos, yCameraPos, 12], [xTarget, yTarget, 0]);

    gl.clearColor(0.0, 0.1, 0.1, 1.0);

    // eatSound.src = "https://dl.dropboxusercontent.com/s/m2nnha5awgw4az7/snake_barell.wav";
    // loseSound.src = "https://dl.dropboxusercontent.com/s/5w1nctadil0s8d8/lose.wav";
    // music.src = "https://dl.dropboxusercontent.com/s/p5wsi6vz5814bii/music.wav";
    eatSound.src = "audio/snake_barell.wav";
    loseSound.src = "audio/lose.mp3";
    music.src = "audio/music.wav";

    draw();
    window.onkeydown = keyboard;
    btnStart.onclick = () => { onStartGameButtonClick(btnStart) };
};
main();