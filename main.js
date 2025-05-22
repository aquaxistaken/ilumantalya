document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;

  // Sayfa ilk yüklendiğinde (products-spa.html değilse) 'loaded' sınıfını ekle
  if (!body.classList.contains('products-spa-page')) {
      body.classList.add('loaded');
  }

  // ----------------------------------------------------------------------
  // DİNAMİK İÇERİK YÜKLENDİĞİNDE products-spa.html'den VEYA DİĞER SPA SAYFALARINDAN ÇAĞRILACAK GLOBAL FONKSİYON
  // Bu fonksiyon, yeni DOM elementleri için TÜM JS bileşenlerini yeniden başlatır.
  // ----------------------------------------------------------------------
  window.triggerPageLoadAnimation = function() {
      console.log('triggerPageLoadAnimation çağrıldı: JS bileşenleri başlatılıyor...');
      body.classList.add('loaded'); // Gerekirse sayfa yükleme animasyonunu tetikle

      // Dinamik olarak yüklenen içeriğin içindeki tüm JS bileşenlerini yeniden başlat
      // BU FONKSİYONLAR, olay dinleyicilerini tekrar tekrar eklememek için kendi içlerinde kontrol mekanizması barındırır.
      initializeHamburgerMenu();
      initializeSlider(); // Eğer products-spa.html'de bir slider varsa
      initializeParallax(); // Eğer products-spa.html'de parallax varsa
      initializeFaq(); // Eğer products-spa.html'de SSS varsa
      initializeLightbox(); // Eğer products-spa.html'de lightbox tetikleyen görseller varsa
      // Buraya dinamik olarak yüklenen diğer JS bileşenlerinin başlatma fonksiyonlarını da ekle
  };


  // ----------------------------------------------------------------------
  // **MODÜLER FONKSİYON:** Hamburger Menü İşlevselliğini Başlatma
  // Bu fonksiyon her çağrıldığında, dinleyicinin zaten eklenip eklenmediğini kontrol eder.
  // ----------------------------------------------------------------------
  function initializeHamburgerMenu() {
      const navToggle = document.querySelector('.nav-toggle');
      const mainNav = document.querySelector('.main-nav');
      const navLinks = document.querySelectorAll('.main-nav ul li a');

      if (navToggle && mainNav) {
          // Önceki dinleyicilerin tekrar tekrar eklenmesini önlemek için kontrol
          // `dataset.hasClickListener` özelliği ile bu butona bir dinleyici eklenip eklenmediğini kontrol ediyoruz.
          if (!navToggle.dataset.hasClickListener) {
              navToggle.addEventListener('click', function() {
                  mainNav.classList.toggle('open');
                  navToggle.classList.toggle('open');
                  body.classList.toggle('nav-open');
                  console.log('Hamburger menü toggle edildi.');
              });
              navToggle.dataset.hasClickListener = 'true'; // İşaretle: Dinleyici eklendi
          }

          navLinks.forEach(link => {
              if (!link.dataset.hasClickListener) { // Linklere de tekrar dinleyici eklememek için
                  link.addEventListener('click', function() {
                      if (mainNav.classList.contains('open')) {
                          mainNav.classList.remove('open');
                          navToggle.classList.remove('open');
                          body.classList.remove('nav-open');
                          console.log('Menü linkine tıklandı, menü kapatıldı.');
                      }
                  });
                  link.dataset.hasClickListener = 'true'; // İşaretle: Dinleyici eklendi
              }
          });
      } else {
          console.log('Hamburger menü elementleri bulunamadı (navToggle veya mainNav).');
      }
  }


  // ----------------------------------------------------------------------
  // **MODÜLER FONKSİYON:** Parallax Scrolling Efekti Başlatma
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
          // Eğer daha önce dinleyici eklediysek kaldıralım ki tekrar etmesin
          window.removeEventListener('scroll', handleParallax);
          window.removeEventListener('resize', handleParallax);
          window.addEventListener('scroll', handleParallax);
          window.addEventListener('resize', handleParallax);
          handleParallax(); // Sayfa yüklendiğinde veya içerik dinamik yüklendiğinde bir kez çalıştır
          console.log('Parallax başlatıldı.');
      } else {
          console.log('Parallax elementleri bulunamadı.');
      }
  }

  // ----------------------------------------------------------------------
  // **MODÜLER FONKSİYON:** SSS Bölümü (Accordion) Başlatma
  // ----------------------------------------------------------------------
  function initializeFaq() {
      const faqQuestions = document.querySelectorAll('.faq-question');

      faqQuestions.forEach(question => {
          if (!question.dataset.hasClickListener) { // Tekrar dinleyici eklememek için
              question.addEventListener('click', () => {
                  const faqItem = question.closest('.faq-item');

                  faqQuestions.forEach(q => {
                      const itemToDeactivate = q.closest('.faq-item');
                      if (itemToDeactivate && itemToDeactivate !== faqItem) {
                          itemToDeactivate.classList.remove('active');
                      }
                  });

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
  // **MODÜLER FONKSİYON:** Lightbox İşlevselliği Başlatma
  // ----------------------------------------------------------------------
  function initializeLightbox() {
      const imgLightbox = document.getElementById('imgLightbox');
      const imgLightboxImg = document.getElementById('imgLightboxImg');
      const imgLightboxClose = document.getElementById('imgLightboxClose');

      if (imgLightbox && imgLightboxImg && imgLightboxClose) {
          // Event delegation zaten `document` üzerinde olduğu için genellikle tekrarlama sorunu olmaz.
          // Ama yine de bu fonksiyon birden fazla çağrılırsa diye basit bir kontrol ekleyelim.
          if (!document.body.dataset.lightboxListenerAdded) {
              document.addEventListener('click', function(e) {
                  // Bu selector'ı dinamik olarak yüklediğin görsellerin class'larına göre ayarla
                  if (e.target.matches('.gallery-item img, .detail-img img, .product-card img, .blog-post-content img')) {
                      imgLightboxImg.src = e.target.src;
                      imgLightbox.classList.add('active');
                      body.style.overflow = 'hidden';
                      console.log('Lightbox açıldı.');
                  }
              });

              imgLightbox.addEventListener('click', function(e) {
                  if (e.target === imgLightbox || e.target === imgLightboxClose) {
                      this.classList.remove('active');
                      imgLightboxImg.src = '';
                      body.style.overflow = '';
                      console.log('Lightbox kapatıldı.');
                  }
              });

              imgLightboxImg.addEventListener('click', function(e) {
                  e.stopPropagation(); // Görsele tıklayınca lightbox'ın kapanmasını engelle
              });
              document.body.dataset.lightboxListenerAdded = 'true';
          }
      } else {
          console.log('Lightbox elementleri bulunamadı (imgLightbox, imgLightboxImg veya imgLightboxClose).');
      }
  }

  // ----------------------------------------------------------------------
  // **MODÜLER FONKSİYON:** Ana Slider İşlevselliği Başlatma
  // ----------------------------------------------------------------------
  function initializeSlider() {
      const sliderContainer = document.querySelector('.slider-container');
      const sliderWrapper = document.querySelector('.slider-wrapper');
      const slides = document.querySelectorAll('.slide');
      const prevButton = document.querySelector('.slider-control.prev');
      const nextButton = document.querySelector('.slider-control.next');
      const dotsContainer = document.querySelector('.slider-dots');
      
      // Slider elementleri bulunamazsa veya zaten başlatıldıysa fonksiyonu durdur
      if (!sliderContainer || !sliderWrapper || slides.length === 0) {
          console.log('Slider elementleri bulunamadı. Slider başlatılamadı.');
          return;
      }
      if (sliderContainer.dataset.sliderInitialized === 'true') {
          console.log('Slider zaten başlatılmış. Tekrar başlatılmıyor.');
          return;
      }

      let currentIndex = 0;
      let intervalId;
      const autoSlideInterval = 5000; // Otomatik geçiş süresi (5 saniye)

      // Slayt genişliğini dinamik olarak alır
      function getSlideWidth() {
          // Eğer slaytlar henüz tam olarak yüklenmediyse, container'ın genişliğini kullan
          if (slides.length > 0 && slides[0].offsetWidth > 0) {
              return slides[0].offsetWidth;
          }
          return sliderContainer.offsetWidth; // Varsayılan olarak container genişliği
      }

      // Belirli bir slayta gitme fonksiyonu
      function goToSlide(index, animated = true) {
          if (index < 0) {
              currentIndex = slides.length - 1; // Başa dön
          } else if (index >= slides.length) {
              currentIndex = 0; // Sona dön
          } else {
              currentIndex = index;
          }
          
          // Animasyonu kontrol et
          sliderWrapper.style.transition = animated ? 'transform 0.6s ease-in-out' : 'none';
          sliderWrapper.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
          
          updateDots(); // Nokta göstergelerini güncelle
          updateActiveSlideClass(); // Aktif slayt sınıfını güncelle
      }

      // Bir sonraki slayta git
      function nextSlide() {
          goToSlide(currentIndex + 1);
      }

      // Bir önceki slayta git
      function prevSlide() {
          goToSlide(currentIndex - 1);
      }

      // Nokta göstergelerini oluştur
      function createDots() {
          if (dotsContainer) { // dotsContainer'ın varlığını kontrol et
              dotsContainer.innerHTML = ''; // Önceki noktaları temizle
              slides.forEach((_, index) => {
                  const dot = document.createElement('button');
                  dot.classList.add('slider-dot');
                  dot.setAttribute('aria-label', `Slayt ${index + 1}`);
                  dot.dataset.index = index; // Hangi slayta karşılık geldiğini sakla
                  dot.addEventListener('click', function() {
                      goToSlide(parseInt(this.dataset.index));
                      stopAutoSlide(); // Manuel geçişte otomatik kaymayı durdur
                      startAutoSlide(); // Tekrar başlat
                  });
                  dotsContainer.appendChild(dot);
              });
              updateDots(); // Nokta durumlarını güncelle
          }
      }

      // Nokta göstergelerinin aktif/pasif durumunu güncelle
      function updateDots() {
          if (dotsContainer) {
              const dots = document.querySelectorAll('.slider-dot');
              dots.forEach((dot, index) => {
                  dot.classList.remove('active');
                  if (index === currentIndex) {
                      dot.classList.add('active');
                  }
              });
          }
      }

      // Slaytlardaki 'active' sınıfını güncelle (resim filtreleri için)
      function updateActiveSlideClass() {
          slides.forEach((slide, index) => {
              if (index === currentIndex) {
                  slide.classList.add('active');
              } else {
                  slide.classList.remove('active');
              }
          });
      }

      // Otomatik slayt geçişini başlat
      function startAutoSlide() {
          stopAutoSlide(); // Önceki interval'ı temizle
          intervalId = setInterval(nextSlide, autoSlideInterval);
      }

      // Otomatik slayt geçişini durdur
      function stopAutoSlide() {
          clearInterval(intervalId);
      }

      // Yeniden boyutlandırma olay dinleyicisi için global bir fonksiyon tanımla
      // Bu, initializeSlider her çağrıldığında tekrar tekrar eklenmesini önler
      if (!window.handleSliderResize) {
          window.handleSliderResize = () => goToSlide(currentIndex, false);
          window.addEventListener('resize', window.handleSliderResize);
      }

      // Slider başlatma mantığı
      createDots();
      goToSlide(0, false); // İlk slayta animasyonsuz git
      startAutoSlide(); // Otomatik kaydırmayı başlat

      // Olay dinleyicileri (dinleyicileri sadece bir kez eklemek için kontrol)
      if (prevButton && !prevButton.dataset.listenerAdded) {
          prevButton.addEventListener('click', () => {
              prevSlide();
              stopAutoSlide();
              startAutoSlide();
          });
          prevButton.dataset.listenerAdded = 'true'; // İşaretle
      }
      if (nextButton && !nextButton.dataset.listenerAdded) {
          nextButton.addEventListener('click', () => {
              nextSlide();
              stopAutoSlide();
              startAutoSlide();
          });
          nextButton.dataset.listenerAdded = 'true'; // İşaretle
      }
      
      if (!sliderContainer.dataset.mouseListenerAdded) {
          sliderContainer.addEventListener('mouseenter', stopAutoSlide);
          sliderContainer.addEventListener('mouseleave', startAutoSlide);
          sliderContainer.dataset.mouseListenerAdded = 'true'; // İşaretle
      }

      // Slider'ın başlatıldığını işaretle
      sliderContainer.dataset.sliderInitialized = 'true';
      console.log('Slider başlatıldı.');
  }


  // ----------------------------------------------------------------------
  // SAYFA İLK YÜKLENDİĞİNDE (DOMContentLoaded) ÇALIŞACAK FONKSİYONLAR
  // Bu kısım, `index.html` gibi doğrudan yüklenen sayfalar içindir.
  // products-spa.html gibi dinamik içerik yükleyen sayfalarda ise `window.triggerPageLoadAnimation()` çağrılmalı.
  // ----------------------------------------------------------------------
  initializeHamburgerMenu();
  initializeParallax(); // Eğer index.html'de parallax varsa
  initializeFaq(); // Eğer index.html'de SSS varsa
  initializeLightbox(); // Eğer index.html'de lightbox tetikleyen görseller varsa
  initializeSlider(); // Slider'ı burada başlat
}); // DOMContentLoaded kapanışı