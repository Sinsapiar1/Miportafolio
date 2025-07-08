// Importar módulos 3D
import { initThreeBackground } from './three-background.js';

// Configuración moderna del portafolio
class ModernPortfolio {
  constructor() {
    this.header = document.querySelector('header');
    this.mainTitle = document.getElementById('main-title');
    this.navLinks = document.querySelectorAll('nav a');
    this.sections = document.querySelectorAll('section');
    this.lastScrollPosition = 0;
    this.ticking = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }

  init() {
    // Configurar eventos optimizados
    this.setupScrollEffects();
    this.setupIntersectionObserver();
    this.setupModernHoverEffects();
    this.setupKeyboardNavigation();
    
    // Inicializar componentes 3D
    this.init3DComponents();
    
    // Configurar efectos de entrada
    this.setupEntranceAnimations();
  }

  setupScrollEffects() {
    // Header auto-hide optimizado con RAF
    const handleScroll = () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const currentScrollPosition = window.pageYOffset;
          
          if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 100) {
            // Scrolling down
            this.header.classList.add('ocultar');
            this.header.classList.remove('mostrar');
          } else {
            // Scrolling up
            this.header.classList.remove('ocultar');
            this.header.classList.add('mostrar');
          }
          
          this.lastScrollPosition = currentScrollPosition;
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    // Usar passive listener para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  setupIntersectionObserver() {
    // Observador para animaciones de entrada de secciones
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aparecer');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px 0px'
    });

    this.sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  setupModernHoverEffects() {
    // Efectos modernos para elementos de proyecto
    const projectElements = document.querySelectorAll('.proyecto, .blog-proyecto, .pagina');
    
    projectElements.forEach(element => {
      if (this.isReducedMotion) return;
      
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-4px)';
        element.style.boxShadow = 'var(--shadow-xl)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = 'var(--shadow-sm)';
      });
    });

    // Efecto moderno para el título principal
    if (this.mainTitle && !this.isReducedMotion) {
      this.setupTitleInteraction();
    }
  }

  setupTitleInteraction() {
    // Efecto magnético sutil para el título
    const handleMouseMove = this.throttle((e) => {
      const rect = this.mainTitle.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.02;
      const deltaY = (e.clientY - centerY) * 0.02;
      
      this.mainTitle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
    }, 16);

    const handleMouseLeave = () => {
      this.mainTitle.style.transform = 'translate(0, 0) scale(1)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    this.mainTitle.addEventListener('mouseleave', handleMouseLeave);
  }

  setupKeyboardNavigation() {
    // Mejorar navegación por teclado
    this.navLinks.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  init3DComponents() {
    try {
      // Inicializar fondo 3D
      const destroyBackground = initThreeBackground();
      
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

      // Crear contenedor para habilidades 3D si no existe
      this.createSkillsContainer(habilidades);
      
    } catch (error) {
      console.warn('Error al inicializar componentes 3D:', error);
    }
  }

  createSkillsContainer(habilidades) {
    const sobreMiSection = document.getElementById('sobre-mi');
    if (!sobreMiSection) return;

    // Verificar si ya existe el contenedor
    let skillsContainer = document.getElementById('habilidades-3d');
    
    if (!skillsContainer) {
      skillsContainer = document.createElement('div');
      skillsContainer.id = 'habilidades-3d';
      skillsContainer.className = 'contenedor-3d';
      skillsContainer.style.cssText = `
        width: 100%;
        height: 400px;
        border-radius: var(--radius-xl);
        overflow: hidden;
        margin: 2rem 0;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
        border: 1px solid var(--border-light);
      `;

      const titulo = document.createElement('h3');
      titulo.textContent = 'Mis Habilidades y Tecnologías';
      titulo.className = 'gradient-text';
      titulo.style.textAlign = 'center';
      titulo.style.marginBottom = '1rem';

      sobreMiSection.insertBefore(titulo, sobreMiSection.firstChild);
      sobreMiSection.insertBefore(skillsContainer, titulo.nextSibling);
    }

    // Inicializar burbujas de habilidades si está disponible
    if (typeof initSkillsBubbles === 'function') {
      initSkillsBubbles('habilidades-3d', habilidades);
    }
  }

  setupEntranceAnimations() {
    // Animaciones de entrada escalonadas para elementos
    const animatedElements = document.querySelectorAll('.proyecto, .blog-proyecto, .pagina');
    
    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100 + (index * 50));
    });
  }

  // Función throttle optimizada
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
}

// Utilidades modernas
class PortfolioUtils {
  static addSmoothScrolling() {
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  static setupLazyLoading() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  static setupPreventZoom() {
    // Prevenir zoom accidental en móviles
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    document.addEventListener('gesturechange', function (e) {
      e.preventDefault();
    });

    document.addEventListener('gestureend', function (e) {
      e.preventDefault();
    });
  }

  static setupPerformanceOptimizations() {
    // Preload de recursos críticos
    const criticalResources = [
      '/css/styles.css',
      '/js/flip-cards.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar portafolio moderno
  window.modernPortfolio = new ModernPortfolio();
  
  // Configurar utilidades
  PortfolioUtils.addSmoothScrolling();
  PortfolioUtils.setupLazyLoading();
  PortfolioUtils.setupPreventZoom();
  PortfolioUtils.setupPerformanceOptimizations();
  
  // Agregar tip de interacción
  const infoTip = document.createElement('div');
  infoTip.innerHTML = `
    <p style="
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 2rem 0;
      padding: 1rem;
      background: rgba(59, 130, 246, 0.05);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    ">
      💡 <strong>Tip:</strong> Puedes interactuar con las cartas y elementos 3D. ¡Explora con el mouse y teclado!
    </p>
  `;
  
  const proyectosSection = document.getElementById('proyectos');
  if (proyectosSection) {
    proyectosSection.appendChild(infoTip);
  }
});

// Manejar cambios en el viewport
window.addEventListener('resize', () => {
  // Recalcular elementos que dependen del viewport
  if (window.modernPortfolio) {
    window.modernPortfolio.lastScrollPosition = window.pageYOffset;
  }
});

// Optimización para dispositivos móviles
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
  
  // Mejorar performance en touch devices
  document.addEventListener('touchstart', function() {}, { passive: true });
  document.addEventListener('touchmove', function() {}, { passive: true });
}

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registro falló: ', registrationError);
      });
  });
}

// Exportar para uso global
window.PortfolioUtils = PortfolioUtils;