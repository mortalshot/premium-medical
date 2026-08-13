import "./copy.scss"

import { slideUp, slideDown } from "@js/common/functions.js"


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-item__button");
  if (!btn) return;

  if (btn.parentElement.querySelector(".copy-item__tooltip")) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const text = btn.getAttribute("data-copy");
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    // если уже есть тултип — уберём его
    let tooltip = btn.querySelector(".copy-tooltip");

    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "copy-item__tooltip";
      tooltip.textContent = "Скопировано в буфер обмена";
      tooltip.hidden = true;
      btn.parentElement.appendChild(tooltip);
    }

    // если таймер уже есть — сбросим
    if (tooltip._hideTimer) {
      clearTimeout(tooltip._hideTimer);
      tooltip._hideTimer = null;
    }

    // показать плавно
    slideDown(tooltip, 200);

    // спрятать через 3 сек плавно и удалить
    tooltip._hideTimer = setTimeout(() => {
      slideUp(tooltip, 200);
      document.addEventListener("slideUpDone", function handler(ev) {
        if (ev.detail.target === tooltip) {
          tooltip.remove();
          document.removeEventListener("slideUpDone", handler);
        }
      });
      tooltip._hideTimer = null;
    }, 3000);
  });
});
