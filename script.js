// Google Analytics Config
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MNH0MG597R');

// Mobile Menu Logic
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => { 
        navList.classList.toggle('active'); 
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => { 
            navList.classList.remove('active'); 
        });
    });
}
