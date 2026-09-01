let pause = false;

let snakeSlice;
let tail;
let head;
let mode;
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
const modeSelect = document.querySelector('.mode-select');
const title = document.querySelector("h1");
const title2 = document.querySelector(".title2");
const infos = document.querySelector(".flex");
const gameArea = document.querySelector('#game');
const graph = document.querySelector('.grid');
const bar = document.querySelector('.progress span');
const cells = [];
const levels = [];
const game = {
    width: 900,
    height: 600,
    columns: 53,
    rows: 7,
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
    collision: false,
    total: 0,
};

const buildGraph = () => {
    for (let i = 0; i < game.columns * game.rows; i++) {
        const cell = document.createElement('div');
        cell.setAttribute('class', 'cell');
        graph.appendChild(cell);
        cells.push(cell);
        levels.push(0);
    }
}

const fillGraph = () => {
    apple.total = 0;
    for (let i = 0; i < levels.length; i++) {
        const random = Math.random();
        if (random < 0.45) { levels[i] = 0; }
        else if (random < 0.70) { levels[i] = 1; }
        else if (random < 0.85) { levels[i] = 2; }
        else if (random < 0.95) { levels[i] = 3; }
        else { levels[i] = 4; }
        if (levels[i] > 0) { apple.total += 1; }
    }
    for (let x = 0; x < snake.length + 2; x++) {
        const index = snake.y * game.columns + x;
        if (levels[index] > 0) {
            levels[index] = 0;
            apple.total -= 1;
        }
    }
}

const setMode = () => {
    mode = modeSelect.value;
    if (mode === 'github') {
        document.body.setAttribute('class', 'github');
        game.width = game.columns;
        game.height = game.rows;
        snake.size = 1;
        snake.y = Math.floor(game.rows / 2);
        fillGraph();
        render();
    } else {
        document.body.setAttribute('class', '');
        game.width = 900;
        game.height = 600;
        snake.size = snakeSize;
        snake.y = game.height / 2;
    }
    snake.x = 0;
}

const snakeBody = () => {
    for (let i = 0; i < snake.length; i++) {
        snake.body.push({ x: snake.size * i, y: snake.y, snakeSlice });
    }
    if (mode === 'github') return;
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
        if (mode !== 'github') {
            tail.snakeSlice = document.createElement("div");
            tail.snakeSlice.setAttribute('class', 'snake');
            gameArea.appendChild(tail.snakeSlice);
        }
        snake.length += 1;
        apple.collision = false;
    }
    snake.body.push(tail);
}


const checkCollisions = () => {
    if (mode === 'github') {
        if (snake.x >= 0 && snake.x < game.columns && snake.y >= 0 && snake.y < game.rows && levels[snake.y * game.columns + snake.x] >0) {
        audio.eat.play();
        levels[snake.y * game.columns + snake.x] = 0;
        ++scoreValue;
        apple.collision = true;} else if (snake.x < 0 || (snake.x + snake.size) > game.width || snake.y < 0 || (snake.y + snake.size)>game.width || snake.y < 0 || (snake.y + snake.size) > game.height) {
            gameOver();
        }
    }
    else if (((snake.x + snake.size) > apple.x) &&
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
    if (mode === 'github') {
        for  (let i = 0; i < cells.length; i++)
        {
            cells[i].setAttribute('class', 'cell level' + levels[i]);
        }
        for (let i = 0; i < snake.body.length; i++) {
            cells[snake.body[i].y * game.columns + snake.body[i].x].setAttribute('class', 'cell snake');
        }
        if (snake.body.length > 0) {
            head = snake.body[snake.body.length -1];
            cells[head.y * game.columns + head.x].setAttribute('class', 'cell snake head');
        }
        bar.style.width = (scoreValue / apple.total)*100 + '%'
    } else {
    for (let i = 0; i < snake.length; i++) {
        snake.body[i].snakeSlice.style.top = snake.body[i].y + 'px';
        snake.body[i].snakeSlice.style.left = snake.body[i].x + 'px';
    }}
    score.innerHTML = scoreValue;
}

const loop = () => {
    if (!pause) {
        moveSnake();
        checkCollisions();
        if (!pause) render();
    }
}
const addEventListeners = () => {
    window.addEventListener('keydown', init);
    modeSelect.addEventListener('change', setMode);

}

buildGraph();
setMode();
addEventListeners();