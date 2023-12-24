import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// const typefaceFont = await fetch("fonts/helvetiker_regular.typeface.json");
// console.log(await typefaceFont.json());

const canvas = document.querySelector(".webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTextureRed = textureLoader.load("/textures/matcaps/red.jpg");
const matcapTextureGreen = textureLoader.load("/textures/matcaps/green.png");
const matcapTextureSnow = textureLoader.load("/textures/matcaps/snow.png");
matcapTextureRed.colorSpace = THREE.SRGBColorSpace;
matcapTextureGreen.colorSpace = THREE.SRGBColorSpace;
matcapTextureSnow.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Happy Holidays", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const textMaterial = new THREE.MeshMatcapMaterial({
    color: "white",
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.center();
  scene.add(text);
});

const donuts: THREE.Mesh<
  THREE.TorusGeometry,
  THREE.MeshMatcapMaterial,
  THREE.Object3DEventMap
>[] = [];
// Donuts
for (let i = 0; i < 100; i++) {
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: Math.random() < 0.5 ? matcapTextureRed : matcapTextureGreen,
  });
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = (Math.random() - 0.5) * 20;
  donut.position.y = (Math.random() - 0.5) * 20;
  donut.position.z = (Math.random() - 0.5) * 20;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  donuts.push(donut);
  scene.add(donut);
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// const axesHelper = new THREE.AxesHelper(2);

scene.add(camera);
// scene.add(axesHelper);

// Controlss
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  // Update objects
  donuts.forEach((donut) => {
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.01;
  });

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
