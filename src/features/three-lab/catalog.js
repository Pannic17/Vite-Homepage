export const experiments = Array.from({length:9}, (_, index) => ({
  id: String(index + 1).padStart(2, '0'),
  key: 'lab.experiments.e' + (index + 1),
}));
export const labPath = '/works/three-lab';
export const loadExperiment = id => ({
  '01': () => import('./scenes/01.js'),
  '02': () => import('./scenes/02.js'),
  '03': () => import('./scenes/03.js'),
  '04': () => import('./scenes/04.js'),
  '05': () => import('./scenes/05.js'),
  '06': () => import('./scenes/06.js'),
  '07': () => import('./scenes/07.js'),
  '08': () => import('./scenes/08.js'),
  '09': () => import('./scenes/09.js'),
})[id]();
