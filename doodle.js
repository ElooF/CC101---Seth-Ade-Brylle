let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img   : null,
    x     : doodlerX,
    y     : doodlerY,
    width : doodlerWidth,
    height: doodlerHeight
}

let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.3;

let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let GameOver = false;
let isOnPlatform = false;
let currentPlatform = null;

let bgMusic;
let audioContext;
let dingSound;
let musicStarted = false;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    bgMusic = new Audio('music/bgm.mp3'); 
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    doodlerRightImg = new Image();
    doodlerRightImg.src = "static/seth.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "static/seth1.png";

    platformImg = new Image();
    platformImg.src = "static/darkblueplat.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", function(e) {
        velocityX = 0;
    });
}

function update() {
    requestAnimationFrame(update);
    if (GameOver) {
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight);

    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }   
    
    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > boardHeight) {
        GameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    isOnPlatform = false;
    currentPlatform = null;
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (detectCollision(doodler, platform)) {
            isOnPlatform = true;
            currentPlatform = platform;
            if (velocityY >= 0) {
                velocityY = initialVelocityY;
                playDingSound();
            }
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    if (!isOnPlatform && velocityY < 0 && doodler.y < boardHeight*3/4) {
        for (let i = 0; i < platformArray.length; i++) {
            if (platformArray[i] !== currentPlatform) {
                platformArray[i].y -= initialVelocityY;
            }
        }
    }

    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        if (platformArray[0] !== currentPlatform) {
            platformArray.shift();
            newPlatforms();
        } else {
            break;
        }
    }

    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (GameOver) {
        context.fillText("Game Over: Press 'Space' to Restart" , boardWidth / 7, boardHeight * 7/8);
    } else if (!musicStarted) {
        context.fillText("Press any key to start music" , boardWidth / 7, boardHeight * 7/8);
    }
}

function moveDoodler(e) {
    if (!musicStarted) {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
        musicStarted = true;
    }

    if(e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 3;
        doodler.img = doodlerRightImg;
    }
    else if(e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -3;
        doodler.img = doodlerLeftImg;
    }
    else if(e.code == "Space" && GameOver) {
    doodler = {
        img   : doodlerRightImg,
        x     : doodlerX,
        y     : doodlerY,
        width : doodlerWidth,
        height: doodlerHeight
    }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        GameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    let platform = {
        img   : platformImg,
        x     : boardWidth / 2,
        y     : boardHeight - 50,
        width : platformWidth,
        height: platformHeight
    }
    
    platformArray.push(platform);


        for (let i = 0; i < 6; i++) {
            let randomX = Math.floor(Math.random() * boardWidth*3/4); 
            let platform = {
            img   : platformImg,
            x     : randomX,
            y     : boardHeight - 75*i - 150,
            width : platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatforms() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); 
            let platform = {
            img   : platformImg,
            x     : randomX,
            y     : -platformHeight,
            width : platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
    }
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function playDingSound() {
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); 
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

    function updateScore() {
        let points = Math.floor(50*Math.random());
        if (velocityY < 0) { 
            maxScore += points;
            if (score < maxScore) {
                score = maxScore;
            }   
        } else if (velocityY >= 0 ) {
            maxScore -= points;
    }
}