import {experiments, labPath} from './features/three-lab/catalog.js';
import {detailEntries} from './content/portfolio.js';

// Stable legacy paths. Production details derive from the content catalog.
export const pagePaths = {home:'/',about:'/about',works:'/works',projects:'/projects',gcs:'/works/gcs',test:'/test',kaiwu:'/projects/kaiwu',kaiwuViewer:'/projects/kaiwu/viewer',kaiwuDetails:'/projects/kaiwu/details'};
export const productionPaths = [labPath,...experiments.map(entry => labPath + '/' + entry.id),pagePaths.home,pagePaths.about,pagePaths.works,pagePaths.projects,pagePaths.kaiwu,pagePaths.kaiwuViewer,pagePaths.kaiwuDetails,...detailEntries.map(entry => entry.detail.path)];
