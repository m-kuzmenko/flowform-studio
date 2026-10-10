/*
 * Единая точка для будущих счётчиков.
 * После регистрации в LiveInternet, Rambler/Top-100 и Рейтинге Mail.ru
 * их коды добавляются в HTML, а вызовы в trackEvent — в документацию сервисов.
 */
(function () {
  const pendingEvents = [];

  window.trackEvent = function trackEvent(name, details = {}) {
    const payload = { name, details, path: window.location.pathname, at: new Date().toISOString() };
    pendingEvents.push(payload);
    console.info('[analytics demo]', payload);

    // Примеры подключаются только после получения реальных идентификаторов счётчиков:
    // window.ym?.(COUNTER_ID, 'reachGoal', name, details);
    // window._tmr?.push({ type: 'reachGoal', id: COUNTER_ID, goal: name });
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-event]');
    if (target) window.trackEvent(target.dataset.event, { label: target.dataset.eventLabel || target.textContent.trim() });
  });

  document.querySelectorAll('details[data-event]').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) window.trackEvent(item.dataset.event, { question: item.querySelector('summary').textContent.trim() });
    });
  });

  const form = document.querySelector('[data-demo-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      window.trackEvent('demo_form_submit');
      form.reset();
      document.querySelector('.form-success')?.classList.add('visible');
    });
  }

  window.__pendingAnalyticsEvents = pendingEvents;
}());
