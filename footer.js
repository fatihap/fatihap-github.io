// Footer Loader and Link Handler
(function() {
    'use strict';
    
    // Load footer HTML
    function loadFooter() {
        fetch('footer.html')
            .then(response => response.text())
            .then(html => {
                // Insert footer before closing body tag or before scripts
                const footerContainer = document.getElementById('footer-container');
                if (footerContainer) {
                    footerContainer.innerHTML = html;
                    setupFooterLinks();
                } else {
                    // Fallback: insert before first script tag or at end of body
                    const scripts = document.querySelectorAll('script[src*="bootstrap"]');
                    if (scripts.length > 0) {
                        scripts[0].insertAdjacentHTML('beforebegin', html);
                    } else {
                        document.body.insertAdjacentHTML('beforeend', html);
                    }
                    setupFooterLinks();
                }
            })
            .catch(error => {
                console.error('Footer yüklenirken hata oluştu:', error);
            });
    }
    
    // Setup footer links based on current page
    function setupFooterLinks() {
        const isIndexPage = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname === '/' || 
                            window.location.pathname.endsWith('/') ||
                            !window.location.pathname.includes('.html');
        
        const footerLinks = document.querySelectorAll('[data-footer-link]');
        footerLinks.forEach(link => {
            const section = link.getAttribute('data-footer-link');
            
            if (section === 'projeler') {
                link.href = 'projeler.html';
            } else if (isIndexPage) {
                link.href = `#${section}`;
            } else {
                link.href = `index.html#${section}`;
            }
            
            // Add click handler for cross-page navigation
            link.addEventListener('click', function(e) {
                if (section === 'projeler') {
                    return; // Let default behavior handle projeler.html
                }
                
                if (!isIndexPage && section !== 'projeler') {
                    e.preventDefault();
                    window.location.href = `index.html#${section}`;
                }
            });
        });
    }
    
    // Load footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();

