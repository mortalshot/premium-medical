// Подключение функционала "Чертоги фрилансера"
import { isMobile, FLS } from "@js/common/functions.js";

// Подключение с node_modules
import tippy from 'tippy.js';

// Подключение стилей с src/scss/libs
import "./tippy.scss";
// Подключение стилей с node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
document.querySelector('[data-fls-tippy-content]') ?
	tippy('[data-fls-tippy-content]', {}) : null