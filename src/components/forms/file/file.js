import "./file.scss"

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-fls-file]').forEach((wrap) => {
    const input = wrap.querySelector('.file__input');
    const trigger = wrap.querySelector('[data-file-trigger]');
    const list = wrap.querySelector('.file__list');

    if (!input || !trigger || !list) return;

    let dt = new DataTransfer();

    trigger.addEventListener('click', () => input.click());

    const fmtSize = (b) => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let i = 0, n = b;
      while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
      return `${n.toFixed(n < 10 && i ? 1 : 0)} ${units[i]}`;
    };

    function render() {
      list.innerHTML = '';
      Array.from(dt.files).forEach((f) => {
        const key = `${f.lastModified}:${f.size}:${f.name}`;

        const li = document.createElement('li');
        li.className = 'file__item';
        li.dataset.key = key;

        const info = document.createElement('span');
        info.className = 'file__name';
        info.textContent = `${f.name} (${fmtSize(f.size)})`;

        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'file__remove';
        rm.textContent = '✕';
        rm.addEventListener('click', () => removeFile(key));

        li.append(info, rm);
        list.appendChild(li);
      });

      input.files = dt.files;
    }

    function removeFile(key) {
      const nextDT = new DataTransfer();
      Array.from(dt.files).forEach((f) => {
        const k = `${f.lastModified}:${f.size}:${f.name}`;
        if (k !== key) nextDT.items.add(f);
      });
      dt = nextDT;
      render();
    }

    input.addEventListener('change', () => {
      Array.from(input.files).forEach((f) => dt.items.add(f));
      render();
      input.value = '';
    });

    render();
  });
});
