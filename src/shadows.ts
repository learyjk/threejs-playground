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
 * Objects
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -3;
sphere.castShadow = true;

// Box
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
box.position.x = 0;
box.castShadow = true;

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 3;
torus.castShadow = true;

// Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -1;

ground.receiveShadow = true;

scene.add(sphere, box, torus, ground);

// Directional Light
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.x = 3;
directionalLight.position.y = 3;
directionalLight.position.z = 3;

directionalLight.castShadow = true;
// make directionLight look at the torus
directionalLight.target = box;

gui.add(directionalLight, "intensity").min(0).max(100).step(0.01);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.01);

// Improve Look of shadow
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Improve shadow performance
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;

scene.add(directionalLight);

// Directional Light Helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);

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
renderer.shadowMap.enabled = true;

const tick = () => {
  // Update objects
  sphere.rotation.y += 0.01;
  torus.rotation.y += 0.01;
  box.rotation.y += 0.01;

  sphere.rotation.x += 0.01;
  torus.rotation.x += 0.01;
  box.rotation.x += 0.01;

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
