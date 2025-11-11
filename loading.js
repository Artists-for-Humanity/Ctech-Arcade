// Loading Animation System for C-Tech Arcade

// Binary background setup function
async function setupBinaryBackground(relativePath = '') {
    try {
        const txt = await fetch(`${relativePath}assets/binary.txt`).then(r => r.text());
        const safe = JSON.stringify(txt);
        document.documentElement.style.setProperty('--binary', safe);
    } catch (e) {
        console.error('Failed to load binary.txt', e);
    }
}

// Loading animation functions
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    const progressFill = document.getElementById('progressBarFill');
    
    if (!overlay || !progressFill) return null;
    
    overlay.classList.add('active');
    progressFill.style.width = '0%';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increment between 5-20%
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressFill.style.width = progress + '%';
    }, 100);
    
    return interval;
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function navigateWithLoading(href) {
    const progressInterval = showLoading();
    
    // Random loading time between 1.5-3 seconds
    const minLoadTime = Math.random() * 1500 + 1500;
    setTimeout(() => {
        if (progressInterval) clearInterval(progressInterval);
        
        // Complete the progress bar
        const progressFill = document.getElementById('progressBarFill');
        if (progressFill) {
            progressFill.style.width = '100%';
        }
        
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }, minLoadTime);
}

// Initialize loading system
function initializeLoading(isGamePage = false) {
    // Setup binary background
    const relativePath = isGamePage ? '../' : '';
    setupBinaryBackground(relativePath);
    
    // Add loading overlay HTML if it doesn't exist
    if (!document.getElementById('loadingOverlay')) {
        const loadingHTML = `
            <div class="loading-overlay" id="loadingOverlay">
                <div class="loading-title">Loading....</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progressBarFill"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }
    
    // Add event listeners to navigation links
    document.addEventListener('DOMContentLoaded', function() {
        // For game links on homepage - only add listeners to elements with href attributes
        const gameLinks = document.querySelectorAll('.game[href]');
        gameLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                navigateWithLoading(href);
            });
        });
        
        // For home links on game pages
        const homeLinks = document.querySelectorAll('a[href*="index.html"], a[href="../index.html"]');
        homeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                navigateWithLoading(href);
            });
        });
    });
    
    // Show loading animation when returning from other pages
    // window.addEventListener('load', function() {
    //     if (document.referrer && 
    //         (document.referrer.includes('/game') || document.referrer.includes('index.html'))) {
    //         const progressInterval = showLoading();
            
    //         setTimeout(() => {
    //             if (progressInterval) clearInterval(progressInterval);
    //             const progressFill = document.getElementById('progressBarFill');
    //             if (progressFill) {
    //                 progressFill.style.width = '100%';
    //             }
                
    //             setTimeout(() => {
    //                 hideLoading();
    //             }, 300);
    //         }, 1000);
    //     }
    // });
    window.addEventListener('load', function() {
    // Only show loading overlay if coming from a different origin or direct navigation
    // (not from our own navigation)
    // Remove or comment out this block entirely if you don't want any loading on page load
    // If you want to keep a quick flash for direct navigation, you can keep a minimal version
    hideLoading();
});
    
}