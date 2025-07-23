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
    description: "They were an ancient civilization in Mexico known for their powerful empire and grand temples. The Aztecs are also famous for their warriors, intricate art, and worship of many gods.",
    image: 'images/Aztec.jpg',
    number: 6
  },
  {
    name: 'Kampung',
    coords: [1.3016360303489687, 103.85895230987227],
    description: "It’s a Malay word meaning “village,” often used to describe traditional rural communities. In Singapore and Malaysia, kampungs are known for their close-knit neighbors and simple way of life.",
    image: 'images/Kampung.jpg',
    number: 7
  },
  {
    name: 'Wedding',
    coords: [1.3024320397682627, 103.85966590601592],
    description: "It’s a traditional celebration rich with customs like the bersanding ceremony, where the bride and groom sit on a decorated dais. Malay weddings often feature vibrant attire, cultural performances, and a grand feast called the kenduri.",
    image: 'images/Wedding.jpg',
    number: 8
  },
  {
    name: 'Phoenix',
    coords: [1.3021298890740542, 103.8594970100109],
    description: "A phoenix is an imaginary bird that, according to ancient stories, burns itself to ashes every five hundred years and is then born again.",
    image: 'images/Phoenix.jpg',
    number: 9
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
  9: 'Phoenix'
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
  // There are 8 murals/attractions
  return Object.keys(answers).every(num => correctAnswers[num]);
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
  const label = isAttraction ? `Attraction #${loc.number}` : `Mural #${loc.number}`;
  const answer = answers[loc.number];
  const letterHint = answer ? ` (${answer.length} letters${answer.includes(' ') ? ', includes space' : ''})` : '';
  const popupContent = `
    <strong>${label}</strong><br>
    <img src="${loc.image}" alt="${loc.name}" style="width:100%;border-radius:8px;margin:8px 0;max-height:120px;object-fit:cover;" />
    <span>${loc.description}</span><br>
    <em>Answer length: ${letterHint}</em><br><br>
    <form class="guess-form" data-mural="${loc.number}">
      <input type="text" class="guess-input" placeholder="Your guess..." autocomplete="off" required style="width: 90%; margin-bottom: 0.5em;" />
      <button type="submit" style="width: 100%;">Submit</button>
      <div class="guess-result" style="margin-top: 0.5em; min-height: 1.2em;"></div>
    </form>
    <canvas class="hangman-canvas" width="120" height="120" style="display:block;margin:10px auto 0 auto;background:#f8f8f8;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.06);"></canvas>
  `;
  const marker = L.marker(loc.coords).addTo(map)
    .bindPopup(popupContent, {autoPan: true});
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

// Remove per-mural hangman state
// Delegate form handling for guess forms in popups
document.addEventListener('submit', function(e) {
  if (e.target && e.target.classList.contains('guess-form')) {
    e.preventDefault();
    const muralNum = parseInt(e.target.getAttribute('data-mural'), 10);
    const input = e.target.querySelector('.guess-input');
    const result = e.target.querySelector('.guess-result');
    const userGuess = input.value.trim().toLowerCase();
    const correctAnswer = answers[muralNum].toLowerCase();
    const popup = e.target.closest('.leaflet-popup-content');
    const canvas = popup.querySelector('.hangman-canvas');
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

// When popup opens, if mural is already correct, show answer and disable input
map.on('popupopen', function(e) {
  const popup = e.popup.getElement();
  const form = popup.querySelector('.guess-form');
  if (form) {
    const muralNum = parseInt(form.getAttribute('data-mural'), 10);
    const canvas = popup.querySelector('.hangman-canvas');
    drawHangman(canvas, globalWrongCount);
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
});

// User location tracking
function onLocationFound(e) {
  const radius = e.accuracy / 2;
  L.marker(e.latlng, {icon: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })}).addTo(map)
    .bindPopup("You are here").openPopup();
  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 17, watch: true});

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