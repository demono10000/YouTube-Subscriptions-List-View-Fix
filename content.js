(function() {
    'use strict';

    function fixThumbnails() {
        const images = document.querySelectorAll('ytd-rich-item-renderer img.ytCoreImageHost');

        images.forEach(img => {
            // 1. Remove dynamic attributes injected by YT that break aspect ratio
            if (img.hasAttribute('width')) img.removeAttribute('width');
            if (img.hasAttribute('height')) img.removeAttribute('height');
            
            // 2. Force inline styles to ensure coverage
            img.style.objectFit = 'cover';
            img.style.minHeight = '100%';
            img.style.minWidth = '100%';

            // 3. Replace image with constant resolution
            if (img.src && !img.src.includes('maxresdefault') && !img.dataset.fixed) {
                const anchor = img.closest('a[href*="/watch?v="]');
                
                if (anchor) {
                    const href = anchor.getAttribute('href');
                    // Extract Video ID (handles extra params like &t=)
                    const match = href.match(/[?&]v=([^&]+)/);
                    
                    if (match && match[1]) {
                        img.src = `https://i3.ytimg.com/vi/${match[1]}/mqdefault.jpg`;
                        // img.src = `https://i3.ytimg.com/vi/${match[1]}/maxresdefault.jpg`; // Higher quality thumbnails
                        img.dataset.fixed = "true"; // Prevent re-processing
                    }
                }
            }
        });
    }

    // Observer: Watch for DOM changes (Infinite scrolling / Navigation)
    const observer = new MutationObserver(() => {
        fixThumbnails();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style']
    });

    // Fallback interval
    setInterval(fixThumbnails, 1500);
    
    // Initial run
    fixThumbnails();
})();