// Usa rutas relativas correctas
import { initThreeBackground } from './three-background.js';
import { initProjectGallery } from './project-gallery-3d.js';
import { initSkillsBubbles } from './skills-bubbles.js';

export function initSkillsBubbles(containerId, skills) {
  // Verificar que exista el contenedor
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // Configurar tamaño
  const width = container.clientWidth;
  const height = 400;
  
  // Crear escena, cámara y renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  
  // Estilizar contenedor
  container.style.height = `${height}px`;
  container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  
  // Agregar luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  
  // Colores para las burbujas
  const colors = [
    0x007bff, // Azul
    0x6610f2, // Índigo
    0xe83e8c, // Rosa
    0xfd7e14, // Naranja
    0x28a745, // Verde
    0x17a2b8, // Cyan
    0xffc107  // Amarillo
  ];
  
  // Crear burbujas para cada habilidad
  const bubbles = [];
  const bubbleRadius = 0.4;
  
  skills.forEach((skill, index) => {
    // Crear esfera para la burbuja
    const geometry = new THREE.SphereGeometry(bubbleRadius, 32, 32);
    
    // Crear material brillante
    const material = new THREE.MeshPhysicalMaterial({
      color: colors[index % colors.length],
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    
    // Crear malla
    const bubble = new THREE.Mesh(geometry, material);
    
    // Posicionar aleatoriamente
    bubble.position.x = (Math.random() - 0.5) * 5;
    bubble.position.y = (Math.random() - 0.5) * 5;
    bubble.position.z = (Math.random() - 0.5) * 5;
    
    // Velocidad inicial aleatoria
    const velocity = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    };
    
    scene.add(bubble);
    
    // Agregar a la lista de burbujas
    bubbles.push({
      mesh: bubble,
      velocity,
      originalPosition: { ...bubble.position },
      skill
    });
  });
  
  // Posicionar cámara
  camera.position.z = 6;
  
  // Crear etiquetas HTML para cada burbuja
  const labels = skills.map((skill, index) => {
    const label = document.createElement('div');
    label.className = 'skill-label';
    label.textContent = skill.name;
    label.style.position = 'absolute';
    label.style.padding = '5px 10px';
    label.style.backgroundColor = '#ffffff';
    label.style.color = '#333333';
    label.style.borderRadius = '4px';
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.style.opacity = '0.9';
    label.style.pointerEvents = 'none';
    label.style.transition = 'opacity 0.3s ease';
    label.style.display = 'none';
    
    container.appendChild(label);
    return label;
  });
  
  // Manejar el redimensionamiento de la ventana
  function handleResize() {
    const newWidth = container.clientWidth;
    
    camera.aspect = newWidth / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, height);
  }
  
  window.addEventListener('resize', handleResize);
  
  // Raycaster para detección de interacción
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredBubble = null;
  let mouseIsOverContainer = false;
  
  // Eventos de mouse
  container.addEventListener('mousemove', (event) => {
    mouseIsOverContainer = true;
    
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
  });
  
  container.addEventListener('mouseleave', () => {
    mouseIsOverContainer = false;
    
    // Ocultar todas las etiquetas al salir
    labels.forEach(label => {
      label.style.display = 'none';
    });
    
    // Restaurar burbuja activa
    if (hoveredBubble) {
      hoveredBubble.mesh.scale.set(1, 1, 1);
      hoveredBubble = null;
    }
  });
  
  // Panel de información detallada
  const infoPanel = document.createElement('div');
  infoPanel.className = 'skill-info-panel';
  infoPanel.style.position = 'absolute';
  infoPanel.style.bottom = '20px';
  infoPanel.style.left = '50%';
  infoPanel.style.transform = 'translateX(-50%)';
  infoPanel.style.width = '80%';
  infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  infoPanel.style.color = 'white';
  infoPanel.style.padding = '15px';
  infoPanel.style.borderRadius = '8px';
  infoPanel.style.opacity = '0';
  infoPanel.style.transition = 'opacity 0.3s ease';
  infoPanel.style.display = 'none';
  infoPanel.style.textAlign = 'center';
  
  container.appendChild(infoPanel);
  
  // Función para mostrar información detallada
  function showSkillInfo(skill) {
    if (!skill) return;
    
    infoPanel.innerHTML = `
      <h3 style="margin-top: 0; color: #fff;">${skill.name}</h3>
      <p>${skill.description}</p>
    `;
    
    infoPanel.style.display = 'block';
    setTimeout(() => {
      infoPanel.style.opacity = '1';
    }, 10);
  }
  
  function hideSkillInfo() {
    infoPanel.style.opacity = '0';
    setTimeout(() => {
      infoPanel.style.display = 'none';
    }, 300);
  }
  
  // Función de animación
  function animate() {
    requestAnimationFrame(animate);
    
    // Animar burbujas
    bubbles.forEach(bubble => {
      // Mover según velocidad
      bubble.mesh.position.x += bubble.velocity.x;
      bubble.mesh.position.y += bubble.velocity.y;
      bubble.mesh.position.z += bubble.velocity.z;
      
      // Límites y rebote
      const limit = 5;
      ['x', 'y', 'z'].forEach(axis => {
        if (Math.abs(bubble.mesh.position[axis]) > limit) {
          bubble.velocity[axis] *= -1;
        }
      });
      
      // Rotación ligera
      bubble.mesh.rotation.x += 0.002;
      bubble.mesh.rotation.y += 0.002;
    });
    
    // Detectar interacción si el mouse está sobre el contenedor
    if (mouseIsOverContainer) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const bubble = bubbles.find(b => b.mesh === intersectedObject);
        
        if (bubble && hoveredBubble !== bubble) {
          // Restaurar burbuja anterior
          if (hoveredBubble) {
            hoveredBubble.mesh.scale.set(1, 1, 1);
          }
          
          // Actualizar burbuja actual
          hoveredBubble = bubble;
          hoveredBubble.mesh.scale.set(1.2, 1.2, 1.2);
          
          // Mostrar etiqueta e información
          const index = bubbles.indexOf(bubble);
          if (index >= 0 && index < labels.length) {
            // Posicionar y mostrar etiqueta
            const screenPosition = new THREE.Vector3();
            screenPosition.copy(bubble.mesh.position);
            screenPosition.project(camera);
            
            const x = (screenPosition.x * 0.5 + 0.5) * width;
            const y = (-(screenPosition.y * 0.5) + 0.5) * height;
            
            labels.forEach(l => l.style.display = 'none');
            labels[index].style.display = 'block';
            labels[index].style.left = `${x}px`;
            labels[index].style.top = `${y - 30}px`;
          }
          
          showSkillInfo(bubble.skill);
        }
      } else if (hoveredBubble) {
        // Restaurar escala si no hay intersección
        hoveredBubble.mesh.scale.set(1, 1, 1);
        hoveredBubble = null;
        
        // Ocultar etiquetas
        labels.forEach(label => {
          label.style.display = 'none';
        });
        
        hideSkillInfo();
      }
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Retornar función de limpieza
  return {
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      
      // Eliminar elementos y liberar memoria
      bubbles.forEach(bubble => {
        scene.remove(bubble.mesh);
        bubble.mesh.geometry.dispose();
        bubble.mesh.material.dispose();
      });
      
      labels.forEach(label => {
        if (container.contains(label)) {
          container.removeChild(label);
        }
      });
      
      if (container.contains(infoPanel)) {
        container.removeChild(infoPanel);
      }
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    }
  };
}