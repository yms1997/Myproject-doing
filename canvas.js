const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameBtn = document.querySelector('#start');

// 기본셋팅
let x = canvas.width / 2;
let y = canvas.height - 20;
let ballRadius = 10;
let dx = 1;
let dy = -1;
let ballSpeed = 1;
// paddle(밑에 움직이는 막대기같은거)
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
// key(event)
let key = {"ArrowRight": false, "ArrowLeft": false};
// 벽돌
let brickRowCount = 0; // 열 수
let brickColumnCount = 0; // 횡 수
let brickWidth = 75; // 벽돌 너비
let brickHeight = 20; // 벽돌 높이
let brickPadding = 10; // 벽돌 사이 간격
let brickOffsetTop = 30; // 캔버스 모서리 안닿게
let brinckoffsetLeft = 20; // 캔버스 모서리 안닿게
// 스코어 및 생명
let score = 0;
let lives = 3;
// 벽돌관리
let bricks = [];
// 타이머 
let game = null; 

// 난이도
let difficulty = "easy";
document.getElementById('difficulty').addEventListener('change', function(event) {
  difficulty = event.target.value;
  console.log(difficulty)
  applydifficulty();
})

function applydifficulty(){
  switch(difficulty){
    case "easy":
      // 벽돌
      brickRowCount = 1;
      brickColumnCount = 1;
      // 생명
      lives = 5;
      // 페달
      paddleWidth = 200;
      // 공
      ballSpeed = 1;
      break;
    case "hard":
      // 벽돌
      brickRowCount = 7;
      brickColumnCount = 9;
      // 생명
      lives = 1;
      // 페달
      paddleWidth = 50;
      // 공
      ballSpeed = 3;
      break;
    default:
      // 벽돌
      brickRowCount = 5;
      brickColumnCount = 9;
      ballSpeed = 1.5;
  }
  
  createBricks(brickColumnCount , brickRowCount);
}

function reset(){
  x = canvas.width / 2;
  y = canvas.height - 20;
  ballRadius = 10;
  dx = 1;
  dy = -1;
  ballSpeed = 1;
  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width - paddleWidth) / 2;
  key = {"ArrowRight": false, "ArrowLeft": false};
  brickRowCount = 0;
  brickColumnCount = 0;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brinckoffsetLeft = 20;
  score = 0;
  lives = 3;
  bricks = [];
  game = null; 
}

function createBricks(brickColumnCount , brickRowCount){
  for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
      bricks[c][r] = {x : 0, y : 0, status : 1};
    }
  }
}

function drawScore(){
  ctx.font = '16px Arilal';
  ctx.fillStyle = '#0095DD';
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives(){
  ctx.font = '16px Arilal';
  ctx.fillStyle = '#0095DD';
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function mouseMoveHandler(event){
  let relativeX = event.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width){
    paddleX = relativeX - paddleWidth / 2;
  }
}


function drawBricks(){
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      if(bricks[c][r].status === 1){
        let brickX = (c * (brickWidth + brickPadding)) + brinckoffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetction(){
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      // 4가지 조건
      // 공의 x 좌표는 벽돌의 x 좌표보다 커야 한다.
      // 공의 x 좌표는 벽돌의 x 좌표 + 가로 길이보다 작아야 한다.
      // 공의 y 좌표는 벽돌의 y 좌표보다 커야 한다.
      // 공의 y좌표는 벽돌의 y 좌표 + 높이보다 작아야 한다.
      let b = bricks[c][r];
      if(b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
        dy = -dy;
        b.status = 0;
        score++;
      }
    }
  }
}

function keyHandler(e, value){
  if(key[e.key] !== undefined){
    key[e.key] = value;
  }
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#222222';
  ctx.fill();
  ctx.closePath();
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.closePath();
}
function draw(){
  gameBtn.style.display = 'none';
  canvas.style.opacity = 1;
  // canvas.style.cursor = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetction();

  // 공튀기기 체크
  if(y + dy < ballRadius){
    dy = -dy;
  } else if(y + dy > canvas.height - ballRadius){ // 바닥에 닿았을때
    lives--;
    if(!lives){
      drawLives();
      alert("GAME OVER");
      document.location.reload();
    }
    else{
      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = 1;
      dy = -1;
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  } else if(y + dy > canvas.height - ballRadius - paddleHeight && x + dx > paddleX && x + dx < paddleX + paddleWidth){
    dy = -dy; // 페달에 닿앗을때 다시 팅기기
  }
  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
    dx = -dx;
  }

  if(score === brickColumnCount * brickRowCount){
    alert("YOU WIN, CONGRATURATIONS!");
    clearInterval(game);
    // document.location.reload();
    canvas.style.opacity = 0;
    gameBtn.style.display = "block";
    gameBtn.innerText = "다시하기";
    gameBtn.addEventListener('click', () => {
      reset();
      applydifficulty();
    })
  }

  // 키 체크
  if(key.ArrowRight && paddleX < canvas.width - paddleWidth){
    paddleX += 7;
  }
  if(key.ArrowLeft && paddleX > 0){
    paddleX -= 7;
  }
  x += dx * (ballSpeed + 0.15 * score);
  y += dy * (ballSpeed + 0.15 * score);
}
document.addEventListener("keydown", e => keyHandler(e, true));
document.addEventListener("keyup", e => keyHandler(e, false));
document.addEventListener("mousemove", mouseMoveHandler, false);

gameBtn.addEventListener('click', e => {
  game = setInterval(draw, 10);
  applydifficulty();
})