// Подключение функционала "Чертоги фрилансера"
import { FLS } from "@js/common/functions.js";
// Docs: https://www.npmjs.com/package/gsap

import { gsap } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// import { gsap, ScrollTrigger } from "../../effects/gsap/gsap.js";