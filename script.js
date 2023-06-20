window.addEventListener('DOMContentLoaded', (event) => {
  const audio = document.getElementById('background-music');
  audio.play();
});

  let startTime = null;
  let timerInterval;
  var gameEnded = false;
  const bulletDisplay = document.getElementById("bullets");
  
  function startGame() {
    gameEnded = false;
    addItems();
    moveAirplane();
    setInterval(moveBullets, 50);
    setInterval(createBullet, 500);
    startTimer();
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

  let currentTime;
  let minutes;
  let seconds;
  let timerElement;
  
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
    let posLeft = 230;
    let leftButton = document.getElementById('left');
    let rightButton = document.getElementById('right');
    leftButton.addEventListener('click',function() {
      if (posLeft > 35) {
          posLeft -= 18;
          airplane.style.left = posLeft + "px";
        } 
    });    
    rightButton.addEventListener('click', function() {
            if (posLeft < 440) {
                posLeft += 18;
                airplane.style.left = posLeft + "px";
              }
        });  
        document.addEventListener("keydown", function(event) {  
            if (event.key === "ArrowLeft" && posLeft > 40) {
                posLeft -= 18;
                airplane.style.left = posLeft + "px";
            } else if (event.key === "ArrowRight" && posLeft < 430) {
                posLeft += 18;
                airplane.style.left = posLeft + "px";
          }
       });
    }

  let bulletsNumbers = 0;

  function createBullet() {
    if (gameEnded) {
        return;
    }
      const bullet = document.createElement("div");
      bullet.className = "bullet";
      bullet.style.left = Math.random() * 400 + "px";
      bullet.style.top = "0";
      bullet.style.backgroundImage = 'url("https://pngfre.com/wp-content/uploads/bullet-png-from-pngfre-4.png")';
      bullet.style.backgroundSize = "contain";
      document.getElementById("board").appendChild(bullet);
      ++bulletsNumbers;
      finalGame();
  }

  function moveBullets() {
      const bullets = document.getElementsByClassName("bullet");
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            let top = parseInt(bullet.style.top);
            top += 14;
            if (top >= 453) {
                bullet.parentNode.removeChild(bullet);
                document.getElementById("bulletCount").textContent = (bulletsNumbers - 3);
               continue;
            }
          bullet.style.top = top + "px";
      }
  }

function intersects(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function removeAllBullets() {
  const bullets = document.getElementsByClassName("bullet");
  while (bullets.length > 0) {
    bullets[0].parentNode.removeChild(bullets[0]);
  }
}

function finalGame() {
  const bullets = document.getElementsByClassName("bullet");
  const airplane = document.getElementById("airplane");
  const airplaneRect = airplane.getBoundingClientRect();
  for (let i = 0; i < bullets.length; i++) {
    const bulletRect = bullets[i].getBoundingClientRect();
    if (intersects(airplaneRect, bulletRect)) {
      let finalScore = document.getElementById("finalScore");
      finalScore.style.display = "block";
      finalScore.textContent = " Your record: " + (bulletsNumbers - 4) + " bullets ";
      clearInterval(timerInterval);
      airplane.style.display = "none";
      startTime = null;
      gameEnded = true;
      --bulletsNumbers;
      removeAllBullets();
      break;
    }
  }
}