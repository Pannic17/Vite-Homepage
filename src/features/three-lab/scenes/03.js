import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {

let scene, camera, renderer, control, composer, object;

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    runtime.mountCanvas(renderer);
    control = init.control;

    camera.position.z = 400;
    object = new THREE.Object3D();
    scene.add(object);

    const geometry = new THREE.SphereGeometry(1, 4, 4);
    const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});
    for (let i = 0; i < 100; i++){
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 400);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        object.add(mesh);
    }
    scene.add(new THREE.AmbientLight(0x222222));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const effect1 = new ShaderPass(DotScreenShader);
    effect1.uniforms.scale.value = 4;
    composer.addPass(effect1);

    const effect2 = new ShaderPass(RGBShiftShader);
    effect2.uniforms.amount.value = 0.0015;
    effect2.renderToScreen = true;
    composer.addPass(effect2);

    animate();
}

const animate = function () {
    runtime.frame(animate);
    object.rotation.x += 0.005;
    object.rotation.y += 0.01;
    control.update();
    composer.render();
}

    runtime.use(() => ({scene, camera, renderer, composer, controls: control}));
    initThree();
    runtime.resize();
}
