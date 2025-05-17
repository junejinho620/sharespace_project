document.querySelectorAll('.options-grid').forEach(group => {
  const checkboxes = group.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
    });
  });
});

// Inline validation on submit
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const errorEl = field.parentNode.querySelector('.error');
    if (!field.value.trim()) {
      valid = false;
      errorEl.hidden = false;
    } else {
      errorEl.hidden = true;
    }
  });

  if (valid) {
    // e.g. form.submit(); or your next-page logic here
    console.log('All good – proceed');
  }
});

// Language Selection
const languages = [
  "Afrikaans", "Arabic", "Bengali", "Cantonese", "Dutch", "English", "French", "German",
  "Hindi", "Indonesian", "Italian", "Japanese", "Kannada", "Korean", "Malay", "Mandarin Chinese",
  "Marathi", "Persian", "Polish", "Portuguese", "Punjabi", "Russian", "Spanish", "Swahili",
  "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Other"
];

const optionsList = document.getElementById("language-options");
const selectedBox = document.getElementById("selected-languages");

function createLanguageList() {
  languages.forEach(lang => {
    const li = document.createElement("li");
    li.textContent = lang;
    li.onclick = () => toggleSelection(lang, li);
    optionsList.appendChild(li);
  });
}

const selected = new Set();

function toggleSelection(lang, li) {
  if (selected.has(lang)) {
    selected.delete(lang);
    li.classList.remove("selected");
  } else {
    selected.add(lang);
    li.classList.add("selected");
  }
  updateSelectedDisplay();
}

function updateSelectedDisplay() {
  selectedBox.innerHTML = "";
  selected.forEach(lang => {
    const tag = document.createElement("span");
    tag.className = "language-tag";
    tag.textContent = lang;
    tag.onclick = () => {
      // Deselect by clicking tag
      selected.delete(lang);
      document.querySelectorAll("#language-options li").forEach(li => {
        if (li.textContent === lang) li.classList.remove("selected");
      });
      updateSelectedDisplay();
    };
    selectedBox.appendChild(tag);
  });
}

function filterLanguages() {
  const input = document.getElementById("languages-input").value.toLowerCase();
  document.querySelectorAll("#language-options li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(input) ? "block" : "none";
  });
}

function toggleLanguageDropdown() {
  optionsList.classList.toggle("hidden");
}

createLanguageList();

// Loading spinner on primary button
const primaryBtn = document.querySelector('.button--primary');
form.addEventListener('submit', () => {
  primaryBtn.classList.add('loading');
});