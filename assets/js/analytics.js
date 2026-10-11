/*
 * LiveInternet и Rambler/Top-100 подключены в HTML каждой страницы.
 * data-flowform включает для Top100 «Аналитику блоков»: показы и клики
 * по CTA, сценариям и вопросам FAQ собираются без передачи личных данных.
 */
(function () {
  const pendingEvents = [];

  window.trackEvent = function trackEvent(name, details = {}) {
    const payload = { name, details, path: window.location.pathname, at: new Date().toISOString() };
    pendingEvents.push(payload);
    console.info('[analytics demo]', payload);

    // Top100 собирает клики по элементам с data-flowform автоматически.
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
