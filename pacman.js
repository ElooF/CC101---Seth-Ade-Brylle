let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

let blueGhostImage;
let redGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let scaredGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;
let cherryImage;

let bgMusic;
let audioContext;
let musicStarted = false;

const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls    = new Set();
const foods    = new Set();
const ghosts   = new Set();
const powerUps = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']
let score = 0;
let lives = 3;
let gameOver = false;
let audioPlayed = false;
let powerMode = false;
let powerModeTimer = 0;
let powerModeDuration = 300;
let cherrySpawnTimer = 0;
let cherrySpawnInterval = Math.floor(Math.random() * 600) + 600; 

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    bgMusic = new Audio('music/pacman.mp3'); 
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    loadImages();
    loadMap();
    //console.log(walls.size);
    //console.log(foods.size);
    //console.log(ghosts.size);
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random()*4)];
        ghost.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movePacman);
    document.addEventListener("keydown", playAudio);
}


function loadImages() {
   wallImage = new Image();
    wallImage.src = "images/wall.png";

    blueGhostImage       = new Image();
    blueGhostImage.src   = "images/blueGhost.png";
    redGhostImage        = new Image();
    redGhostImage.src    = "images/redGhost.png";
    orangeGhostImage     = new Image();
    orangeGhostImage.src = "images/orangeGhost.png";
    pinkGhostImage       = new Image();
    pinkGhostImage.src   = "images/pinkGhost.png";
    scaredGhostImage     = new Image();
    scaredGhostImage.src = "images/scaredGhost.png";

    pacmanUpImage        = new Image();
    pacmanUpImage.src    = "images/pacmanUp.png";
    pacmanDownImage      = new Image();
    pacmanDownImage.src  = "images/pacmanDown.png";
    pacmanLeftImage      = new Image();
    pacmanLeftImage.src  = "images/pacmanLeft.png";
    pacmanRightImage     = new Image();
    pacmanRightImage.src = "images/pacmanRight.png";

    cherryImage          = new Image();
    cherryImage.src      = "images/cherry.png";
}

function loadMap () {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c*tileSize;
            const y = r*tileSize;

            if (tileMapChar == 'X') {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'b') {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

function update() {
    if (gameOver) {
        return;
    } else if (!musicStarted) {
        context.fillText("Press any key to start music" , boardWidth / 7, boardHeight * 7/8);
    }

    if (powerMode) {
        powerModeTimer++;
        if (powerModeTimer >= powerModeDuration) {
            powerMode = false;
            powerModeTimer = 0;
            for (let ghost of ghosts.values()) {
                ghost.scared = false;
                ghost.image = ghost.image.replace('scaredGhost', ghost.image.includes('blue') ? 'blueGhost' : ghost.image.includes('red') ? 'redGhost' : ghost.image.includes('orange') ? 'orangeGhost' : 'pinkGhost');
            }
        }
    }

    for (let ghost of ghosts.values()) {
        if (ghost.dead) {
            ghost.respawnTimer++;
            if (ghost.respawnTimer >= 300) { 
                ghost.dead         = false;
                ghost.respawnTimer = 0;
                ghost.x            = ghost.startX;
                ghost.y            = ghost.startY;
                ghost.scared       = false;
                ghost.image        = ghost.scared ? scaredGhostImage : ghost.image;
            }
        }
    }

    cherrySpawnTimer++;
    if (cherrySpawnTimer >= cherrySpawnInterval) {
        spawnCherry();
        cherrySpawnTimer    = 0;
        cherrySpawnInterval = Math.floor(Math.random() * 600) + 600;
    }

    move();
    draw();
    setTimeout(update, 50);
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()) {
        if (!ghost.dead) {
            context.drawImage(ghost.scared ? scaredGhostImage : ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
        }
    }
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    context.fillStyle = 'white';
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
    for (let powerUp of powerUps.values()) {
        context.drawImage(cherryImage, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }

    context.fillStyle = 'white';
    context.font = "14px sans-serif";
    if (gameOver) {
        context.fillText("Game Over: " + String(score), tileSize/2, tileSize/2);
    }
    else {
        context.fillText("x" + String(lives) + " " + String(score), tileSize/2, tileSize/2);
    }
}

function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    if (pacman.x > boardWidth) {
        pacman.x = 0;
    } else if (pacman.x + pacman.width < 0) {
        pacman.x = boardWidth;
    }

    for (let wall of walls.values ()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {
        if (!ghost.dead) {
            if (powerMode && collision(ghost, pacman)) {
                ghost.dead = true;
                score += 200;
                powerModeTimer += 120;
            } else if (!powerMode && collision(ghost, pacman)) {
                lives -= 1;
                if (lives == 0) {
                    gameOver = true;
                    return;
                }
                resetPositions();
            }

            if (ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D') {
                ghost.updateDirection('U');
            }

            ghost.x += ghost.velocityX;
            ghost.y += ghost.velocityY;
            for (let wall of walls.values()) {
                if (collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth) {
                    ghost.x -= ghost.velocityX;
                    ghost.y -= ghost.velocityY;
                    const newDirection = directions[Math.floor(Math.random()*4)];
                    ghost.updateDirection(newDirection);
                }
            }
        }
    }

    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += 10;
            break;
        }
    }
    foods.delete(foodEaten);

    let powerUpEaten = null;
    for (let powerUp of powerUps.values()) {
        if (collision(pacman, powerUp)) {
            powerUpEaten = powerUp;
            score += 100;
            powerMode = true;
            powerModeTimer = 0;
            for (let ghost of ghosts.values()) {
                ghost.scared = true;
            }
            break;
        }
    }
    powerUps.delete(powerUpEaten);

    if(foods.size == 0) {
        loadMap();
        resetPositions();
    }
}

function movePacman (e) {
    if (gameOver) {
        loadMap();
        resetPositions();
        lives    = 3;
        score    = 0;
        gameOver = false;
        update();
        return;
    }

    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection('U');
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection('D');
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection('L');
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection('R');
    }

    if (pacman.direction == 'U') {
        pacman.image = pacmanUpImage;
    }
    else if (pacman.direction == 'D') {
        pacman.image = pacmanDownImage;
    }
    else if (pacman.direction == 'L') {
        pacman.image = pacmanLeftImage;
    }
    else if (pacman.direction == 'R') {
        pacman.image = pacmanRightImage;
    }
}

function playAudio(e) {
    if (!audioPlayed) {
        document.getElementById("bgm").play();
        audioPlayed = true;
        musicStarted = true;
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height && 
           a.y + a.height > b.y;
}

function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        ghost.scared       = false;
        ghost.dead         = false;
        ghost.respawnTimer = 0;
        const newDirection = directions[Math.floor(Math.random()*4)];
        ghost.updateDirection(newDirection);
    }
    powerMode      = false;
    powerModeTimer = 0;
    powerUps.clear();
}

function spawnCherry() {
    const emptyTiles = [];
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];
            if (tileMapChar == ' ') {
                const x = c * tileSize;
                const y = r * tileSize;
                let occupied = false;
                for (let food of foods.values()) {
                    if (food.x == x + 14 && food.y == y + 14) {
                        occupied = true;
                        break;
                    }
                }
                if (!occupied) {
                    emptyTiles.push({x, y});
                }
            }
        }
    }
    if (emptyTiles.length > 0) {
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const cherry = new Block(cherryImage, randomTile.x, randomTile.y, tileSize, tileSize);
        powerUps.add(cherry);
    }
}


class Block {
    constructor(image, x, y, width, height) {
        this.image = image
        this.x     = x;
        this.y     = y;
        this.width = width
        this.height= height

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;

        this.scared = false;
        this.dead   = false;
        this.respawnTimer = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}
