const allImages = [
  {
    folder: 'images/blueredbikini/',
    thumbnail: 'blueredbikini_thumb.jpg',
    answer: 'blueredbikini_answer.png',
    before: 'blueredbikini_before.jpg',
    after: 'blueredbikini_after.jpg',
  },
  {
    folder: 'images/fastfoodclipart/',
    thumbnail: 'fastfoodclipart_thumb.jpg',
    answer: 'fastfoodclipart_answer.png',
    before: 'fastfoodclipart_before.jpg',
    after: 'fastfoodclipart_after.jpg',
  }
];

// keeping the state of the game in an object

let gameImage =  {
  thumbnail: allImages[1].folder + allImages[1].thumbnail,
  after: allImages[1].folder + allImages[1].after,
  before: allImages[1].folder + allImages[1].before,
  answer: allImages[1].folder + allImages[1].answer,
}

// all the images; 3 layers

let transparentImage = document.querySelector('.game__answer');
let gamePicAfter = document.querySelector('.game__after-img');
let gamePicBefore = document.querySelector('.game__before-img');

let gameStartButton = document.querySelector('.game__start');
let gameWonScreen = document.querySelector('.game__won')
let gameMouseCursor = document.querySelector('.game__arrow');
let gameInstructions = document.querySelector('.game__instructions')


setUp();
loadAllImages(allImages)

// some states of the game
let gameStarted = false;
let won = false;

gameStartButton.addEventListener('click', startGame)

gameInstructions.addEventListener('click', function () {
  if (won) {
    gameStarted = false;
    resetGame();
  }
})

function startGame () {
  let progressBar = document.querySelector('.progress-bar');
  gameStartButton.classList.toggle('game__start--click');
  gamePicBefore.classList.toggle('game__before--opacity');
  gameStarted = true;

  loadProgressBar(progressBar);

  transparentImage.style.zIndex = "2";
  transparentImage.addEventListener('click', checkWonOrLost)
}

function loadProgressBar(progressBar) {
  progressBar.classList.toggle('progress-bar__fill');
  window.setTimeout(doneChangingImage, 10000);
};

function getPixelDataOfImg(img, event) {
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  return canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
}

function checkWonOrLost(event) {
  if (gameStarted) {
    let pixelDataTransparent = getPixelDataOfImg(this, event);
    // get the alpha value of the pixel clicked
    pixelDataTransparent = pixelDataTransparent[pixelDataTransparent.length - 1];

    // checks if the user clicked on the hidden answer
    // does something when the user does and doesn't

    if (pixelDataTransparent > 0) {
      gamePicBefore.classList.toggle('game__before--opacity')
      gameInstructions.textContent = 'Correct! Tap the here to retry or pick another picture!';
      gameWonScreen.style.display = 'flex';
      won = true;
      setArrow(event);
    } else {
      let layers = document.querySelector('.game');
      won = false;
      setArrow(event);
      gameInstructions.textContent = 'Wrong! try again';
      // an animation when the user pressed on the wrong spot
      layers.classList.add('shake');
      window.setTimeout(function () {
        layers.classList.remove('shake');
      }, 200);
    }
  }
}

function doneChangingImage () {
  if (!won) {
    gameInstructions.textContent = 'The change is done. Tap a part of picture.';
  }
}

function setUp () {
  transparentImage.src = gameImage.answer;
  gamePicAfter.src = gameImage.after;
  gamePicBefore.src = gameImage.before;
}

function loadAllImages (images) {
  images.forEach(function (currentImage) {
    let createImage = document.createElement('img')
    createImage.src = currentImage.folder + currentImage.thumbnail;
    let appendImages = document.querySelector('.images');

    createImage.addEventListener('click', function () {
      if (gameImage.answer !== currentImage.folder + currentImage.answer) {
        gameImage.answer = currentImage.folder + currentImage.answer;
        gameImage.before = currentImage.folder + currentImage.before;
        gameImage.thumbnail = currentImage.folder + currentImage.thumbnail;
        gameImage.after = currentImage.folder + currentImage.after;
        gameStarted = false;
        setUp();
        resetGame();
      }
    });

    appendImages.appendChild(createImage);
  })
}


// resets the styles back to the initial state
function resetGame() {
  let progressBar = document.querySelector('.progress-bar');
  progressBar.classList.remove('progress-bar__fill');

  gameStartButton.classList.remove('game__start--click');
  gamePicBefore.classList.remove('game__before--opacity');
  document.querySelector('body').classList.remove("correct");
  document.querySelector('body').classList.remove("wrong");
  gameMouseCursor.style.display = "none";
  gameInstructions.textContent = 'Find a part of the picture that changes gradually.';
  
  gameWonScreen.style.display = 'none';
}

function setArrow(event) {
  if (won) {
    document.querySelector('body').classList.add("correct");
    document.querySelector('body').classList.remove("wrong");
  } else {
    document.querySelector('body').classList.add("wrong");
  }

  gameMouseCursor.style.top = event.offsetY + "px";
  gameMouseCursor.style.left = event.offsetX + "px";
  gameMouseCursor.style.display = "block";
}