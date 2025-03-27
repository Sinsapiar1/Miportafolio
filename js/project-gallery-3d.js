// Usa rutas relativas correctas
import { initThreeBackground } from './three-background.js';
import { initProjectGallery } from './project-gallery-3d.js';
import { initSkillsBubbles } from './skills-bubbles.js';

export function initProjectGallery(containerId, projects) {
  // Obtener el contenedor
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // Configurar dimensiones
  const width = container.clientWidth;
  const height = 400; // Altura fija para la galería
  
  // Crear escena, cámara y renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0.1); // Fondo semi-transparente
  
  // Estilizar el contenedor y añadir el canvas
  container.style.height = `${height}px`;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
  container.appendChild(renderer.domElement);
  
  // Añadir luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);
  
  // Crear tarjetas 3D para cada proyecto
  const cards = [];
  const cardWidth = 1.5;
  const cardHeight = 1;
  const spacing = 2; // Espacio entre tarjetas
  
  projects.forEach((project, index) => {
    // Crear geometría de la tarjeta (un plano)
    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    
    // Crear textura desde la imagen del proyecto
    const texture = new THREE.TextureLoader().load(project.imageUrl);
    
    // Material con la textura
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    
    // Crear malla
    const card = new THREE.Mesh(geometry, material);
    
    // Posicionar tarjeta en un círculo
    const angle = (index / projects.length) * Math.PI * 2;
    const radius = 3;
    card.position.x = Math.sin(angle) * radius;
    card.position.z = Math.cos(angle) * radius;
    card.rotation.y = -angle + Math.PI/2; // Orientar hacia el centro
    
    scene.add(card);
    cards.push({
      mesh: card,
      index,
      project
    });
  });
  
  // Posicionar cámara
  camera.position.y = 1;
  camera.position.z = 0;
  
  // Variables para animación
  let currentAngle = 0;
  let targetAngle = 0;
  let isDragging = false;
  let previousMousePosition = 0;
  
  // Eventos de mouse/touch
  container.addEventListener('mousedown', handleMouseDown);
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  
  function handleMouseDown(event) {
    isDragging = true;
    previousMousePosition = event.clientX;
  }
  
  function handleTouchStart(event) {
    isDragging = true;
    previousMousePosition = event.touches[0].clientX;
  }
  
  function handleMouseUp() {
    isDragging = false;
  }
  
  function handleTouchEnd() {
    isDragging = false;
  }
  
  function handleMouseMove(event) {
    if (!isDragging) return;
    
    const delta = (event.clientX - previousMousePosition) * 0.01;
    targetAngle += delta;
    previousMousePosition = event.clientX;
  }
  
  function handleTouchMove(event) {
    if (!isDragging) return;
    
    const delta = (event.touches[0].clientX - previousMousePosition) * 0.01;
    targetAngle += delta;
    previousMousePosition = event.touches[0].clientX;
  }
  
  // Actualizar tamaño del canvas cuando cambia el navegador
  function handleResize() {
    const newWidth = container.clientWidth;
    
    camera.aspect = newWidth / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, height);
  }
  
  window.addEventListener('resize', handleResize);
  
  // Añadir info de cada proyecto al hacer hover/click
  function createInfoPanel() {
    const infoPanel = document.createElement('div');
    infoPanel.className = 'project-info-panel';
    infoPanel.style.position = 'absolute';
    infoPanel.style.bottom = '20px';
    infoPanel.style.left = '0';
    infoPanel.style.width = '100%';
    infoPanel.style.background = 'rgba(0, 0, 0, 0.7)';
    infoPanel.style.color = 'white';
    infoPanel.style.padding = '15px';
    infoPanel.style.borderRadius = '8px';
    infoPanel.style.opacity = '0';
    infoPanel.style.transition = 'opacity 0.3s ease';
    infoPanel.style.transform = 'translateY(20px)';
    infoPanel.style.textAlign = 'center';
    
    container.appendChild(infoPanel);
    return infoPanel;
  }
  
  const infoPanel = createInfoPanel();
  
  // Función para mostrar información del proyecto
  function showProjectInfo(project) {
    if (!project) return;
    
    infoPanel.innerHTML = `
      <h3 style="margin-top: 0; color: #fff;">${project.title}</h3>
      <p>${project.description}</p>
      ${project.link ? `<a href="${project.link}" style="display: inline-block; background: #007bff; color: white; padding: 5px 15px; border-radius: 4px; text-decoration: none; margin-top: 10px;">Ver Proyecto</a>` : ''}
    `;
    
    infoPanel.style.opacity = '1';
    infoPanel.style.transform = 'translateY(0)';
  }
  
  function hideProjectInfo() {
    infoPanel.style.opacity = '0';
    infoPanel.style.transform = 'translateY(20px)';
  }
  
  // Raycaster para detección de hover
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredCard = null;
  
  container.addEventListener('mousemove', (event) => {
    // Calcular posición del mouse en coordenadas normalizadas (-1 a +1)
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
  });
  
  // Animación
  function animate() {
    requestAnimationFrame(animate);
    
    // Animar rotación suave
    currentAngle += (targetAngle - currentAngle) * 0.05;
    
    // Actualizar posición de las tarjetas
    cards.forEach((card, index) => {
      const angle = (index / cards.length) * Math.PI * 2 + currentAngle;
      const radius = 3;
      card.mesh.position.x = Math.sin(angle) * radius;
      card.mesh.position.z = Math.cos(angle) * radius;
      card.mesh.rotation.y = -angle + Math.PI/2;
    });
    
    // Detectar hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards.map(card => card.mesh));
    
    // Si hay intersección, mostrar info del proyecto
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const card = cards.find(card => card.mesh === intersectedMesh);
      
      if (hoveredCard !== card) {
        hoveredCard = card;
        showProjectInfo(card.project);
        
        // Escalar ligeramente la tarjeta al hacer hover
        intersectedMesh.scale.set(1.1, 1.1, 1.1);
      }
    } else if (hoveredCard) {
      hoveredCard.mesh.scale.set(1, 1, 1);
      hoveredCard = null;
      hideProjectInfo();
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Retornar función de limpieza
  return {
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      
      // Eliminar mallas y liberar memoria
      cards.forEach(card => {
        scene.remove(card.mesh);
        card.mesh.geometry.dispose();
        card.mesh.material.dispose();
      });
      
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (container.contains(infoPanel)) {
        container.removeChild(infoPanel);
      }
    }
  };
}