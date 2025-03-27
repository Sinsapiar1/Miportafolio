// Importar módulos 3D
import { initThreeBackground } from './three-background.js';


document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('header');
    const mainTitle = document.getElementById('main-title');
    const navLinks = document.querySelectorAll('nav a');
    const proyectoElementos = document.querySelectorAll('.proyecto, .blog-proyecto, .pagina');
    const enlacesProyecto = document.querySelectorAll('.proyecto a, .pagina a');

    // Inicializar fondo 3D
    const destroyBackground = initThreeBackground();

    // Datos para la galería 3D de proyectos
    const proyectos = [
        {
            title: "Menús Digitales Interactivos",
            description: "Transforma la experiencia de tus clientes con menús digitales interactivos y visualmente impactantes.",
            imageUrl: "assets/img/menu-restaurantes/menu-ejemplo-1.jpg",
            link: "#"
        },
        {
            title: "Aplicaciones Móviles (AppSheet)",
            description: "Desarrollo de aplicaciones móviles personalizadas con AppSheet que optimizan procesos y operaciones.",
            imageUrl: "assets/img/apps-appsheet/app-ejemplo-1.png",
            link: "#"
        },
        {
            title: "Aplicaciones Web (Firebase)",
            description: "Construyo aplicaciones web escalables con Firebase, con funcionalidades completas y diseños impactantes.",
            imageUrl: "assets/img/web-firebase/web-ejemplo-1.png",
            link: "https://sinsapiar1.github.io/control-almacen/"
        },
        {
            title: "Automatización con Google & Office",
            description: "Sistematización y automatización de procesos usando herramientas de Google y Microsoft Office.",
            imageUrl: "assets/img/placeholder-automation.jpg",
            link: "#"
        },
        {
            title: "Programas en Python",
            description: "Herramientas de análisis de datos y automatización desarrolladas con Python.",
            imageUrl: "assets/img/placeholder-python.jpg",
            link: "#"
        }
        
    ];

    // Datos para las burbujas de habilidades
    const habilidades = [
        {
            name: "HTML/CSS/JS",
            description: "Desarrollo web front-end con animaciones y efectos visuales avanzados. Dominio de interfaces responsivas y experiencias interactivas."
        },
        {
            name: "Firebase",
            description: "Desarrollo de aplicaciones web con bases de datos en tiempo real, autenticación de usuarios y hosting."
        },
        {
            name: "AppSheet",
            description: "Creación de aplicaciones móviles sin código, con formularios dinámicos, flujos de trabajo automatizados y registro fotográfico."
        },
        {
            name: "Google Apps Script",
            description: "Automatización de procesos con Google Workspace, conectando Sheets, Forms, Docs y servicios externos."
        },
        {
            name: "Python",
            description: "Desarrollo de scripts para análisis de datos, automatización y visualización con librerías como Pandas y NumPy."
        },
        {
            name: "Diseño UX/UI",
            description: "Diseño de interfaces centradas en el usuario, con enfoque en usabilidad y experiencia visual atractiva."
        },
        {
            name: "Three.js",
            description: "Creación de experiencias 3D inmersivas para web, con animaciones y visualizaciones interactivas."
        }
    ];
    
    // Función para generar un color aleatorio (ejemplo - puedes personalizarla)
    function generarColorAleatorio() {
        const coloresVibrantes = ['#007bff', '#6610f2', '#e83e8c', '#fd7e14', '#198754', '#dc3545', '#28a745', '#ffc107'];
        return coloresVibrantes[Math.floor(Math.random() * coloresVibrantes.length)];
    }
    
    // Crear contenedores para las visualizaciones 3D
    function crearContenedor3D(id, titulo, seccionPadre) {
        const seccion = document.getElementById(seccionPadre);
        
        if (!seccion) {
            console.error(`No se encontró la sección con ID ${seccionPadre}`);
            return null;
        }
        
        const contenedor = document.createElement('div');
        contenedor.id = id;
        contenedor.className = 'contenedor-3d';
        contenedor.style.width = '100%';
        contenedor.style.borderRadius = '8px';
        contenedor.style.overflow = 'hidden';
        contenedor.style.marginBottom = '30px';
        contenedor.style.marginTop = '30px';
        
        const tituloElemento = document.createElement('h3');
        tituloElemento.textContent = titulo;
        tituloElemento.style.textAlign = 'center';
        tituloElemento.style.marginBottom = '15px';
        
        seccion.prepend(contenedor);
        seccion.prepend(tituloElemento);
        
        return contenedor.id;
    }
    
    // Inicializar galerías 3D
    const contenedorHabilidades3D = crearContenedor3D('habilidades-3d', 'Mis Habilidades y Tecnologías', 'sobre-mi');
    
    
    if (contenedorHabilidades3D) {
        const burbujas3D = initSkillsBubbles(contenedorHabilidades3D, habilidades);
    }
    
    // Añadir información de interacción
    const infoInteraccion = document.createElement('p');
    infoInteraccion.textContent = '💡 Tip: Puedes arrastrar la galería y hacer hover sobre los elementos para más información.';
    infoInteraccion.style.textAlign = 'center';
    infoInteraccion.style.fontSize = '0.9rem';
    infoInteraccion.style.color = '#666';
    infoInteraccion.style.marginTop = '10px';
    
    const contenedorProyectos = document.getElementById(contenedorProyectos3D);
    if (contenedorProyectos) {
        contenedorProyectos.after(infoInteraccion);
    }
    
    // Cambiar el color de fondo y texto al hacer scroll (ejemplo mejorado)
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const umbralOscuro = 800;
        const umbralClaro = 2000;

        if (scrollPosition > umbralOscuro && scrollPosition < umbralClaro) {
            body.style.backgroundColor = '#222';
            body.style.color = '#eee';
            header.style.backgroundColor = '#444';
            navLinks.forEach(link => link.style.color = '#ddd');
        } else {
            body.style.backgroundColor = '#f4f4f4';
            body.style.color = '#333';
            header.style.backgroundColor = '#333';
            navLinks.forEach(link => link.style.color = '#fff');
        }
    });

    // Efecto hover sutil en los proyectos y blogs
    proyectoElementos.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => {
            elemento.style.backgroundColor = '#f9f9f9';
            elemento.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            elemento.style.transform = 'scale(1.02)';
            elemento.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease';
        });
        elemento.addEventListener('mouseleave', () => {
            elemento.style.backgroundColor = '#fff';
            elemento.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            elemento.style.transform = 'scale(1)';
        });
    });

    // Efecto hover en los enlaces de los proyectos
    enlacesProyecto.forEach(enlace => {
        enlace.addEventListener('mouseenter', () => {
            enlace.style.backgroundColor = '#0056b3';
            enlace.style.transform = 'scale(1.05)';
        });
        enlace.addEventListener('mouseleave', () => {
            enlace.style.backgroundColor = '#007bff';
            enlace.style.transform = 'scale(1)';
        });
    });

    // Cambio de color del texto del encabezado (más sutil)
    setInterval(() => {
        if (header) {
            header.style.color = generarColorAleatorio();
            header.style.transition = 'color 0.5s ease-in-out'; // Añadimos transición
            setTimeout(() => {
                header.style.color = '#fff'; // Regresa al color original después de un breve tiempo
            }, 750);
        }
    }, 5000); // Cambia cada 5 segundos y revierte

    // --- Efecto de Evadir el Ratón para el Título ---
    const sensitivity = 20; // Ajusta la sensibilidad del movimiento

    if (mainTitle) {
        document.addEventListener('mousemove', (e) => {
            const titleRect = mainTitle.getBoundingClientRect();
            const centerX = titleRect.left + titleRect.width / 2;
            const centerY = titleRect.top + titleRect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const moveX = deltaX / sensitivity;
            const moveY = deltaY / sensitivity;

            mainTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        mainTitle.addEventListener('mouseleave', () => {
            mainTitle.style.transform = 'translate(0, 0)'; // Regresa a la posición original
        });
    }
    
    // Añadir efectos de parallax al hacer scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Aplicar efecto parallax a las secciones
        document.querySelectorAll('section').forEach((section, index) => {
            const speed = index % 2 === 0 ? 0.2 : -0.2;
            const yPos = scrollPosition * speed;
            section.style.backgroundPosition = `center ${yPos}px`;
        });
    });
});

// --- Animación de Entrada de las Secciones ---
const secciones = document.querySelectorAll('section');

function checkVisibility() {
    const secciones = document.querySelectorAll('section');
    secciones.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Modificamos la condición para ser más permisiva
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !section.classList.contains('aparecer')) {
            section.classList.add('aparecer');
        } else if (!isVisible && section.classList.contains('aparecer')) {
            section.classList.remove('aparecer'); // Opcional: remover la clase si ya no es visible
        }
    });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('resize', checkVisibility);
checkVisibility(); // Para verificar la visibilidad inicial

// Efecto de movimiento 3D para las cartas
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