import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {

let camera, scene, renderer;
let cube, sphere, torus, material;

let count = 0, cubeCamera1, cubeCamera2, cubeRenderTarget1, cubeRenderTarget2;

let controls;

function initCanvas() { runtime.mountCanvas(renderer); }

function initThree(){
    const textureLoader = runtime.textureLoader();

    textureLoader.load( '/image/galaxy.jpg', function ( texture ) {

        texture.encoding = THREE.sRGBEncoding;
        texture.mapping = THREE.EquirectangularReflectionMapping;

        init( texture );
        animate();

    } );
}

function init( texture ) {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    initCanvas();

    scene = new THREE.Scene();
    scene.background = texture;

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

    //

    cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget( 256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame
    } );

    cubeCamera1 = new THREE.CubeCamera( 1, 1000, cubeRenderTarget1 );

    cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget( 256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    } );

    cubeCamera2 = new THREE.CubeCamera( 1, 1000, cubeRenderTarget2 );

    //

    material = new THREE.MeshBasicMaterial( {
        envMap: cubeRenderTarget2.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
    } );

    sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 5 ), material );
    scene.add( sphere );

    cube = new THREE.Mesh( new THREE.BoxGeometry( 20, 20, 20 ), material );
    scene.add( cube );

    torus = new THREE.Mesh( new THREE.TorusKnotGeometry( 10, 5, 128, 16 ), material );
    scene.add( torus );

    //

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 60;
    controls.maxDistance = 200;
    controls.autoRotate = true;
    controls.autoRotateSpeed = .5;
    camera.position.set(100, 0, 0);
    controls.update();

}

function animate() {

    runtime.frame(animate);
    render();

}

function render() {

    const time = Date.now();

    cube.position.x = Math.cos( time * 0.001 ) * 30;
    cube.position.y = Math.sin( time * 0.001 ) * 30;
    cube.position.z = Math.sin( time * 0.001 ) * 30;

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    torus.position.x = Math.cos( time * 0.001 + 10 ) * 30;
    torus.position.y = Math.sin( time * 0.001 + 10 ) * 30;
    torus.position.z = Math.sin( time * 0.001 + 10 ) * 30;

    torus.rotation.x += 0.02;
    torus.rotation.y += 0.03;

    controls.update();

    // pingpong

    if ( count % 2 === 0 ) {

        cubeCamera1.update( renderer, scene );
        material.envMap = cubeRenderTarget1.texture;

    } else {

        cubeCamera2.update( renderer, scene );
        material.envMap = cubeRenderTarget2.texture;

    }

    count ++;

    renderer.render( scene, camera );

}

    runtime.use(() => ({scene, camera, renderer, controls, targets: [cubeRenderTarget1, cubeRenderTarget2].filter(Boolean)}));
    initThree();
    runtime.resize();
}
