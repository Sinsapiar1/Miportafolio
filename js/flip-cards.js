// Efecto de flip para las cartas 3D
document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar todos los botones de "Ver ejemplos"
  const verEjemplosButtons = document.querySelectorAll('.ver-ejemplos-btn');
  // Seleccionar todos los botones de "Volver"
  const volverButtons = document.querySelectorAll('.volver-btn');
  // Seleccionar todas las cartas
  const cartas = document.querySelectorAll('.carta-3d');
  
  // Añadir evento click a los botones "Ver ejemplos"
  verEjemplosButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Evitar que el evento se propague
      e.preventDefault();
      e.stopPropagation();
      
      // Obtener la carta padre
      const carta = this.closest('.carta-3d');
      
      // Añadir la clase flipped para voltear la carta
      carta.classList.add('flipped');
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
      
      // Quitar la clase flipped para devolver la carta
      carta.classList.remove('flipped');
    });
  });
  
  // Opcional: Mejorar el efecto 3D con seguimiento de mouse
  cartas.forEach(carta => {
    // Variables para seguimiento del mouse
    let bounds;
    let mouseX = 0;
    let mouseY = 0;
    
    function handleMouseMove(e) {
      // Solo aplicar efecto si la carta no está volteada
      if (carta.classList.contains('flipped')) return;
      
      bounds = carta.getBoundingClientRect();
      
      // Calcular posición relativa del mouse dentro de la carta
      mouseX = e.clientX - bounds.left;
      mouseY = e.clientY - bounds.top;
      
      const xRotation = 10 * ((mouseY - bounds.height/2) / bounds.height);
      const yRotation = -10 * ((mouseX - bounds.width/2) / bounds.width);
      
      // Aplicar transformaciones solo al inner (mantener el flip si existe)
      const inner = carta.querySelector('.carta-3d-inner');
      
      // Verificar si la carta está volteada
      if (!carta.classList.contains('flipped')) {
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
      inner.style.transform = '';
    }
    
    // Añadir event listeners
    carta.addEventListener('mousemove', handleMouseMove);
    carta.addEventListener('mouseleave', resetStyles);
    
    // Anular los eventos cuando la carta está volteada
    carta.addEventListener('transitionend', function() {
      if (carta.classList.contains('flipped')) {
        // Cuando está volteada, eliminar efectos de hover
        inner.style.transform = 'rotateY(180deg)';
      }
    });
  });
  
  // Efecto de entrada animada
  cartas.forEach((carta, index) => {
    setTimeout(() => {
      carta.style.opacity = '1';
      carta.style.transform = 'translateY(0)';
    }, 200 + (index * 100));
  });
});

// Opcional: Detección de navegadores que no soportan bien perspective/3D
function checkSupport3D() {
  // Verificar soporte de CSS 3D
  const supports3d = ('perspective' in document.documentElement.style) || 
                    ('webkitPerspective' in document.documentElement.style) || 
                    ('MozPerspective' in document.documentElement.style);
  
  if (!supports3d) {
    // Fallback para navegadores sin soporte 3D
    document.querySelectorAll('.carta-3d-inner').forEach(inner => {
      inner.style.transformStyle = 'flat';
    });
    
    // Modificar la transición para que sea simple
    document.querySelectorAll('.carta-3d.flipped .carta-3d-front').forEach(front => {
      front.style.display = 'none';
    });
    
    document.querySelectorAll('.carta-3d.flipped .carta-3d-back').forEach(back => {
      back.style.display = 'flex';
    });
  }
  
  return supports3d;
}

// Ejecutar la detección (opcional)
checkSupport3D();