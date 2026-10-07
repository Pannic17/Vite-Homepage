export default {
  "scene": {"enable":"Enable animation", "disable":"Disable animation", "quality":"Animation", "auto":"Auto", "static":"Static", "low":"Low", "medium":"Medium", "high":"High"},
  "accessibility": {
    "skip": "Skip to content",
    "navigation": "Site navigation",
    "language": "Language"
  },
  "status": {
    "notFound": "This page could not be found.",
    "detailsPending": "More project details will be added here.",
    "introPending": "An introduction has not been provided yet.",
    "noDetail": "Details pending"
  },
  "home": {
    "name": "Jiangyun Pan",
    "master": "MSc Creative Computing - UAL CCI",
    "bachelor": "BSc Biology & Immunology - University of Toronto",
    "company": "Co-founder and Developer of {company}",
    "intro": "As a creative programmer, innovative developer and project manager, I successfully launched a mobile online trading app. My academic background in creative programming has focused on integrating neural networks with game engines, reflecting my commitment to the game industry."
  },
  "about": {
    "background": "I’m Jiangyun Pan, a creative developer also known as Pannic / Nic Pan. My studies took me from biology and immunology at the University of Toronto to creative computing at the University of the Arts London. My practice now spans games, artificial intelligence and interactive art, using code to explore connections between the physical world and digital experiences.",
    "practice": "I’m particularly interested in bringing neural networks into real-time interactions. In CatNet, I used Unity to explore AI in augmented reality games. In PokemonPad, I combined Three.js, custom shaders and post-processing with music, 3D models and keyboard input to create a playful visual experience. Across C#, JavaScript and Python, these projects trace my explorations in game development, real-time graphics and creative coding.",
    "experience": "Alongside experimental work, I build products for real users. As co-founder, technical lead and lead developer at KaiwuArt, I was responsible for technical architecture and core features, coordinating development across mobile apps, a WeChat mini-program, websites and cloud services. I worked with designers and developers to bring the product to launch. From interactive prototypes to complete products, I aim to turn technical ideas into things people can use and experience."
  },
  "menu": {
    "about": "ABOUT",
    "works": "WORKS",
    "projects": "PROJECTS",
    "main": "HOME",
    "back": "BACK",
    "test": "TEST"
  },
  "tags": {
    "mini": "WeChat Miniprogram",
    "installment": "Installation",
    "xr-game": "XR Game",
    "xr-interactive": "XR Interactive Installment",
    "ai-game": "AI Game",
    "web-game": "Web Game",
    "ai-experiment": "AI Art Experiment",
    "ar-mini": "AR Miniprogram",
    "ai-app": "AI Chat APP",
    "tool": "Tool",
    "web": "Web",
    "coursework": "Course Work",
    "under": "Under Development",
    "arduino": "Interactive Installation"
  },
  "title": {
    "ZAR": "Zhuangyuan Jiequ - Miniature Mansion",
    "BLA": "Bilian AI",
    "CCI": "CCI Coursework",
    "HPG": "Homepage",
    "CAT": "CatNet",
    "GCS": "Chronoscape",
    "OGX": "O Galaxy",
    "C1F": "PokemonPad",
    "AMR": "Resonance",
    "C3F": "AI Shijing Paintings",
    "C2F": "Ai, Art & hAsh",
    "ABP": "Anybody Problem",
    "SPLIT": "SPLIT!",
    "TESTER": "AI Tester"
  },
  "intro": {
    "ABP": "Anybody Problem is an experimental XR work exploring visual detection and planetary interaction. Built around Unreal Engine 4.27 scenes and visual effects, it investigates detection points as inputs for planetary positions, gravity and particles, alongside Python / OpenCV experiments and Unity prototypes connecting image detection with game interaction.",
    "ZAR": "\"Zhuangyuan Jiequ - Miniature Mansion\" is a WeChat AR mini-program developed based on the WeChat XR-Frame framework. Users can scan the QR code to display vivid 3D animations of characters on corresponding markers. This mini-program serves as an interactive experience project for scenic spots, aiming to recreate the traditional life of ancient Chinese people in historical settings.",
    "BLA": "\"Bilian AI\" is a chat app targeted at Chinese AI users. It integrates ChatGPT and WenyanYixin interfaces, providing an AI entrance accessible in mainland China. I am responsible for the mobile frontend development of this application. The frontend is built on the Flutter framework, enabling cross-platform synchronous development for iOS and Android. It utilizes responsive layout and integrates related interfaces such as WeChat sharing.",
    "CCI": "Here is a showcase of all my coding assignments during the one-year UAL CCI master's program: This includes JavaScript-related assignments from Coding 1, OpenFrameworks and Python-related tasks from Coding 2, and assignments related to neural networks from Coding 3.",
    "HPG": "Built with Vue3+Vite, featuring responsive layout and component-based development. Utilizes Three.js for constructing 3D models and i18n for implementing internationalization of languages.",
    "CAT": "CatNet is an experimental AR game built with Unity, combining artificial intelligence with augmented reality. It uses OpenCV to detect cat faces and Unity Barracuda to run a neural network for coat classification, alongside image color extraction, exploring how real cats can inform a virtual game experience.",
    "GCS": "Chronoscape is an XR interactive game installation developed using the UE5 engine. In this project, human existence is extended into a virtual digital world through gaming experiences. Our goal is to design an immersive playground space that amplifies and commemorates the impact individuals have on the world. The project is developed using Unreal Engine and incorporates a self-trained YOLO network deployed in the game through OpenCV and experimental neural network modules. A camera positioned at the top tracks human traces in real-time within the scene and feeds back into the game environment.",
    "OGX": "Using prisms, cameras and projectors to capture images of the physical world and create a virtual world.",
    "C1F": "A web music game developed with Three.js and WebGL.",
    "C3F": "An experiment using AI to understand ancient Chinese poetry and reconstruct paintings.",
    "C2F": "Generative art exploring a computer's understanding, memory and validation of your picture. For this project, I created a Python script that uses a Stable Diffusion model to generate an image from a hash string. I then used the generated image to replace a face in an input image. The script uses OpenCV to detect faces, a binary mask to replace the face with the generated image, and OpenCV to compute the perceptual hash of the input image."
  },
  "catnet": {
    "hero": "AI × AR",
    "overview": "PROJECT OVERVIEW",
    "process": "From real images to virtual experiences",
    "recognitionHeading": "Recognition & feature extraction",
    "experimentHeading": "Experiment & open source",
    "github": "View source on GitHub ↗",
    "demo": "CatNet demo video",
    "watch": "Watch on bilibili ↗",
    "videoHelp": "If the player cannot load, watch the full demo on bilibili.",
    "recognition": "The recognition pipeline starts with a camera image or image file. OpenCV detects cat faces with a Haar cascade, then crops and resizes the face to 224 × 224 pixels. Unity Barracuda runs neural network inference to classify the coat pattern, while OpenCV K-means clustering extracts the main image colors, turning a real image into visual data for the game.",
    "experiment": "The project experiments with neural network inference inside a game engine and AR interaction, exploring connections between real images and virtual characters. The GitHub repository includes Unity scripts, scenes and model assets. Its README links to Windows and Android downloads, and the source is released under the MIT license."
  },
  "anybody": {
    "hero": "Vision × Gravity",
    "process": "Three repositories, three areas of exploration",
    "unrealHeading": "Scenes & visual effects",
    "detectionHeading": "Visual detection experiments",
    "unityHeading": "Planetary interaction prototypes",
    "unrealLink": "UE4.27 main project · GitHub ↗",
    "detectionLink": "OpenCV detection experiments · GitHub ↗",
    "unityLink": "Unity interaction prototypes · GitHub ↗",
    "unreal": "VAP-UE427 is the main project. Its C++ and Blueprint detection-point processing covers camera coordinate mapping, relative positions and gravity directions. Scenes, materials and Niagara assets explore planetary and particle visuals.",
    "detection": "VAP-OpenCV-Detection uses Python and OpenCV for camera preview and static image detection, with Haar cascade classifiers for hands, palms, fists and faces. It explores detection positions and regions in visual input as a reference for interaction experiments.",
    "unity": "VAP-Unity contains C# prototypes for camera control, image processing, planetary gravity and particle effects. The three repositories are maintained independently, with some features still experimental. The public code does not provide a shared communication interface, preserving explorations across different technical approaches."
  },
  "pages": {
    "worksSubtitle": "Artworks by {name}",
    "projectsSubtitle": "Projects developed or contributed to by {name}"
  },
  "contact": {
    "label": "Contact and social links",
    "email": "Email",
    "github": "GitHub",
    "instagram": "Instagram"
  },
  "dates": {
    "2021": "2021",
    "2023": "2023",
    "2024": "2024",
    "june2023": "June 2023",
    "fall2023": "Fall 2023",
    "december2022": "December 2022",
    "march2023": "March 2023",
    "january2024": "January 2024",
    "winter2023": "Winter 2023",
    "december2024": "December 2024"
  },
  "kaiwuDetail": {
    "subtitle": "Co-founder · Technical lead · Lead developer",
    "headline": "Bringing 3D art into everyday viewing and collecting",
    "overview": "KaiwuArt is a platform for collecting and trading 3D digital artworks in China. It brings together artwork presentation, discovery, purchasing and collecting, exploring how 3D art can connect with games, popular culture and digital collections through mobile and browser experiences.",
    "role": "As co-founder, technical lead and lead developer, I owned technical planning and core product development, coordinating mobile apps, a WeChat mini-program, web presentation and business services. I worked with designers and developers to turn artwork and trading needs into a usable product, and supported releases and operations after launch.",
    "preview": "Explore the 3D viewing experience",
    "posters": "Kaiwu promotional visuals, bringing together the brand and its focus on 3D digital art.",
    "scope": {
      "experience": {"title": "Artwork experience", "text": "3D viewing, playback controls and presentation tools"},
      "access": {"title": "Multiple entry points", "text": "Android / iOS apps, WeChat mini-program and mobile web"},
      "journey": {"title": "Collecting journey", "text": "Browsing, accounts, collections, orders and payments"},
      "operations": {"title": "Releases & operations", "text": "Series and artwork releases, gifting and management tools"}
    },
    "chapters": {
      "viewing": {
        "title": "From images to a 3D experience",
        "lead": "I led development of the 3D artwork viewer, allowing users to view models, control playback and reset the presentation. This extended the experience beyond static images into an interactive way of viewing artworks.",
        "body": "I also developed preview and presentation tools for preparing works before release. These let the team adjust viewing angles, lighting and visual treatment, then save and reuse presentation settings. The work supported both the viewing experience and content preparation, giving individual artworks an appropriate presentation."
      },
      "clients": {
        "title": "Connecting multiple entry points",
        "lead": "I coordinated development across Android and iOS apps, a WeChat mini-program and mobile web, giving users different ways to browse artworks and series, explore details, and access their accounts and collections.",
        "body": "Across the different client implementations, I contributed to home pages, search, artwork details, profiles, collections, orders, payments, gifting and sharing. My responsibilities included developing core pages and interactions, as well as coordinating clients with business services so that viewing an artwork could lead into further actions."
      },
      "services": {
        "title": "Connecting browsing, collecting and purchasing",
        "lead": "I developed and coordinated core business capabilities, bringing artwork and series information, sign-in, profiles, likes, collections, orders and payments into connected product journeys.",
        "body": "This work supported the actions behind the pages: following artworks of interest, checking collection and purchase status, and accessing related account records. I coordinated the connections between clients and business services so the product could support ongoing use alongside its visual presentation."
      },
      "issuance": {
        "title": "Supporting artwork preparation and release",
        "lead": "I led development of digital collectible issuance and trading features, covering user address registration, series and individual artwork releases, transaction queries, price updates and gifting operations.",
        "body": "For releasing a collection, I built tools that supported series preparation, artwork material uploads and individual releases, with records at each stage for team checks and later review. Alongside the user-facing product, I provided support for routine releases, gifting campaigns and business management."
      },
      "delivery": {
        "title": "Working with the team to launch the product",
        "lead": "As technical lead, my responsibilities spanned artwork presentation, client experiences, business journeys and release tools. I coordinated dependencies across these areas and worked with designers and developers to bring the product to launch.",
        "body": "My contribution continued into operations, supporting artwork releases and events with product features and operational tools. Kaiwu was a progression from individual feature development to delivering a complete product, requiring attention to both how users experience artworks and how the team maintains and operates the platform."
      }
    },
    "contributionLabel": "MY CONTRIBUTION",
    "contributionTitle": "From artwork presentation to product operations",
    "contribution": "At Kaiwu, I combined the roles of co-founder, technical lead and lead developer. I directly developed 3D viewing and core product features, while coordinating multiple user entry points and business capabilities to connect artwork presentation, collecting, trading and release operations. The project reflects my work with a team to turn a creative idea into a product for real users."
  },
  "kaiwu": {
    "siteLabel": "KAIWUART.CN: Open the Kaiwu page",
    "previewLabel": "PREVIEW: Open the Kaiwu 3D example",
    "title": "开物KaiwuArt",
    "poster": "Kaiwu promotional poster {number}",
    "intro": "Kaiwu is an NFT trading platform in China focusing on the 3D digital artwork market and its applications in the metaverse, games, popular culture, collections and CG industries.",
    "role": "As KaiwuArt’s technical lead and lead developer, I owned the overall technical architecture and core development, coordinating implementation across Android/iOS apps, a WeChat mini-program, the official website, cloud services, and databases. I also led development of 3D rendering and crypto token issuance and trading features, working closely with developers and designers to launch the product and support subsequent events.",
    "links": {
      "viewer": "3D Viewer",
      "app": "Mobile APP",
      "websites": "Websites",
      "backend": "Cloud & Backend",
      "chain": "NFT & Chain"
    }
  }
};
