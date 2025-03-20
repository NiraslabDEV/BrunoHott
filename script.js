document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Configuração do efeito
  const particleCount = width < 768 ? 120 : 200; // Aumentei o número de partículas
  const particles = [];
  const connectionDistance = width < 768 ? 100 : 150;
  const mouseRadius = width < 768 ? 150 : 250; // Reduzido o raio de influência do mouse

  // Posição do mouse
  let mouseX = width / 2;
  let mouseY = height / 2;
  let isMouseMoving = false;
  let mouseTimer;
  let mouseSpeed = 0;
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let mouseDirection = { x: 0, y: 0 };

  // Paleta de cores
  const colors = [
    { r: 255, g: 51, b: 102 }, // Rosa vibrante (#ff3366)
    { r: 142, g: 36, b: 170 }, // Roxo (#8e24aa)
    { r: 66, g: 39, b: 245 }, // Azul neon
    { r: 255, g: 215, b: 0 }, // Dourado
    { r: 0, g: 231, b: 255 }, // Azul ciano
  ];

  // Função para obter uma cor da paleta
  function getRandomColor() {
    const colorIndex = Math.floor(Math.random() * colors.length);
    return colors[colorIndex];
  }

  // Função para interpolar cores
  function lerpColor(a, b, t) {
    return {
      r: Math.floor(a.r + (b.r - a.r) * t),
      g: Math.floor(a.g + (b.g - a.g) * t),
      b: Math.floor(a.b + (b.b - a.b) * t),
    };
  }

  // Criação das partículas
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseSize = this.size;
      this.speedX = Math.random() * 0.4 - 0.2; // Reduzido a velocidade base
      this.speedY = Math.random() * 0.4 - 0.2; // Reduzido a velocidade base
      this.baseSpeedX = this.speedX;
      this.baseSpeedY = this.speedY;

      // Cores
      this.baseColor = getRandomColor();
      this.targetColor = getRandomColor();
      this.colorTransition = 0;
      this.colorSpeed = 0.003; // Reduzido a velocidade de transição de cor
    }

    update() {
      // Atualização da cor
      this.colorTransition += this.colorSpeed;
      if (this.colorTransition >= 1) {
        this.baseColor = this.targetColor;
        this.targetColor = getRandomColor();
        this.colorTransition = 0;
      }

      // Obter cor atual
      const currentColor = lerpColor(
        this.baseColor,
        this.targetColor,
        this.colorTransition
      );
      this.color = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

      // Movimento básico
      this.x += this.speedX;
      this.y += this.speedY;

      // Efeito do mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius && isMouseMoving) {
        // Aumentar tamanho quando próximo ao mouse e pulsar
        const pulseEffect = 1 + 0.2 * Math.sin(Date.now() * 0.01);
        this.size =
          this.baseSize +
          ((mouseRadius - distance) / mouseRadius) * 2 * pulseEffect; // Reduzido o aumento de tamanho

        // Efeito de atração - as partículas seguem o mouse
        const force = (mouseRadius - distance) / mouseRadius;
        const directionX = dx / distance || 0;
        const directionY = dy / distance || 0;

        // Atração mais forte quanto mais perto estiver do mouse
        const attractionStrength = 0.7; // Reduzido a força de atração
        const mouseInfluence =
          Math.min(1, mouseSpeed / 40) * attractionStrength;
        this.speedX += directionX * force * 0.5 * mouseInfluence; // Reduzido o impacto do mouse
        this.speedY += directionY * force * 0.5 * mouseInfluence; // Reduzido o impacto do mouse

        // Adicionar efeito de turbilhão quando o mouse se move rápido
        if (mouseSpeed > 10) {
          // Criar um efeito de rotação ao redor do cursor
          const turbulenceStrength = Math.min(1, mouseSpeed / 50) * 0.5;

          // Rotação perpendicular à direção do mouse
          const perpX = -mouseDirection.y;
          const perpY = mouseDirection.x;

          // Adicionar componente de turbilhão à velocidade
          this.speedX += perpX * force * turbulenceStrength;
          this.speedY += perpY * force * turbulenceStrength;
        }

        // Cores mais vibrantes quando perto do mouse
        this.colorSpeed = 0.01; // Transição de cor mais rápida perto do mouse
      } else {
        // Retornar ao tamanho normal quando longe do mouse
        this.size = this.baseSize;

        // Retornar gradualmente à velocidade base
        this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.02;

        // Velocidade de transição de cor normal quando longe do mouse
        this.colorSpeed = 0.005;
      }

      // Limitação de velocidade
      const maxSpeed = isMouseMoving ? 2 : 0.8; // Reduzido a velocidade máxima
      this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
      this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));

      // Rebater nas bordas
      if (this.x < 0) {
        this.x = 0;
        this.speedX *= -1;
      } else if (this.x > width) {
        this.x = width;
        this.speedX *= -1;
      }

      if (this.y < 0) {
        this.y = 0;
        this.speedY *= -1;
      } else if (this.y > height) {
        this.y = height;
        this.speedY *= -1;
      }
    }

    draw() {
      // Desenhar partícula com brilho
      const glow = isMouseMoving ? 5 : 3; // Reduzido o efeito de brilho/sombra

      // Efeito de brilho
      ctx.shadowBlur = glow;
      ctx.shadowColor = this.color;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      // Resetar sombra
      ctx.shadowBlur = 0;
    }
  }

  // Inicializar partículas
  function init() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Conectar partículas com linhas
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // Opacidade baseada na distância
          const opacity = 1 - distance / connectionDistance;

          // Misturar cores das duas partículas
          const colorA = particles[i].baseColor;
          const colorB = particles[j].baseColor;
          const mixedColor = lerpColor(colorA, colorB, 0.5);

          // Cor mais brilhante quando o mouse está se movendo
          const lineOpacity = isMouseMoving ? opacity * 0.6 : opacity * 0.3; // Reduzido a opacidade das linhas
          const lineColor = `rgba(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b}, ${lineOpacity})`;

          ctx.strokeStyle = lineColor;
          ctx.lineWidth = isMouseMoving ? 0.6 : 0.3; // Reduzido a espessura das linhas

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animar
  function animate() {
    // Criar um efeito de rastro em vez de limpar completamente o canvas
    ctx.fillStyle = "rgba(17, 17, 17, 0.2)"; // Aumentado a opacidade para deixar menos rastro
    ctx.fillRect(0, 0, width, height);

    // Atualizar e desenhar partículas
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Conectar partículas com linhas
    connectParticles();

    requestAnimationFrame(animate);
  }

  // Rastreamento do mouse
  document.addEventListener("mousemove", function (e) {
    // Calcular a velocidade do mouse
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);

    // Calcular direção do mouse para efeito de turbilhão
    if (mouseSpeed > 5) {
      mouseDirection.x = dx / mouseSpeed;
      mouseDirection.y = dy / mouseSpeed;
    }

    // Atualizar posição do mouse
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Sinalizar que o mouse está se movendo
    isMouseMoving = true;

    // Limpar o temporizador anterior
    clearTimeout(mouseTimer);

    // Definir um temporizador para marcar quando o mouse parou
    mouseTimer = setTimeout(function () {
      isMouseMoving = false;
      mouseSpeed = 0;
      mouseDirection = { x: 0, y: 0 };
    }, 200);
  });

  // Interação por toque para dispositivos móveis
  document.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches.length > 0) {
        // Prevenir scroll
        e.preventDefault();

        // Calcular a velocidade do toque
        const touch = e.touches[0];
        const dx = touch.clientX - mouseX;
        const dy = touch.clientY - mouseY;
        mouseSpeed = Math.sqrt(dx * dx + dy * dy);

        // Calcular direção do toque para efeito de turbilhão
        if (mouseSpeed > 5) {
          mouseDirection.x = dx / mouseSpeed;
          mouseDirection.y = dy / mouseSpeed;
        }

        // Atualizar posição do mouse
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        // Sinalizar que o mouse está se movendo
        isMouseMoving = true;

        // Limpar o temporizador anterior
        clearTimeout(mouseTimer);

        // Definir um temporizador para marcar quando o toque parou
        mouseTimer = setTimeout(function () {
          isMouseMoving = false;
          mouseSpeed = 0;
          mouseDirection = { x: 0, y: 0 };
        }, 200);
      }
    },
    { passive: false }
  );

  // Redimensionamento da janela
  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Iniciar animação
  init();
  animate();

  /* Navegação e Interações do Site */

  // Efeito de scroll para navegação
  const header = document.querySelector("header");
  const menuMobile = document.querySelector(".menu-mobile");
  const menuItems = document.querySelectorAll(".menu a");

  // Adicionar classe quando rolar a página
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Menu mobile toggle
  menuMobile.addEventListener("click", function () {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("active");
    this.classList.toggle("active");
  });

  // Scroll suave para links de navegação
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Fechar menu mobile se estiver aberto
      const menu = document.querySelector(".menu");
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
        menuMobile.classList.remove("active");
      }

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });

  // Animação de entrada dos elementos
  function animateOnScroll() {
    const elements = document.querySelectorAll(
      ".section-title, .sobre-content, .servico-card, .portfolio-item, .convite-content, .contato-content"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.classList.add("animate");
      }
    });
  }

  // Executar animação no scroll
  window.addEventListener("scroll", animateOnScroll);

  // Executar animação no carregamento inicial
  setTimeout(animateOnScroll, 500);

  /* Funcionalidade de Formulário de Contato */

  // Formulário para WhatsApp
  const formContato = document.getElementById("form-contato");
  if (formContato) {
    formContato.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const whatsapp = this.querySelector('input[type="tel"]').value;
      const servico =
        this.querySelector("select").options[
          this.querySelector("select").selectedIndex
        ].text;
      const mensagem = this.querySelector("textarea").value;

      // Formatar mensagem para WhatsApp
      const textoWhatsApp =
        `Olá DJ Bruno Hott, sou ${nome}! 💿\n\n` +
        `Gostaria de mais informações sobre ${servico}.\n\n` +
        `Mensagem: ${mensagem}\n\n` +
        `Meus contatos:\n` +
        `WhatsApp: ${whatsapp}\n` +
        `Email: ${email}`;

      // Codificar para URL
      const mensagemCodificada = encodeURIComponent(textoWhatsApp);

      // Redirecionar para WhatsApp
      window.open(
        `https://wa.me/5511900000000?text=${mensagemCodificada}`,
        "_blank"
      );
    });
  }
});
