const backgroundDirectory = "assets/backgrounds";
const backgroundExtension = "webp";
const maximumBackgrounds = 100;

const stage = document.getElementById("carousel-stage");

const imageExists = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

const findBackgrounds = async () => {
  const sources = [];

  for (let index = 1; index <= maximumBackgrounds; index += 1) {
    const src = `${backgroundDirectory}/beeld${index}.${backgroundExtension}`;

    if (!(await imageExists(src))) {
      break;
    }

    sources.push(src);
  }

  return sources;
};

const preloadImages = (sources) => {
  sources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const createLayer = () => {
  const layer = document.createElement("div");
  layer.className = "carousel__layer";
  stage.appendChild(layer);
  return layer;
};

const getIndexForX = (x, width, total) => {
  const clamped = Math.min(Math.max(0, x), width - 1);
  return Math.min(total - 1, Math.floor(clamped / (width / total)));
};

const initializeCarousel = async () => {
  const images = await findBackgrounds();

  if (!stage || images.length === 0) {
    return;
  }

  preloadImages(images.slice(1));

  const layers = [createLayer(), createLayer()];
  const total = images.length;
  let currentIndex = 0;
  let activeLayer = 0;

  const setIndex = (index) => {
    if (index === currentIndex) {
      return;
    }

    const nextLayer = activeLayer === 0 ? 1 : 0;
    layers[nextLayer].style.backgroundImage = `url("${images[index]}")`;
    layers[nextLayer].classList.add("is-active");
    layers[activeLayer].classList.remove("is-active");
    activeLayer = nextLayer;
    currentIndex = index;
  };

  const updateFromEvent = (event) => {
    if (event.target?.closest?.(".contact")) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const index = getIndexForX(event.clientX - rect.left, rect.width, total);
    setIndex(index);
  };

  layers[0].style.backgroundImage = `url("${images[0]}")`;
  layers[0].classList.add("is-active");

  if (total > 1) {
    stage.addEventListener("pointermove", updateFromEvent);
    stage.addEventListener("pointerdown", updateFromEvent);
  }
};

initializeCarousel();
