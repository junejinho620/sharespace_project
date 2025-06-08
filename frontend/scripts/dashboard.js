document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const compRes = await fetch('/api/users/me/completion', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const { percent } = await compRes.json();
        document.querySelector('.progress-fill').style.width = `${percent}%`;
        document.querySelector('.progress-text').innerText = `${percent}% Complete`;
      } else {
        console.warn('Failed to fetch completion status');
      }
    }

    document.querySelector('.cta-button')?.addEventListener('click', async () => {
      const res = await fetch('/api/users/me/completion', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const { incompleteFields } = await res.json();

      if (incompleteFields.length === 0) {
        alert("✅ Your profile is already complete!");
        return;
      }

      const fieldToPage = {
        // step 1
        gender: 1, age: 1, occupation: 1, wfh_days: 1, budget_min: 1, budget_max: 1, stay: 1,
        // step 2
        work_hours: 2, bedtime: 2, noise: 2, cleanliness: 2, clean_freq: 2,
        // step 3
        pets: 3, smoking: 3, alcohol: 3, diet: 3, kitchen_sharing: 3, bathroom: 3,
        // step 4
        own_guest_freq: 4, roommate_guest: 4, social_vibe: 4, roommate_gender: 4, lgbtq: 4, allergies: 4, allergy_custom: 4
      };

      let lowestStep = 5;
      incompleteFields.forEach(field => {
        if (fieldToPage[field] && fieldToPage[field] < lowestStep) {
          lowestStep = fieldToPage[field];
        }
      });

      window.location.href = `/userinfo-step${lowestStep}.html`;
    });

    // 1) Grab matchedFomi from localStorage
    const matchedFomi = localStorage.getItem('matchedFomi');
    if (!matchedFomi) {
      // If not found, you can redirect back to loading or show a message
      console.warn('No matchedFomi in localStorage.');
      return;
    }

    // 1b) If missing, fall back to asking the server
    if (!matchedFomi) {
      const token = localStorage.getItem('token'); // or however you send auth
      const res2 = await fetch('/api/users/me/fomi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res2.ok) throw new Error('Failed to fetch user’s Fomi from server');
      const json2 = await res2.json();
      matchedFomi = json2.matchedFomi;
      // Save to localStorage for future visits
      localStorage.setItem('matchedFomi', matchedFomi);
    }

    // 2) Fetch Fomi details from our new endpoint
    const res = await fetch(`/api/fomis/${encodeURIComponent(matchedFomi)}/details`);
    if (!res.ok) throw new Error('Failed to fetch Fomi details');
    const data = await res.json();

    // 3) Update Profile Snapshot
    document.getElementById('profile-img').src = data.photo_url;
    document.getElementById('profile-label').innerText = data.name;

    // 4) If you have a description map, insert it. Otherwise, use a default based on name:
    const descMap = {
      "Quiet Fomi": "Hi, I’m Quiet Fomi. I thrive in peaceful, tidy spaces and value respectful silence. Let’s keep things calm and organized!",
      "Energy Fomi": "Hi, I’m Energy Fomi. I’m outgoing, love background noise, and thrive in a lively environment. Let’s keep the party going!",
      "Emotional Fomi": "Hi, I’m Emotional Fomi. I’m empathetic, caring, and value a supportive roommate who shares feelings openly. Let’s be there for each other!",
      "Free Fomi": "Hi, I’m Free Fomi. I’m spontaneous, laid-back, and flexible about schedules and rules. Let’s go with the flow together!",
      "Wanderer Fomi": "Hi, I’m Wanderer Fomi. I love adventure, travel often, and bring stories from every trip. Let’s explore new places anytime!",
      "Noisy Fomi": "Hi, I’m Noisy Fomi. Background music, TV, and late-night chats energize me. If you don’t mind noise, we’ll get along great!",
      "Moderate Fomi": "Hi, I’m Moderate Fomi. I’m balanced—neither too messy nor obsessed with perfection. I’m easygoing and adapt to most situations.",
      "Sensitive Fomi": "Hi, I’m Sensitive Fomi. I need low noise and routine and appreciate gentle consideration. Let’s keep the vibe calm and supportive!",
      "Care Fomi": "Hi, I’m Care Fomi. I love cooking, cleaning, and looking out for others. Let’s create a warm, nurturing home together!",
      "Homebody Fomi": "Hi, I’m Homebody Fomi. I’m happiest during cozy nights in with books or movies. Let’s make home our favorite place!",
      "Coexist Fomi": "Hi, I’m Coexist Fomi. I’m great at compromise, ensuring everyone feels comfortable and respected. Let’s build harmony together!",
      "Balanced Fomi": "Hi, I’m Balanced Fomi. I’m equally comfortable socializing or relaxing and keep a stable, predictable routine. Let’s enjoy the best of both worlds!",
      "Night Owl Fomi": "Hi, I’m Night Owl Fomi. I come alive after dark and appreciate quiet mornings. If you’re okay with late-night routines, we’ll be a perfect match!",
      "Independent Fomi": "Hi, I’m Independent Fomi. I value privacy and personal space and take care of most things on my own. Let’s respect each other’s independence!",
      "Collab Fomi": "Hi, I’m Collab Fomi. I thrive on teamwork—whether cooking, working out, or planning activities. Let’s collaborate and make shared moments fun!",
      "Adaptive Fomi": "Hi, I’m Adaptive Fomi. I easily adjust to any routine or energy level, fitting right in no matter the situation. Let’s adapt and get along effortlessly!"
    };
    document.getElementById('profile-desc').innerText = descMap[data.name] || "Welcome to ShareSpace!";

    // 5) Compute & render trait bars
    //    ‣ data.traits is an object, e.g. { Introversion: 5, Extroversion: 1, Cleanliness: 4, "Noise Tolerance": 5, … }
    const t = data.traits;

    // Helper: percent = (value / 5) * 100, rounded
    const pct = v => Math.round((v / 5) * 100);

    // Introversion vs Extroversion
    const introP = pct(t.Introversion);
    const extroP = 100 - introP;
    document.getElementById('intro-left').innerHTML = `${introP}%<br>Introvert`;
    document.getElementById('intro-right').innerHTML = `${extroP}%<br>Extrovert`;
    document.getElementById('intro-bar-fill').style.width = `${introP}%`;

    // Tidy vs Messy (Cleanliness)
    const tidyP = pct(t.Cleanliness);
    const messyP = 100 - tidyP;
    document.getElementById('tidy-left').innerHTML = `${tidyP}%<br>Tidy`;
    document.getElementById('tidy-right').innerHTML = `${messyP}%<br>Messy`;
    document.getElementById('tidy-bar-fill').style.width = `${tidyP}%`;

    // Quiet vs Loud (Noise Tolerance)
    // ‣ A higher Noise Tolerance means "more quiet‐friendly," so:
    const quietP = pct(t['Noise Tolerance']);
    const loudP = 100 - quietP;
    document.getElementById('quiet-left').innerHTML = `${loudP}%<br>Loud`;
    document.getElementById('quiet-right').innerHTML = `${quietP}%<br>Quiet`;
    document.getElementById('quiet-bar-fill').style.width = `${quietP}%`;

    // 6) Show Best/Worst partners
    const bestName = Array.isArray(data.bestMatches) ? data.bestMatches[0] : null;
    const worstName = Array.isArray(data.worstMatches) ? data.worstMatches[0] : null;

    // A small helper to build the inner HTML of one partner‐card
    async function renderPartnerCard(cardId, fomiName, cardType) {
      if (!fomiName) {
        // If no name found, hide the card entirely
        return document.getElementById(cardId).style.display = 'none';
      }

      // 1) Fetch details for that fomi
      const resp = await fetch(`/api/fomis/${encodeURIComponent(fomiName)}/details`);
      if (!resp.ok) throw new Error(`Failed to fetch details for ${fomiName}`);
      const partnerData = await resp.json();

      const description = descMap[partnerData.name] || "";

      // 3) Insert into the appropriate <div id="…">
      document.getElementById(cardId).innerHTML = `
    <div class="partner-image-container">
      <img
        src="${partnerData.photo_url}"
        alt="${partnerData.name}"
        class="partner-img" />
    </div>
    <div class="partner-name">${partnerData.name}</div>
    <hr />
    <div class="partner-desc">${description}</div>
  `;
    }

    // 7) Call the helper for both best and worst
    await renderPartnerCard('best-partner', bestName, 'best-card');
    await renderPartnerCard('worst-partner', worstName, 'worst-card');

    // 8) Navigate user to pricing plan
    document.getElementById('upgrade-button')?.addEventListener('click', () => {
      window.location.href = '/pricing.html';
    });
  }
  catch (err) {
    console.error('Error populating dashboard:', err);
  }
});

const quotes = [
  { text: "A good roommate is like a four-leaf clover: hard to find and lucky to have.", author: "ShareSpace" },
  { text: "Roommates: because rent is better shared, just like laughter.", author: "ShareSpace" },
  { text: "The best roommates make the best memories.", author: "ShareSpace" },
  { text: "Living together teaches us patience, empathy... and how to label leftovers.", author: "Roommate Truths" },
  { text: "Respect is the rent we pay to live peacefully together.", author: "ShareSpace" }
];

const quote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById('quoteText').textContent = `“${quote.text}”`;
document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;