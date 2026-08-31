let pause = false;

let snakeSlice;
let tail;
let head;
const audio = {
    eat: new Audio('sounds/eat.wav'),
    hurt: new Audio('sounds/hit.wav')
}
const appleSize = snakeSize = 15;
let userSpeed;
let scoreValue = 0;
const score = document.querySelector('.score span');
const score2 = document.querySelector(".score2");
const select = document.querySelector('.custom-select');
const title = document.querySelector("h1");
const title2 = document.querySelector(".title2");
const infos = document.querySelector(".flex");
const gameArea = document.querySelector('#game');

const game = {
    width: 900,
    height: 600,
}

const snake = {
    elem: document.querySelector('.snake'),
    x: 0,
    y: game.height / 2,
    speed: userSpeed,
    direction: 'right',
    size: snakeSize,
    length: 4,
    body: []
};

const apple = {
    elem: document.querySelector('.apple'),
    x: 0,
    y: 0,
    size: appleSize,
    collision: false
};

const snakeBody = () => {
    for (let i = 0; i < snake.length; i++) {
        console.log(snake.y)
        snake.body.push({ x: snakeSize * i, y: snake.y, snakeSlice });
    }
    for (let u = 0; u < snake.length; u++) {
        snake.body[u].snakeSlice = document.createElement("div");
        snake.body[u].snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(snake.body[u].snakeSlice);
    }
}

const snakeDirection = (e) => {
    if (e.which === 38 && snake.direction != 'down') { snake.direction = 'top'; }
    if (e.which === 40 && snake.direction != 'top') { snake.direction = 'down'; }
    if (e.which === 39 && snake.direction != 'left') { snake.direction = 'right'; }
    if (e.which === 37 && snake.direction != 'right') { snake.direction = 'left'; }
    if (e.which === 32) {
        if (!pause) pause = true;
        else pause = false;
    }
}

const moveSnake = () => {
    head = snake.body[snake.length - 1];
    snake.x = head.x;
    snake.y = head.y;
    if (snake.direction === 'top') { snake.y -= snake.size; }
    if (snake.direction === 'down') { snake.y += snake.size; }
    if (snake.direction === 'left') { snake.x -= snake.size; }
    if (snake.direction === 'right') { snake.x += snake.size; }
    if (!apple.collision) {
        tail = snake.body.shift();
        tail.x = snake.x;
        tail.y = snake.y;
    } else {
        tail = { x: snake.x, y: snake.y, snakeSlice };
        tail.snakeSlice = document.createElement("div");
        tail.snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(tail.snakeSlice);
        snake.length += 1;
        apple.collision = false;
    }
    snake.body.push(tail);
}

const checkCollisions = () => {
    if (((snake.x + snake.size) > apple.x) &&
        (snake.x <= (apple.x + apple.size)) &&
        ((snake.y + snake.size) >= apple.y) &&
        (snake.y <= (apple.y + apple.size))) {
        audio.eat.play();
        resetApple();
        ++scoreValue;
        apple.collision = true;
    } else if (snake.x < 0 ||
        (snake.x + snake.size) > game.width ||
        snake.y < 0 ||
        (snake.y + snake.size) > game.height) {
        gameOver();
    }
    for (let i = 0; i < snake.length - 2; i++) {
        if ((snake.x === snake.body[i].x) && (snake.y === snake.body[i].y)) {
            gameOver();
        }
    }
}

const resetApple = () => {
    apple.x = Math.floor(Math.random() * (game.width - apple.size));
    apple.y = Math.floor(Math.random() * (game.height - apple.size));
    console.log(apple.size)
    apple.elem.style.top = apple.y + 'px';
    apple.elem.style.left = apple.x + 'px';
}

const menuDisappear = () => {
    infos.style.opacity = 0;
    title2.innerHTML = "";
    document.querySelector('h3').style.visibility = "hidden";
    title.innerHTML = "";
    score2.innerHTML = "";
}

const gameOver = () => {
    audio.hurt.play();
    pause = true;
    title.innerHTML = "GAME OVER";
    score2.innerHTML = "Score : " + scoreValue;
    title2.innerHTML = "Press any key to start over";
    window.addEventListener('keydown', () => {
        window.location.reload();
    });
}

const init = () => {
    menuDisappear();
    resetApple();
    snakeBody();
    userSpeed = 100 - 20 * (select.value - 1);
    setInterval(loop, userSpeed);
    window.removeEventListener('keydown', init);
    window.addEventListener('keydown', (e) => {
        snakeDirection(e);
    });
}

const render = () => {
    for (let i = 0; i < snake.length; i++) {
        snake.body[i].snakeSlice.style.top = snake.body[i].y + 'px';
        snake.body[i].snakeSlice.style.left = snake.body[i].x + 'px';
    }
    score.innerHTML = scoreValue;
}

const loop = () => {
    if (!pause) {
        moveSnake();
        checkCollisions();
        render();
    }
}

const addEventListeners = () => {
    window.addEventListener('keydown', init);
}

addEventListeners();