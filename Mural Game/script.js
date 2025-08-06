const locations = [
  {
    name: 'Satay',
    coords: [1.3027748202508007, 103.85841118326272],
    description: "It's a popular Southeast Asian dish of skewered, grilled meat, often served with a rich peanut sauce. You’ll often find it at street stalls in Indonesia, Malaysia, and Singapore.",
    image: 'images/Satay.jpg',
    number: 1
  },
  {
    name: 'Trolley',
    coords: [1.3046062233944278, 103.85995180773685],
    description: "It’s a wheeled cart used to carry items, often seen in supermarkets or airports. Sometimes, it’s also called a shopping cart or luggage cart.",
    image: 'images/Trolley.jpg',
    number: 2
  },
  {
    name: 'Athletes',
    coords: [1.3035081037865488, 103.85902189385985],
    description: "They are sportsmen and sportswomen who represent Singapore in local and international competitions. Some famous ones include Joseph Schooling in swimming and Loh Kean Yew in badminton.",
    image: 'images/Athletes.jpg',
    number: 3
  },
  {
    name: 'Jewels',
    coords: [1.301024645679672, 103.85962451983654],
    description: "They are precious stones like diamonds or rubies, often used in making fine jewelry. People treasure them for their beauty, rarity, and value.",
    image: 'images/Jewels.jpg',
    number: 4
  },
  {
    name: 'Sultan Mosque',
    coords: [1.3022508887904074, 103.85896727975616],
    description: "It’s a famous mosque in Kampong Glam, known for its golden dome and rich history. Built in the 1920s, it’s a key landmark for Singapore’s Muslim community.",
    image: 'images/Sultan Mosque.jpg',
    number: 5
  },
  {
    name: 'Aztec',
    coords: [1.3001183212286607, 103.85956204655417],
    description: "They were an ancient civilization in Mexico known for their powerful empire and grand temples. They are also famous for their warriors, intricate art, and worship of many gods.",
    image: 'images/Aztec.jpg',
    number: 6
  },
  {
    name: 'Kampung',
    coords: [1.3016360303489687, 103.85895230987227],
    description: "It’s a Malay word meaning “village,” often used to describe traditional rural communities. In Singapore and Malaysia, these places are known for their close-knit neighbors and simple way of life.",
    image: 'images/Kampung.jpg',
    number: 7
  },
  {
    name: 'Wedding',
    coords: [1.3024320397682627, 103.85966590601592],
    description: "It’s a traditional celebration rich with customs like the bersanding ceremony, where the bride and groom sit on a decorated dais. Malay ______ often feature vibrant attire, cultural performances, and a grand feast called the kenduri.",
    image: 'images/Wedding.jpg',
    number: 8
  },
  {
    name: 'Phoenix',
    coords: [1.3021298890740542, 103.8594970100109],
    description: "An imaginary bird that, according to ancient stories, burns itself to ashes every five hundred years and is then born again.",
    image: 'images/Phoenix.jpg',
    number: 9
  },
  {
    name: 'Vintage Camera Museum',
    coords: [1.3035450744003545, 103.85896463553551],
    description: "A unique museum showcasing vintage cameras and photography equipment from different eras. It's a fascinating place for photography enthusiasts and history buffs.",
    image: 'images/Vintage Camera Museum.jpg',
    number: 10
  },
  {
    name: 'Golden Landmark Shopping Complex',
    coords: [1.3022776388010917, 103.858090912164],
    description: "A shopping center known for its golden facade and diverse retail offerings. It's a popular destination for locals and tourists looking for various goods and services.",
    image: 'images/Golden Landmark Shopping Complex.jpg',
    number: 11
  },
  {
    name: 'The Blackbook Studio',
    coords: [1.3022299274744695, 103.86059141843883],
    description: "A creative studio space where artists and designers work on various projects. It's a hub for artistic expression and collaboration in the local community.",
    image: 'images/The Blackbook Studio.jpg',
    number: 12
  }
];

const answers = {
  1: 'Satay',
  2: 'Trolley',
  3: 'Athletes',
  4: 'Jewels',
  5: 'Sultan Mosque',
  6: 'Aztec',
  7: 'Kampung',
  8: 'Wedding',
  9: 'Phoenix',
  10: 'Vintage Camera Museum',
  11: 'Golden Landmark Shopping Complex',
  12: 'The Blackbook Studio'
};

const map = L.map('map').setView([1.3027748202508007, 103.85841118326272], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Global hangman state (shared across all popups)
let globalWrongCount = 0;
const maxWrong = 10;

// Track which murals have been answered correctly
const correctAnswers = {};

function checkAllCorrect() {
  // Only check the 9 locations with text input forms (excluding photo-only locations 10, 11, 12)
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].every(num => correctAnswers[num]);
}

function showConfetti() {
  // Simple confetti using canvas
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.top = 0;
  confettiCanvas.style.left = 0;
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = 9999;
  document.body.appendChild(confettiCanvas);
  const ctx = confettiCanvas.getContext('2d');
  const pieces = Array.from({length: 120}, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * -confettiCanvas.height,
    r: 6 + Math.random() * 6,
    d: 8 + Math.random() * 8,
    color: `hsl(${Math.random()*360},90%,60%)`,
    tilt: Math.random() * 10 - 5,
    tiltAngle: 0
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }
  function update() {
    frame++;
    pieces.forEach(p => {
      p.y += Math.cos(frame/10 + p.d) + 2 + p.d/10;
      p.x += Math.sin(frame/10) * 2;
      p.tiltAngle += 0.1;
      p.tilt = Math.sin(p.tiltAngle) * 10;
      if (p.y > confettiCanvas.height) {
        p.y = -10;
        p.x = Math.random() * confettiCanvas.width;
      }
    });
  }
  let count = 0;
  function animate() {
    draw();
    update();
    count++;
    if (count < 120) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(confettiCanvas);
    }
  }
  animate();
}

locations.forEach(loc => {
  const isAttraction = loc.number === 5;
  const isSpecialLocation = loc.number === 10 || loc.number === 11 || loc.number === 12; // Vintage Camera Museum, Golden Landmark, Blackbook Studio
  
  // Create custom icon for special locations (red pins)
  let customIcon;
  if (isSpecialLocation) {
    customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  } else {
    // Default blue pin for regular locations
    customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }
  
  const label = isAttraction ? `Attraction #${loc.number}` : `Attraction #${loc.number}`;
  const answer = answers[loc.number];
  const letterHint = answer ? ` (${answer.length} letters${answer.includes(' ') ? ', includes space' : ''})` : '';
  const detailsContent = isSpecialLocation ? `
    <div style="width:80%;max-width:300px;margin:0 auto;">
      <strong>${label}</strong><br>
      <img src="${loc.image}" alt="${loc.name}" style="width:100%;border-radius:8px;margin:12px 0;max-height:220px;object-fit:cover;display:block;" />
      <span><strong>${loc.name}:</strong> ${loc.description}</span><br><br>
      <div style="background:#f0f8ff;padding:1em;border-radius:8px;border-left:4px solid #007b5e;margin:1em 0;">
        <strong style="color:#007b5e;">📸 Photo Challenge!</strong><br>
        <span style="font-size:0.9em;">Take a wefie or photo of this location!</span>
      </div>
    </div>
  ` : `
    <div style="width:80%;max-width:300px;margin:0 auto;">
      <strong>${label}</strong><br>
      <img src="${loc.image}" alt="${loc.name}" style="width:100%;border-radius:8px;margin:12px 0;max-height:220px;object-fit:cover;display:block;" />
      <span>${loc.description}</span><br>
      <em>Answer length: ${letterHint}</em><br><br>
      <form class="guess-form" data-mural="${loc.number}">
        <input type="text" class="guess-input" placeholder="Your guess..." autocomplete="off" required style="width: 100%; margin-bottom: 0.8em;" />
        <button type="submit" style="width: 100%;">Submit</button>
        <div class="guess-result" style="margin-top: 0.8em; min-height: 1.2em;"></div>
      </form>
    </div>
    <canvas class="hangman-canvas" width="120" height="120" style="display:block;margin:15px auto 0 auto;background:#f8f8f8;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.06);"></canvas>
  `;
  const marker = L.marker(loc.coords, { icon: customIcon }).addTo(map);
  marker.on('click', function() {
    // Show details below the map
    const details = document.getElementById('marker-details');
    details.innerHTML = detailsContent;
    // Draw hangman for this mural
    const canvas = details.querySelector('.hangman-canvas');
    drawHangman(canvas, globalWrongCount);
    // If already correct, disable input and show answer
    const form = details.querySelector('.guess-form');
    if (form) {
      const muralNum = parseInt(form.getAttribute('data-mural'), 10);
      if (correctAnswers[muralNum]) {
        const input = form.querySelector('.guess-input');
        const button = form.querySelector('button');
        const result = form.querySelector('.guess-result');
        input.disabled = true;
        button.disabled = true;
        result.textContent = `Correct! The answer is: ${answers[muralNum]}`;
        result.style.color = '#1ca94c';
      }
    }
    // Scroll to details if on mobile
    if (window.innerWidth < 700) {
      details.scrollIntoView({behavior: 'smooth'});
    }
  });
});

// Remove the global guess box if it exists
const oldGuessBox = document.getElementById('guess-box');
if (oldGuessBox) oldGuessBox.remove();

// Hangman drawing logic
function drawHangman(canvas, wrongCount) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  // 1. Base
  if (wrongCount > 0) {
    ctx.beginPath(); ctx.moveTo(10, 110); ctx.lineTo(110, 110); ctx.stroke();
  }
  // 2. Pole
  if (wrongCount > 1) {
    ctx.beginPath(); ctx.moveTo(30, 110); ctx.lineTo(30, 20); ctx.stroke();
  }
  // 3. Beam
  if (wrongCount > 2) {
    ctx.beginPath(); ctx.moveTo(30, 20); ctx.lineTo(80, 20); ctx.stroke();
  }
  // 4. Rope
  if (wrongCount > 3) {
    ctx.beginPath(); ctx.moveTo(80, 20); ctx.lineTo(80, 35); ctx.stroke();
  }
  // 5. Head
  if (wrongCount > 4) {
    ctx.beginPath(); ctx.arc(80, 45, 10, 0, Math.PI * 2); ctx.stroke();
  }
  // 6. Body
  if (wrongCount > 5) {
    ctx.beginPath(); ctx.moveTo(80, 55); ctx.lineTo(80, 85); ctx.stroke();
  }
  // 7. Left Arm
  if (wrongCount > 6) {
    ctx.beginPath(); ctx.moveTo(80, 65); ctx.lineTo(65, 75); ctx.stroke();
  }
  // 8. Right Arm
  if (wrongCount > 7) {
    ctx.beginPath(); ctx.moveTo(80, 65); ctx.lineTo(95, 75); ctx.stroke();
  }
  // 9. Left Leg
  if (wrongCount > 8) {
    ctx.beginPath(); ctx.moveTo(80, 85); ctx.lineTo(70, 105); ctx.stroke();
  }
  // 10. Right Leg
  if (wrongCount > 9) {
    ctx.beginPath(); ctx.moveTo(80, 85); ctx.lineTo(90, 105); ctx.stroke();
  }
}

// Update: Delegate form handling for guess forms in #marker-details
// Remove previous event listener for popups

document.addEventListener('submit', function(e) {
  if (e.target && e.target.classList.contains('guess-form')) {
    e.preventDefault();
    const muralNum = parseInt(e.target.getAttribute('data-mural'), 10);
    const input = e.target.querySelector('.guess-input');
    const result = e.target.querySelector('.guess-result');
    const userGuess = input.value.trim().toLowerCase();
    const correctAnswer = answers[muralNum].toLowerCase();
    // Find the canvas in the same details container
    const container = e.target.closest('#marker-details') || e.target.closest('.leaflet-popup-content');
    const canvas = container.querySelector('.hangman-canvas');
    if (userGuess === correctAnswer) {
      result.textContent = `Correct! The answer is: ${answers[muralNum]}`;
      result.style.color = '#1ca94c';
      input.disabled = true;
      e.target.querySelector('button').disabled = true;
      correctAnswers[muralNum] = true;
      if (checkAllCorrect()) {
        setTimeout(() => {
          alert('Good job, you answered all correctly!');
          showConfetti();
        }, 300);
      }
    } else {
      result.textContent = 'Wrong!';
      result.style.color = '#d32f2f';
      globalWrongCount = Math.min(globalWrongCount + 1, maxWrong);
    }
    drawHangman(canvas, globalWrongCount);
    if (globalWrongCount >= maxWrong) {
      result.innerHTML = '<b style="color:#d32f2f;">Game Over</b>';
      setTimeout(() => {
        if (window.confirm('Game Over! Do you want to restart?')) {
          globalWrongCount = 0;
          drawHangman(canvas, globalWrongCount);
          result.textContent = '';
        }
      }, 200);
    }
    input.value = '';
  }
});

// Remove Leaflet popupopen logic for murals (not needed)

// User location tracking
let userLocationMarker = null;
let userLocationCircle = null;

function onLocationFound(e) {
  // Remove previous location marker and circle if they exist
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
  }
  if (userLocationCircle) {
    map.removeLayer(userLocationCircle);
  }
  
  // Create new location marker (without popup)
  userLocationMarker = L.marker(e.latlng, {icon: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })}).addTo(map);
}

function onLocationError(e) {
  console.log('Location error:', e.message);
  
  // Show a more user-friendly error message
  let errorMessage = 'Unable to get your location. ';
  
  switch(e.code) {
    case 1:
      errorMessage += 'Please allow location access in your browser settings.';
      break;
    case 2:
      errorMessage += 'Location unavailable. Please try again.';
      break;
    case 3:
      errorMessage += 'Location request timed out. Please try again.';
      break;
    default:
      errorMessage += 'Please try refreshing the page.';
  }
  
  // Create a temporary notification instead of an alert
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 300px;
    font-size: 14px;
  `;
  notification.textContent = errorMessage;
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Try to locate with longer timeout and better options
map.locate({
  setView: false, 
  maxZoom: 17, 
  watch: true,
  timeout: 30000, // 30 seconds timeout
  maximumAge: 60000, // Accept cached location up to 1 minute old
  enableHighAccuracy: true // Request high accuracy
});

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}); 
