// Google Analytics Config
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MNH0MG597R');

// Mobile Menu Logic
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (menuToggle && navList) {
    // Toggle menu on click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents immediate closing from the document listener
        navList.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    // New: Close menu if user clicks anywhere outside the nav
    document.addEventListener('click', (event) => {
        const isClickInside = navList.contains(event.target) || menuToggle.contains(event.target);
        
        if (!isClickInside && navList.classList.contains('active')) {
            navList.classList.remove('active');
        }
    });
}

// Blog Master 50 - Optional: Horizontal Scroll Wheel Support
// Allows desktop users to scroll the blog/reviews using their mouse wheel
const sliders = document.querySelectorAll('.slider-container');
sliders.forEach(slider => {
    slider.addEventListener('wheel', (evt) => {
        if (evt.deltaY !== 0) {
            evt.preventDefault();
            slider.scrollLeft += evt.deltaY;
        }
    }, { passive: false });
});
