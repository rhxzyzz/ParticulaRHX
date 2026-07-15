const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurar canvas
canvas.width = 900;
canvas.height = 600;

// Variáveis globais
let particles = [];
let isAnimating = false;
let shapeMode = 'heart'; // 'heart' ou 'x'

class Particle {
    constructor(x, y, targetX, targetY, color = '#ff69b4') {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.opacity = 0;
        this.mass = this.radius;
    }

    update() {
        // Forças de atração
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            const force = 0.0015;
            this.ax = (dx / distance) * force;
            this.ay = (dy / distance) * force;
        }

        // Aplicar aceleração
        this.vx += this.ax;
        this.vy += this.ay;

        // Damping (amortecimento)
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Atualizar posição
        this.x += this.vx;
        this.y += this.vy;

        // Aumentar opacidade quando perto do alvo
        const distToTarget = Math.sqrt(dx * dx + dy * dy);
        if (distToTarget < 100) {
            this.opacity = Math.min(this.opacity + 0.03, 1);
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Função para gerar pontos em forma de coração
function generateHeartPoints(centerX, centerY, scale = 1) {
    const points = [];
    for (let t = 0; t < Math.PI * 2; t += 0.02) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        
        points.push({
            x: centerX + x * scale * 2,
            y: centerY - y * scale * 2
        });
    }
    return points;
}

// Função para gerar pontos em forma de X
function generateXPoints(centerX, centerY, size = 1) {
    const points = [];
    const spacing = 10;
    
    // Linha diagonal 1 (de cima-esquerda para baixo-direita)
    for (let i = -size; i <= size; i += spacing) {
        points.push({
            x: centerX - size + i * 1.4,
            y: centerY - size + i * 1.4
        });
    }
    
    // Linha diagonal 2 (de cima-direita para baixo-esquerda)
    for (let i = -size; i <= size; i += spacing) {
        points.push({
            x: centerX + size - i * 1.4,
            y: centerY - size + i * 1.4
        });
    }
    
    return points;
}

// Inicializar partículas
function initParticles() {
    particles = [];
    
    // Gerar pontos para o coração
    const heartPoints = generateHeartPoints(250, 300, 3);
    
    // Gerar pontos para o X
    const xPoints = generateXPoints(650, 300, 80);
    
    // Criar partículas para o coração (rosa)
    for (let point of heartPoints) {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                point.x + (Math.random() - 0.5) * 10,
                point.y + (Math.random() - 0.5) * 10,
                `hsl(${330 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`
            ));
        }
    }
    
    // Criar partículas para o X (azul/roxo)
    for (let point of xPoints) {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                point.x + (Math.random() - 0.5) * 10,
                point.y + (Math.random() - 0.5) * 10,
                `hsl(${260 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`
            ));
        }
    }
    
    document.getElementById('particleCount').textContent = particles.length;
}

// Função de animação principal
function animate() {
    // Limpar canvas
    ctx.fillStyle = 'rgba(30, 30, 46, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isAnimating) {
        // Atualizar e desenhar partículas
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }

        // Desenhar linhas de conexão (efeito de traço)
        ctx.strokeStyle = 'rgba(255, 105, 180, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 50 && p1.opacity > 0.5 && p2.opacity > 0.5) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    requestAnimationFrame(animate);
}

// Toggle animação
function toggleAnimation() {
    isAnimating = !isAnimating;
    if (isAnimating) {
        document.querySelector('button').textContent = '⏸ Pause';
    } else {
        document.querySelector('button').textContent = '▶ Play';
    }
}

// Inicializar tudo
initParticles();
animate();

// Redimensionar canvas ao mudar tamanho da janela
window.addEventListener('resize', () => {
    // Mantém o tamanho fixo por enquanto
});
