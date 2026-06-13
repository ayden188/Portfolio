document.addEventListener("DOMContentLoaded", () => {
    
    // Enregistrement du plugin ScrollTrigger pour GSAP
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       1. GESTION DU MENU RESPONSIVE (RIDEAU EXCLUSIF GSAP - REFAIT & FIXÉ)
       ========================================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const navOverlay = document.getElementById("navOverlay");
    const overlayLinks = document.querySelectorAll(".overlay-link");
    let menuIsOpen = false;

    // État initial de l'overlay et de ses liens cachés
    gsap.set(navOverlay, { opacity: 0, visibility: "hidden" });
    gsap.set(overlayLinks, { y: 20, opacity: 0 });

    function toggleMenu() {
        menuIsOpen = !menuIsOpen;
        
        if (menuIsOpen) {
            menuToggle.classList.add("active");
            document.body.style.overflow = "hidden"; // Bloque le scroll arrière-plan

            // Ouverture fluide de l'overlay et apparition en cascade (stagger) des liens
            gsap.to(navOverlay, { 
                opacity: 1, 
                visibility: "visible", 
                duration: 0.4, 
                ease: "power2.out" 
            });
            gsap.to(overlayLinks, { 
                y: 0, 
                opacity: 1, 
                stagger: 0.08, 
                duration: 0.4, 
                ease: "power3.out", 
                delay: 0.1 
            });
        } else {
            menuToggle.classList.remove("active");
            document.body.style.overflow = ""; // Libère le scroll

            // Fermeture propre en rangeant les liens vers le bas d'abord
            gsap.to(overlayLinks, { 
                y: 20, 
                opacity: 0, 
                stagger: 0.04, 
                duration: 0.25, 
                ease: "power2.in" 
            });
            gsap.to(navOverlay, { 
                opacity: 0, 
                visibility: "hidden", 
                duration: 0.35, 
                ease: "power2.inOut", 
                delay: 0.15 
            });
        }
    }

    // Événement clic sur le bouton Burger
    if (menuToggle && navOverlay) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    // FIX MOBILE : Fermeture instantanée lors d'un clic sur n'importe quel lien du menu rideau
    overlayLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (menuIsOpen) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       2. ANIMATIONS AU CHARGEMENT INITIAL (HERO AREA)
       ========================================================================== */
    const loadTimeline = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });

    loadTimeline.from(".navbar", { y: -30, opacity: 0, delay: 0.2 })
                .from(".hero-title", { y: 50, opacity: 0 }, "-=0.7")
                .from(".hero-subtitle", { y: 30, opacity: 0 }, "-=0.75")
                .from(".hero-text", { y: 20, opacity: 0 }, "-=0.8")
                .from(".hero-bullets li", { x: -30, opacity: 0, stagger: 0.1 }, "-=0.85")
                .from(".hero-cta", { y: 20, opacity: 0 }, "-=0.85")
                .from(".hero-image-area", { scale: 0.95, opacity: 0 }, "-=0.95")
                .from(".hello-sticker", { rotation: -45, scale: 0, opacity: 0, ease: "back.out(1.7)" }, "-=0.4");


    /* ==========================================================================
       3. REVEALS PROGRESSIFS AU SCROLL (POUR TOUTES LES SECTIONS)
       ========================================================================== */
    const itemsToReveal = document.querySelectorAll(".reveal-item");

    itemsToReveal.forEach((item) => {
        // Préparation de l'état initial en CSS/JS pour éviter les sauts d'écran (FOUC)
        gsap.set(item, { opacity: 0, y: 30 });

        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });


    /* ==========================================================================
       4. ANIMATION DES COMPTEURS DE STATISTIQUES
       ========================================================================== */
    const metricCounters = document.querySelectorAll(".counter");

    metricCounters.forEach((counter) => {
        const finalTarget = parseInt(counter.getAttribute("data-target"), 10) || 0;
        
        gsap.to(counter, {
            scrollTrigger: {
                trigger: counter,
                start: "top 92%",
            },
            innerText: finalTarget,
            duration: 1.8,
            snap: { innerText: 1 }, // Incrémentation par chiffres entiers (1, 2, 3...)
            ease: "power1.out"
        });
    });


    /* ==========================================================================
       5. ACCORDÉONS INTERACTIFS (SECTION FAQ)
       ========================================================================== */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isOpen = item.classList.contains("active");
                
                // Fermer tous les autres accordéons ouverts pour un effet pro
                faqItems.forEach(i => {
                    i.classList.remove("active");
                    const icon = i.querySelector(".faq-question i");
                    if (icon) icon.className = "fa-solid fa-plus";
                });

                // Si l'élément cliqué n'était pas ouvert, on l'ouvre
                if (!isOpen) {
                    item.classList.add("active");
                    const icon = questionBtn.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-minus";
                }
            });
        }
    });


    /* ==========================================================================
       6. SELECTION INTERACTIVE DES TAGS ET ROUTAGE WHATSAPP
       ========================================================================== */
    const mindTags = document.querySelectorAll(".mind-tags .mind-tag");
    const projectForm = document.getElementById("waProjectForm");
    let currentSelectedTag = "Site Internet"; // Valeur par défaut synchronisée avec ton premier tag HTML

    mindTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            mindTags.forEach((t) => t.classList.remove("active-tag"));
            tag.classList.add("active-tag");
            // Récupère l'attribut data-value ou le texte brut du tag si vide
            currentSelectedTag = tag.getAttribute("data-value") || tag.innerText;
        });
    });

    if (projectForm) {
        projectForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const clientName = document.getElementById("waName").value.trim();
            const clientEmail = document.getElementById("waEmail").value.trim();
            const clientCompany = document.getElementById("waCompany").value.trim();
            
            // Ton numéro officiel de réception sans espace, ni caractère spécial
            const myWhatsappNum = "22898347018"; 

            // Construction propre du message texte WhatsApp
            let finalMsg = `Hello Eli !\n\n`;
            finalMsg += `*Nom :* ${clientName}\n`;
            finalMsg += `*Email :* ${clientEmail}\n`;
            if (clientCompany) { 
                finalMsg += `*Entreprise :* ${clientCompany}\n`; 
            }
            finalMsg += `*Besoin / Projet :* ${currentSelectedTag}\n\n`;
            finalMsg += `Discutons de cette idée !`;

            // Encodage propre au format URL standard
            const encodedMessage = encodeURIComponent(finalMsg);
            const finalRedirectUrl = `https://wa.me/${myWhatsappNum}?text=${encodedMessage}`;
            
            // Redirection sécurisée dans un nouvel onglet
            window.open(finalRedirectUrl, '_blank');
        });
    }
});