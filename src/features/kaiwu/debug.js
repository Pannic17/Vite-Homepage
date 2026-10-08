import * as THREE from 'three';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {disposeObject3D} from '../../three/dispose';
import {localizeGui} from '../../utils/localizeGui.js';

// Only instantiated for debug=1. All controls operate on this viewer's resources.
export function createDebug({container,renderer,scene,camera,controls,ambient,object,environment,mappings,playback,setPlaying,schedule}) {
  const gui=new GUI({container,title:'Three.js Debug'});
  gui.domElement.classList.add('kaiwu-debug');
  gui.onChange(schedule);
  const folder=name=>gui.addFolder(name).close();
  const number=(group,target,key,min,max,step=0.01)=>group.add(target,key,min,max,step);
  const vector=(group,target,change=()=>{})=>{
    for(const axis of ['x','y','z'])group.add(target,axis).listen().onChange(change);
  };
  const materials=new Set();
  object.traverse(node=>{for(const material of [node.material].flat())if(material)materials.add(material);});
  const recompile=()=>{materials.forEach(material=>{material.needsUpdate=true;});schedule();};

  const rendering=folder('Rendering');
  rendering.add(renderer,'toneMapping',mappings).name('Tone mapping').onChange(recompile);
  number(rendering,renderer,'toneMappingExposure',0,10).name('Exposure');
  rendering.add(renderer,'outputEncoding',{Linear:THREE.LinearEncoding,sRGB:THREE.sRGBEncoding}).name('Output encoding').onChange(recompile);
  rendering.add(renderer,'physicallyCorrectLights').name('Physical lights').onChange(recompile);
  const settings={pixelRatio:renderer.getPixelRatio(),environment:true,background:'Image / transparent',backgroundColor:'#171717'};
  number(rendering,settings,'pixelRatio',0.5,Math.max(3,window.devicePixelRatio||1),0.25).name('Pixel ratio').onChange(value=>renderer.setPixelRatio(value));

  const lighting=folder('Environment & lighting');
  lighting.add(settings,'environment').name('HDR lighting').onChange(value=>{scene.environment=value?environment:null;});
  const background=()=>{scene.background=settings.background==='HDR'?environment:settings.background==='Solid color'?new THREE.Color(settings.backgroundColor):null;};
  lighting.add(settings,'background',['Image / transparent','Solid color','HDR']).name('Background').onChange(background);
  lighting.addColor(settings,'backgroundColor').name('Background color').onChange(background);
  lighting.add(ambient,'visible').name('Ambient enabled');
  lighting.addColor(ambient,'color').name('Ambient color');
  number(lighting,ambient,'intensity',0,10).name('Ambient intensity');

  const view=folder('Camera');
  const projection=()=>camera.updateProjectionMatrix();
  number(view,camera,'fov',1,120).name('Field of view').listen().onChange(projection);
  const lens={get focalLength(){return camera.getFocalLength();},set focalLength(value){camera.setFocalLength(value);}};
  number(view,lens,'focalLength',1,200).name('Focal length').listen();
  number(view,camera,'zoom',0.1,10).onChange(projection);
  number(view,camera,'near',0.001,10,0.001).onChange(()=>{camera.near=Math.min(camera.near,camera.far-0.001);projection();});
  number(view,camera,'far',10,10000,1).onChange(()=>{camera.far=Math.max(camera.far,camera.near+0.001);projection();});
  vector(view.addFolder('Position'),camera.position,()=>controls.update());
  vector(view.addFolder('Look at'),controls.target,()=>controls.update());
  view.add({reset:()=>controls.reset()},'reset').name('Reset camera');

  const orbit=folder('Orbit controls');
  for(const key of ['enabled','enableRotate','enableZoom','enablePan','enableDamping','autoRotate','screenSpacePanning'])orbit.add(controls,key);
  for(const key of ['rotateSpeed','zoomSpeed','panSpeed','autoRotateSpeed'])number(orbit,controls,key,-10,10);
  number(orbit,controls,'dampingFactor',0.01,1);
  number(orbit,controls,'minDistance',0,100).onChange(value=>{controls.maxDistance=Math.max(value,controls.maxDistance);controls.update();});
  // Infinity is OrbitControls' default; use an editable finite limit in the UI.
  const limits={maxDistance:Number.isFinite(controls.maxDistance)?controls.maxDistance:1000};
  number(orbit,limits,'maxDistance',1,10000,1).onChange(value=>{controls.maxDistance=Math.max(value,controls.minDistance);controls.update();});

  const model=folder('Model');
  model.add(object,'visible');
  model.add(playback,'playing').name('Play').listen().onChange(setPlaying);
  number(model,playback,'speed',-3,3).name('Rotation speed');
  vector(model.addFolder('Position'),object.position);
  const rotation={x:0,y:0,z:0};
  const rotations=model.addFolder('Rotation (degrees)');
  for(const axis of ['x','y','z']){
    Object.defineProperty(rotation,axis,{get:()=>THREE.MathUtils.radToDeg(object.rotation[axis]),set:value=>{object.rotation[axis]=THREE.MathUtils.degToRad(value);},enumerable:true,configurable:true});
    rotations.add(rotation,axis,-360,360,1).listen();
  }
  vector(model.addFolder('Scale'),object.scale);
  const initial={position:object.position.clone(),rotation:object.rotation.clone(),scale:object.scale.clone()};
  model.add({reset:()=>{object.position.copy(initial.position);object.rotation.copy(initial.rotation);object.scale.copy(initial.scale);}},'reset').name('Reset transform');

  const surfaces=folder('Materials');
  let index=0;
  for(const material of materials){
    const group=surfaces.addFolder(`${++index}: ${material.name||material.type}`).close();
    for(const key of ['color','emissive'])if(material[key]?.isColor)group.addColor(material,key);
    for(const key of ['metalness','roughness','opacity','alphaTest'])if(key in material)number(group,material,key,0,1).onChange(recompile);
    for(const key of ['envMapIntensity','emissiveIntensity','aoMapIntensity','lightMapIntensity'])if(key in material)number(group,material,key,0,10);
    for(const key of ['visible','wireframe','transparent','flatShading','depthTest','depthWrite'])if(key in material)group.add(material,key).onChange(recompile);
    group.add(material,'side',{Front:THREE.FrontSide,Back:THREE.BackSide,Double:THREE.DoubleSide}).onChange(recompile);
  }

  const helpers=folder('Helpers');
  const axes=new THREE.AxesHelper(5),grid=new THREE.GridHelper(20,20);
  axes.visible=false;grid.visible=false;scene.add(axes,grid);
  helpers.add(axes,'visible').name('Axes');helpers.add(grid,'visible').name('Grid');
  localizeGui(gui);
  gui.open();
  return {dispose(){gui.destroy();scene.remove(axes,grid);disposeObject3D(axes);disposeObject3D(grid);}};
}
