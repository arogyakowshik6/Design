const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleCount = 100;
let connectionDistance = 150;
let particleSpeed = 1;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };
let hue = 200;

// Color schemes
const colorSchemes = [
    { particle: 'rgba(102, 126, 234, 0.8)', line: 'rgba(102, 126, 234, 0.2)' },
    { particle: 'rgba(255, 107, 107, 0.8)', line: 'rgba(255, 107, 107, 0.2)' },
    { particle: 'rgba(78, 205, 196, 0.8)', line: 'rgba(78, 205, 196, 0.2)' },
    { particle: 'rgba(255, 195, 0, 0.8)', line: 'rgba(255, 195, 0, 0.2)' },
    { particle: 'rgba(199, 0, 57, 0.8)', line: 'rgba(199, 0, 57, 0.2)' }
];
let currentColorScheme = 0;

class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() * 2 - 1) * particleSpeed;
        this.speedY = (Math.random() * 2 - 1) * particleSpeed;
        this.color = colorSchemes[currentColorScheme].particle;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                const opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = colorSchemes[currentColorScheme].line.replace('0.2', opacity * 0.3);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

let lastTime = 0;
let fps = 0;

function animate(currentTime) {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    
    // Calculate FPS
    if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').textContent = Math.round(fps);
        fps = 0;
        lastTime = currentTime;
    }
    fps++;
    
    requestAnimationFrame(animate);
}

// Event listeners
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

canvas.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(e.x, e.y));
    }
    document.getElementById('activeParticles').textContent = particles.length;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Controls
document.getElementById('particleSlider').addEventListener('input', (e) => {
    particleCount = parseInt(e.target.value);
    document.getElementById('particleCount').textContent = particleCount;
    init();
    document.getElementById('activeParticles').textContent = particles.length;
});

document.getElementById('distanceSlider').addEventListener('input', (e) => {
    connectionDistance = parseInt(e.target.value);
    document.getElementById('distanceValue').textContent = connectionDistance;
});

document.getElementById('speedSlider').addEventListener('input', (e) => {
    particleSpeed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = particleSpeed;
    particles.forEach(p => {
        const speed = Math.sqrt(p.speedX * p.speedX + p.speedY * p.speedY);
        const angle = Math.atan2(p.speedY, p.speedX);
        p.speedX = Math.cos(angle) * particleSpeed;
        p.speedY = Math.sin(angle) * particleSpeed;
    });
});

document.getElementById('colorBtn').addEventListener('click', () => {
    currentColorScheme = (currentColorScheme + 1) % colorSchemes.length;
    particles.forEach(p => {
        p.color = colorSchemes[currentColorScheme].particle;
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    particleCount = 100;
    connectionDistance = 150;
    particleSpeed = 1;
    document.getElementById('particleSlider').value = 100;
    document.getElementById('distanceSlider').value = 150;
    document.getElementById('speedSlider').value = 1;
    document.getElementById('particleCount').textContent = 100;
    document.getElementById('distanceValue').textContent = 150;
    document.getElementById('speedValue').textContent = 1;
    init();
    document.getElementById('activeParticles').textContent = particles.length;
});

document.getElementById('explodeBtn').addEventListener('click', () => {
    particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const force = 5;
        p.speedX = Math.cos(angle) * force;
        p.speedY = Math.sin(angle) * force;
    });
    
    setTimeout(() => {
        particles.forEach(p => {
            p.speedX = (Math.random() * 2 - 1) * particleSpeed;
            p.speedY = (Math.random() * 2 - 1) * particleSpeed;
        });
    }, 2000);
});

init();
animate(0);
