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

let gameImage =  {
  thumbnail: allImages[1].folder + allImages[1].thumbnail,
  after: allImages[1].folder + allImages[1].after,
  before: allImages[1].folder + allImages[1].before,
  answer: allImages[1].folder + allImages[1].answer,
}

let clickimage = document.querySelector('.image-click');
let lostImage = document.querySelector('.after');
let loadPicBefore = document.querySelector('.before');

setUp();
loadAllImages(allImages)


let gameStarted = false;
let won = false;

document.querySelector('.start').addEventListener('click', function () {
  let progressBar = document.querySelector('.progress-bar');
  document.querySelector('.start').classList.toggle('start--click');
  loadPicBefore.classList.toggle('before--opacity');
  gameStarted = true;

  loadProgressBar(progressBar);

  clickimage.style.zIndex = "2";
  clickimage.addEventListener('click', checkWonOrLost)
})

document.querySelector('#instructions').addEventListener('click', function () {
  if (won) {
    gameStarted = false;
    resetGame();
  }
})

function loadProgressBar(progressBar) {
  progressBar.classList.toggle('progress-bar__fill');
  window.setTimeout(doneChangingImage, 3000);
};

function getPixelDataOfImg(img, event) {
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  return canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
}

function checkWonOrLost(event) {
  // get the alpha of the part clicked on the picture
  let pixelDataTransparent = getPixelDataOfImg(this, event);
  pixelDataTransparent = pixelDataTransparent[pixelDataTransparent.length-1];

  if (pixelDataTransparent > 0) {
    loadPicBefore.classList.toggle('before--opacity')
    document.querySelector('#instructions').textContent = 'Correct! Tap the here to retry or pick another picture!';
    document.querySelector('.won').style.display = 'flex';
    won = true;
    setArrow(event);
  } else {
    setArrow(event);
    document.querySelector('#instructions').textContent = 'Wrong! try again';
  }
}

function doneChangingImage () {
  if (!won) {
    console.log('called')
    document.querySelector('#instructions').textContent = 'The change is done. Tap a part of picture.';
  }
}

function setUp () {
  clickimage.src = gameImage.answer;
  lostImage.src = gameImage.after;
  loadPicBefore.src = gameImage.before;
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

function resetGame() {
  let progressBar = document.querySelector('.progress-bar');
  if (gameStarted) {
    loadPicBefore.classList.add('before--opacity')
    won = false;
    loadProgressBar(progressBar);

  } else {
    progressBar.classList.remove('progress-bar__fill');
    document.querySelector('.start').classList.remove('start--click');
    loadPicBefore.classList.remove('before--opacity');
    document.querySelector('body').classList.remove("correct");
    document.querySelector('.arrow').style.display = "none";
  }

  document.querySelector('#instructions').textContent = 'Find a part of the picture that changes gradually.';
  document.querySelector('.won').style.display = 'none';
}

function setArrow(event) {
  let arrow = document.querySelector('.arrow');
  if (won) {
    document.querySelector('body').classList.add("correct");
    document.querySelector('body').classList.remove("wrong");
  } else {
    document.querySelector('body').classList.remove("correct");
    document.querySelector('body').classList.add("wrong");
  }

  arrow.style.top = event.offsetY + "px";
  arrow.style.left = event.offsetX + "px";
  arrow.style.display = "block";
}