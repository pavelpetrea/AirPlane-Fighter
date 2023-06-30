let startTime = null;
let timerInterval;
var gameEnded = false;
let positionPc = 230;
const bulletDisplay = document.getElementById("rackets");

document.addEventListener("keydown", function(event) {
  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
  }
});

function closeText() {
  document.getElementById('text-container').style.display = 'none';
}

function startGame() {
  gameEnded = false;
  addItems();
  moveAirplane();
  startTimer();
  setInterval(createRackets, 600);
  let tap = document.getElementById("tap");
  tap.style.display = "none";
}

function addItems() {
  let div = document.getElementById("startGame");
  let airplane = document.getElementById("airplane");
  const scoreDisplay = document.getElementById("record");
  scoreDisplay.style.display = "block";
  bulletDisplay.style.display = "block";
  airplane.style.display = "block";
  div.classList.add("hidden");
}

let currentTime, minutes, seconds, timerElement;
let bulletsNumbers = 0;

function startTimer() {
  if (startTime === null) {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    }
 }

function updateTimer() {
  currentTime = Math.floor((Date.now() - startTime) / 1000);
  minutes = Math.floor(currentTime / 60);
  seconds = currentTime % 60;
  timerElement = document.getElementById("record");
  timerElement.textContent =
  "Your score: " + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

function moveAirplane() {
  const airplane = document.getElementById("airplane");
  positionPc = 230;
      document.addEventListener("keydown", function(event) {
        if (event.key === " " || event.code === "Space") {
          shoot();
        }
      });
      document.addEventListener("keydown", function(event) {  
          if (event.key === "ArrowLeft" && positionPc > 40) {
            positionPc -= 18;
              airplane.style.left = positionPc + "px";
          } else if (event.key === "ArrowRight" && positionPc < 430) {
            positionPc += 18;
              airplane.style.left = positionPc + "px";
        }
     });
  }

  function shoot() {
    if (gameEnded) {
      return;
    }
    const playerBullet = document.createElement("div"); 
    playerBullet.className = "playerBullet";
    playerBullet.style.left = parseInt(getComputedStyle(airplane).left) - 9 + "px";
    playerBullet.style.bottom = 55 +"px";
    playerBullet.style.backgroundImage = 'url("https://pngfre.com/wp-content/uploads/bullet-png-from-pngfre-4.png")';
    playerBullet.style.backgroundSize = "contain";
    document.getElementById("board").appendChild(playerBullet);
    movePlayerBullet(playerBullet);
  }
  
  function movePlayerBullet(playerBullet) {
    const playerBulletInterval = setInterval(() => {
      let top = parseInt(playerBullet.style.bottom);
      top += 14;
      if (top >= 465) {
        clearInterval(playerBulletInterval);
        playerBullet.parentNode.removeChild(playerBullet);
        return;
      }
      playerBullet.style.bottom = top + "px";
      checkCollision(playerBullet);
    }, 50);
  }
  
  function checkCollision(playerBullet) {
    const enemyRackets = document.getElementsByClassName("enemyRackets");
    const bulletRect = playerBullet.getBoundingClientRect();
    for (let i = 0; i < enemyRackets.length; i++) {
      const enemyRacket = enemyRackets[i];
      const enemyRacketRect = enemyRacket.getBoundingClientRect();
      if (intersects(bulletRect, enemyRacketRect)) {
        enemyRacket.style.backgroundImage = 'url("assets/image/nuclear-explosion.png")';
        enemyRacket.style.backgroundSize = "100% 100%";
        playerBullet.parentNode.removeChild(playerBullet);
        ++bulletsNumbers;
        document.getElementById("racketCount").textContent = bulletsNumbers;
        finalGame();
        clearInterval(enemyRacket.moveInterval);
        setTimeout(function() {
          enemyRacket.parentNode.removeChild(enemyRacket);
        }, 110);
        return;
      }
    }
  }
  
  function createRackets() {
    if (gameEnded) {
      return;
    }
    const racket = document.createElement("div");
    racket.className = "enemyRackets";
    racket.style.left = Math.random() * 400 + "px";
    racket.style.top = "0";
    racket.style.backgroundImage = 'url("assets/image/rackets.png")';
    racket.style.backgroundSize = "contain";
    document.getElementById("board").appendChild(racket);
    finalGame();
    racket.moveInterval = setInterval(function() {
      moveRacket(racket);
    }, 50);
  }
  
  function moveRacket(racket) {
    let top = parseInt(racket.style.top);
    if (top >= 440) {
      racket.parentNode.removeChild(racket);
      document.getElementById("racketCount").textContent = bulletsNumbers;
      return;
    }
    if (minutes === 0 && seconds < 30) {
      top += 14;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes === 0 && seconds >= 30) {
      top += 16;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes === 1 && seconds <= 59) {
      top += 18;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes > 1 && seconds <= 59) {
      top += 20;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes > 2 && seconds <= 59) {
      top += 22;
      racket.style.top = top + "px";
      finalGame();
    }
  }
  

function intersects(airplane, racket) {
  const hitZone = 12;
  const airplaneLeft = airplane.left + hitZone;
  const airplaneRight = airplane.right - hitZone;
  const airplaneTop = airplane.top + hitZone;
  const airplaneBottom = airplane.bottom - hitZone;
  return (
    airplaneLeft < racket.right &&
    airplaneRight > racket.left &&
    airplaneTop < racket.bottom &&
    airplaneBottom > racket.top
  );
}


function removeAllItems() {
    const enemyRackets = document.getElementsByClassName("enemyRackets");
    const playerBullet = document.getElementsByClassName("playerBullet");
  while (playerBullet.length > 0) {
    playerBullet[0].parentNode.removeChild(playerBullet[0]);
  }
  while (enemyRackets.length > 0) {
    enemyRackets[0].parentNode.removeChild(enemyRackets[0]);
  }
}

function finalGame() {
  const rackets = document.getElementsByClassName("enemyRackets");
  const airplane = document.getElementById("airplane");
  const airplaneRect = airplane.getBoundingClientRect();
  const refresh = document.getElementById("refreshPage");
  const enemyRacket = document.getElementById("rackets");
  const explosion = document.getElementById("explosion");
  for (let i = 0; i < rackets.length; i++) {
    const racketRect = rackets[i].getBoundingClientRect();
    if (intersects(airplaneRect, racketRect)) {
      explosion.style.left = airplane.style.left;
      airplane.style.display = "none";
      explosion.style.display = "block";
      clearInterval(airplane.moveInterval); 
      setTimeout(function() {
        explosion.style.display = "none";
        refresh.style.display = "block";
        finalScore.style.display = "block";
      }, 170);
      let finalScore = document.getElementById("finalScore");
      finalScore.textContent = bulletsNumbers + " rackets destroyed";
      clearInterval(timerInterval);
      startTime = null;
      gameEnded = true;
      enemyRacket.style.display = "none";
      removeAllItems();
      break;
    }
  }
}

  function restartGame() {
    removeAllItems();
    const finalScore = document.getElementById("finalScore");
    const refresh = document.getElementById("refreshPage");
    finalScore.style.display = "none";
    refresh.style.display = "none";
    bulletsNumbers = 0;
    document.getElementById("racketCount").textContent = bulletsNumbers;
    startTime = null;
    clearInterval(timerInterval);
    startTimer();
    updateTimer();
    addItems();
    document.getElementById("airplane").style.left = 230 + "px";
    positionPc = 230;
    gameEnded = false;
}

if (window.matchMedia("(max-width: 767px)").matches) {
  let positionMobile = 157;
  function startGame() {
    document.getElementById("left").style.display = "block";
    document.getElementById("right").style.display = "block";
    document.getElementById("shoot").style.display = "block";
    gameEnded = false;
    addItems();
    moveAirplane();
    startTimer();
    let tap = document.getElementById("tap");
    tap.style.display = "none";
    setInterval(createRackets, 600);
    setInterval(moveRackets, 50);
  }
  
  function moveAirplane() {
    const airplane = document.getElementById("airplane");
    positionMobile = 157;
    let space = document.getElementById('shoot');
    let leftButton = document.getElementById('left');
    let rightButton = document.getElementById('right');
    leftButton.addEventListener('click',function() {
      if (positionMobile > 38) {
        positionMobile -= 17.8;
          airplane.style.left = positionMobile + "px";
        } 
    });    
    leftButton.addEventListener("dblclick", function(event) {
      event.preventDefault();
    });
    rightButton.addEventListener('click', function() {
            if (positionMobile < 286) {
              positionMobile += 17.8;
                airplane.style.left = positionMobile + "px";
              }
        });
        rightButton.addEventListener("dblclick", function(event) {
          event.preventDefault();
        });
        space.addEventListener('click', function() {
          shoot();
        });
        space.addEventListener("dblclick", function(event) {
          event.preventDefault();
        });
    }

  function shoot() {
    if (gameEnded) {
      return;
    }
    const playerBullet = document.createElement("div"); 
    playerBullet.className = "playerBullet";
    playerBullet.style.left = parseInt(getComputedStyle(airplane).left) - 9 + "px";
    playerBullet.style.bottom = 50 +"px";
    playerBullet.style.backgroundImage = 'url("https://pngfre.com/wp-content/uploads/bullet-png-from-pngfre-4.png")';
    playerBullet.style.backgroundSize = "contain";
    document.getElementById("board").appendChild(playerBullet);
    movePlayerBullet(playerBullet);
  }

  function checkCollision(playerBullet) {
    const enemyRackets = document.getElementsByClassName("enemyRackets");
    const bulletRect = playerBullet.getBoundingClientRect();
    for (let i = 0; i < enemyRackets.length; i++) {
      const enemyRacket = enemyRackets[i];
      const enemyRacketRect = enemyRacket.getBoundingClientRect();
      if (intersects(bulletRect, enemyRacketRect)) {
        enemyRacket.style.backgroundImage = 'url("assets/image/nuclear-explosion.png")';
        enemyRacket.style.backgroundSize = "100% 100%";
        playerBullet.parentNode.removeChild(playerBullet);
        ++bulletsNumbers;
        document.getElementById("racketCount").textContent = bulletsNumbers;
        finalGame();
        clearInterval(enemyRacket.moveInterval);
        setTimeout(function() {
          enemyRacket.parentNode.removeChild(enemyRacket);
        }, 110);
        return;
      }
    }
  }
  
  function createRackets() {
    if (gameEnded) {
      return;
    }
    const racket = document.createElement("div");
    racket.className = "enemyRackets";
    racket.style.left = Math.random() * 290 + "px";
    racket.style.top = "0";
    racket.style.backgroundImage = 'url("assets/image/rackets.png")';
    racket.style.backgroundSize = "contain";
    document.getElementById("board").appendChild(racket);
    finalGame();
    racket.moveInterval = setInterval(function() {
      moveRacket(racket);
    }, 50);
  }
  
  function moveRacket(racket) {
    let top = parseInt(racket.style.top);
    if (top >= 337) {
      racket.parentNode.removeChild(racket);
      document.getElementById("racketCount").textContent = bulletsNumbers;
      return;
    }
    if (minutes === 0 && seconds < 30) {
      top += 11;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes === 0 && seconds >= 30) {
      top += 12;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes === 1 && seconds <= 59) {
      top += 13;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes > 1 && seconds <= 59) {
      top += 14;
      racket.style.top = top + "px";
      finalGame();
    } else if (minutes > 2 && seconds <= 59) {
      top += 15;
      racket.style.top = top + "px";
      finalGame();
    }
  }

  function movePlayerBullet(playerBullet) {
    const playerBulletInterval = setInterval(() => {
      let top = parseInt(playerBullet.style.bottom);
      top += 14;
      if (top >= 358) {
        clearInterval(playerBulletInterval);
        playerBullet.parentNode.removeChild(playerBullet);
        return;
      }
      playerBullet.style.bottom = top + "px";
      checkCollision(playerBullet);
    }, 50);
  }

  function finalGame() {
    const rackets = document.getElementsByClassName("enemyRackets");
    const airplane = document.getElementById("airplane");
    const airplaneRect = airplane.getBoundingClientRect();
    const refresh = document.getElementById("refreshPage");
    const enemyRacket = document.getElementById("rackets");
    const explosion = document.getElementById("explosion");
    for (let i = 0; i < rackets.length; i++) {
      const racketRect = rackets[i].getBoundingClientRect();
      if (intersects(airplaneRect, racketRect)) {
        explosion.style.left = airplane.style.left;
        airplane.style.display = "none";
        explosion.style.display = "block";
        clearInterval(airplane.moveInterval); 
        setTimeout(function() {
          explosion.style.display = "none";
          refresh.style.display = "block";
          finalScore.style.display = "block";
        }, 170);
        let finalScore = document.getElementById("finalScore");
        finalScore.textContent = bulletsNumbers + " rackets destroyed";
        clearInterval(timerInterval);
        startTime = null;
        gameEnded = true;
        enemyRacket.style.display = "none";
        removeAllItems();
        break;
      }
    }
  }

  function restartGame() {
    document.getElementById("airplane").style.left = 164 + "px";
    document.getElementById("left").style.display = "block";
    document.getElementById("right").style.display = "block";
    document.getElementById("shoot").style.display = "block";
    gameEnded = false;
    const finalScore = document.getElementById("finalScore");
    const refresh = document.getElementById("refreshPage");
    finalScore.style.display = "none";
    refresh.style.display = "none";
    bulletsNumbers = 0;
    document.getElementById("racketCount").textContent = bulletsNumbers;
    startTime = null;
    clearInterval(timerInterval);
    startTimer();
    updateTimer();
    addItems();
    positionMobile = 157
    moveRackets();
    removeAllItems();
  }
}