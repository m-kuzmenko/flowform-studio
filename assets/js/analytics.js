/*
 * LiveInternet и Rambler/Top-100 подключены в HTML каждой страницы.
 * MyTracker загружается из этого общего файла, который подключён на всех шести страницах.
 * data-flowform включает для Top100 «Аналитику блоков»: показы и клики
 * по CTA, сценариям и вопросам FAQ собираются без передачи личных данных.
 * Собственные события Top100 отправляются ниже отдельным методом reachGoal.
 */
(function () {
  const pendingEvents = [];
  const MYTRACKER_COUNTER_ID = '3800957';
  const TOP100_COUNTER_ID = 7752735;
  const myTrackerGoals = {
    cta_try_studio: 'earlyAccessClick',
    template_select: 'templateSelect',
    demo_form_submit: 'briefSubmit'
  };
  const top100Goals = {
    cta_try_studio: { name: 'early_access_click', data: { placement: 'hero' } },
    demo_form_submit: { name: 'brief_submit', data: { form: 'early_access' } }
  };

  // Очередь из документации Top100: действия, совершённые до загрузки
  // внешнего скрипта, будут автоматически отправлены после его инициализации.
  window.top100d = window.top100d || function () {
    (window.top100d.a = window.top100d.a || []).push(arguments);
  };

  // Код счётчика выдан MyTracker. Общий файл гарантирует одинаковую установку
  // на каждой странице лендинга.
  window._tmr = window._tmr || [];
  window._tmr.push({
    id: MYTRACKER_COUNTER_ID,
    type: 'pageView',
    start: (new Date()).getTime()
  });

  (function loadMyTracker(d, w, id) {
    if (d.getElementById(id)) return;
    const script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.id = id;
    script.src = 'https://top-fwz1.mail.ru/js/code.js';
    const insertScript = function () {
      const firstScript = d.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };
    if (w.opera === '[object Opera]') {
      d.addEventListener('DOMContentLoaded', insertScript, false);
    } else {
      insertScript();
    }
  }(document, window, 'tmr-code'));

  function sendMyTrackerGoal(eventName) {
    const goal = myTrackerGoals[eventName];
    if (!goal) return;
    window._tmr.push({ id: MYTRACKER_COUNTER_ID, type: 'reachGoal', goal });
  }

  function sendTop100Goal(eventName) {
    const goal = top100Goals[eventName];
    if (!goal) return;
    window.top100d(TOP100_COUNTER_ID, 'reachGoal', goal.name, goal.data);
  }

  window.trackEvent = function trackEvent(name, details = {}) {
    const payload = { name, details, path: window.location.pathname, at: new Date().toISOString() };
    pendingEvents.push(payload);
    console.info('[analytics demo]', payload);

    // Top100 собирает клики по элементам с data-flowform автоматически.
    // В цели обоих счётчиков передаются только технические метки, не текст формы.
    sendMyTrackerGoal(name);
    sendTop100Goal(name);
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
