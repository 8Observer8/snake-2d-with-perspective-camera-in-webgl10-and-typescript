
import { ShaderProgram } from "./ShaderProgram";
import { Camera } from "./Camera";

// Playground: https://plnkr.co/edit/532NwXvgR0uS3rpNmIUh?p=preview
// Color Calculator: http://doc.instantreality.org/tools/color_calculator/

let sp: ShaderProgram;
let gl: WebGLRenderingContext;

let interval = 200;
let snake = [];
let food = [];
let snakeDir = { x: 0, y: 1 };

let score = 0;
let hudContext: CanvasRenderingContext2D;

function drawSnake()
{
    sp.Color = [1.0, 1.0, 1.0];
    snake.forEach((element) =>
    {
        sp.DrawRect(element.x, element.y, 1, 1);
    });
}

function drawFood()
{
    sp.Color = [0.5, 0.5, 1.0];
    food.forEach(function (element)
    {
        sp.DrawRect(element.x, element.y, 1, 1);
    });
}

function drawBorders()
{
    // Top
    sp.DrawRect(-1, sp.fieldHeight, sp.fieldWidth + 2, 1);
    // Bottom
    sp.DrawRect(-1, -1, sp.fieldWidth + 1, 1);
    // Left
    sp.DrawRect(-1, -1, 1, sp.fieldHeight + 1);
    // Right
    sp.DrawRect(sp.fieldWidth, -1, 1, sp.fieldHeight + 1);
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
    drawFood();
    drawSnake();
    drawScore();
}

function update()
{
    let newPosX = snake[0].x + snakeDir.x;
    let newPosY = snake[0].y + snakeDir.y;

    snake.unshift({ x: newPosX, y: newPosY });
    snake.pop();

    let headX = snake[0].x;
    let headY = snake[0].y;

    food.forEach((f, index) =>
    {
        if (headX === f.x && headY === f.y)
        {
            snake.push({ x: f.x, y: f.y });
            food.splice(index, 1);
            score++;
        }
    });

    /*
        This value is between 0 and 20. Then we check if the
        value is 0 (which happens with a 5% chance because 100 divided by 20 is 5)
    */
    let r = getRandomInt(20);   // Spawn food with 5% chance
    if (r === 0)
    {
        let x = getRandomInt(sp.fieldWidth);
        let y = getRandomInt(sp.fieldHeight);
        console.log(`New food: (${x}, ${y})`);
        food.push({ x: x, y: y });
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

function onStartGame(button: HTMLButtonElement)
{
    update();
    button.style.visibility = "hidden";
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

    snake.push({ x: sp.fieldWidth / 2, y: 1 });

    gl.clearColor(0.0, 0.1, 0.1, 1.0);

    draw();
    window.onkeydown = keyboard;
    btnStart.onclick = () => { onStartGame(btnStart) };
};
main();