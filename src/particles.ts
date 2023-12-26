import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector(".webgl") as HTMLCanvasElement;

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Color Texture
const colorTexture = textureLoader.load("textures/particles/11.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;

// Scene
const scene = new THREE.Scene();

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// Material
const material = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: "salmon",
  alphaMap: colorTexture,
  transparent: true,
  alphaTest: 0.001,
});

// Points
const particles = new THREE.Points(particlesGeometry, material);
scene.add(particles);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
const axesHelper = new THREE.AxesHelper(2);
scene.add(camera, axesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  // Render
  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement;

  if (!fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
