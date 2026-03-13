/* ============================================
   Click Tracking
   ============================================ */

// Simple click tracking function
function trackClick(element) {
    // Get the link information
    const linkTitle = element.querySelector('.link-title')?.textContent || 'Unknown';
    const linkUrl = element.href || 'No URL';
    const timestamp = new Date().toISOString();
    
    // Log to console (for testing)
    console.log('🔗 Link clicked:', {
        title: linkTitle,
        url: linkUrl,
        timestamp: timestamp,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
    
    // Send event to Google Analytics (if gtag is available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'social_links',
            event_label: linkTitle,
            value: 1,
            custom_parameters: {
                link_url: linkUrl,
                link_title: linkTitle
            }
        });
        console.log('📊 Event sent to Google Analytics');
    }
    
    // Store in localStorage for persistence (backup tracking)
    const clicks = JSON.parse(localStorage.getItem('linkClicks') || '[]');
    clicks.push({
        title: linkTitle,
        url: linkUrl,
        timestamp: timestamp,
        userAgent: navigator.userAgent
    });
    
    // Keep only the last 100 clicks to prevent storage bloat
    if (clicks.length > 100) {
        clicks.splice(0, clicks.length - 100);
    }
    
    localStorage.setItem('linkClicks', JSON.stringify(clicks));
}

// Function to view all tracked clicks
function viewClickHistory() {
    const clicks = JSON.parse(localStorage.getItem('linkClicks') || '[]');
    console.table(clicks);
    return clicks;
}

// Function to export click data
function exportClickData() {
    const clicks = JSON.parse(localStorage.getItem('linkClicks') || '[]');
    const dataStr = JSON.stringify(clicks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ohako_link_clicks_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Initialize click tracking keyboard shortcuts
function initClickTracking() {
    document.addEventListener('keydown', (e) => {
        // Press 'S' to view Stats
        if (e.key.toLowerCase() === 's' && e.ctrlKey) {
            e.preventDefault();
            console.log('📊 Click Statistics:');
            const clicks = viewClickHistory();
            
            // Show summary
            const summary = clicks.reduce((acc, click) => {
                acc[click.title] = (acc[click.title] || 0) + 1;
                return acc;
            }, {});
            
            console.log('📈 Summary:', summary);
            console.log('💾 Total clicks tracked:', clicks.length);
        }
        
        // Press Ctrl+E to Export data
        if (e.key.toLowerCase() === 'e' && e.ctrlKey) {
            e.preventDefault();
            exportClickData();
            console.log('📁 Click data exported!');
        }
    });
}

/* ============================================
   Ohako Link Page - Epic Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCardEffects();
    initParallax();
    initTouchFeedback();
    initEasterEgg();
    initClickTracking();
});

/* ============================================
   Epic Loading Screen + Swirl Transition
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    const swirl = document.getElementById('swirlTransition');
    const content = document.getElementById('content');
    
    // After loader finishes: fade out loader, then draw spiral
    setTimeout(() => {
        loader.classList.add('hidden');
        
        setTimeout(() => {
            swirl.classList.add('active');
            drawSpiral();
        }, 200);
    }, 2600);
}

function drawSpiral() {
    const canvas = document.getElementById('swirlCanvas');
    const swirl = document.getElementById('swirlTransition');
    const content = document.getElementById('content');
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    // Spiral must reach every corner of the screen
    const diagonal = Math.sqrt(w * w + h * h);
    const maxRadius = diagonal * 0.8;
    const totalRotations = 14;
    const totalPoints = totalRotations * 100;
    const duration = 1400;

    // The gap between loops = maxRadius / totalRotations
    // Line width needs to exceed this gap so loops merge into solid colour
    const loopGap = maxRadius / totalRotations;

    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth ease-in-out
        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const pointsToDraw = Math.floor(eased * totalPoints);

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fef0f5';
        ctx.fillRect(0, 0, w, h);

        if (pointsToDraw > 1) {
            ctx.beginPath();
            for (let i = 0; i <= pointsToDraw; i++) {
                const t = i / totalPoints;
                const angle = t * totalRotations * 2 * Math.PI;
                const radius = t * maxRadius;
                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            // Line width grows with the spiral — by the outer loops it's
            // wider than the gap between loops so they overlap into solid pink.
            // Starts at 4px, ends at 1.4× the loop gap.
            const currentT = pointsToDraw / totalPoints;
            ctx.strokeStyle = '#fcd5e3';
            ctx.lineWidth = 4 + currentT * currentT * loopGap * 1.4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Spiral has drawn itself into solid pink — brief hold then blob
            setTimeout(() => {
                drawPinkBlob(canvas, ctx, w, h, swirl, content);
            }, 300);
        }
    }

    requestAnimationFrame(animate);
}

function drawPinkBlob(canvas, ctx, w, h, swirl, content) {
    const blobDuration = 950;   // ms for blob to cover screen
    const wobbleAmp  = 38;      // height of the wiggly edge
    const wobbleFreq = 2.8;     // number of waves across the width
    const startTime  = performance.now();

    // Reveal the page content immediately so it's ready behind the canvas
    content.classList.add('visible');

    function animateBlob(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / blobDuration, 1);

        // Ease: fast start, bouncy settle
        const eased = 1 - Math.pow(1 - progress, 3);

        // Wobble: oscillate faster at start, slow at end
        const wobbleTime = elapsed * 0.012;
        const wobbleFade = 1 - eased * 0.7; // wobble calms as it fills

        // Clear canvas each frame
        ctx.clearRect(0, 0, w, h);

        // Only draw the remaining pink area (the part the cream hasn't covered yet)
        // The cream blob rises from bottom, so pink remains from top down to riseY
        const riseY = h - eased * (h + wobbleAmp);

        // Draw the pink section (top of screen down to the wiggly edge)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, riseY);

        // Wiggly bottom edge of the pink, drawn right to left
        const steps = 80;
        for (let i = steps; i >= 0; i--) {
            const x = (i / steps) * w;
            const wave1 = Math.sin((i / steps) * Math.PI * 2 * wobbleFreq + wobbleTime) * wobbleAmp * wobbleFade;
            const wave2 = Math.sin((i / steps) * Math.PI * 2 * wobbleFreq * 1.7 + wobbleTime * 1.3) * wobbleAmp * 0.4 * wobbleFade;
            const y = riseY + wave1 + wave2;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = '#fcd5e3';
        ctx.fill();

        if (progress < 1) {
            requestAnimationFrame(animateBlob);
        } else {
            // Pink is fully gone — remove the canvas
            swirl.style.display = 'none';
        }
    }

    requestAnimationFrame(animateBlob);
}

/* ============================================
   Card Effects - Magnetic Tilt & Ripples
   ============================================ */
function initCardEffects() {
    const cards = document.querySelectorAll('.link-card');
    
    cards.forEach(card => {
        // Magnetic tilt on mousemove (desktop)
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Ripple on click
        card.addEventListener('click', (e) => {
            // Track the click
            trackClick(card);
            
            createRipple(e, card);
        });
    });
}

function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(248, 200, 216, 0.6) 0%, transparent 60%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 5;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/* ============================================
   Parallax Effects
   ============================================ */
function initParallax() {
    const decos = document.querySelectorAll('.deco');
    const orbs = document.querySelectorAll('.orb');
    
    let ticking = false;
    
    // Scroll-based parallax
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                decos.forEach((deco, i) => {
                    const speed = 0.02 + (i * 0.01);
                    deco.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                orbs.forEach((orb, i) => {
                    const speed = 0.015 + (i * 0.008);
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Device tilt parallax (mobile)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const gamma = (e.gamma || 0) / 90;
            const beta = (e.beta || 0) / 180;
            
            decos.forEach((deco, i) => {
                const factor = (i + 1) * 3;
                const x = gamma * factor;
                const y = beta * factor;
                deco.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

/* ============================================
   Touch Feedback
   ============================================ */
function initTouchFeedback() {
    const cards = document.querySelectorAll('.link-card');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.97)';
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
            card.style.animation = 'cardBounce 0.4s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 400);
        }, { passive: true });
        
        card.addEventListener('touchcancel', () => {
            card.style.transform = '';
        }, { passive: true });
    });
    
    // Add bounce animation
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
        @keyframes cardBounce {
            0% { transform: scale(0.97); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(bounceStyle);
}

/* ============================================
   Easter Egg - Tap profile 5 times
   ============================================ */
function initEasterEgg() {
    let tapCount = 0;
    let tapTimer = null;
    
    const profile = document.querySelector('.profile-image-wrapper');
    if (!profile) return;
    
    profile.addEventListener('click', () => {
        tapCount++;
        
        profile.style.transform = 'scale(0.95)';
        setTimeout(() => {
            profile.style.transform = '';
        }, 150);
        
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => tapCount = 0, 600);
        
        if (tapCount >= 5) {
            tapCount = 0;
            celebrate();
        }
    });
}

function celebrate() {
    const emojis = ['⋆˚꩜', '𐙚', '˙⋆✮', '♡', '✦', '✧', '૮꒰ ˶• ༝ •˶꒱ა'];
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    // Add celebration animation
    if (!document.querySelector('#celebrate-style')) {
        const style = document.createElement('style');
        style.id = 'celebrate-style';
        style.textContent = `
            @keyframes celebrateFloat {
                0% {
                    transform: translateY(0) scale(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-200px) scale(1.2) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create confetti burst
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                left: ${30 + Math.random() * 40}%;
                top: 50%;
                font-size: ${1 + Math.random() * 0.8}rem;
                animation: celebrateFloat ${1.5 + Math.random() * 0.5}s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                pointer-events: none;
                z-index: 100;
            `;
            container.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 2000);
        }, i * 60);
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
}

/* ============================================
   Pause animations when tab not visible
   ============================================ */
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.deco, .orb, .profile-glow, .profile-ring');
    animatedElements.forEach(el => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});
