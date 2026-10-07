import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {publicAsset} from '../../utils/publicAsset.js';
import {disposeObject3D} from '../../three/dispose.js';

// One runtime, canvas and resource owner per selected experiment.
export function createRuntime(host, panel, {onReady, onError}) {
  let paused = false;
  let disposed = false, raf = 0, nextFrame, state = () => ({}), observer;
  let loading = false, ready = false;
  const textures = new Set(), roots = new Set(), released = new Set();
  const manager = new THREE.LoadingManager();
  const reportReady = () => {
    if (!disposed && !ready && !loading && host.querySelector('canvas')) { ready = true; onReady(); }
  };
  manager.onStart = () => { loading = true; };
  manager.onLoad = () => { loading = false; reportReady(); };
  manager.onError = url => fail(new Error('Could not load ' + url));
  function fail(error) { if (disposed) return; dispose(); onError(error); }
  function resize() {
    const {renderer, camera, composer, groundReflector} = state();
    if (disposed || !renderer || !camera) return;
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    composer?.setPixelRatio(renderer.getPixelRatio()); composer?.setSize(width, height);
    if (groundReflector) {
      groundReflector.getRenderTarget().setSize(width, height);
      groundReflector.resolution.set(width, height);
    }
  }
  function contextLost(event) { event.preventDefault(); fail(new Error('WebGL context lost')); }
  function mountCanvas(renderer) {
    if (disposed) { renderer.dispose(); return; }
    host.append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    observer = new ResizeObserver(() => { try { resize(); } catch (error) { fail(error); } });
    observer.observe(host); resize();
  }
  function frame(callback) {
    nextFrame = callback;
    if (disposed || paused || document.hidden || raf) return;
    raf = requestAnimationFrame(time => {
      raf = 0;
      if (disposed || paused || document.hidden) return;
      try { callback(time); reportReady(); } catch (error) { fail(error); }
    });
  }
  function visibility() { cancelAnimationFrame(raf); raf = 0; if (!document.hidden && nextFrame) frame(nextFrame); }
  document.addEventListener('visibilitychange', visibility);
  function dispose() {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(raf); observer?.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    const {scene, renderer, composer, controls, gui, groundReflector, targets = []} = state();
    controls?.dispose(); gui?.destroy();
    renderer?.domElement.removeEventListener('webglcontextlost', contextLost);
    for (const pass of composer?.passes || []) pass.dispose?.();
    composer?.dispose(); groundReflector?.getRenderTarget().dispose();
    for (const target of targets) target.dispose();
    disposeObject3D(scene, released);
    for (const root of roots) disposeObject3D(root, released);
    for (const texture of textures) if (!released.has(texture)) texture.dispose();
    scene?.clear(); roots.clear(); textures.clear();
    renderer?.dispose(); renderer?.forceContextLoss(); renderer?.domElement.remove();
    panel.replaceChildren();
  }
  return {
    host, panel, frame, dispose, resize, fail, mountCanvas,
    setPaused(value) { paused = value; cancelAnimationFrame(raf); raf = 0; if (!paused && nextFrame) frame(nextFrame); },
    use(getState) { state = getState; },
    initScene() {
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({antialias:true});
      const camera = new THREE.PerspectiveCamera(45, 1, .01, 10000);
      const control = new OrbitControls(camera, renderer.domElement);
      control.enableDamping = true; control.rotateSpeed = .5;
      return {scene, renderer, camera, control};
    },
    textureLoader() {
      const loader = new THREE.TextureLoader(manager), load = loader.load.bind(loader);
      loader.load = (url, onLoad, onProgress, onFailure) => {
        const texture = load(publicAsset('three-lab/' + url.replace(/^\//, '')), value => {
          if (disposed) { value.dispose(); return; }
          try { onLoad?.(value); } catch (error) { fail(error); }
        }, onProgress, onFailure);
        textures.add(texture); return texture;
      };
      return loader;
    },
    gltfLoader() {
      const loader = new GLTFLoader(manager), load = loader.load.bind(loader);
      loader.load = (url, onLoad, onProgress, onFailure) => load(publicAsset('three-lab/' + url.replace(/^\//, '')), gltf => {
        if (disposed) { for (const root of gltf.scenes) disposeObject3D(root, released); return; }
        for (const root of gltf.scenes) roots.add(root);
        try { onLoad(gltf); } catch (error) { fail(error); }
      }, onProgress, onFailure);
      return loader;
    },
  };
}
