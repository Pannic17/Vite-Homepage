// English labels match the existing panels; names of APIs and model assets stay literal.
const labels = [
  ['Three.js Debug', 'Three.js 调试', 'Depuración de Three.js'],
  ['Rendering', '渲染', 'Renderizado'], ['Tone mapping', '色调映射', 'Mapeo de tonos'],
  ['Exposure', '曝光', 'Exposición'], ['Output encoding', '输出编码', 'Codificación de salida'],
  ['Physical lights', '物理光照', 'Luces físicas'], ['Pixel ratio', '像素比', 'Relación de píxeles'],
  ['Environment & lighting', '环境与光照', 'Entorno e iluminación'], ['HDR lighting', 'HDR 光照', 'Iluminación HDR'],
  ['Background', '背景', 'Fondo'], ['Image / transparent', '图片 / 透明', 'Imagen / transparente'],
  ['Solid color', '纯色', 'Color sólido'], ['Background color', '背景颜色', 'Color de fondo'],
  ['Ambient enabled', '启用环境光', 'Activar luz ambiental'], ['Ambient color', '环境光颜色', 'Color de luz ambiental'],
  ['Ambient intensity', '环境光强度', 'Intensidad de luz ambiental'], ['Camera', '相机', 'Cámara'],
  ['Field of view', '视野', 'Campo de visión'], ['Focal length', '焦距', 'Distancia focal'],
  ['zoom', '缩放', 'Zoom'], ['near', '近裁剪面', 'Plano cercano'], ['far', '远裁剪面', 'Plano lejano'],
  ['Position', '位置', 'Posición'], ['Look at', '观察目标', 'Objetivo de la cámara'], ['Reset camera', '重置相机', 'Restablecer cámara'],
  ['Orbit controls', '轨道控制', 'Controles orbitales'], ['enabled', '启用', 'Activado'],
  ['enableRotate', '启用旋转', 'Permitir rotación'], ['enableZoom', '启用缩放', 'Permitir zoom'],
  ['enablePan', '启用平移', 'Permitir desplazamiento'], ['enableDamping', '启用阻尼', 'Activar amortiguación'],
  ['autoRotate', '自动旋转', 'Rotación automática'], ['screenSpacePanning', '屏幕空间平移', 'Desplazamiento en pantalla'],
  ['rotateSpeed', '旋转速度', 'Velocidad de rotación'], ['zoomSpeed', '缩放速度', 'Velocidad de zoom'],
  ['panSpeed', '平移速度', 'Velocidad de desplazamiento'], ['autoRotateSpeed', '自动旋转速度', 'Velocidad de rotación automática'],
  ['dampingFactor', '阻尼系数', 'Factor de amortiguación'], ['minDistance', '最小距离', 'Distancia mínima'],
  ['maxDistance', '最大距离', 'Distancia máxima'], ['Model', '模型', 'Modelo'], ['visible', '可见', 'Visible'],
  ['Play', '播放', 'Reproducir'], ['Rotation speed', '旋转速度', 'Velocidad de rotación'],
  ['Rotation (degrees)', '旋转（度）', 'Rotación (grados)'], ['Scale', '缩放比例', 'Escala'],
  ['Reset transform', '重置变换', 'Restablecer transformación'], ['Materials', '材质', 'Materiales'],
  ['color', '颜色', 'Color'], ['emissive', '自发光颜色', 'Color emisivo'], ['metalness', '金属度', 'Metalicidad'],
  ['roughness', '粗糙度', 'Rugosidad'], ['opacity', '不透明度', 'Opacidad'], ['alphaTest', '透明度阈值', 'Umbral alfa'],
  ['envMapIntensity', '环境贴图强度', 'Intensidad del mapa de entorno'], ['emissiveIntensity', '自发光强度', 'Intensidad emisiva'],
  ['aoMapIntensity', '环境遮蔽强度', 'Intensidad de oclusión ambiental'], ['lightMapIntensity', '光照贴图强度', 'Intensidad del mapa de luz'],
  ['wireframe', '线框', 'Malla de alambre'], ['transparent', '透明', 'Transparente'], ['flatShading', '平面着色', 'Sombreado plano'],
  ['depthTest', '深度测试', 'Prueba de profundidad'], ['depthWrite', '深度写入', 'Escritura de profundidad'],
  ['side', '渲染面', 'Cara de renderizado'], ['Front', '正面', 'Frontal'], ['Back', '背面', 'Posterior'], ['Double', '双面', 'Ambas caras'],
  ['Helpers', '辅助工具', 'Guías'], ['Axes', '坐标轴', 'Ejes'], ['Grid', '网格', 'Cuadrícula'],
  ['None', '无', 'Ninguno'], ['Linear', '线性', 'Lineal'],
  ['Enable SSR', '启用 SSR', 'Activar SSR'], ['groundReflector', '地面反射', 'Reflector del suelo'],
  ['thickness', '厚度', 'Grosor'], ['infiniteThick', '无限厚度', 'Grosor infinito'],
  ['more settings', '更多设置', 'Más ajustes'], ['fresnel', '菲涅耳', 'Fresnel'],
  ['distanceAttenuation', '距离衰减', 'Atenuación por distancia'], ['otherMeshes', '其他物体', 'Otros objetos'],
  ['bouncing', '多次反射', 'Rebotes'], ['output', '输出', 'Salida'], ['Default', '默认', 'Predeterminado'],
  ['SSR Only', '仅 SSR', 'Solo SSR'], ['Beauty', '原始画面', 'Imagen original'], ['Depth', '深度', 'Profundidad'],
  ['Normal', '法线', 'Normales'], ['Metalness', '金属度', 'Metalicidad'], ['blur', '模糊', 'Desenfoque'],
];

export const controlKey = label => label.replace(/[^a-zA-Z0-9]+/g, '_');
const controls = index => Object.fromEntries(labels.map(row => [controlKey(row[0]), row[index]]));
export const en = {preview: 'PREVIEW', details: 'DETAILS', sensors: 'Sensors', creativeCoding: 'Creative Coding', controls: controls(0)};
export const cn = {preview: '预览', details: '详情', sensors: '传感器', creativeCoding: '创意编程', controls: controls(1)};
export const es = {preview: 'VISTA PREVIA', details: 'DETALLES', sensors: 'Sensores', creativeCoding: 'Programación creativa', controls: controls(2)};
