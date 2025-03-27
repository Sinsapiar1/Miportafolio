// Efecto de flip para las cartas 3D
(function() {
  // Función para inicializar las cartas
  function initFlipCards() {
    // Seleccionar todos los botones de "Ver ejemplos"
    const verEjemplosButtons = document.querySelectorAll('.ver-ejemplos-btn');
    // Seleccionar todos los botones de "Volver"
    const volverButtons = document.querySelectorAll('.volver-btn');
    // Seleccionar todas las cartas
    const cartas = document.querySelectorAll('.carta-3d');
    
    // Función de volteo segura
    function flipCard(carta, flip = true) {
      // Garantizar que la función funcione incluso si los selectores no existen
      try {
        if (flip) {
          carta.classList.add('flipped');
        } else {
          carta.classList.remove('flipped');
        }
      } catch (error) {
        console.error('Error al voltear la carta:', error);
      }
    }
    
    // Añadir evento click a los botones "Ver ejemplos"
    verEjemplosButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Evitar que el evento se propague
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener la carta padre
        const carta = this.closest('.carta-3d');
        
        // Voltear la carta
        if (carta) {
          flipCard(carta, true);
        }
      });
    });
    
    // Añadir evento click a los botones "Volver"
    volverButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Evitar que el evento se propague
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener la carta padre
        const carta = this.closest('.carta-3d');
        
        // Devolver la carta
        if (carta) {
          flipCard(carta, false);
        }
      });
    });
    
    // Efecto de movimiento 3D
    cartas.forEach(carta => {
      let mouseX = 0, mouseY = 0;
      
      function handleMouseMove(e) {
        // Solo aplicar efecto si la carta no está volteada
        if (carta.classList.contains('flipped')) return;
        
        const bounds = carta.getBoundingClientRect();
        
        // Calcular posición relativa del mouse
        mouseX = e.clientX - bounds.left;
        mouseY = e.clientY - bounds.top;
        
        const xRotation = 10 * ((mouseY - bounds.height/2) / bounds.height);
        const yRotation = -10 * ((mouseX - bounds.width/2) / bounds.width);
        
        // Buscar el elemento interno de la carta
        const inner = carta.querySelector('.carta-3d-inner');
        
        if (inner && !carta.classList.contains('flipped')) {
          inner.style.transform = `
            rotateX(${xRotation}deg)
            rotateY(${yRotation}deg)
          `;
        }
      }
      
      function resetStyles() {
        // Solo resetear si la carta no está volteada
        if (carta.classList.contains('flipped')) return;
        
        const inner = carta.querySelector('.carta-3d-inner');
        if (inner) {
          inner.style.transform = '';
        }
      }
      
      // Añadir event listeners solo si existen los elementos
      carta.addEventListener('mousemove', handleMouseMove);
      carta.addEventListener('mouseleave', resetStyles);
    });
    
    // Efecto de entrada animada
    cartas.forEach((carta, index) => {
      carta.style.opacity = '0';
      carta.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        carta.style.opacity = '1';
        carta.style.transform = 'translateY(0)';
      }, 200 + (index * 100));
    });
  }
  
  // Esperar a que el DOM esté completamente cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlipCards);
  } else {
    initFlipCards();
  }
})();

// Detección de soporte 3D
function checkSupport3D() {
  const supports3d = ('perspective' in document.documentElement.style) || 
                    ('webkitPerspective' in document.documentElement.style) || 
                    ('MozPerspective' in document.documentElement.style);
  
  if (!supports3d) {
    // Fallback para navegadores sin soporte 3D
    document.querySelectorAll('.carta-3d-inner').forEach(inner => {
      inner.style.transformStyle = 'flat';
    });
    
    // Modificar transición para ser simple
    document.querySelectorAll('.carta-3d.flipped .carta-3d-front').forEach(front => {
      front.style.display = 'none';
    });
    
    document.querySelectorAll('.carta-3d.flipped .carta-3d-back').forEach(back => {
      back.style.display = 'flex';
    });
  }
  
  return supports3d;
}

// Ejecutar detección de soporte 3D
checkSupport3D();