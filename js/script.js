document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('header');
    const mainTitle = document.getElementById('main-title'); // Referencia al título principal
    const navLinks = document.querySelectorAll('nav a');
    const proyectoElementos = document.querySelectorAll('.proyecto, .blog-proyecto, .pagina'); // Incluimos .blog-proyecto
    const enlacesProyecto = document.querySelectorAll('.proyecto a, .pagina a'); // Quitamos .invento (ya no está)

    // Función para generar un color aleatorio (ejemplo - puedes personalizarla)
    function generarColorAleatorio() {
        const coloresVibrantes = ['#007bff', '#6610f2', '#e83e8c', '#fd7e14', '#198754', '#dc3545', '#28a745', '#ffc107'];
        return coloresVibrantes[Math.floor(Math.random() * coloresVibrantes.length)];
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