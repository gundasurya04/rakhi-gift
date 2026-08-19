document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Background Particle System
    // ----------------------------------------------------
    const bgCanvas = document.getElementById('webgl-canvas');
    if (!bgCanvas) return;

    const bgScene = new THREE.Scene();
    
    // Add subtle fog to blend particles into the distance
    bgScene.fog = new THREE.FogExp2('#fff4e6', 0.001);

    const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.z = 100;

    const bgRenderer = new THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        antialias: true
    });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Particles
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#FFD700'); // Gold
    const color2 = new THREE.Color('#ff4d4d'); // Red
    const color3 = new THREE.Color('#ffffff'); // White

    for (let i = 0; i < particleCount * 3; i += 3) {
        // x, y, z positions
        positions[i] = (Math.random() - 0.5) * 400; // x
        positions[i + 1] = (Math.random() - 0.5) * 400; // y
        positions[i + 2] = (Math.random() - 0.5) * 400; // z

        // Mix colors randomly
        const mix = Math.random();
        let c = color1;
        if (mix > 0.6) c = color2;
        if (mix > 0.9) c = color3;

        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material for better looking particles
    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    bgScene.add(particles);

    // Mouse Interaction for background
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    });

    // Handle Window Resize for bg
    window.addEventListener('resize', () => {
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ----------------------------------------------------
    // 2. Interactive 3D Gift Box
    // ----------------------------------------------------
    const giftContainer = document.getElementById('gift-canvas-container');
    let giftScene, giftCamera, giftRenderer, giftGroup, giftLid, giftBody;
    let isGiftOpened = false;

    if (giftContainer) {
        giftScene = new THREE.Scene();
        
        giftCamera = new THREE.PerspectiveCamera(45, giftContainer.clientWidth / giftContainer.clientHeight, 0.1, 100);
        giftCamera.position.z = 15;
        giftCamera.position.y = 5;
        giftCamera.lookAt(0, 0, 0);

        giftRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        giftRenderer.setSize(giftContainer.clientWidth, giftContainer.clientHeight);
        giftRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        giftContainer.appendChild(giftRenderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        giftScene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7);
        giftScene.add(dirLight);
        
        const backLight = new THREE.DirectionalLight(0xffe6e6, 0.5);
        backLight.position.set(-5, 5, -5);
        giftScene.add(backLight);

        // Build the Gift Box
        giftGroup = new THREE.Group();

        // Materials
        const boxMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcc0000, 
            roughness: 0.4,
            metalness: 0.1
        });
        const ribbonMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.2,
            metalness: 0.8
        });

        // Box Body
        giftBody = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(4, 4, 4);
        const bodyMesh = new THREE.Mesh(bodyGeo, boxMaterial);
        bodyMesh.position.y = 2; // Sit on ground (y=0)
        giftBody.add(bodyMesh);
        
        // Ribbon Vertical
        const ribbonVGeo = new THREE.BoxGeometry(4.1, 4.1, 0.5);
        const ribbonVMesh = new THREE.Mesh(ribbonVGeo, ribbonMaterial);
        ribbonVMesh.position.y = 2;
        giftBody.add(ribbonVMesh);

        // Ribbon Horizontal
        const ribbonHGeo = new THREE.BoxGeometry(0.5, 4.1, 4.1);
        const ribbonHMesh = new THREE.Mesh(ribbonHGeo, ribbonMaterial);
        ribbonHMesh.position.y = 2;
        giftBody.add(ribbonHMesh);

        giftGroup.add(giftBody);

        // Box Lid
        giftLid = new THREE.Group();
        const lidGeo = new THREE.BoxGeometry(4.2, 0.8, 4.2);
        const lidMesh = new THREE.Mesh(lidGeo, boxMaterial);
        lidMesh.position.y = 4.4;
        giftLid.add(lidMesh);

        // Lid Ribbon Cross
        const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.9, 0.5), ribbonMaterial);
        lidRibbonV.position.y = 4.4;
        giftLid.add(lidRibbonV);
        const lidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 4.3), ribbonMaterial);
        lidRibbonH.position.y = 4.4;
        giftLid.add(lidRibbonH);

        // Simple Bow (Torus)
        const bowGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
        const bowMesh1 = new THREE.Mesh(bowGeo, ribbonMaterial);
        bowMesh1.position.set(0.6, 5.0, 0);
        bowMesh1.rotation.y = Math.PI / 4;
        giftLid.add(bowMesh1);
        
        const bowMesh2 = new THREE.Mesh(bowGeo, ribbonMaterial);
        bowMesh2.position.set(-0.6, 5.0, 0);
        bowMesh2.rotation.y = -Math.PI / 4;
        giftLid.add(bowMesh2);

        giftGroup.add(giftLid);

        // Center entire group
        giftGroup.position.y = -2;
        giftScene.add(giftGroup);

        // Make canvas interactive
        giftRenderer.domElement.style.cursor = 'pointer';
        
        giftRenderer.domElement.addEventListener('click', () => {
            if (isGiftOpened || typeof gsap === 'undefined') return;
            isGiftOpened = true;

            const tl = gsap.timeline();
            
            // Shake
            tl.to(giftGroup.rotation, {z: 0.1, yoyo: true, repeat: 5, duration: 0.05})
            // Open Lid
            .to(giftLid.position, {y: 4, z: -3, duration: 1, ease: 'power2.inOut'})
            .to(giftLid.rotation, {x: -Math.PI / 4, duration: 1, ease: 'power2.inOut'}, "-=1")
            
            // Show the image inside using regular DOM (fade in the hidden gift)
            .call(() => {
                const innerGift = document.querySelector('.inner-gift');
                if (innerGift) {
                    innerGift.classList.remove('hidden');
                    // Ensure the inner gift is positioned properly absolute relative to the container if we want it to float up
                    innerGift.style.position = 'absolute';
                    innerGift.style.top = '50%';
                    innerGift.style.left = '50%';
                    innerGift.style.transform = 'translate(-50%, -50%)';
                    innerGift.style.zIndex = '10';
                    
                    gsap.fromTo(innerGift, {opacity: 0, scale: 0.5}, {opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1)'});
                }
                
                // Show 'Open Another' button
                const openAnotherBtn = document.getElementById('open-another-btn');
                if (openAnotherBtn) {
                    openAnotherBtn.classList.remove('hidden');
                }
                
                // Fire confetti
                if (typeof confetti !== 'undefined') {
                    confetti({ particleCount: 150, spread: 100, origin: { y: 0.7 }, zIndex: 100 });
                }
            }, null, "-=0.5");
        });
    }

    // ----------------------------------------------------
    // Animation Loop
    // ----------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // 1. Update Background Particles
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        bgCamera.rotation.x += (targetY - bgCamera.rotation.x) * 0.02;
        bgCamera.rotation.y += (targetX - bgCamera.rotation.y) * 0.02;

        particles.rotation.y = time * 0.05;
        particles.rotation.x = time * 0.02;

        bgRenderer.render(bgScene, bgCamera);

        // 2. Update Gift Box
        if (giftScene && giftCamera && giftRenderer) {
            // Idle rotation if not opened
            if (!isGiftOpened) {
                giftGroup.rotation.y = Math.sin(time * 0.5) * 0.3; // subtle sway
            }
            giftRenderer.render(giftScene, giftCamera);
        }
    }

    animate();
});
