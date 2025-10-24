// script.js

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Инициализация всех модулей
    initLoadingScreen();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderEffects();
    initMobileMenu();
    initGalleryModal();
    initBackToTop();
    initParallaxEffects();
    initCounters();
    initFormHandlers();
    initParticleEffects();
    
    console.log('🚀 Сайт инициализирован!');
}

// 1. Loading Screen
function initLoadingScreen() {
    const loading = document.querySelector('.loading');
    if (loading) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loading.style.opacity = '0';
                loading.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
                
                // Запуск начальных анимаций после загрузки
                animateOnLoad();
            }, 1200);
        });
    }
}

// 2. Плавная прокрутка
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрытие мобильного меню
                closeMobileMenu();
            }
        });
    });
}

// 3. Анимации при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .feature-card, .step, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                    element.style.filter = 'blur(0)';
                    
                    // Специфичные анимации для разных элементов
                    if (element.classList.contains('feature-card')) {
                        animateFeatureCard(element);
                    }
                    if (element.classList.contains('step')) {
                        animateStep(element);
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.filter = 'blur(5px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

// 4. Эффекты для хедера
function initHeaderEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Эффект прозрачности и блюра
        if (currentScrollY > 100) {
            header.style.background = 'rgba(139, 69, 19, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
        
        // Скрытие/показ хедера при скролле
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Активация пунктов меню при скролле
        updateActiveNavLink();
    });
}

// 5. Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// 6. Модальное окно для галереи
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img class="modal-image" src="" alt="">
            <div class="modal-nav">
                <button class="modal-prev">‹</button>
                <button class="modal-next">›</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => 
        item.style.backgroundImage.replace('url("', '').replace('")', '')
    );
    
    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => openModal(index));
    });
    
    function openModal(index) {
        currentImageIndex = index;
        updateModalImage();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function updateModalImage() {
        const modalImage = modal.querySelector('.modal-image');
        modalImage.src = images[currentImageIndex];
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalImage();
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalImage();
    }
    
    // Event listeners для модалки
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-next').addEventListener('click', nextImage);
    modal.querySelector('.modal-prev').addEventListener('click', prevImage);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Навигация клавиатурой
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });
}

// 7. Кнопка "Наверх"
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Наверх';
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// 8. Параллакс эффекты
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// 9. Анимация счетчиков
function initCounters() {
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.dataset.target;
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + '+';
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        });
        
        counterElements.forEach(counter => observer.observe(counter));
    }
}

// 10. Обработчики форм
function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Форма отправлена успешно!', 'success');
        });
    });
}

// 11. Частицы для фона
function initParticleEffects() {
    const hero = document.querySelector('.hero');
    
    if (hero && window.innerWidth > 768) {
        createParticles(hero);
    }
}

function createParticles(container) {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 215, 0, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float 6s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }, i * 200);
    }
}

// Вспомогательные функции
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function animateOnLoad() {
    // Анимация для герой-секции
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'none';
        setTimeout(() => {
            heroContent.style.animation = 'fadeInUp 1s ease forwards';
        }, 100);
    }
    
    // Запуск частиц
    setTimeout(initParticleEffects, 500);
}

function animateFeatureCard(card) {
    card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

function animateStep(step) {
    step.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
    step.style.transform = 'translateX(0) rotate(0)';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Ресайз обработчик
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        closeMobileMenu();
    }, 250);
});

// Preloader для изображений
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const loader = document.createElement('div');
        loader.className = 'image-loader';
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        loader.innerHTML = '<div class="spinner"></div>';
        img.parentNode.style.position = 'relative';
        img.parentNode.insertBefore(loader, img);
        
        img.addEventListener('load', function() {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        });
    });
}

// Инициализация preloader'а
preloadImages();