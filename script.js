/* File: script.js */

document.addEventListener('DOMContentLoaded', function() {

    // 宣告 Swiper 實例變數
    let swiper1;

    /************************************
     * Swiper 輪播功能初始化
     ************************************/
    const updateCoverflowZIndex = (swiper) => {
        swiper.slides.forEach(slide => {
            slide.style.zIndex = 0;
        });
        if (swiper.el.querySelector('.swiper-slide-active')) {
            swiper.el.querySelector('.swiper-slide-active').style.zIndex = 2;
        }
        if (swiper.el.querySelector('.swiper-slide-prev')) {
            swiper.el.querySelector('.swiper-slide-prev').style.zIndex = 1;
        }
        if (swiper.el.querySelector('.swiper-slide-next')) {
            swiper.el.querySelector('.swiper-slide-next').style.zIndex = 1;
        }
    };
    const swiperOptions = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        slideToClickedSlide: true,
        coverflowEffect: {
            rotate: 10,
            stretch: 0,
            depth: 80,
            modifier: 1,
            scale: 0.9,
            slideShadows: false,
        },
        on: {
            init: updateCoverflowZIndex,
            slideChangeTransitionEnd: updateCoverflowZIndex,
        },
    };
    swiper1 = new Swiper('#product-swiper-tab1', {
        ...swiperOptions,
        navigation: {
            nextEl: '#product-swiper-tab1 .swiper-button-next',
            prevEl: '#product-swiper-tab1 .swiper-button-prev',
        },
    });

    /************************************
     * ★優化:建立可重用的 Tabs 初始化函式
     ************************************/
    function initializeTabs(containerSelector) {
        const tabContainer = document.querySelector(containerSelector);
        if (!tabContainer) return;

        const tabButtons = tabContainer.querySelectorAll('.tab-button, .filter-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');
        const tabButtonsContainer = tabContainer.querySelector('.tab-buttons, .category-filters');

        if (tabButtonsContainer && tabButtons.length > 0) {
            const sliderWidth = 100 / tabButtons.length;
            tabButtonsContainer.style.setProperty('--deals-slider-width', `${sliderWidth}%`);
            tabButtonsContainer.style.setProperty('--deals-slider-transform', 'translateX(0%)');
        }

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                if (tabContents.length > 0) {
                    tabContents.forEach(content => content.classList.remove('active'));
                    const activeTabContent = document.getElementById(button.dataset.tab);
                    if (activeTabContent) {
                        activeTabContent.classList.add('active');
                    }
                }

                if (tabButtonsContainer) {
                    const transformValue = `translateX(${index * 100}%)`;
                    tabButtonsContainer.style.setProperty('--deals-slider-transform', transformValue);
                }
            });
        });
    }
    initializeTabs('.tabs-container');
    initializeTabs('#product-deals .container');

    /************************************
     * 滾動視差功能
     ************************************/
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const scaleValue = 1 + scrollPosition * 0.0002;
            window.requestAnimationFrame(function() {
                parallaxBg.style.transform = `scale(${scaleValue})`;
            });
        });
    }

    /************************************
     * 邀請碼 Modal 功能整合
     ************************************/
    const modalContainer = document.getElementById('modal-container');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.modal-content .close-button');
    const getCodeForm = document.getElementById('getCodeForm');
    const emailInput = document.getElementById('email');
    const emailSuggestionEl = document.getElementById('email-suggestion');
    const modalResult = document.getElementById('modal-result');

    const openModal = () => modalContainer && modalContainer.classList.add('active');
    const closeModal = () => {
        if (modalContainer) {
            modalContainer.classList.remove('active');
            if (getCodeForm) getCodeForm.reset();
            if (modalResult) modalResult.innerHTML = '';
            const getCodeBtn = document.getElementById('getCodeBtn');
            if (getCodeBtn) {
                getCodeBtn.disabled = false;
                getCodeBtn.textContent = '我要當隊長';
            }
        }
    };

    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
    }
    if (getCodeForm) {
        getCodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof grecaptcha !== 'undefined' && grecaptcha) {
                grecaptcha.execute();
            } else {
                modalResult.textContent = '人機驗證元件載入失敗,請刷新頁面重試。';
            }
        });
    }

    /************************************
     * Email 錯字建議功能 (使用 Mailcheck.js)
     ************************************/
    if (emailInput && emailSuggestionEl) {
        emailInput.addEventListener('blur', function() {
            Mailcheck.run({
                email: this.value,
                suggested: function(suggestion) {
                    emailSuggestionEl.innerHTML = `您是不是要輸入 <a href="#" id="suggestion-link">${suggestion.full}</a>?`;
                    const suggestionLink = document.getElementById('suggestion-link');
                    if (suggestionLink) {
                        suggestionLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            emailInput.value = suggestion.full;
                            emailSuggestionEl.innerHTML = '';
                            emailInput.focus();
                        });
                    }
                },
                empty: function() {
                    emailSuggestionEl.innerHTML = '';
                }
            });
        });
    }

    /************************************
     * ★新增: 滑鼠 Hover 影片暫停/播放功能★
     ************************************/
    const prizeCard = document.querySelector('.prize-info-card.image-fill');
    if (prizeCard) {
        const video = prizeCard.querySelector('.prize-video-bg');
        if (video) {
            prizeCard.addEventListener('mouseenter', () => video.pause());
            prizeCard.addEventListener('mouseleave', () => {
                video.play().catch(error => {
                    console.log("Autoplay on mouseleave was prevented:", error);
                });
            });
        }
    }
    
    /************************************
     * 產品優惠篩選功能 (更新為列表模式)
     ************************************/
    const dealsSection = document.querySelector('#product-deals');
    if (dealsSection) {
        const filterButtons = dealsSection.querySelectorAll('.filter-button');
        const dataSource = dealsSection.querySelector('.product-data-source');
        const listBody = dealsSection.querySelector('#product-list-body');

        function renderProductList(category) {
            if (!dataSource || !listBody) return;
            listBody.innerHTML = '';
            const categoryContainer = dataSource.querySelector(`[data-category="${category}"]`);
            if (categoryContainer) {
                const productCards = categoryContainer.querySelectorAll('.product-item-card');
                if (productCards.length > 0) {
                    productCards.forEach(card => {
                        const name = card.querySelector('h4')?.textContent || 'N/A';
                        const promoPrice = card.querySelector('.promo-price')?.textContent || '';
                        const originalPrice = card.querySelector('.original-price')?.textContent || '';
                        const notes = card.querySelector('.card-notes')?.textContent || '';

                        const li = document.createElement('li');
                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'product-name';
                        nameSpan.textContent = name;

                        const priceSpan = document.createElement('span');
                        priceSpan.className = 'product-price';
                        
                        const promoSpan = document.createElement('span');
                        promoSpan.className = 'promo-price';
                        promoSpan.textContent = promoPrice;
                        priceSpan.appendChild(promoSpan);

                        if (originalPrice) {
                            const originalSpan = document.createElement('span');
                            originalSpan.className = 'original-price';
                            originalSpan.textContent = originalPrice;
                            priceSpan.appendChild(originalSpan);
                        }

                        if (notes.trim() !== '') {
                            const notesInlineSpan = document.createElement('span');
                            notesInlineSpan.className = 'product-notes-inline';
                            notesInlineSpan.textContent = notes;
                            priceSpan.appendChild(notesInlineSpan);
                        }
                        
                        li.appendChild(nameSpan);
                        li.appendChild(priceSpan);
                        listBody.appendChild(li);
                    });
                } else {
                    listBody.innerHTML = '<li>此分類目前無優惠產品。</li>';
                }
            }
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.dataset.filter;
                renderProductList(filterValue);
            });
        });

        renderProductList('motherboard');
    }

    /************************************
     * 備註摺疊功能 (優化版)
     ************************************/
    function initializeCollapsible() {
        const container = document.getElementById('揪團辦法');
        if (!container) return;
        container.addEventListener('click', function(event) {
            const toggle = event.target.closest('.remarks-toggle');
            if (!toggle) return;
            const wrapper = toggle.closest('.remarks-wrapper');
            if (!wrapper) return;
            const content = wrapper.querySelector('.remarks-content.collapsible');
            if (content) {
                toggle.classList.toggle('active');
                content.classList.toggle('active');
            }
        });
    }
    initializeCollapsible();

    /************************************
     * 單品登錄區塊摺疊列表功能
     ************************************/
    function initializeAccordion() {
        const accordionContainer = document.querySelector('.product-accordion-container');
        if (!accordionContainer) return;
        const items = accordionContainer.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (header && content) {
                header.addEventListener('click', () => {
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                        content.style.maxHeight = null;
                    } else {
                        items.forEach(otherItem => {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        });
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        });
    }
    initializeAccordion();

    /************************************
     * RWD 新增：手機版導覽列邏輯
     ************************************/
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav a');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // 點擊選單連結後自動關閉選單
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

}); // DOMContentLoaded 結束


/***********************************************************************
 * 全域函式 (給 reCAPTCHA 和動態內容使用)
 ***********************************************************************/

/**
 * reCAPTCHA 回呼函式(全域)
 * 當 reCAPTCHA 驗證成功後會呼叫此函式
 * @param {string} token - reCAPTCHA 產生的 token
 */
window.submitFormWithToken = function(token) {
    const getCodeBtn = document.getElementById('getCodeBtn');
    const modalResult = document.getElementById('modal-result');
    const getCodeForm = document.getElementById('getCodeForm');
    
    if (!getCodeBtn || !modalResult || !getCodeForm) return;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxwdn8avExeJS1uUl4W5UJ2A3wMqS2Aj5IVUHJrwSkodsUf8xAfgoANpai9nmdadcH2/exec';

    getCodeBtn.disabled = true;
    getCodeBtn.textContent = '查詢/產生中...';
    modalResult.innerHTML = '';

    const formData = new FormData(getCodeForm);
    formData.append('g-recaptcha-response', token);

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text.trim());
            if (data.success) {
                getCodeBtn.textContent = '產生成功!';
                modalResult.innerHTML = `
                <div class="code-display-container">
                    <p>${data.isExisting ? '您已申請過,這是您的專屬戰隊代碼:' : '您的專屬戰隊代碼是:'}</p>
                    <div class="code-container">
                        <span id="generated-code" class="team-code">${data.teamCode}</span>
                        <button id="copyCodeBtn" class="utility-button">複製代碼</button>
                    </div>
                </div>`;

                const copyCodeBtn = document.getElementById('copyCodeBtn');
                if (copyCodeBtn) {
                    copyCodeBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(data.teamCode).then(() => {
                            copyCodeBtn.textContent = '已複製!';
                            copyCodeBtn.classList.add('copied');
                            setTimeout(() => {
                                copyCodeBtn.textContent = '複製代碼';
                                copyCodeBtn.classList.remove('copied');
                            }, 2000);
                        });
                    });
                }
            } else {
                modalResult.textContent = data.error || '產生失敗,請稍後再試。';
                getCodeBtn.disabled = false;
                getCodeBtn.textContent = '我要當隊長';
            }
        } catch (e) {
            console.error("Failed to parse JSON:", text, e);
            modalResult.textContent = '伺服器回傳格式錯誤,請聯繫管理員。';
            getCodeBtn.disabled = false;
            getCodeBtn.textContent = '我要當隊長';
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        modalResult.textContent = '發生網路連線錯誤,請檢查您的網路並稍後再試。';
        getCodeBtn.disabled = false;
        getCodeBtn.textContent = '我要當隊長';
    })
    .finally(() => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    });
};