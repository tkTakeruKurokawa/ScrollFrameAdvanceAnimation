const FILE_PATH = "./images/";
const NUM_OF_IMAGES = 75; // 画像の枚数
const SWITCH_IMAGE_AMOUNT = 30;
const canvas = document.querySelector("[data-frame-advance-target]");
const ctx =
  canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");

//逃げのグローバルlet変数で失礼します🙏
let imageNames = [];
let images = [];

const drawCanvasImage = (index) => {
  if (!canvas || !ctx) {
    return;
  }
  images[index].then((image) => {
    if (!image) {
      return;
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  });
};

const loadAdditionalImages = (index) => {
  // ここでは現在表示されいる画像の前後20枚ずつ読み込む
  const previousImageIndex = index - 20 >= 0 ? index - 20 : 0;
  const nextImageIndex =
    index + 20 < NUM_OF_IMAGES ? index + 20 : NUM_OF_IMAGES - 1;
  for (let index = previousImageIndex; index <= nextImageIndex; index++) {
    images[index].then((image) => {
      // 既に読み込み済みの場合はとばす
      if (image) {
        return;
      }
      const loadedImage = imageLoad(`${FILE_PATH}${imageNames[index]}`);
      images[index] = loadedImage;
    });
  }
};

const frameAdvanceAnimation = () => {
  const index = Math.floor(window.scrollY / SWITCH_IMAGE_AMOUNT);
  const currentIndex = index >= NUM_OF_IMAGES ? NUM_OF_IMAGES - 1 : index;
  loadAdditionalImages(currentIndex);
  drawCanvasImage(currentIndex);
};

const initializeFrameAdvanceAnimation = () => {
  frameAdvanceAnimation(); // スクロールするまで画像が表示されないためここで一度呼び出す
  window.addEventListener("scroll", frameAdvanceAnimation);
};

const imageLoad = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject();
    };
    image.src = src;
  });
};

const loadInitialImages = () => {
  imageNames = [...Array(NUM_OF_IMAGES)].map((_, index) => `${index + 1}.png`);
  images = imageNames.map(async (imageName, index) => {
    const image =
      index % 2 === 0 ? await imageLoad(`${FILE_PATH}${imageName}`) : undefined;
    return image;
  });
};

loadInitialImages();
initializeFrameAdvanceAnimation();
