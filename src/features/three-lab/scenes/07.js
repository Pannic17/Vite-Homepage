import * as THREE from 'three';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {

let scene, camera, renderer, control, geometry, material, points, clock;
const parameters = {}
parameters.count = 100000
parameters.size = .01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 1
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    runtime.mountCanvas(renderer);
    control = init.control;

    camera.position.z = 7;
    camera.position.y = 5;

    initGalaxy();
    initMaterial();

    clock = new THREE.Clock();

    animate();
}

function initGalaxy (){
    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) * (Math.PI * 2 / parameters.branches);

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

function initMaterial (){
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

function animate (){
    const elapsedTime = clock.getElapsedTime();
    points.rotation.y = elapsedTime * .1;
    control.update();
    renderer.render(scene, camera);
    runtime.frame(animate);
}

    runtime.use(() => ({scene, camera, renderer, controls: control}));
    initThree();
    runtime.resize();
}
