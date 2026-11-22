/**
 * Google Form Auto Answer
 * 
 * Paste this entire script into the browser console (F12 → Console)
 * on any Google Form page, then click "Start Auto-Answer".
 * 
 * Works with:
 * - Multiple Choice (radio)
 * - Linear Scale
 * - Checkboxes
 */

(function () {
  // Remove any previous panel
  const old = document.getElementById('gform-auto-panel');
  if (old) old.remove();

  // Create panel
  const panel = document.createElement('div');
  panel.id = 'gform-auto-panel';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: #1e1e1e;
    color: #fff;
    padding: 16px 18px;
    border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    min-width: 240px;
    border: 1px solid #333;
  `;

  const title = document.createElement('div');
  title.textContent = 'GForm Auto Answer';
  title.style.cssText = 'font-weight:600;margin-bottom:12px;font-size:15px;';
  panel.appendChild(title);

  const desc = document.createElement('div');
  desc.textContent = 'Works on radio + linear scale + checkboxes';
  desc.style.cssText = 'margin-bottom:10px;color:#aaa;font-size:12px;';
  panel.appendChild(desc);

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start Auto-Answer';
  startBtn.style.cssText = `
    width:100%;padding:10px;background:#4CAF50;color:white;border:none;
    border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:8px;
  `;
  panel.appendChild(startBtn);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Form';
  submitBtn.style.cssText = `
    width:100%;padding:10px;background:#2196F3;color:white;border:none;
    border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:8px;
  `;
  panel.appendChild(submitBtn);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close Panel';
  closeBtn.style.cssText = `
    width:100%;padding:8px;background:#444;color:#ccc;border:none;
    border-radius:8px;cursor:pointer;
  `;
  panel.appendChild(closeBtn);

  const status = document.createElement('div');
  status.style.cssText = 'margin-top:10px;font-size:12px;color:#8f8;';
  panel.appendChild(status);

  document.body.appendChild(panel);

  // Start button
  startBtn.onclick = function () {
    let radioCount = 0;
    let checkboxCount = 0;

    // === RADIO / LINEAR SCALE ===
    document.querySelectorAll('[role="radiogroup"]').forEach(group => {
      const options = [...group.querySelectorAll('[role="radio"]')]
        .filter(el => el.getAttribute('aria-disabled') !== 'true');

      if (options.length === 0) return;

      // Skip if already answered
      if (options.some(el => el.getAttribute('aria-checked') === 'true')) return;

      const choice = options[Math.floor(Math.random() * options.length)];
      choice.click();
      radioCount++;
    });

    // === CHECKBOXES ===
    document.querySelectorAll('[role="list"]').forEach(group => {
      const checkboxes = [...group.querySelectorAll('[role="checkbox"]')]
        .filter(el => el.getAttribute('aria-disabled') !== 'true');

      if (checkboxes.length === 0) return;

      // Skip if already answered
      if (checkboxes.some(el => el.getAttribute('aria-checked') === 'true')) return;

      // Randomly pick 2 or 3 options
      const howMany = Math.min(3, Math.max(2, Math.floor(Math.random() * 3) + 1));
      const shuffled = checkboxes.sort(() => 0.5 - Math.random());

      for (let i = 0; i < howMany && i < shuffled.length; i++) {
        shuffled[i].click();
        checkboxCount++;
      }
    });

    if (radioCount === 0 && checkboxCount === 0) {
      status.textContent = 'No questions found';
    } else {
      status.textContent = `Filled ${radioCount} radio + ${checkboxCount} checkbox`;
    }
  };

  // Submit button
  submitBtn.onclick = function () {
    const candidates = [
      ...document.querySelectorAll('div[role="button"]'),
      ...document.querySelectorAll('span'),
      ...document.querySelectorAll('button')
    ];

    let found = false;
    for (const el of candidates) {
      const text = (el.innerText || el.textContent || '').toLowerCase().trim();
      if (text === 'submit' || text === 'kirim' || text.includes('submit') || text.includes('kirim')) {
        el.click();
        found = true;
        status.textContent = 'Clicked Submit';
        break;
      }
    }
    if (!found) status.textContent = 'Could not find Submit button. Click it yourself.';
  };

  closeBtn.onclick = () => panel.remove();
})();
