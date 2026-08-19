document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const setupScreen = document.getElementById('setup-screen');
    const mainContent = document.getElementById('main-content');
    const startBtn = document.getElementById('start-btn');
    const brotherNameInput = document.getElementById('brother-name');
    const sisterNameInput = document.getElementById('sister-name');
    
    const sisterDisplays = document.querySelectorAll('.sister-name-display');
    const brotherDisplays = document.querySelectorAll('.brother-name-display');
    
    const audio = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = audioToggle.querySelector('i');
    
    let isPlaying = false;
    let particleInterval = null;

    // ----- INITIALIZATION & SETUP -----

    startBtn.addEventListener('click', () => {
        const bName = brotherNameInput.value.trim();
        const sName = sisterNameInput.value.trim();

        if(bName === '' || sName === '') {
            alert('Please enter both names to create the surprise!');
            return;
        }

        // Update DOM
        sisterDisplays.forEach(el => el.textContent = sName);
        brotherDisplays.forEach(el => el.textContent = bName);

        // Transition screens (with funny prank first)
        const funnySurprise = document.getElementById('funny-surprise');
        
        gsap.to(setupScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setupScreen.classList.remove('active');
                
                // Show funny prank
                funnySurprise.style.display = 'flex';
                
                // Shake and pop image
                gsap.fromTo(funnySurprise.querySelector('img'), 
                    { scale: 0 }, 
                    { scale: 1, duration: 0.5, ease: 'back.out(2)' }
                );
                
                // Wait 3 seconds, then hide prank and start main sequence
                setTimeout(() => {
                    gsap.to(funnySurprise, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            funnySurprise.style.display = 'none';
                            
                            // Start real main content
                            mainContent.classList.add('active');
                            
                            // Play music if allowed by browser policy
                            playAudio();
                            
                            // Trigger opening sequence
                            runOpeningSequence();
                            
                            // Initialize ScrollTrigger and other listeners
                            initScrollAnimations();
                            initCursorSparkles();
                            initTiltEffect();
                        }
                    });
                }, 3000);
            }
        });
    });

    // ----- AUDIO CONTROLS -----
    
    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            audioIcon.classList.remove('fa-volume-xmark');
            audioIcon.classList.add('fa-volume-high');
        }).catch(err => {
            console.log("Audio autoplay prevented by browser.");
        });
    }

    audioToggle.addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
            audioIcon.classList.remove('fa-volume-high');
            audioIcon.classList.add('fa-volume-xmark');
        } else {
            audio.play();
            audioIcon.classList.remove('fa-volume-xmark');
            audioIcon.classList.add('fa-volume-high');
        }
        isPlaying = !isPlaying;
    });

    // ----- ANIMATIONS & INTERACTIVITY -----

    // 1. Opening Sequence
    function runOpeningSequence() {
        const tl = gsap.timeline();
        
        // Setup split text for title
        const titleEl = document.getElementById('opening-title');
        const text = titleEl.innerText;
        titleEl.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.classList.add('split-char');
            titleEl.appendChild(span);
        });

        // Background fade in
        gsap.set(mainContent, {opacity: 0});
        tl.to(mainContent, {opacity: 1, duration: 1})
          
          // Diyas pop in
          .to('.diya-container', {opacity: 1, y: -20, stagger: 0.2, duration: 0.5, ease: 'back.out(1.7)'}, "-=0.5")
          
          // Letter by letter title
          .to('.split-char', {opacity: 1, scale: 1, stagger: 0.05, duration: 0.2, ease: 'back.out(2)'})
          
          // Subtitle and button fade in
          .to('.subtitle', {opacity: 1, y: 0, duration: 1, ease: 'power2.out', onStart: () => {
              document.querySelector('#opening-screen .subtitle').classList.remove('hidden');
          }}, "+=0.2")
          .to('#opening-gift-icon, #open-gift-btn', {opacity: 1, y: 0, duration: 1, ease: 'back.out(1.5)', onStart: () => {
              document.getElementById('opening-gift-icon').classList.remove('hidden');
              document.getElementById('open-gift-btn').classList.remove('hidden');
          }}, "-=0.5")
          .call(() => {
              // Jumping flowers/confetti on opening
              const duration = 3000;
              const end = Date.now() + duration;

              (function frame() {
                  confetti({
                      particleCount: 5,
                      angle: 60,
                      spread: 55,
                      origin: { x: 0, y: 0.8 },
                      colors: ['#FFD700', '#ff4d4d', '#ff99cc', '#ffffff']
                  });
                  confetti({
                      particleCount: 5,
                      angle: 120,
                      spread: 55,
                      origin: { x: 1, y: 0.8 },
                      colors: ['#FFD700', '#ff4d4d', '#ff99cc', '#ffffff']
                  });

                  if (Date.now() < end) {
                      requestAnimationFrame(frame);
                  }
              }());
          });

        // Removed old startBackgroundParticles() call as Three.js handles it now.
    }

    // Cursor Sparkles
    // (Removed old startBackgroundParticles function)

    // Cursor Sparkles
    function initCursorSparkles() {
        // Only run on non-touch devices
        if(window.matchMedia("(pointer: coarse)").matches) return;

        const container = document.getElementById('cursor-sparkles');
        
        document.addEventListener('mousemove', (e) => {
            // Rate limit
            if(Math.random() > 0.5) return;

            const sparkle = document.createElement('div');
            sparkle.classList.add('cursor-sparkle');
            sparkle.style.left = `${e.clientX}px`;
            sparkle.style.top = `${e.clientY}px`;
            container.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 600);
        });
    }

    // 2. Anime Rakhi Entrance & Tying
    const openGiftBtn = document.getElementById('open-gift-btn');
    if (openGiftBtn) {
        openGiftBtn.addEventListener('click', () => {
            document.getElementById('anime-rakhi-scene').scrollIntoView({behavior: 'smooth'});
        });
    }

    const animeTieBtn = document.getElementById('anime-tie-btn');
    const animeSuccessMsg = document.getElementById('anime-success-msg');
    const animeEmotionalMsg = document.getElementById('anime-emotional-msg');

    animeTieBtn.addEventListener('click', () => {
        // Disable button to prevent spamming
        animeTieBtn.disabled = true;
        animeTieBtn.classList.remove('pulse-fast');

        const tl = gsap.timeline();

        // Sister hand extends left towards brother
        tl.to('#anime-wrist', {opacity: 1, x: -40, duration: 1, ease: 'power2.out'})
        
        // Brother arm with rakhi moves right towards sister
        .to('#anime-arm', {opacity: 1, x: 120, y: 25, rotation: -10, duration: 1.5, ease: 'power2.inOut'}, "-=0.5")
        
        // Rakhi rotates slightly
        .to('#anime-rakhi', {rotation: 360, duration: 2, ease: 'none'}, "-=1.5")
        
        // Rakhi glows with golden light
        .to('#anime-rakhi', {boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD700', duration: 0.5})
        
        // Small heart pops above them
        .call(() => {
            const burst = document.getElementById('anime-heart-burst');
            burst.innerHTML = '<i class="fa-solid fa-heart pop-icon" style="color: #ff4d4d; font-size: 3rem; text-shadow: 0 0 10px #ff4d4d;"></i>';
            gsap.fromTo(burst.querySelector('.pop-icon'), {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)'});
            gsap.to(burst.querySelector('.pop-icon'), {y: -50, opacity: 0, duration: 1, delay: 1});
        })

        // Confetti burst
        .call(() => {
            confetti({
                particleCount: 150,
                spread: 120,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#ff4d4d', '#ffffff']
            });
            animeSuccessMsg.classList.remove('hidden');
            animeTieBtn.textContent = "Our Bond Is Sealed ❤️";
        }, null, "+=0.5")
        
        // Reveal emotional message
        .to(animeEmotionalMsg, {
            opacity: 1, 
            y: -10, 
            duration: 1, 
            onStart: () => animeEmotionalMsg.classList.remove('hidden')
        }, "+=1")
        .call(() => {
            // Auto scroll to funny question after 3 seconds
            setTimeout(() => {
                document.getElementById('funny-question-section').scrollIntoView({behavior: 'smooth'});
            }, 3500);
        });
    });

    // 2.2 Funny Sister Question Logic
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const funnyMsgContainer = document.getElementById('funny-message-container');
    const funnySuccess = document.getElementById('funny-success');
    
    let escapeAttempt = 0;
    const funnyMessages = [
        "Nice try! 😜",
        "Nope! Try YES ❤️",
        "You can't catch me! 😂",
        "Wrong button! 😆",
        "Your brother is watching! 👀",
        "Come on, you know the answer! ❤️",
        "NO is not available today! 😂",
        "Try the other button 😜"
    ];

    function escapeNoButton(e) {
        if(yesBtn.disabled) return; // If YES was already clicked

        escapeAttempt++;
        
        // Prevent default tap behavior
        if(e.cancelable) {
            e.preventDefault();
        }
        
        // Change position to fixed if not already
        if (noBtn.style.position !== 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            
            // Move to body to avoid containing block issues with CSS transforms in parent
            document.body.appendChild(noBtn);
            
            // Disable CSS transitions so GSAP can animate cleanly
            noBtn.style.transition = 'none';
            
            noBtn.style.position = 'fixed';
            noBtn.style.left = rect.left + 'px';
            noBtn.style.top = rect.top + 'px';
            noBtn.style.zIndex = '9999';
            
            // Add shake animation class (we can reuse heartbeat or bounce)
            gsap.to(noBtn, {rotation: 10, yoyo: true, repeat: 3, duration: 0.1});
        }

        // Generate random message
        if (escapeAttempt === 5) {
            funnyMsgContainer.innerHTML = "Okay okay... I think you know the answer! 😂❤️";
        } else {
            const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            funnyMsgContainer.innerHTML = randomMsg;
        }

        // Calculate random position
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const safeMargin = 20;
        
        const maxX = window.innerWidth - btnWidth - safeMargin;
        const maxY = window.innerHeight - btnHeight - safeMargin;
        
        let newX = Math.random() * (maxX - safeMargin) + safeMargin;
        let newY = Math.random() * (maxY - safeMargin) + safeMargin;
        
        let duration = 0.4;
        if(escapeAttempt > 2) duration = 0.2;
        if(escapeAttempt > 4) duration = 0.1;
        
        gsap.to(noBtn, {
            left: newX,
            top: newY,
            duration: duration,
            ease: "power2.out"
        });
    }

    if (noBtn && yesBtn) {
        noBtn.addEventListener('mouseover', escapeNoButton);
        noBtn.addEventListener('touchstart', escapeNoButton, {passive: false});
        noBtn.addEventListener('pointerdown', escapeNoButton);
        noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            escapeNoButton(e);
        });

        yesBtn.addEventListener('click', () => {
            // Disable both buttons
            yesBtn.disabled = true;
            noBtn.style.display = 'none'; // hide NO button entirely
            
            funnyMsgContainer.innerHTML = "";
            document.querySelector('.funny-buttons-container').style.display = 'none';

            // Heart burst
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff4d4d', '#ffffff', '#FFD700']
            });
            
            // Custom hearts falling
            for(let i=0; i<40; i++) {
                setTimeout(() => {
                    const h = document.createElement('i');
                    h.classList.add('fa-solid', 'fa-heart');
                    h.style.position = 'fixed';
                    h.style.color = Math.random() > 0.5 ? '#ff4d4d' : '#ff99cc';
                    h.style.fontSize = (Math.random() * 20 + 10) + 'px';
                    h.style.left = Math.random() * window.innerWidth + 'px';
                    h.style.top = '-50px';
                    h.style.zIndex = '9999';
                    document.body.appendChild(h);
                    
                    gsap.to(h, {
                        y: window.innerHeight + 100,
                        x: '+=' + (Math.random() * 150 - 75),
                        rotation: Math.random() * 360,
                        duration: Math.random() * 2 + 2,
                        ease: "none",
                        onComplete: () => h.remove()
                    });
                }, Math.random() * 1500);
            }

            funnySuccess.classList.remove('hidden');
            gsap.fromTo(funnySuccess, {scale: 0.5, opacity: 0}, {scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)'});

            // Continue to next section automatically after 4 seconds
            setTimeout(() => {
                document.getElementById('bonding-section').scrollIntoView({behavior: 'smooth'});
            }, 4000);
        });
    }

    // 3. Typewriter Effect
    const typeWriterEl = document.getElementById('typewriter-text');
    let typeWriterTriggered = false;

    function startTypewriter() {
        if(typeWriterTriggered) return;
        typeWriterTriggered = true;
        
        const sName = sisterNameInput.value.trim() || 'Akka';
        const lines = [
            `Dear ${sName},`,
            `No matter how much we fight, tease each other, or annoy each other, you will always be one of the most important people in my life.`,
            `On this Raksha Bandhan, I just want to say...`,
            `You are not just my sister...`,
            `You are my forever friend. ❤️`,
            `Thank you for being my biggest supporter, and sometimes my biggest headache! 😄`,
            `May your life always be filled with happiness, success, love and beautiful moments.`,
            `Happy Raksha Bandhan! ❤️`
        ];

        typeWriterEl.innerHTML = '';
        let currentLine = 0;
        let currentChar = 0;
        let isTyping = true;
        
        function type() {
            if(currentLine >= lines.length) {
                // Done
                gsap.to('.letter-signoff', {opacity: 1, duration: 1, delay: 0.5});
                return;
            }

            if(currentChar === 0) {
                // Append new paragraph
                const p = document.createElement('p');
                p.style.marginBottom = '1rem';
                p.id = `line-${currentLine}`;
                typeWriterEl.appendChild(p);
            }

            const p = document.getElementById(`line-${currentLine}`);
            p.textContent += lines[currentLine].charAt(currentChar);

            currentChar++;

            if(currentChar >= lines[currentLine].length) {
                currentLine++;
                currentChar = 0;
                setTimeout(type, 500); // Pause at end of line
            } else {
                setTimeout(type, Math.random() * 30 + 20);
            }
        }
        
        setTimeout(type, 500);
    }

    // 4. 3D Gift Box Animation (CSS fallback click handler removed - handled by three-scene.js)
    const openAnotherBtn = document.getElementById('open-another-btn');

    openAnotherBtn.addEventListener('click', () => {
        document.getElementById('memories-section').scrollIntoView({behavior: 'smooth'});
    });

    // 5. Memories 3D Tilt Effect
    function initTiltEffect() {
        const wrappers = document.querySelectorAll('.tilt-wrapper');
        
        wrappers.forEach(wrapper => {
            const card = wrapper.querySelector('.memory-card');
            const heart = card.querySelector('.heart-click-overlay');
            
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15;
                const rotateY = ((x - centerX) / centerX) * 15;
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            wrapper.addEventListener('mouseleave', () => {
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });

            // Heart pop on click
            card.addEventListener('click', () => {
                gsap.fromTo(heart, {scale: 0, opacity: 1}, {scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out'});
            });
        });
    }

    // 6. Interactive Hearts (Radial Explosion)
    const sendLoveBtn = document.getElementById('send-love-btn');
    const loveCountEl = document.getElementById('love-count');
    const loveMsg = document.getElementById('love-msg');
    let loveCount = 0;

    sendLoveBtn.addEventListener('click', (e) => {
        loveCount++;
        loveCountEl.textContent = loveCount;
        
        if(navigator.vibrate) navigator.vibrate(50);
        
        // Button scale bounce
        gsap.fromTo(sendLoveBtn, {scale: 0.8}, {scale: 1, duration: 0.2});

        if(loveCount === 1) loveMsg.classList.remove('hidden');
        if(loveCount === 10) {
            loveMsg.textContent = "Wow, that's a lot of love! 💖";
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }

        // Radial Heart Explosion
        const container = document.getElementById('radial-hearts-container');
        const numHearts = 20;
        
        for(let i=0; i<numHearts; i++) {
            const heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart', 'radial-heart');
            container.appendChild(heart);
            
            const angle = (Math.PI * 2 / numHearts) * i;
            const distance = Math.random() * 150 + 100;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;

            gsap.to(heart, {
                x: destX,
                y: destY,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: Math.random() * 1 + 1,
                ease: 'power2.out',
                onComplete: () => heart.remove()
            });
        }
    });

    // 7. Scroll Reveal & Final Celebration
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // General section reveals
        const sections = document.querySelectorAll('.hidden-section');
        sections.forEach(sec => {
            ScrollTrigger.create({
                trigger: sec,
                start: "top 80%",
                onEnter: () => sec.classList.add('visible')
            });
        });

        // Trigger typewriter when message section is reached
        ScrollTrigger.create({
            trigger: "#message-section",
            start: "top 60%",
            onEnter: () => startTypewriter()
        });

        // Stagger Promise cards
        ScrollTrigger.create({
            trigger: "#promises-section",
            start: "top 70%",
            onEnter: () => {
                const cards = document.querySelectorAll('.promise-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
            }
        });
        
        // Final section Celebration
        ScrollTrigger.create({
            trigger: "#final-section",
            start: "top 50%",
            onEnter: () => {
                triggerFinalCelebration();
            }
        });
    }

    function triggerFinalCelebration() {
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
        
        // Add some fireworks-style sparkles via GSAP
        for(let i=0; i<30; i++) {
            setTimeout(() => {
                const sp = document.createElement('div');
                sp.classList.add('particle', 'gold');
                sp.style.width = '10px'; sp.style.height = '10px';
                sp.style.left = `${Math.random() * window.innerWidth}px`;
                sp.style.top = `${Math.random() * window.innerHeight}px`;
                document.getElementById('particles-container').appendChild(sp);
                
                gsap.to(sp, {
                    scale: 3, opacity: 0, duration: 1, ease: 'power2.out',
                    onComplete: () => sp.remove()
                });
            }, Math.random() * 3000);
        }
    }

    // 8. Replay Logic
    const replayBtn = document.getElementById('replay-btn');
    replayBtn.addEventListener('click', () => {
        // Fade out entire screen
        gsap.to(mainContent, {
            opacity: 0, 
            duration: 1, 
            onComplete: () => {
                // Hard reset by reloading the page and saving names in session storage
                // For a true SPA reset, it's safer to reload to clear all GSAP timeline states and CSS transforms cleanly.
                const bName = brotherNameInput.value;
                const sName = sisterNameInput.value;
                sessionStorage.setItem('rakhi_bName', bName);
                sessionStorage.setItem('rakhi_sName', sName);
                window.location.reload();
            }
        });
    });

    // Auto-fill from session storage if replaying
    if(sessionStorage.getItem('rakhi_bName')) {
        brotherNameInput.value = sessionStorage.getItem('rakhi_bName');
        sisterNameInput.value = sessionStorage.getItem('rakhi_sName');
        sessionStorage.removeItem('rakhi_bName');
        sessionStorage.removeItem('rakhi_sName');
        // Auto start
        startBtn.click();
    }
});
