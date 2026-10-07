import * as THREE from 'three';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {

let scene, camera, renderer, control, model, sphereParticles;

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    runtime.mountCanvas(renderer);
    control = init.control;

    camera.position.z = 2;

    const loader = runtime.gltfLoader();
    loader.load(
        "/model/eevee.gltf",
        function ( gltf ) {
            model = gltf.scene.children[2];
            const modelGeometry = model.geometry;
            const particleTexture = runtime.textureLoader().load('/image/circle.png');
            const modelMaterial = new THREE.PointsMaterial({
                size: 0.08,
                map: particleTexture,
                color: new THREE.Color('#8bffff'),
                opacity: 0.5,
                transparent: true,
                depthTest: false,
                blending: THREE.AdditiveBlending
            });
            const modelParticles = new THREE.Points(modelGeometry, modelMaterial);
            scene.add(modelParticles);
            initSphere();
            initRandom();
            animate();
        })
}

function initSphere (){
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true,
    })
    sphereParticles = new THREE.Points(sphereGeometry, sphereMaterial);
    scene.add(sphereParticles);
}

function initRandom(){
    const count = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count*3);
    for (let i=0;i<count*3;i++){
        positions[i] = Math.random()*2-1;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.01,
        sizeAttenuation: true,
        color: new THREE.Color('#ff88cc'),
        transparent: true,
        depthTest: false
    });
    const randomParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(randomParticles);
}

const animate = function () {
    sphereParticles.rotation.y += 0.5
    control.update();
    renderer.render(scene, camera);
    runtime.frame(animate);
};

    runtime.use(() => ({scene, camera, renderer, controls: control}));
    initThree();
    runtime.resize();
}
