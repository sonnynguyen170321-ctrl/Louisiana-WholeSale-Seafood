/**
 * Louisiana Wholesale Seafood - Client Side Logic
 * Controls sticky header, mobile navigation, seasonality calendar, catalog filtering, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STICKY HEADER & NAVIGATION EFFECT
    // ==========================================
    const header = document.getElementById('mainHeader');
    
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Initialize scroll state on load
    handleScroll();
    window.addEventListener('scroll', handleScroll);


    // ==========================================
    // 2. MOBILE MENU NAVIGATION TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navBar = document.getElementById('navBar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navBar) {
        const navMenu = navBar.querySelector('.nav-menu');

        menuToggle.setAttribute('aria-expanded', 'false');

        const closeNav = () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', String(isActive));
        });

        // Close when clicking a nav link
        navLinks.forEach(link => link.addEventListener('click', closeNav));

        // Close when clicking outside the nav
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navBar.contains(e.target)) {
                closeNav();
            }
        });
    }


    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all open items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ==========================================
    // BACK TO TOP
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ==========================================
    // 3. INTERACTIVE SEASONALITY CALENDAR
    // ==========================================
    const seasonalityControls = document.getElementById('seasonalityControls');
    const seasonalityDisplay = document.getElementById('seasonalityDisplay');
    
    // Seafood Seasonality Data
    const seasonalityData = {
        crawfish: {
            title: 'Louisiana Crawfish',
            scientific: 'Procambarus clarkii',
            status: 'Peak Season',
            statusClass: 'peak',
            desc: 'Our signature red swamp crawfish are harvested wild from natural basins. Known for sweet, tender tail meat. Ideal for traditional southern backyard boils and restaurant promotions.',
            source: 'Atchafalaya Basin, LA',
            sizing: 'Medium, Large, Select Jumbo',
            months: {
                // 1: Out, 2: Limited, 3: Peak
                1: 2, 2: 2, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1
            }
        },
        shrimp: {
            title: 'Wild Gulf Shrimp',
            scientific: 'Penaeus aztecus',
            status: 'Fresh Catch',
            statusClass: 'peak',
            desc: 'Wild-caught Gulf brown and white shrimp. Known for firm texture and sweet, briny flavor. Excellent for frying, grilling, boiling, and premium restaurant entrees.',
            source: 'Barataria Bay & Grand Isle, LA',
            sizing: 'U/10, 16/20, 21/25, 31/35',
            months: {
                1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 3, 12: 2
            }
        },
        oysters: {
            title: 'Gulf Coast Oysters',
            scientific: 'Crassostrea virginica',
            status: 'Premium Grade',
            statusClass: 'limited',
            desc: 'Cultured and wild oysters harvested from designated reef beds. Hand-graded for raw shucking bars and cooking. Features smooth salinity and plump, mineral-rich meats.',
            source: 'Caminada Bay & Calcasieu Lake, LA',
            sizing: 'Shucking Sacks & Selected Boxed Oysters',
            months: {
                1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 2, 10: 3, 11: 3, 12: 3
            }
        },
        bluecrab: {
            title: 'Louisiana Blue Crab',
            scientific: 'Callinectes sapidus',
            status: 'Wild Harvest',
            statusClass: 'peak',
            desc: 'Highly sought-after blue crabs harvested using wire traps in coastal bays. Sorted strictly by weight and size into #1 Males, #2 Males, and sweet egg-bearing females.',
            source: 'Lake Pontchartrain & Barataria, LA',
            sizing: 'Bushels, Medium & Select Jumbo Crabs',
            months: {
                1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 2, 12: 2
            }
        }
    };

    if (seasonalityControls && seasonalityDisplay) {
        const seasonButtons = seasonalityControls.querySelectorAll('.season-btn');
        const displayTitle = document.getElementById('displayTitle');
        const displaySci = document.getElementById('displaySci');
        const displayStatus = document.getElementById('displayStatus');
        const displayDesc = document.getElementById('displayDesc');
        const displaySource = document.getElementById('displaySource');
        const displaySize = document.getElementById('displaySize');
        const monthBlocks = document.querySelectorAll('.month-block');

        // Function to update the seasonality calendar UI
        const updateSeasonality = (seafoodKey) => {
            const data = seasonalityData[seafoodKey];
            if (!data) return;

            // Fade display content in
            seasonalityDisplay.style.opacity = 0;
            
            setTimeout(() => {
                // Update text content
                displayTitle.textContent = data.title;
                displaySci.textContent = data.scientific;
                displayStatus.textContent = data.status;
                displayDesc.textContent = data.desc;
                displaySource.textContent = data.source;
                displaySize.textContent = data.sizing;

                // Update status classes
                displayStatus.className = 'season-status'; // Reset
                if (data.statusClass === 'peak') {
                    displayStatus.classList.add('peak');
                } else {
                    displayStatus.classList.add('limited');
                }

                // Update calendar month grids
                monthBlocks.forEach(block => {
                    const m = parseInt(block.getAttribute('data-month'));
                    const status = data.months[m];
                    
                    block.className = 'month-block'; // Reset classes
                    
                    if (status === 3) {
                        block.classList.add('peak');
                    } else if (status === 2) {
                        block.classList.add('active');
                    }
                });
                
                // Fade back in
                seasonalityDisplay.style.transition = 'opacity 0.4s ease';
                seasonalityDisplay.style.opacity = 1;
            }, 200);
        };

        // Initialize calendar with Crawfish
        updateSeasonality('crawfish');

        // Add button click listeners
        seasonButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class
                seasonButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update display
                const key = btn.getAttribute('data-seafood');
                updateSeasonality(key);
            });
        });
    }


    // ==========================================
    // 4. B2B PRODUCT CATALOG FILTERING
    // ==========================================
    const catalogFilters = document.getElementById('catalogFilters');
    const catalogGrid = document.getElementById('catalogGrid');

    if (catalogFilters && catalogGrid) {
        const filterBtns = catalogFilters.querySelectorAll('.filter-btn');
        const productCards = catalogGrid.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterVal = btn.getAttribute('data-filter');

                // Filter product cards
                productCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (filterVal === 'all' || categories.includes(filterVal)) {
                        // Fade in and display
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Fade out and hide
                        card.style.opacity = 0;
                        card.style.transform = 'scale(0.95)';
                        card.style.display = 'none';
                    }
                });
            });
        });
    }


    // ==========================================
    // 5. B2B QUOTE REQUEST FORM SUBMISSION
    // ==========================================
    const wholesaleForm = document.getElementById('wholesaleForm');
    const successMsg = document.getElementById('successMsg');
    const wholesaleSubmitBtn = document.getElementById('wholesaleSubmitBtn');

    if (wholesaleForm && successMsg) {
        wholesaleForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('businessEmail').value.trim();
            const phone = document.getElementById('businessPhone').value.trim();
            const contactName = document.getElementById('contactName').value.trim();
            const businessName = document.getElementById('businessName').value.trim();

            if (!email || !phone || !contactName || !businessName) {
                const firstEmpty = wholesaleForm.querySelector(':invalid');
                if (firstEmpty) firstEmpty.focus();
                return;
            }

            if (wholesaleSubmitBtn) {
                wholesaleSubmitBtn.disabled = true;
                wholesaleSubmitBtn.textContent = 'Sending...';
            }

            try {
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(wholesaleForm)).toString()
                });
            } catch (_) {
                // Netlify still processes the form server-side; swallow network errors
            }

            wholesaleForm.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // ==========================================
    // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Once animated, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(el => el.classList.add('reveal-active'));
    }


    // ==========================================
    // 7. INTERACTIVE BOIL CALCULATOR
    // ==========================================
    const guestsSlider = document.getElementById('calcGuests');
    const guestsVal = document.getElementById('guestsVal');
    const radioCards = document.querySelectorAll('.calc-radio-card');
    
    // Result displays
    const mainSeafoodAmt = document.getElementById('mainSeafoodAmt');
    const mainSeafoodLbl = document.getElementById('mainSeafoodLbl');
    const potatoesAmt = document.getElementById('potatoesAmt');
    const cornAmt = document.getElementById('cornAmt');
    const sausageAmtText = document.getElementById('sausageAmtText');
    const sausageAmtBlock = document.getElementById('sausageAmtBlock');

    if (guestsSlider && guestsVal) {
        const calculateBoil = () => {
            const numGuests = parseInt(guestsSlider.value);
            guestsVal.textContent = numGuests;
            
            // Get active seafood type
            let activeSeafood = 'crawfish';
            radioCards.forEach(card => {
                if (card.classList.contains('active')) {
                    activeSeafood = card.getAttribute('data-type');
                }
            });
            
            if (activeSeafood === 'crawfish') {
                // Crawfish boil guidelines:
                // 3 lbs of crawfish per person
                // 0.3 lbs potatoes per person
                // 1 corn cob per person
                // 0.2 lbs sausage per person
                const crawfish = numGuests * 3;
                const potatoes = (numGuests * 0.3).toFixed(1);
                const corn = numGuests;
                const sausage = (numGuests * 0.2).toFixed(1);
                
                mainSeafoodAmt.textContent = `${crawfish} lbs`;
                mainSeafoodLbl.textContent = 'Live Crawfish';
                potatoesAmt.textContent = `${potatoes} lbs`;
                cornAmt.textContent = `${corn} Cobs`;
                sausageAmtText.textContent = `${sausage} lbs`;
                if (sausageAmtBlock) sausageAmtBlock.style.display = 'block';
            } else {
                // Blue crab boil guidelines:
                // 2 lbs of crab per person
                // 0.2 lbs potatoes per person
                // 1 corn cob per person
                const crab = numGuests * 2;
                const potatoes = (numGuests * 0.2).toFixed(1);
                const corn = numGuests;
                
                mainSeafoodAmt.textContent = `${crab} lbs`;
                mainSeafoodLbl.textContent = 'Live Blue Crabs';
                potatoesAmt.textContent = `${potatoes} lbs`;
                cornAmt.textContent = `${corn} Cobs`;
                if (sausageAmtBlock) sausageAmtBlock.style.display = 'none';
            }
        };

        // Guests slider trigger
        guestsSlider.addEventListener('input', calculateBoil);
        
        // Radio card trigger
        radioCards.forEach(card => {
            card.addEventListener('click', () => {
                radioCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                calculateBoil();
            });
        });
        
        // Initial run
        calculateBoil();
    }


    // ==========================================
    // 8. EMAIL NEWSLETTER SIGNUP
    // ==========================================
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccessMsg = document.getElementById('newsletterSuccessMsg');
    const newsletterSubmitBtn = document.getElementById('newsletterSubmitBtn');

    if (newsletterForm && newsletterSuccessMsg) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailVal = newsletterForm.querySelector('input[name="email"]').value.trim();
            if (!emailVal) return;

            if (newsletterSubmitBtn) {
                newsletterSubmitBtn.disabled = true;
                newsletterSubmitBtn.textContent = 'Subscribing...';
            }

            try {
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(newsletterForm)).toString()
                });
            } catch (_) {
                // Netlify processes server-side; swallow network errors
            }

            newsletterForm.style.display = 'none';
            newsletterSuccessMsg.style.display = 'flex';
        });
    }


    // ==========================================
    // 9. SMS FRESH CATCH ALERTS SIGNUP
    // ==========================================
    const smsAlertForm = document.getElementById('smsAlertForm');
    const smsSuccessMsg = document.getElementById('smsSuccessMsg');
    const smsSubmitBtn = document.getElementById('smsSubmitBtn');

    if (smsAlertForm && smsSuccessMsg) {
        smsAlertForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phoneVal = smsAlertForm.querySelector('input[name="phone"]').value.trim();
            const nameVal = smsAlertForm.querySelector('input[name="first-name"]').value.trim();
            if (!phoneVal || !nameVal) return;

            if (smsSubmitBtn) {
                smsSubmitBtn.disabled = true;
                smsSubmitBtn.textContent = '...';
            }

            try {
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(smsAlertForm)).toString()
                });
            } catch (_) {
                // Netlify processes server-side; swallow network errors
            }

            smsAlertForm.style.display = 'none';
            smsSuccessMsg.style.display = 'block';
        });
    }


    // ==========================================
    // MOBILE BOTTOM NAV — ACTIVE STATE
    // ==========================================
    const mbnItems = document.querySelectorAll('.mob-nav-item[data-mbn]');
    if (mbnItems.length) {
        const path = window.location.pathname.toLowerCase();
        let page = 'home';
        if (path.includes('wholesale')) page = 'wholesale';
        else if (path.includes('restaurant')) page = 'restaurant';

        mbnItems.forEach(item => {
            if (item.dataset.mbn === page) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            }
        });
    }
});
