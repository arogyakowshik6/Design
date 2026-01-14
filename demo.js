const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const mouse = { x: null, y: null };

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("click", e => {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(e.x, e.y, true));
  }
});

class Particle {
  constructor(x, y, burst = false) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = burst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5);
    this.speedY = burst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5);
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update() {
    if (mouse.x) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        this.speedX += dx * 0.0005;
        this.speedY += dy * 0.0005;
      }
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.speedX *= 0.99;
    this.speedY *= 0.99;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < 400; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

init();
animate();
