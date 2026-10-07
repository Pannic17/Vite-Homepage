/**
 * @typedef {{kind:'none'} | {kind:'internal', to:string} | {kind:'external', href:string}} Destination
 * @typedef {Object} PortfolioEntry
 * @property {string} id Stable content identifier, independent of translation.
 * @property {'works'|'projects'} collection
 * @property {string} titleKey
 * @property {string|null} introKey Null means no complete introduction was supplied.
 * @property {string} cover Public asset path without deployment base.
 * @property {string} categoryKey
 * @property {Array<string|{key:string}>} tags Literal technical names or translation keys.
 * @property {string} dateKey
 * @property {Destination} destination Exactly one navigation behavior.
 * @property {{path:string,parent:string,paragraphKeys:string[],status:'pending'|'complete',links?:Array<{href:string,labelKey:string}>,video?:{embedUrl:string,href:string,titleKey:string}}} [detail]
 */

/** @type {PortfolioEntry[]} */
export const portfolio = [
  {
    "id": "catnet",
    "collection": "works",
    "cover": "image/CAT-Cover.png",
    "titleKey": "title.CAT",
    "introKey": "intro.CAT",
    "categoryKey": "tags.xr-game",
    "tags": [
      "Unity",
      "AR",
      "ResNet",
      "OpenCV"
    ],
    "dateKey": "dates.2021",
    "destination": {
      "kind": "internal",
      "to": "/works/catnet"
    },
    "detail": {
      "path": "/works/catnet",
      "parent": "/works",
      "paragraphKeys": ["catnet.recognition", "catnet.experiment"],
      "status": "complete",
      "links": [
        {"href": "https://github.com/Pannic17/CatNet-Unity", "labelKey": "catnet.github"}
      ],
      "video": {
        "embedUrl": "https://player.bilibili.com/player.html?bvid=BV1434y1R7Yw&page=1&autoplay=0",
        "href": "https://www.bilibili.com/video/BV1434y1R7Yw/",
        "titleKey": "catnet.demo"
      }
    }
  },
  {
    "id": "chronoscape",
    "collection": "works",
    "cover": "image/GCS-Cover.jpg",
    "titleKey": "title.GCS",
    "introKey": "intro.GCS",
    "categoryKey": "tags.xr-interactive",
    "tags": [
      "Unreal 5",
      "XR",
      "OpenCV",
      "YOLO",
      {
        "key": "tags.installment"
      }
    ],
    "dateKey": "dates.june2023",
    "destination": {
      "kind": "internal",
      "to": "/works/gcs"
    },
    "detail": {
      "path": "/works/gcs",
      "parent": "/works",
      "paragraphKeys": [],
      "status": "pending"
    }
  },
  {
    "id": "o-galaxy",
    "collection": "works",
    "cover": "image/OGX-Cover.png",
    "titleKey": "title.OGX",
    "introKey": "intro.OGX",
    "categoryKey": "tags.ai-game",
    "tags": [
      "Unreal 5",
      "Stable Diffusion",
      "OpenCV",
      "Django"
    ],
    "dateKey": "dates.fall2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "pokemon-pad",
    "collection": "works",
    "cover": "image/C1F-Cover.png",
    "titleKey": "title.C1F",
    "introKey": "intro.C1F",
    "categoryKey": "tags.web-game",
    "tags": [
      "Three.js",
      "Vue.js",
      "WebGL"
    ],
    "dateKey": "dates.december2022",
    "destination": {
      "kind": "external",
      "href": "https://pannic17.github.io/C1-Final/"
    }
  },
  {
    "id": "resonance",
    "collection": "works",
    "cover": "image/AMR-Cover.png",
    "titleKey": "title.AMR",
    "introKey": null,
    "categoryKey": "tags.arduino",
    "tags": [
      "Arduino",
      "Sensors"
    ],
    "dateKey": "dates.december2022",
    "destination": {
      "kind": "external",
      "href": "https://github.com/Pannic17/PCOMP-Final-Resonance/"
    }
  },
  {
    "id": "ai-shijing",
    "collection": "works",
    "cover": "image/C3F-Cover.png",
    "titleKey": "title.C3F",
    "introKey": "intro.C3F",
    "categoryKey": "tags.ai-experiment",
    "tags": [
      "Python",
      "Stable Diffusion",
      "ChatGPT",
      "LoRA"
    ],
    "dateKey": "dates.june2023",
    "destination": {
      "kind": "external",
      "href": "https://github.com/Pannic17/C3-Final"
    }
  },
  {
    "id": "ai-art-hash",
    "collection": "works",
    "cover": "image/C2F-Cover.png",
    "titleKey": "title.C2F",
    "introKey": "intro.C2F",
    "categoryKey": "tags.ai-experiment",
    "tags": [
      "Python",
      "Stable Diffusion",
      "OpenCV"
    ],
    "dateKey": "dates.march2023",
    "destination": {
      "kind": "external",
      "href": "https://github.com/Pannic17/C2-Final"
    }
  },
  {
    "id": "anybody-problem",
    "collection": "works",
    "cover": "image/ABP-Cover.png",
    "titleKey": "title.ABP",
    "introKey": null,
    "categoryKey": "tags.xr-game",
    "tags": [
      "Unreal 4",
      "OpenCV",
      {
        "key": "tags.installment"
      }
    ],
    "dateKey": "dates.march2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "zhuangyuan",
    "collection": "projects",
    "cover": "image/ZAR-Cover.png",
    "titleKey": "title.ZAR",
    "introKey": "intro.ZAR",
    "categoryKey": "tags.ar-mini",
    "tags": [
      "AR",
      {
        "key": "tags.mini"
      }
    ],
    "dateKey": "dates.fall2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "bilian-ai",
    "collection": "projects",
    "cover": "image/BLA-Cover.png",
    "titleKey": "title.BLA",
    "introKey": "intro.BLA",
    "categoryKey": "tags.ai-app",
    "tags": [
      "Flutter",
      "AI"
    ],
    "dateKey": "dates.january2024",
    "destination": {
      "kind": "external",
      "href": "https://github.com/Pannic17/Flutter-BilianAI"
    }
  },
  {
    "id": "split",
    "collection": "projects",
    "cover": "image/Split!.png",
    "titleKey": "title.SPLIT",
    "introKey": null,
    "categoryKey": "tags.tool",
    "tags": [
      "Django",
      "React"
    ],
    "dateKey": "dates.winter2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "homepage",
    "collection": "projects",
    "cover": "image/HPG-Cover.png",
    "titleKey": "title.HPG",
    "introKey": "intro.HPG",
    "categoryKey": "tags.web",
    "tags": [
      "Vue.js",
      "Three.js"
    ],
    "dateKey": "dates.2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "cci-coursework",
    "collection": "projects",
    "cover": "image/CourseWork.png",
    "titleKey": "title.CCI",
    "introKey": "intro.CCI",
    "categoryKey": "tags.coursework",
    "tags": [
      "JavaScripts",
      "OpenFramework",
      "Python"
    ],
    "dateKey": "dates.2023",
    "destination": {
      "kind": "none"
    }
  },
  {
    "id": "ai-tester",
    "collection": "projects",
    "cover": "image/Construction.png",
    "titleKey": "title.TESTER",
    "introKey": null,
    "categoryKey": "tags.under",
    "tags": [
      "GPTs",
      "AI"
    ],
    "dateKey": "dates.2024",
    "destination": {
      "kind": "none"
    }
  }
];

export const works = portfolio.filter(entry => entry.collection === 'works');
export const projects = portfolio.filter(entry => entry.collection === 'projects');
export const detailEntries = portfolio.filter(entry => entry.detail);
export const findEntry = id => portfolio.find(entry => entry.id === id);

export const kaiwu = {
  id: 'kaiwu',
  titleKey: 'kaiwu.title',
  destination: {kind:'internal',to:'/projects/kaiwu'},
  paragraphs: ['kaiwu.intro', 'kaiwu.role'],
  posters: [1,2,3,4].map(number => ({number,src:'image/kaiwu/KW-poster' + number + '.jpg'})),
  links: ['viewer','app','chain'].map(id => ({
    id, labelKey:'kaiwu.links.' + id,
    destination:{kind:'none'},
  })),
};
