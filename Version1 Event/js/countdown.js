(() => {
  const sections = Array.from(document.querySelectorAll('section[data-deadline]'));
  if (!sections.length) return;

  sections.forEach((root) => {
    const expiredEl = root.querySelector('.sub');

    const valueEls = {
      days:   root.querySelector('[data-key="days"]'),
      hours:  root.querySelector('[data-key="hours"]'),
      minutes:root.querySelector('[data-key="minutes"]'),
      seconds:root.querySelector('[data-key="seconds"]'),
    };

    const originalDeadline = root.dataset.deadline?.trim();
    if (!originalDeadline) return console.error('No deadline set on', root);

    let target = new Date(originalDeadline);
    let rafId;

    function format(num, pad = 2) {
      return String(num).padStart(pad, '0');
    }

    function diffParts(to) {
      const now = new Date();
      let ms = to - now;
      if (ms < 0) ms = 0;
      const s = Math.floor(ms / 1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;
      return { totalMs: ms, days, hours, minutes, seconds };
    }

    function render(parts) {
      valueEls.days.textContent    = parts.days;
      valueEls.hours.textContent   = format(parts.hours);
      valueEls.minutes.textContent = format(parts.minutes);
      valueEls.seconds.textContent = format(parts.seconds);
    }

    function tick() {
      const parts = diffParts(target);
      render(parts);
      const done = parts.totalMs <= 0;
      if (expiredEl) expiredEl.classList.toggle('hidden', !done);
      const grid = root.querySelector('.grid');
      if (grid) grid.classList.toggle('hidden', done);
      rafId = requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
  });
})();
