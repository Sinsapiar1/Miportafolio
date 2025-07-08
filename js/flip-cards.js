// Módulo moderno para cartas 3D con efectos optimizados
class ModernFlipCards {
  constructor() {
    this.cards = [];
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupCards());
    } else {
      this.setupCards();
    }
  }

  setupCards() {
    const cardElements = document.querySelectorAll('.carta-3d');
    
    cardElements.forEach((card, index) => {
      this.initializeCard(card, index);
    });

    // Animación de entrada escalonada
    this.animateCardsEntrance(cardElements);
  }

  initializeCard(cardElement, index) {
    const cardData = {
      element: cardElement,
      inner: cardElement.querySelector('.carta-3d-inner'),
      front: cardElement.querySelector('.carta-3d-front'),
      back: cardElement.querySelector('.carta-3d-back'),
      flipButton: cardElement.querySelector('.ver-ejemplos-btn'),
      backButton: cardElement.querySelector('.volver-btn'),
      isFlipped: false,
      mouseMoveHandler: null,
      mouseLeaveHandler: null
    };

    // Configurar eventos de flip
    this.setupFlipEvents(cardData);
    
    // Configurar efectos de hover 3D
    if (!this.isReducedMotion) {
      this.setup3DHoverEffects(cardData);
    }

    // Configurar observador de intersección para animaciones
    this.setupIntersectionObserver(cardData);

    this.cards.push(cardData);
  }

  setupFlipEvents(cardData) {
    const { flipButton, backButton, element } = cardData;

    if (flipButton) {
      flipButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.flipCard(cardData, true);
      });
    }

    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.flipCard(cardData, false);
      });
    }

    // Agregar soporte para teclado (accesibilidad)
    [flipButton, backButton].forEach(button => {
      if (button) {
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });
      }
    });
  }

  setup3DHoverEffects(cardData) {
    const { element, inner } = cardData;
    
    const mouseMoveHandler = this.throttle((e) => {
      if (cardData.isFlipped) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Reducir la intensidad del efecto 3D para un look más moderno
      const rotateX = (mouseY / rect.height) * -8;
      const rotateY = (mouseX / rect.width) * 8;
      
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        inner.style.transformStyle = 'preserve-3d';
      }
    }, 16); // 60fps

    const mouseLeaveHandler = () => {
      if (cardData.isFlipped || !inner) return;
      
      inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    element.addEventListener('mousemove', mouseMoveHandler);
    element.addEventListener('mouseleave', mouseLeaveHandler);
    
    // Guardar referencias para cleanup
    cardData.mouseMoveHandler = mouseMoveHandler;
    cardData.mouseLeaveHandler = mouseLeaveHandler;
  }

  setupIntersectionObserver(cardData) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    observer.observe(cardData.element);
  }

  flipCard(cardData, shouldFlip) {
    const { element, inner } = cardData;
    
    if (!inner) return;

    cardData.isFlipped = shouldFlip;
    
    if (shouldFlip) {
      element.classList.add('flipped');
      // Limpiar efectos de hover durante el flip
      inner.style.transform = 'rotateY(180deg)';
    } else {
      element.classList.remove('flipped');
      inner.style.transform = 'rotateY(0deg)';
    }

    // Agregar vibración táctil en dispositivos compatibles
    if ('vibrate' in navigator && shouldFlip) {
      navigator.vibrate(50);
    }

    // Emitir evento personalizado para tracking
    element.dispatchEvent(new CustomEvent('cardFlipped', {
      detail: { isFlipped: shouldFlip, cardData }
    }));
  }

  animateCardsEntrance(cards) {
    cards.forEach((card, index) => {
      // Configurar estado inicial
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.95)';
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Animar entrada con delay escalonado
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 150 + (index * 100));
    });
  }

  // Función throttle para optimizar performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Función para limpiar eventos (útil para SPA)
  destroy() {
    this.cards.forEach(cardData => {
      const { element, mouseMoveHandler, mouseLeaveHandler } = cardData;
      if (mouseMoveHandler) {
        element.removeEventListener('mousemove', mouseMoveHandler);
      }
      if (mouseLeaveHandler) {
        element.removeEventListener('mouseleave', mouseLeaveHandler);
      }
    });
    this.cards = [];
  }

  // Método público para agregar nuevas cartas dinámicamente
  addCard(cardElement) {
    const index = this.cards.length;
    this.initializeCard(cardElement, index);
  }
}

// Detección de soporte 3D mejorada
function detect3DSupport() {
  const testElement = document.createElement('div');
  const prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
  
  for (let prefix of prefixes) {
    testElement.style.cssText = `${prefix}transform-style: preserve-3d;`;
    if (testElement.style.transformStyle === 'preserve-3d') {
      return true;
    }
  }
  
  return false;
}

// Fallback para navegadores sin soporte 3D
function setupFallback() {
  const cards = document.querySelectorAll('.carta-3d');
  
  cards.forEach(card => {
    const inner = card.querySelector('.carta-3d-inner');
    const front = card.querySelector('.carta-3d-front');
    const back = card.querySelector('.carta-3d-back');
    
    if (inner) {
      inner.style.transformStyle = 'flat';
    }
    
    // Usar opacity toggle en lugar de 3D flip
    card.addEventListener('click', () => {
      if (card.classList.contains('flipped')) {
        front.style.opacity = '1';
        back.style.opacity = '0';
        card.classList.remove('flipped');
      } else {
        front.style.opacity = '0';
        back.style.opacity = '1';
        card.classList.add('flipped');
      }
    });
  });
}

// Inicialización principal
(() => {
  const has3DSupport = detect3DSupport();
  
  if (has3DSupport) {
    // Inicializar cartas modernas con efectos 3D
    window.modernFlipCards = new ModernFlipCards();
  } else {
    // Usar fallback para navegadores antiguos
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupFallback);
    } else {
      setupFallback();
    }
  }

  // Escuchar cambios en preferencias de movimiento reducido
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', (e) => {
    if (window.modernFlipCards && e.matches) {
      // Deshabilitar efectos 3D si el usuario prefiere movimiento reducido
      window.modernFlipCards.cards.forEach(cardData => {
        const { element, mouseMoveHandler, mouseLeaveHandler } = cardData;
        if (mouseMoveHandler) {
          element.removeEventListener('mousemove', mouseMoveHandler);
        }
        if (mouseLeaveHandler) {
          element.removeEventListener('mouseleave', mouseLeaveHandler);
        }
      });
    }
  });
})();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernFlipCards;
}