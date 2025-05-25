document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    logoutAndRedirect();
    return;
  }

  try {
    const user = await fetchCurrentUser(token);

    const [prefs, hobbies, languages, feedback] = await Promise.all([
      fetchRoommatePrefs(token),
      fetchUserHobbies(user.id),
      fetchUserLanguages(user.id),
      fetchUserFeedback(user.id),
    ]);

    if (document.body.dataset.step === '1') {
      populateStep1(user, prefs, hobbies, languages);
      setupLanguageSelector(languages);
      setupHobbySelector(hobbies);
    }

    if (document.body.dataset.step === '2') {
      populateStep2(prefs);
    }

    if (document.body.dataset.step === '3') {
      populateStep3(prefs);
    }

    if (document.body.dataset.step === '4') {
      populateStep4(prefs);
      applyAllergyOtherLogic();
    }

    if (document.body.dataset.step === '5') {
      populateStep5(feedback);
      applyEmojiRatingLogic();
    }

    applySingleSelectLogic();
    setupValidation();

    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
  } catch (err) {
    console.error('❌ Initialization failed:', err);
    logoutAndRedirect();
  }
});

// Fetch helper functions
async function fetchCurrentUser(token) {
  const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Unauthorized');
  return (await res.json()).user;
}

async function fetchRoommatePrefs(token) {
  const res = await fetch('/api/prefs/me', { headers: { Authorization: `Bearer ${token}` } });
  return res.ok ? (await res.json()).prefs : {};
}

async function fetchUserHobbies(userId) {
  const res = await fetch(`/api/users/${userId}/hobbies`, { headers: authHeader() });
  return res.ok ? await res.json() : [];
}

async function fetchUserLanguages(userId) {
  const res = await fetch(`/api/users/${userId}/languages`, { headers: authHeader() });
  return res.ok ? await res.json() : [];
}

async function fetchUserFeedback(userId) {
  const res = await fetch(`/api/feedbacks/${userId}`, { headers: authHeader() });
  return res.ok ? (await res.json()).feedback : {};
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` };
}

// Populate form steps
function populateStep1(user, prefs, hobbies, languages) {
  setCheckboxValue('gender', user.gender);
  setCheckboxValue('age', user.age);
  setInputValue('occupation', user.occupation);
  setInputValue('wfh_days', prefs.wfh_days);
  setInputValue('budget_min', prefs.budget_min);
  setInputValue('budget_max', prefs.budget_max);
  setCheckboxValue('stay', prefs.stay);
  setSelectValue('nationality', user.nationality);
  setSelectValue('cultural', user.cultural);
  populateTags('hobby-tags', hobbies, 'icon', 'name');
  populateLanguageTags(languages);
}

function populateStep2(prefs) {
  setCheckboxValue('work_hours', prefs.work_hours);
  setCheckboxValue('bedtime', prefs.bedtime);
  setCheckboxValue('noise', prefs.noise);
  setCheckboxValue('cleanliness', prefs.cleanliness);
  setCheckboxValue('clean_freq', prefs.clean_freq);
}

function populateStep3(prefs) {
  setCheckboxValue('pets', prefs.pets);
  setCheckboxValue('smoking', prefs.smoking);
  setCheckboxValue('alcohol', prefs.alcohol);
  setMultiCheckboxValues('diet', prefs.diet || []);
  setCheckboxValue('kitchen_sharing', prefs.kitchen_sharing);
  setCheckboxValue('bathroom', prefs.bathroom);
}

function populateStep4(prefs) {
  setCheckboxValue('own_guest_freq', prefs.own_guest_freq);
  setCheckboxValue('roommate_guest', prefs.roommate_guest);
  setCheckboxValue('social_vibe', prefs.social_vibe);
  setCheckboxValue('roommate_gender', prefs.roommate_gender);
  setCheckboxValue('lgbtq', prefs.lgbtq);
  setMultiCheckboxValues('allergies', prefs.allergies || []);
  setInputValue('allergy_custom', prefs.allergy_custom);
}

function populateStep5(feedback) {
  setCheckboxValue('satisfaction', feedback.satisfaction);
  setInputValue('feedback', feedback.feedback);
}

// Helper functions
function setCheckboxValue(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
    input.checked = String(input.value) === String(value);
  });
}

function setMultiCheckboxValues(name, values) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
    input.checked = values.includes(input.value);
  });
}

function setInputValue(name, value) {
  const input = document.querySelector(`[name="${name}"]`);
  if (input) input.value = value || '';
}

function setSelectValue(name, value) {
  const select = document.querySelector(`select[name="${name}"]`);
  if (select) select.value = value || '';
}

function populateTags(containerId, items, iconKey, nameKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = `${item[iconKey]} ${item[nameKey]}`;
    container.appendChild(tag);
  });
}

function populateLanguageTags(languages) {
  const container = document.getElementById('selected-languages');
  container.innerHTML = '';
  languages.forEach(lang => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = lang.name;
    container.appendChild(tag);
  });
}

// Handle form submissions
async function handleFormSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("Missing token in localStorage!");
    console.warn("Current URL:", window.location.href);
    return logoutAndRedirect();
  }
  const user = await fetchCurrentUser(token);

  const formData = new FormData(e.target);
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (!formData.has(cb.name) && cb.dataset.single !== "false") {
      formData.append(cb.name, null);
    }
  });
  ['budget_min', 'budget_max', 'wfh_days', 'noise', 'social_vibe', 'satisfaction'].forEach((key) => {
    if (formData.has(key)) {
      const val = formData.get(key);
      formData.set(key, val === '' ? null : Number(val));
    }
  });

  const data = {};
  formData.forEach((value, key) => {
    console.log(`🟨 ${key}:`, value);
    if (data[key]) {
      if (Array.isArray(data[key])) data[key].push(value);
      else data[key] = [data[key], value];
    } else {
      data[key] = value;
    }
  });

  let endpoint = '';
  let method = 'PUT';
  if (location.pathname.includes('step1')) {
    // Split into two API requests for step1
    const userPayload = {};
    const prefPayload = {};

    for (const [key, value] of formData.entries()) {
      if (['gender', 'age', 'occupation', 'nationality', 'cultural'].includes(key)) {
        userPayload[key] = value;
      } else {
        prefPayload[key] = value;
      }
    }

    // Send user fields
    await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userPayload),
    });

    // Send pref fields
    await fetch('/api/prefs/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prefPayload),
    });

    // Send hobby fields
    const hobbyIds = getSelectedHobbyIds();
    await fetch(`/api/users/${user.id}/hobbies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ hobbyIds })
    });

    // Send language fields
    const languageIds  = getSelectedLanguages();
    await fetch(`/api/users/${user.id}/languages`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ languageIds })
    });

    // ✅ Short-circuit to prevent sending a 3rd invalid request
    const nextPage = getNextPage(location.pathname);
    return (window.location.href = nextPage || 'dashboard.html');

  } else if (location.pathname.includes('step2') || location.pathname.includes('step3') || location.pathname.includes('step4')) {
    endpoint = '/api/prefs/me';
  } else if (location.pathname.includes('step5')) {
    endpoint = '/api/feedbacks';
    method = 'POST';
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to submit form');

    const nextPage = getNextPage(location.pathname);
    window.location.href = nextPage || 'dashboard.html';

  } catch (err) {
    console.error('❌ Submission error:', err);
    alert('Error submitting the form.');
  }
}

function getNextPage(path) {
  if (path.includes('step1')) return 'userinfo-step2.html';
  if (path.includes('step2')) return 'userinfo-step3.html';
  if (path.includes('step3')) return 'userinfo-step4.html';
  if (path.includes('step4')) return 'userinfo-step5.html';
  if (path.includes('step5')) return 'ai-results-loading.html';
  return null;
}

// Utility: Logout if no token
function logoutAndRedirect() {
  localStorage.clear();
  window.location.href = 'login.html';
}


// 1️⃣ Single-select checkbox logic
function applySingleSelectLogic() {
  document.querySelectorAll('.options-grid').forEach(group => {
    if (group.dataset.multiselect === 'true') return;
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) checkboxes.forEach(other => other !== cb && (other.checked = false));
    }));
  });
}

// 2️⃣ Emoji rating logic
function applyEmojiRatingLogic() {
  document.querySelectorAll('.emoji-rating').forEach(group => {
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) checkboxes.forEach(other => other !== cb && (other.checked = false));
    }));
  });
}

// 3️⃣ Allergy "Other" textbox logic
function applyAllergyOtherLogic() {
  const allergyOtherCheckbox = document.getElementById('allergy-other');
  const allergyOtherInput = document.getElementById('allergy-other-input');
  const allergyOtherText = allergyOtherInput?.querySelector('input[type="text"]');

  if (allergyOtherCheckbox && allergyOtherInput) {
    allergyOtherCheckbox.addEventListener('change', () => {
      allergyOtherInput.classList.toggle('hidden', !allergyOtherCheckbox.checked);
      if (allergyOtherCheckbox.checked) allergyOtherText?.focus();
      else if (allergyOtherText) allergyOtherText.value = '';
    });
    allergyOtherInput.classList.toggle('hidden', !allergyOtherCheckbox.checked);
  }
}

// 4️⃣ Inline validation logic
function setupValidation() {
  document.querySelectorAll('form').forEach(form => form.addEventListener('submit', e => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const errorEl = field.parentNode.querySelector('.error');
      const isEmpty = !field.value.trim();
      if (errorEl) errorEl.hidden = !isEmpty;
      if (isEmpty) valid = false;
    });
    if (!valid) e.preventDefault();
  }));
}

// 5️⃣ Language selector widget
function setupLanguageSelector(selectedLanguages) {
  const optionsList = document.getElementById("language-options");
  const selectedBox = document.getElementById("selected-languages");
  const input = document.getElementById("languages-input");
  const selected = new Set(selectedLanguages.map(lang => lang.id));
  let allLanguages = [];

  // 1. Toggle the dropdown when you click the input
  input.addEventListener("click", () => {
    optionsList.classList.toggle("hidden");
  });

  // 2. Filter the <li> based on what’s typed
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    // show/hide each <li>
    Array.from(optionsList.children).forEach(li => {
      const matches = li.textContent.toLowerCase().includes(q);
      li.style.display = matches ? "block" : "none";
    });
  });

  // 3. Fetch list of languages 
  fetch('/api/languages')
    .then(res => res.json())
    .then(languages => {
      allLanguages = languages; // cache for name lookups
      languages.forEach(lang => {
        const li = document.createElement("li");
        li.textContent = lang.name;
        li.dataset.id = lang.id;    // tag the element with its ID

        li.addEventListener("click", () => {
          const id = lang.id;
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
          li.classList.toggle("selected");
          updateSelectedDisplay();
        });

        if (selected.has(lang.id)) li.classList.add("selected");
        optionsList.appendChild(li);
      });
      updateSelectedDisplay();
    });

  function updateSelectedDisplay() {
    selectedBox.innerHTML = "";
    // now selected contains IDs; look up each name
    selected.forEach(id => {
      const lang = allLanguages.find(l => l.id === id);
      if (!lang) return;
      const tag = document.createElement("span");
      tag.className = "language-tag";
      tag.textContent = lang.name;

      tag.addEventListener("click", () => {
        selected.delete(id);
        // un-highlight the <li>
        Array.from(optionsList.children)
          .find(li => Number(li.dataset.id) === id)
          ?.classList.remove("selected");
        updateSelectedDisplay();
      });

      selectedBox.appendChild(tag);
    });
  }

  window.getSelectedLanguages = () => [...selected];
}

// 6️⃣ Hobby selection widget (limit 3)
function setupHobbySelector(selectedHobbies) {
  const hobbyTags = document.getElementById('hobby-tags');
  const hobbyDrop = document.getElementById('hobby-dropdown');
  let selected = selectedHobbies.slice();

  fetch('/api/hobbies').then(res => res.json()).then(allHobbies => {
    const render = () => {
      hobbyTags.innerHTML = '';
      selected.forEach((hobby, i) => addTag(`${hobby.icon} ${hobby.name}`, () => openSelect(i)));
      if (selected.length < 3) addTag('+ Add hobby', () => openSelect(selected.length));
    };
    const addTag = (text, cb) => {
      const div = document.createElement('div');
      div.className = 'hobby-tag';
      div.textContent = text;
      div.onclick = cb;
      hobbyTags.appendChild(div);
    };
    const openSelect = idx => {
      hobbyDrop.innerHTML = '';
      allHobbies.forEach(h => {
        const opt = new Option(`${h.icon} ${h.name}`, h.id, false, selected[idx]?.id === h.id);
        hobbyDrop.add(opt);
      });
      hobbyDrop.classList.remove('hidden');
      hobbyDrop.onchange = () => {
        const id = parseInt(hobbyDrop.value);
        if (selected.some(h => h.id === id)) return alert('Already selected');
        selected[idx] = allHobbies.find(h => h.id === id);
        hobbyDrop.classList.add('hidden');
        render();
      };
    };
    render();
  });

  window.getSelectedHobbyIds = () => selected.map(h => h.id);
}