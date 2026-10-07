import {createRouter, createWebHistory} from 'vue-router';
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');
const Works = () => import('./views/Works.vue');
const Projects = () => import('./views/Projects.vue');
const ProjectDetail = () => import('./views/ProjectDetail.vue');
const NotFound = () => import('./views/NotFound.vue');
import {pagePaths} from './routePaths';
import {detailEntries} from './content/portfolio';

const routes = [
  {path:pagePaths.home,name:'Home',component:Home},
  {path:pagePaths.about,name:'About',component:About,meta:{titleKey:'menu.about'}},
  {path:pagePaths.works,name:'Works',component:Works,meta:{titleKey:'menu.works'}},
  {path:pagePaths.projects,name:'Projects',component:Projects,meta:{titleKey:'menu.projects'}},
  {path:pagePaths.kaiwu,name:'KaiwuHome',component:()=>import('./views/KaiwuHome.vue'),meta:{titleKey:'kaiwuViewer.title'}},
  {path:pagePaths.kaiwuViewer,name:'KaiwuViewer',component:()=>import('./views/KaiwuViewer.vue'),meta:{titleKey:'kaiwuViewer.title'}},
  {path:pagePaths.kaiwuDetails,name:'KaiwuDetails',component:()=>import('./views/KaiwuDetails.vue'),meta:{parent:pagePaths.projects,titleKey:'kaiwu.title'}},
  ...detailEntries.map(entry => ({
    path:entry.detail.path, name:entry.id, component:ProjectDetail, props:{id:entry.id},
    meta:{parent:entry.detail.parent,titleKey:entry.titleKey},
  })),
  ...(import.meta.env.DEV ? [{path:pagePaths.test,name:'Test',component:() => import('./views/Page.vue'),meta:{titleKey:'menu.test'}}] : []),
  {path:'/:pathMatch(.*)*',name:'NotFound',component:NotFound,meta:{notFound:true,titleKey:'status.notFound'}},
];
export default createRouter({
  history:createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to,from,savedPosition) { return savedPosition || {left:0,top:0}; },
});
