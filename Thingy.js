// ==============================
// Fade-in Sections
// ==============================
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
      else entry.target.classList.remove('visible');
    });
  },
  { threshold: 0.2 }
);
sections.forEach(sec => observer.observe(sec));

// ==============================
// Starfield Background
// ==============================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let w, h;

function resizeStars() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStars);
resizeStars();

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3
  });
}

function animateStars() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(184,79,255,0.8)';
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0) s.x = w;
    if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h;
    if (s.y > h) s.y = 0;
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// ==============================
// Floating Shapes
// ==============================
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, i) => {
  shape.style.animationDelay = `${i * 0.5}s`;
});

// ==============================
// Tech Tree with Curved Lines & Glow
// ==============================
const nodes = document.querySelectorAll('.node');
const canvasTree = document.getElementById('connections');
const ctxTree = canvasTree.getContext('2d');

function animateTechTree() {
  canvasTree.width = canvasTree.offsetWidth;
  canvasTree.height = canvasTree.offsetHeight;
  ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);

  const centerNode = [...nodes].find(n => n.dataset.name === 'Megamind');
  const cx = centerNode.offsetLeft + centerNode.offsetWidth / 2;
  const cy = centerNode.offsetTop + centerNode.offsetHeight / 2;

  // Animate nodes appearing
  nodes.forEach((n, i) =>
    setTimeout(() => {
      n.style.opacity = 1;
      n.style.transform = 'scale(1)';
    }, i * 150)
  );

  // Create lines data
  const lines = [...nodes]
    .filter(n => n.dataset.name !== 'Megamind')
    .map(n => {
      const x = n.offsetLeft + n.offsetWidth / 2;
      const y = n.offsetTop + n.offsetHeight / 2;
      return { x1: cx, y1: cy, x2: x, y2: y, progress: 0 };
    });

  // Draw curved line
  function drawCurvedLine(x1, y1, x2, y2, progress) {
    const midX = (x1 + x2) / 2 + Math.sin(Date.now() / 500) * 50;
    const midY = (y1 + y2) / 2 + Math.cos(Date.now() / 500) * 50;
    ctxTree.beginPath();
    ctxTree.moveTo(x1, y1);
    ctxTree.quadraticCurveTo(
      midX,
      midY,
      x1 + (x2 - x1) * progress,
      y1 + (y2 - y1) * progress
    );
    ctxTree.stroke();
  }

  // Animate lines
  function animateLines() {
    ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);

    lines.forEach(line => {
      line.progress += 0.02;
      if (line.progress > 1) line.progress = 1;

      // Background line
      ctxTree.strokeStyle = 'rgba(184,79,255,0.15)';
      ctxTree.lineWidth = 2;
      drawCurvedLine(line.x1, line.y1, line.x2, line.y2, 1);

      // Animated foreground line
      ctxTree.strokeStyle = 'rgba(224,100,255,0.8)';
      ctxTree.lineWidth = 3;
      drawCurvedLine(line.x1, line.y1, line.x2, line.y2, line.progress);

      // Glow dot moving along the line
      const px = line.x1 + (line.x2 - line.x1) * line.progress;
      const py = line.y1 + (line.y2 - line.y1) * line.progress + Math.sin(Date.now() / 200) * 3;
      ctxTree.beginPath();
      ctxTree.arc(px, py, 4, 0, Math.PI * 2);
      ctxTree.fillStyle = '#b84fff';
      ctxTree.fill();
    });

    requestAnimationFrame(animateLines);
  }

  animateLines();
}

window.addEventListener('load', animateTechTree);
window.addEventListener('resize', animateTechTree);

// ==============================
// Optional: Node Hover Glow Animation
// ==============================
nodes.forEach(node => {
  node.addEventListener('mouseenter', () => {
    node.style.zIndex = 3; // bring to front
  });
  node.addEventListener('mouseleave', () => {
    node.style.zIndex = 2;
  });
});
