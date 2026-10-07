import * as THREE from 'three';

// Adapted from Homepage-Old; its original scene composition is preserved.
export function createScene(runtime) {
let orbit;

let clock, renderer, scene, camera, point;
let portalParticles = [];
let smokeParticles = [];

function initThree (){
    let init = runtime.initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    orbit = init.control;
    runtime.mountCanvas(renderer);
    init.control.enabled = false;

    camera.position.z = 1000;
    camera.far = 10000;
    initBackground();

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,0,1);
    scene.add(light);

    point = new THREE.PointLight(0x062d89,30,350,1.7);
    point.position.set(0,0,250);
    scene.add(point);

    initParticle();
}

function initBackground() {
    scene.background = new THREE.Color(0x040810);
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2600, 1800), new THREE.ShaderMaterial({
        depthWrite: false,
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: 'varying vec2 vUv; void main(){float glow=exp(-5.*dot(vUv-.5,vUv-.5));gl_FragColor=vec4(vec3(.012,.02,.038)+glow*vec3(.018,.027,.04),1.);}'
    }));
    backdrop.position.z = -600;
    scene.add(backdrop);
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - .5) * 2400;
        positions[i + 1] = (Math.random() - .5) * 1600;
        positions[i + 2] = -450;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({
        color:0x6682a5, size:1.5, transparent:true, opacity:.16, depthWrite:false
    })));
}

function featherSmoke(material) {
    // Fade alpha well before the texture reaches the rectangular plane boundary.
    material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
            #include <map_fragment>
            float smokeFade = 1.0 - smoothstep(0.24, 0.5, length(vUv - vec2(0.5)));
            diffuseColor.a *= smokeFade;
        `);
    };
    material.depthWrite = false;
    return material;
}

const initParticle = function (){
    let loader = runtime.textureLoader();
    loader.load("/image/smoke_3.png", function (texture){
        const portalGeo = new THREE.PlaneGeometry(350, 350);
        const portalMaterial = featherSmoke(new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.2
        }));
        for(let p=480; p>240; p--){
            let particle =    new THREE.Mesh(portalGeo, portalMaterial);
            particle.position.set(
                0.7*p*Math.cos((4*p*Math.PI)/180),
                0.7*p*Math.sin((4*p*Math.PI)/180),
                0.1*p
            );
            particle.rotation.z = Math.random()*Math.PI*2;
            portalParticles.push(particle);
            scene.add(particle);
        }

        const smokeGeo = new THREE.PlaneGeometry(1000, 1000);
        const smokeMaterial = featherSmoke(new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.1
        }));

        for(let p=0; p<40; p++){
            let particle =    new THREE.Mesh(smokeGeo, smokeMaterial);
            particle.position.set(
                Math.random()*500-300,
                Math.random()*400-200,
                25
            );
            particle.rotation.z = Math.random()*Math.PI*2;
            smokeParticles.push(particle);
            scene.add(particle);
        }

        clock = new THREE.Clock();
        animate();
    })
}

const animate = function () {
    let delta = Math.min(clock.getDelta(), 0.05);
    portalParticles.forEach(p => {
        p.rotation.z -= delta *1.5;
    });
    smokeParticles.forEach(p => {
        p.rotation.z -= delta *0.2;
    });
    if(Math.random()>0.9){
        point.power = 350 + Math.random()*100;
    }

    renderer.render(scene, camera);
    runtime.frame(animate);
}

    runtime.use(() => ({scene, camera, renderer, controls: orbit}));
    initThree();
    runtime.resize();
}
