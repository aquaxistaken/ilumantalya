document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    
    // Sayfa ilk yüklendiğinde (products-spa.html değilse) 'loaded' sınıfını ekle
  
  
    // ----------------------------------------------------------------------
    // GLOBAL FONKSİYON: Dinamik içerik yüklendiğinde JS bileşenlerini başlat
    // ----------------------------------------------------------------------
    window.triggerPageLoadAnimation = function() {
        console.log('triggerPageLoadAnimation çağrıldı: JS bileşenleri başlatılıyor...');
        body.classList.add('loaded');
  
        // Tüm JS bileşenlerini yeniden başlat
        initializeHamburgerMenu();
        initializeSlider();
        initializeParallax();
        initializeFaq();
        initializeLightbox();
    };
  
    // ----------------------------------------------------------------------
    // Hamburger Menü İşlevselliği
    // ----------------------------------------------------------------------
    function initializeHamburgerMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.main-nav ul li a');
  
        if (navToggle && mainNav) {
            // Tekrar dinleyici eklenmesini önle
            if (!navToggle.dataset.hasClickListener) {
                navToggle.addEventListener('click', function() {
                    mainNav.classList.toggle('open');
                    navToggle.classList.toggle('open');
                    body.classList.toggle('nav-open');
                    console.log('Hamburger menü toggle edildi.');
                });
                navToggle.dataset.hasClickListener = 'true';
            }
  
            navLinks.forEach(link => {
                if (!link.dataset.hasClickListener) {
                    link.addEventListener('click', function() {
                        if (mainNav.classList.contains('open')) {
                            mainNav.classList.remove('open');
                            navToggle.classList.remove('open');
                            body.classList.remove('nav-open');
                            console.log('Menü linkine tıklandı, menü kapatıldı.');
                        }
                    });
                    link.dataset.hasClickListener = 'true';
                }
            });
        } else {
            console.log('Hamburger menü elementleri bulunamadı.');
        }
    }
  
    // ----------------------------------------------------------------------
    // Parallax Scrolling Efekti
    // ----------------------------------------------------------------------
    function initializeParallax() {
        const parallaxElems = document.querySelectorAll('.parallax-bg');
  
        function handleParallax() {
            parallaxElems.forEach(elem => {
                const speed = parseFloat(elem.dataset.parallaxSpeed) || 0.5;
                const rect = elem.getBoundingClientRect();
                const scrollPos = window.scrollY || document.documentElement.scrollTop;
                const offset = rect.top + scrollPos;
  
                if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                    const yPos = (offset - scrollPos) * speed;
                    elem.style.backgroundPositionY = `${yPos}px`;
                }
            });
        }
  
        if (parallaxElems.length > 0) {
            // Önceki dinleyicileri kaldır
            window.removeEventListener('scroll', window.handleParallaxScroll);
            window.removeEventListener('resize', window.handleParallaxResize);
            
            // Yeni dinleyicileri ekle
            window.handleParallaxScroll = handleParallax;
            window.handleParallaxResize = handleParallax;
            window.addEventListener('scroll', window.handleParallaxScroll);
            window.addEventListener('resize', window.handleParallaxResize);
            
            handleParallax(); // İlk çalıştırma
            console.log('Parallax başlatıldı.');
        } else {
            console.log('Parallax elementleri bulunamadı.');
        }
    }
  
    // ----------------------------------------------------------------------
    // SSS (FAQ) Accordion İşlevselliği
    // ----------------------------------------------------------------------
    function initializeFaq() {
        const faqQuestions = document.querySelectorAll('.faq-question');
  
        faqQuestions.forEach(question => {
            if (!question.dataset.hasClickListener) {
                question.addEventListener('click', () => {
                    const faqItem = question.closest('.faq-item');
  
                    // Diğer açık olanları kapat
                    faqQuestions.forEach(q => {
                        const itemToDeactivate = q.closest('.faq-item');
                        if (itemToDeactivate && itemToDeactivate !== faqItem) {
                            itemToDeactivate.classList.remove('active');
                        }
                    });
  
                    // Mevcut öğeyi toggle et
                    if (faqItem) {
                        faqItem.classList.toggle('active');
                    }
                    console.log('SSS accordion toggle edildi.');
                });
                question.dataset.hasClickListener = 'true';
            }
        });
        
        if (faqQuestions.length === 0) {
            console.log('SSS elementleri bulunamadı.');
        }
    }
  
    // ----------------------------------------------------------------------
    // Lightbox İşlevselliği
    // ----------------------------------------------------------------------
    function initializeLightbox() {
        const imgLightbox = document.getElementById('imgLightbox');
        const imgLightboxImg = document.getElementById('imgLightboxImg');
        const imgLightboxClose = document.getElementById('imgLightboxClose');
  
        if (imgLightbox && imgLightboxImg && imgLightboxClose) {
            // Tekrar dinleyici eklenmesini önle
            if (!document.body.dataset.lightboxListenerAdded) {
                // Görsellere tıklama dinleyicisi
                document.addEventListener('click', function(e) {
                    if (e.target.matches('.gallery-item img, .detail-img img, .product-card img, .blog-post-content img, .product-img')) {
                        imgLightboxImg.src = e.target.src;
                        imgLightbox.classList.add('active');
                        body.style.overflow = 'hidden';
                        console.log('Lightbox açıldı.');
                    }
                });
  
                // Lightbox kapatma dinleyicisi
                imgLightbox.addEventListener('click', function(e) {
                    if (e.target === imgLightbox || e.target === imgLightboxClose) {
                        this.classList.remove('active');
                        imgLightboxImg.src = '';
                        body.style.overflow = '';
                        console.log('Lightbox kapatıldı.');
                    }
                });
  
                // Görsel tıklamasında kapatmayı engelle
                imgLightboxImg.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
  
                // ESC tuşu ile kapatma
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && imgLightbox.classList.contains('active')) {
                        imgLightbox.classList.remove('active');
                        imgLightboxImg.src = '';
                        body.style.overflow = '';
                        console.log('Lightbox ESC ile kapatıldı.');
                    }
                });
  
                document.body.dataset.lightboxListenerAdded = 'true';
            }
        } else {
            console.log('Lightbox elementleri bulunamadı.');
        }
    }
  
    // ----------------------------------------------------------------------
    // Slider İşlevselliği
    // ----------------------------------------------------------------------
    function initializeSlider() {
        const sliderContainer = document.querySelector('.slider-container');
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const prevButton = document.querySelector('.slider-control.prev');
        const nextButton = document.querySelector('.slider-control.next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        // Slider elementleri kontrolü
        if (!sliderContainer || !sliderWrapper || slides.length === 0) {
            console.log('Slider elementleri bulunamadı. Slider başlatılamadı.');
            return;
        }
        
        if (sliderContainer.dataset.sliderInitialized === 'true') {
            console.log('Slider zaten başlatılmış.');
            return;
        }
  
        let currentIndex = 0;
        let intervalId;
        const autoSlideInterval = 5000;
  
        // Slayt genişliğini al
        function getSlideWidth() {
            if (slides.length > 0 && slides[0].offsetWidth > 0) {
                return slides[0].offsetWidth;
            }
            return sliderContainer.offsetWidth;
        }
  
        // Belirli slayta git
        function goToSlide(index, animated = true) {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            sliderWrapper.style.transition = animated ? 'transform 0.6s ease-in-out' : 'none';
            sliderWrapper.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
            
            updateDots();
            updateActiveSlideClass();
        }
  
        // Sonraki slayt
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
  
        // Önceki slayt
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
  
        // Nokta göstergeleri oluştur
        function createDots() {
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('slider-dot');
                    dot.setAttribute('aria-label', `Slayt ${index + 1}`);
                    dot.dataset.index = index;
                    dot.addEventListener('click', function() {
                        goToSlide(parseInt(this.dataset.index));
                        stopAutoSlide();
                        startAutoSlide();
                    });
                    dotsContainer.appendChild(dot);
                });
                updateDots();
            }
        }
  
        // Nokta durumlarını güncelle
        function updateDots() {
            if (dotsContainer) {
                const dots = document.querySelectorAll('.slider-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }
  
        // Aktif slayt sınıfını güncelle
        function updateActiveSlideClass() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
        }
  
        // Otomatik slayt başlat
        function startAutoSlide() {
            stopAutoSlide();
            intervalId = setInterval(nextSlide, autoSlideInterval);
        }
  
        // Otomatik slayt durdur
        function stopAutoSlide() {
            clearInterval(intervalId);
        }
  
        // Yeniden boyutlandırma dinleyicisi
        if (!window.handleSliderResize) {
            window.handleSliderResize = () => goToSlide(currentIndex, false);
            window.addEventListener('resize', window.handleSliderResize);
        }
  
        // Slider'ı başlat
        createDots();
        goToSlide(0, false);
        startAutoSlide();
  
        // Kontrol butonları
        if (prevButton && !prevButton.dataset.listenerAdded) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
            prevButton.dataset.listenerAdded = 'true';
        }
  
        if (nextButton && !nextButton.dataset.listenerAdded) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
            nextButton.dataset.listenerAdded = 'true';
        }
  
        // Mouse hover olayları
        if (!sliderContainer.dataset.mouseListenerAdded) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
            sliderContainer.dataset.mouseListenerAdded = 'true';
        }
  
        sliderContainer.dataset.sliderInitialized = 'true';
        console.log('Slider başlatıldı.');
    }
  
    // ----------------------------------------------------------------------
    // İLK YÜKLENDİĞİNDE ÇALIŞACAK FONKSİYONLAR
    // ----------------------------------------------------------------------
    initializeHamburgerMenu();
    initializeParallax();
    initializeFaq();
    initializeLightbox();
    initializeSlider();
  
    console.log('Main.js başlatıldı ve tüm bileşenler aktif.');
  });