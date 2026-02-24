const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    menuToggle.addEventListener('click', () => { 
        navList.classList.toggle('active'); 
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => { 
            navList.classList.remove('active'); 
        });
    });