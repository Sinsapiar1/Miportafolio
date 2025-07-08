// Versión simplificada de cartas 3D - más directa y robusta
(function() {
  'use strict';

  // Función principal de inicialización
  function initFlipCards() {
    const cards = document.querySelectorAll('.carta-3d');
    
    cards.forEach((card, index) => {
      // Asegurar estado inicial limpio
      card.classList.remove('flipped');
      
      // Configurar eventos
      setupCardEvents(card);
      
      // Animación de entrada
      animateCardEntrance(card, index);
    });
  }

  function setupCardEvents(card) {
    const flipButton = card.querySelector('.ver-ejemplos-btn');
    const backButton = card.querySelector('.volver-btn');
    const cardBack = card.querySelector('.carta-3d-back');
    
    // Evento para voltear la carta
    if (flipButton) {
      flipButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        flipCard(card, true);
      });
    }
    
    // Evento para regresar la carta
    if (backButton) {
      backButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        flipCard(card, false);
      });
    }

    // Soporte para teclado
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (card.classList.contains('flipped')) {
          flipCard(card, false);
        } else {
          flipCard(card, true);
        }
      }
    });

    // Mejorar eventos táctiles para móviles
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let hasMoved = false;
    
    // Detectar si es un toque rápido vs scroll
    card.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      hasMoved = false;
    }, { passive: true });
    
    card.addEventListener('touchmove', function(e) {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = Math.abs(currentY - touchStartY);
      const deltaX = Math.abs(currentX - touchStartX);
      
      // Si se movió más de 15px, considerarlo como scroll
      if (deltaY > 15 || deltaX > 15) {
        hasMoved = true;
      }
    }, { passive: true });
    
    card.addEventListener('touchend', function(e) {
      const touchEndTime = Date.now();
      const deltaTime = touchEndTime - touchStartTime;
      
      // Solo flip si es un toque rápido, no hubo movimiento significativo y no fue en contenido scrolleable
      if (!hasMoved && deltaTime < 300) {
        const target = e.target;
        const isScrollableContent = target.closest('.carta-3d-back .ejemplos-container');
        const isButton = target.closest('.ver-ejemplos-btn, .volver-btn');
        
        // No hacer flip si se tocó un botón o contenido scrolleable
        if (!isScrollableContent && !isButton) {
          if (card.classList.contains('flipped')) {
            flipCard(card, false);
          } else {
            flipCard(card, true);
          }
        }
      }
    }, { passive: true });

    // Efecto hover sutil (solo para dispositivos no táctiles)
    if (!('ontouchstart' in window)) {
      card.addEventListener('mouseenter', function() {
        if (!card.classList.contains('flipped')) {
          card.style.transform = 'translateY(-5px)';
          card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        }
      });

      card.addEventListener('mouseleave', function() {
        if (!card.classList.contains('flipped')) {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'var(--shadow-lg)';
        }
      });
    }
    
    // Mejorar scroll en el contenido de la carta volteada
    if (cardBack) {
      cardBack.addEventListener('touchmove', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
  }

  function flipCard(card, shouldFlip) {
    if (shouldFlip) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
    }

    // Vibración táctil si está disponible
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  function animateCardEntrance(card, index) {
    // Estado inicial
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    
    // Animar entrada
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 150));
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlipCards);
  } else {
    initFlipCards();
  }

  // Re-inicializar si se detectan cambios
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const newCards = Array.from(mutation.addedNodes)
          .filter(node => node.nodeType === 1)
          .filter(node => node.classList && node.classList.contains('carta-3d'));
        
        if (newCards.length > 0) {
          newCards.forEach(setupCardEvents);
        }
      }
    });
  });

  // Observar cambios en el contenedor
  const container = document.querySelector('.cartas-3d-container');
  if (container) {
    observer.observe(container, { childList: true, subtree: true });
  }

})();