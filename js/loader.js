// loader.js - Cargador no modular para resolver conflictos
document.addEventListener('DOMContentLoaded', () => {
    // Aquí colocamos las variables y funciones que necesitamos pasar a nuestros módulos
    window.threeJsReady = true;
    
    // Función para cargar un script
    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Error cargando script: ${url}`));
        document.head.appendChild(script);
      });
    }
    
    // Cargamos los scripts en el orden correcto
    async function loadScripts() {
      try {
        // Primero cargamos las dependencias
        await loadScript('js/three-background.js');
        await loadScript('js/project-gallery-3d.js');
        await loadScript('js/skills-bubbles.js');
        
        // Finalmente cargamos el script principal
        await loadScript('js/script.js');
        
        console.log('Todos los scripts cargados correctamente');
      } catch (error) {
        console.error('Error cargando scripts:', error);
      }
    }
    
    // Iniciar carga de scripts
    loadScripts();
  });