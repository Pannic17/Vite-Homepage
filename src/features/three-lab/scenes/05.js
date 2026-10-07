import * as THREE from 'three';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {
let orbit;

let renderer, scene, camera, ambientLight, directionalLight, flash, rain, rainGeo;
let cloudParticle = [];
let defaultColor = new THREE.Color(0x062d89);

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    orbit = init.control;
    runtime.mountCanvas(renderer);
    init.control.enabled = false;

    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    initEnvironment();
    initFlash();
    initRain();
    initParticle();
}

const initEnvironment = function (){
    ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0,0,1);
    scene.add(directionalLight);

    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    renderer.setClearColor(scene.fog.color);
}

const initFlash = function (){
    flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
    flash.position.set(200,300,100);
    scene.add(flash);
}

const initParticle = function (){
    let loader = runtime.textureLoader();
    loader.load("/image/smoke_1.png", function(texture){
        const cloudGeo = new THREE.PlaneGeometry(500,500);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });
        for(let p=0; p<40; p++) {
            let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
            cloud.position.set(
                Math.random()*800 -400,
                500,
                Math.random()*500 - 450
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*Math.PI*2;
            cloud.material.opacity = 0.8;
            cloudParticle.push(cloud);
            scene.add(cloud);
        }
        animate();
    });
}

const initRain = function (){
    const rainDrop = [];
    for(let i=0;i<10000;i++) {
        rainDrop.push(Math.random() * 400 -200)
        rainDrop.push(Math.random() * 500 -250)
        rainDrop.push(Math.random() * 400 -200)
    }
    rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(rainDrop, 3))
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
        depthTest: false
    })
    rain = new THREE.Points(rainGeo, rainMaterial);
    scene.add(rain);
}

const animate = function (){
    cloudParticle.forEach(p => {
        p.rotation.z -=0.005
    });

    const rainPosition = rainGeo.getAttribute('position');
    for (let i=0; i<rainPosition.count;i++){
        let y = rainPosition.getY(i);
        y -= Math.random();
        if (y<-200){
            y = 200;
        }
        rainPosition.setY(i, y);
    }
    rainPosition.needsUpdate = true;

    if(Math.random()>0.93||flash.power>100){
        flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100
        );
        flash.color.set(Math.random() > .8 ? 0xff88cc : defaultColor);
        flash.power = 50 + Math.random() * 500;
    }

    renderer.render(scene, camera);
    runtime.frame(animate);
}

    runtime.use(() => ({scene, camera, renderer, controls: orbit}));
    initThree();
    runtime.resize();
}
