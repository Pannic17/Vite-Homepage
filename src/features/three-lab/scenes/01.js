import * as THREE from 'three';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {
let orbit;

let scene, camera, renderer, obj;

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    orbit = init.control;
    runtime.mountCanvas(renderer);

    camera.position.z = 3;
    initLight(scene);

    const loader = runtime.gltfLoader();
    loader.load(
        '/model/eevee.gltf',
        function (gltf) {
            obj = gltf.scene.children[2];
            obj.position.y = -1;
            scene.add(obj);
            animate();
        },
        undefined,
        runtime.fail
    );
}

const animate = function () {
    obj.rotation.z += 0.01;
    orbit.update();
    renderer.render(scene, camera);
    runtime.frame(animate);
};

function initLight (){
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0 , 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0,200,100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
}

    runtime.use(() => ({scene, camera, renderer, controls: orbit}));
    initThree();
    runtime.resize();
}
