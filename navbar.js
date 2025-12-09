// Navbar Loader and Link Handler
(function() {
    'use strict';
    
    // Load navbar HTML
    function loadNavbar() {
        fetch('navbar.html')
            .then(response => response.text())
            .then(html => {
                // Insert navbar at the beginning of body
                const navbarContainer = document.getElementById('navbar-container');
                if (navbarContainer) {
                    navbarContainer.innerHTML = html;
                } else {
                    // Fallback: insert at beginning of body
                    const body = document.body;
                    if (body.firstChild) {
                        body.insertBefore(document.createRange().createContextualFragment(html), body.firstChild);
                    } else {
                        body.insertAdjacentHTML('afterbegin', html);
                    }
                }
                
                // Setup links and scroll after navbar is inserted
                setTimeout(() => {
                    setupNavbarLinks();
                    initNavbarScroll();
                }, 100);
            })
            .catch(error => {
                console.error('Navbar yüklenirken hata oluştu:', error);
            });
    }
    
    // Setup navbar links based on current page
    function setupNavbarLinks() {
        const isIndexPage = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname === '/' || 
                            window.location.pathname.endsWith('/') ||
                            !window.location.pathname.includes('.html');
        
        const navbarLinks = document.querySelectorAll('[data-navbar-link]');
        navbarLinks.forEach(link => {
            const section = link.getAttribute('data-navbar-link');
            
            if (section === 'home') {
                link.href = isIndexPage ? '#' : 'index.html';
            } else if (section === 'projeler') {
                link.href = 'projeler.html';
            } else if (isIndexPage) {
                link.href = `#${section}`;
            } else {
                link.href = `index.html#${section}`;
            }
            
            // Set active state
            if (section === 'projeler' && window.location.pathname.includes('projeler.html')) {
                link.classList.add('active');
            } else if (isIndexPage && link.getAttribute('data-section')) {
                // Will be handled by scroll spy
            }
            
            // Add click handler for cross-page navigation
            link.addEventListener('click', function(e) {
                if (section === 'projeler') {
                    return; // Let default behavior handle projeler.html
                }
                
                if (section === 'home') {
                    e.preventDefault();
                    if (!isIndexPage) {
                        window.location.href = 'index.html';
                    } else {
                        // Already on index page, just scroll to top
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        // Remove hash from URL without reload
                        if (window.location.hash) {
                            history.replaceState(null, null, window.location.pathname);
                        }
                    }
                    return;
                }
                
                // Handle section links (anasayfa, hizmetler, hakkimizda, iletisim)
                if (isIndexPage) {
                    // On index page, prevent default and use smooth scroll
                    e.preventDefault();
                    
                    // If clicking "anasayfa" section link, scroll to top
                    if (section === 'anasayfa') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        // Remove hash from URL without reload
                        if (window.location.hash) {
                            history.replaceState(null, null, window.location.pathname);
                        }
                    } else {
                        // Other sections
                        const targetSection = document.querySelector(`#${section}`);
                        if (targetSection) {
                            const offsetTop = targetSection.offsetTop - 100;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                            // Update URL hash without reload
                            history.pushState(null, null, `#${section}`);
                        }
                    }
                } else {
                    // On other pages, navigate to index with hash
                    e.preventDefault();
                    if (section === 'anasayfa') {
                        window.location.href = 'index.html';
                    } else {
                        window.location.href = `index.html#${section}`;
                    }
                }
            });
        });
    }
    
    // Initialize navbar scroll effect and scroll spy
    function initNavbarScroll() {
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('mainNavbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
        
        // Scroll Spy - Active navbar link based on scroll position (only on index page)
        const isIndexPage = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname === '/' || 
                            window.location.pathname.endsWith('/') ||
                            !window.location.pathname.includes('.html');
        
        if (isIndexPage) {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link[data-section]');

            function updateActiveNavLink() {
                let current = '';
                const scrollY = window.pageYOffset || window.scrollY;
                const navbarHeight = 100;

                sections.forEach(section => {
                    const sectionHeight = section.offsetHeight;
                    const sectionTop = section.offsetTop - navbarHeight;
                    const sectionId = section.getAttribute('id');

                    if (scrollY >= sectionTop - 50 && scrollY < sectionTop + sectionHeight) {
                        current = sectionId;
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === current) {
                        link.classList.add('active');
                    }
                });

                // If at top of page, make anasayfa active
                if (scrollY < 150) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === 'anasayfa') {
                            link.classList.add('active');
                        }
                    });
                }
            }

            // Update on scroll
            window.addEventListener('scroll', updateActiveNavLink);
            
            // Update on page load
            setTimeout(updateActiveNavLink, 500);
        }
    }
    
    // Load navbar when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNavbar);
    } else {
        loadNavbar();
    }
})();

