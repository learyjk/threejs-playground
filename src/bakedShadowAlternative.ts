import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const canvas = document.querySelector(".webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// create gui
const gui = new GUI();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const simpleShadow = textureLoader.load("/textures/shadows/simpleShadow.jpg");
console.log(simpleShadow);

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = 0;

// Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -0.5;

// Sphere Shadow
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: "black",
    side: THREE.DoubleSide,
    transparent: true,
    alphaMap: simpleShadow,
  })
);

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = ground.position.y + 0.01;

// Ambient Light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
scene.add(ambientLight);

scene.add(sphere, ground, sphereShadow);

// Directional Light
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.x = 3;
directionalLight.position.y = 3;
directionalLight.position.z = 3;

gui.add(directionalLight, "intensity").min(0).max(100).step(0.01);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.01);

scene.add(directionalLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
const axesHelper = new THREE.AxesHelper();
scene.add(camera, axesHelper);
camera.position.z = 7;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // Update the shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

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
