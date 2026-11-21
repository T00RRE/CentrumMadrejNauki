/* ============================================================
   CENTRUM MĄDREJ NAUKI — Form Validation & Submission
   ============================================================ */

(function () {
  'use strict';

  const MESSAGES = {
    required:     'To pole jest wymagane.',
    email:        'Podaj prawidłowy adres e-mail.',
    tel:          'Podaj prawidłowy numer telefonu (9 cyfr).',
    gdpr:         'Zgoda na przetwarzanie danych jest wymagana.',
    minlength:    n => `Minimum ${n} znaków.`,
  };

  /* ---- Validation rules ---- */
  function validate(input) {
    const v = input.value.trim();
    const type = input.type;
    const name = input.name;

    if (input.required && !v) return MESSAGES.required;
    if (!v) return null; // optional, empty → ok

    if (type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) return MESSAGES.email;
    }
    if (type === 'tel' || name === 'telefon') {
      const digits = v.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{9,12}$/.test(digits)) return MESSAGES.tel;
    }
    const minLen = input.getAttribute('minlength');
    if (minLen && v.length < parseInt(minLen)) return MESSAGES.minlength(minLen);

    return null;
  }

  /* ---- Show/hide inline error ---- */
  function setError(input, msg) {
    const group = input.closest('.form-group');
    if (!group) return;
    const errEl = group.querySelector('.field-error');
    if (!errEl) return;
    if (msg) {
      errEl.textContent = msg;
      errEl.classList.add('is-visible');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errEl.id || (errEl.id = input.name + '-error'));
    } else {
      errEl.textContent = '';
      errEl.classList.remove('is-visible');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  /* ---- Validate whole form, return first error input ---- */
  function validateForm(form) {
    let firstError = null;

    // Fields
    form.querySelectorAll('input:not([type=hidden]):not([type=checkbox]), select, textarea').forEach(input => {
      const msg = validate(input);
      setError(input, msg);
      if (msg && !firstError) firstError = input;
    });

    // GDPR checkbox
    const gdpr = form.querySelector('input[name="gdpr"]');
    if (gdpr && !gdpr.checked) {
      const group = gdpr.closest('.form-checkbox');
      const errEl = group && group.querySelector('.field-error');
      if (errEl) {
        errEl.textContent = MESSAGES.gdpr;
        errEl.classList.add('is-visible');
      }
      if (!firstError) firstError = gdpr;
    }

    return firstError;
  }

  /* ---- Encode for Netlify Forms submission ---- */
  function encode(data) {
    return Object.entries(data)
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
      .join('&');
  }

  /* ---- Handle submit ---- */
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstError = validateForm(form);

    if (firstError) {
      firstError.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Wysyłanie…';

    try {
      const formData = new FormData(form);
      const data = {};
      formData.forEach((v, k) => { data[k] = v; });

      const resp = await fetch('/mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': form.getAttribute('name'), ...data }),
      });

      if (resp.ok) {
        const successEl = form.closest('[data-form-wrap]')?.querySelector('.form-success');
        if (successEl) {
          form.style.display = 'none';
          successEl.classList.add('is-visible');
        } else {
          form.innerHTML = `
            <div class="form-success is-visible">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
              </svg>
              <h3>Wiadomość wysłana!</h3>
              <p>Odpiszemy najszybciej jak to możliwe. Dziękujemy za kontakt!</p>
            </div>`;
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = originalText;
      alert('Wystąpił błąd podczas wysyłania. Proszę skontaktować się telefonicznie: 538 956 998');
    }
  }

  /* ---- Inline validation on blur ---- */
  function attachInlineValidation(form) {
    form.querySelectorAll('input:not([type=hidden]):not([type=checkbox]), select, textarea').forEach(input => {
      input.addEventListener('blur', () => setError(input, validate(input)));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          setError(input, validate(input));
        }
      });
    });
  }

  /* ---- Init all forms ---- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      attachInlineValidation(form);
      form.addEventListener('submit', handleSubmit);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
