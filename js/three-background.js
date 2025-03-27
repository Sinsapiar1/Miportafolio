// three-background.js
// Eliminamos la importación: import * as THREE from 'three';
// En su lugar, usamos el objeto THREE global del CDN

// Función para inicializar el fondo 3D
export function initThreeBackground() {
    // Verificar si THREE está disponible
    if (typeof THREE === 'undefined') {
      console.error('THREE no está definido. Asegúrate de que Three.js esté cargado correctamente.');
      return null;
    }
  
    // Crear escena, cámara y renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    
    // Agregar el canvas al DOM
    const container = document.createElement('div');
    container.className = 'three-background';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none'; // Permite clics a través del fondo
    container.appendChild(renderer.domElement);
    document.body.prepend(container);
    
    // Crear particulas/estrellas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Colores vibrantes para las partículas
    const colors = [
      new THREE.Color(0x007bff), // Azul
      new THREE.Color(0x6610f2), // Índigo
      new THREE.Color(0xe83e8c), // Rosa
      new THREE.Color(0xfd7e14), // Naranja
      new THREE.Color(0x28a745), // Verde
    ];
    
    // Posicionar partículas aleatoriamente
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Posiciones
      posArray[i] = (Math.random() - 0.5) * 10;     // X
      posArray[i + 1] = (Math.random() - 0.5) * 10; // Y
      posArray[i + 2] = (Math.random() - 0.5) * 10; // Z
      
      // Colores aleatorios
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorsArray[i] = color.r;
      colorsArray[i + 1] = color.g;
      colorsArray[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Material para partículas
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    // Crear sistema de partículas
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Posicionar cámara
    camera.position.z = 3;
    
    // Variables para seguimiento del mouse
    const mousePosition = {
      x: 0,
      y: 0
    };
    
    // Escuchar movimiento del mouse
    document.addEventListener('mousemove', (event) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Manejar cambio de tamaño de ventana
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotación suave del sistema de partículas
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      // Seguimiento suave del mouse
      particlesMesh.rotation.x += (mousePosition.y * 0.05 - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y += (mousePosition.x * 0.05 - particlesMesh.rotation.y) * 0.05;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Retornar función de limpieza
    return () => {
      window.removeEventListener('resize', () => {});
      document.removeEventListener('mousemove', () => {});
      document.body.removeChild(container);
      
      // Liberar memoria
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }