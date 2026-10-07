import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {
let orbit;

let scene, camera, renderer, composer;
let cloudGeo, cloudMaterial, galaxyTexture;
let cloudParticles = []
let lastFrame = performance.now();

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .6;
    orbit = init.control;
    runtime.mountCanvas(renderer);
    orbit.enabled = false;

    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    initLight();
    initCloud();

    const galaxy = runtime.textureLoader();
    galaxy.load("/image/galaxy.jpg", function (texture){
        galaxyTexture = texture;
        postEffect();
    });

    animate();
}

function initLight (){
    let ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xff8c19);
    directionalLight.position.set(0,0,1);
    scene.add(directionalLight);

    let orangeLight = new THREE.PointLight(0xcc6600,5,450,1.7);
    orangeLight.position.set(200,300,100);
    scene.add(orangeLight);
    let redLight = new THREE.PointLight(0xd8547e,5,450,1.7);
    redLight.position.set(100,300,100);
    scene.add(redLight);
    let blueLight = new THREE.PointLight(0x3677ac,5,450,1.7);
    blueLight.position.set(300,300,200);
    scene.add(blueLight);

    scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    renderer.setClearColor(scene.fog.color);
}

const initCloud = function (){
    const texture = runtime.textureLoader();
    texture.load("/image/smoke_2.png", function(texture){
        cloudGeo = new THREE.PlaneGeometry(500,500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map:texture,
            transparent: true,
            depthTest: false,
            opacity: 0.55
        });

        for(let p=0; p<50; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random()*800 -400,
                500,
                Math.random()*500-500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*2*Math.PI;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
    });
}

const animate = function (time = performance.now()){
    const delta = Math.min(Math.max((time - lastFrame) / 1000, 0), .05);
    lastFrame = time;
    cloudParticles.forEach((cloud, index) => {
        cloud.rotation.z -= delta * (.45 + (index % 3) * .1);
    });
    render();
    runtime.frame(animate);
}

function render() {
    if (composer) composer.render(); else renderer.render(scene,camera);
}

const postEffect = function () {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .65, .3, .85));
    const overlay = new ShaderPass({
        uniforms: {tDiffuse: {value:null}, galaxy: {value:galaxyTexture}, opacity: {value:.2}},
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: 'uniform sampler2D tDiffuse; uniform sampler2D galaxy; uniform float opacity; varying vec2 vUv; void main(){vec4 base=texture2D(tDiffuse,vUv);vec3 layer=texture2D(galaxy,vUv).rgb;gl_FragColor=vec4(mix(base.rgb,min(base.rgb/max(vec3(.001),1.-layer),vec3(1.)),opacity),base.a);}'
    });
    composer.addPass(overlay);
    runtime.resize();
};

    runtime.use(() => ({scene, camera, renderer, composer, controls: orbit}));
    initThree();
    runtime.resize();
}
