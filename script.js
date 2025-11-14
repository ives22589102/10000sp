/* File: script.js */

/******************************************************************************
 * 主監聽事件，當 HTML 載入完成後執行
 ******************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
    // 宣告 Swiper 實例變數
    let swiper1;
    let swiper1_plus;

    // ++ [新增] 手機版導覽列邏輯 ++
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    function openMobileMenu() {
        mobileNav.classList.add('is-open');
        mobileNavOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }
    function closeMobileMenu() {
        mobileNav.classList.remove('is-open');
        mobileNavOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
        // 點擊選單連結後自動關閉選單 (適用於單頁式網站)
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /**************************************************************************
     * Swiper 輪播功能初始化
     **************************************************************************/

       
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

    // 定義可重複使用的 Swiper 設定
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
        // 使用最穩定的事件來觸發 z-index 更新
        on: {
            // 1. 初始化時執行一次，確保初始狀態正確
            init: function(swiper) {
                updateCoverflowZIndex(swiper);
            },
            // 2. 每次滑動動畫「完全結束」時執行一次，確保最終狀態正確
            slideChangeTransitionEnd: function(swiper) {
                updateCoverflowZIndex(swiper);
            },
        }
    };

    // 初始化第一個輪播 (萬元戰備區)
    swiper1 = new Swiper('#product-swiper-tab1', {
        ...swiperOptions,
        navigation: {
            nextEl: '#product-swiper-tab1 .swiper-button-next',
            prevEl: '#product-swiper-tab1 .swiper-button-prev',
        },
    });

    swiper1_plus = new Swiper('#product-swiper-tab1-plus', {
        ...swiperOptions,
        navigation: {
            nextEl: '#product-swiper-tab1-plus .swiper-button-next',
            prevEl: '#product-swiper-tab1-plus .swiper-button-prev',
        },
    });

    /**************************************************************************
     * ★優化: 建立可重用的 Tabs 初始化函式
     **************************************************************************/
    function initializeTabs(containerSelector) {
        const tabContainer = document.querySelector(containerSelector);
        if (!tabContainer) return;

        const tabButtons = tabContainer.querySelectorAll('.tab-button, .filter-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');
        const tabButtonsContainer = tabContainer.querySelector('.tab-buttons, .category-filters');

        // 設定滑塊的寬度和初始位置
        if (tabButtonsContainer && tabButtons.length > 0) {
            const sliderWidth = 100 / tabButtons.length;
            tabButtonsContainer.style.setProperty('--deals-slider-width', `${sliderWidth}%`);
            tabButtonsContainer.style.setProperty('--deals-slider-transform', 'translateX(0%)');
        }

        // 為每個按鈕綁定點擊事件
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的 active class
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 為當前點擊的按鈕添加 active class
                button.classList.add('active');

                // 處理內容區塊的顯示/隱藏
                if (tabContents.length > 0) {
                    tabContents.forEach(content => content.classList.remove('active'));
                    const activeTabContent = document.getElementById(button.dataset.tab);
                    if (activeTabContent) {
                        activeTabContent.classList.add('active');
                    }
                }

                // 移動滑塊
                const transformValue = `translateX(${index * 100}%)`;
                if (tabButtonsContainer) {
                    tabButtonsContainer.style.setProperty('--deals-slider-transform', transformValue);
                }

                
            });
        });
    }

    // 初始化 "萬元精選" 區塊的 Tabs
    initializeTabs('.tabs-container');
    // 初始化 "優惠清單" 區塊的 Tabs (篩選器)
    // 注意: 此處的 initializeTabs 僅處理按鈕 active 效果和滑塊，篩選邏輯由 renderProductList 處理
    initializeTabs('#product-deals .container');


    /**************************************************************************
     * 滾動視差功能
     **************************************************************************/
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const scaleValue = 1 + scrollPosition * 0.0002;
            // 使用 requestAnimationFrame 提高性能
            window.requestAnimationFrame(function() {
                parallaxBg.style.transform = `scale(${scaleValue})`;
            });
        });
    }

    /**************************************************************************
     * 邀請碼 Modal 功能整合
     **************************************************************************/
    const modalContainer = document.getElementById('modal-container');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.modal-content .close-button');
    const getCodeForm = document.getElementById('getCodeForm');
    const emailInput = document.getElementById('email');
    const emailSuggestionEl = document.getElementById('email-suggestion');
    const modalResult = document.getElementById('modal-result');

    // 開啟 Modal
    const openModal = () => modalContainer && modalContainer.classList.add('active');

    // 關閉 Modal 並重置表單狀態
    const closeModal = () => {
        if (modalContainer) {
            modalContainer.classList.remove('active');
            // 關閉時重置表單狀態
            if (getCodeForm) getCodeForm.reset();
            if (modalResult) modalResult.innerHTML = '';
            const getCodeBtn = document.getElementById('getCodeBtn');
            if (getCodeBtn) {
                getCodeBtn.disabled = false;
                getCodeBtn.textContent = '我要當隊長';
            }
        }
    };

    // 綁定開啟按鈕事件
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // 綁定關閉按鈕事件
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // 點擊 Modal 外部區域關閉
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
    }

    // 綁定表單提交事件
    if (getCodeForm) {
        getCodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // 檢查 reCAPTCHA 是否已載入
            if (typeof grecaptcha !== 'undefined' && grecaptcha) {
                grecaptcha.execute();
            } else {
                modalResult.textContent = '人機驗證元件載入失敗，請刷新頁面重試。';
            }
        });
    }

    /**************************************************************************
     * Email 錯字建議功能 (使用 Mailcheck.js)
     **************************************************************************/
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

    /**************************************************************************
     * ★新增: 滑鼠 Hover 影片暫停/播放功能★
     **************************************************************************/
    const prizeCard = document.querySelector('.prize-info-card.image-fill');
    if (prizeCard) {
        const video = prizeCard.querySelector('.prize-video-bg');
        if (video) {
            prizeCard.addEventListener('mouseenter', () => video.pause());
            prizeCard.addEventListener('mouseleave', () => {
                video.play().catch(error => {
                    // 捕捉瀏覽器因用戶未互動而不允許自動播放的錯誤
                    console.log("Autoplay on mouseleave was prevented:", error);
                });
            });
        }
    }

    /**************************************************************************
     * 產品優惠篩選功能 (更新為列表模式)
     **************************************************************************/
    const dealsSection = document.querySelector('#product-deals');
    if (dealsSection) {
        const filterButtons = dealsSection.querySelectorAll('.filter-button');
        const dataSource = dealsSection.querySelector('.product-data-source');
        const listBody = dealsSection.querySelector('#product-list-body');

        // 渲染產品列表的函式
        function renderProductList(category) {
            if (!dataSource || !listBody) return;

            listBody.innerHTML = ''; // 清空現有列表
            const categoryContainer = dataSource.querySelector(`[data-category="${category}"]`);

            if (categoryContainer) {
                const productCards = categoryContainer.querySelectorAll('.product-item-card');

                if (productCards.length > 0) {
                    productCards.forEach(card => {
                        const name = card.querySelector('h4')?.textContent || 'N/A';
                        const promoPrice = card.querySelector('.promo-price')?.textContent || '';
                        const originalPrice = card.querySelector('.original-price')?.textContent || '';
                        const notes = card.querySelector('.card-notes')?.textContent || '';

                        // 建立列表項目 <li>
                        const li = document.createElement('li');

                        // 建立產品名稱 <span>
                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'product-name';
                        nameSpan.textContent = name;

                        // 建立價格容器 <span>
                        const priceSpan = document.createElement('span');
                        priceSpan.className = 'product-price';

                        // 建立優惠價 <span>
                        const promoSpan = document.createElement('span');
                        promoSpan.className = 'promo-price';
                        promoSpan.textContent = promoPrice;
                        priceSpan.appendChild(promoSpan);

                        // 如果有原價，建立原價 <span>
                        if (originalPrice) {
                            const originalSpan = document.createElement('span');
                            originalSpan.className = 'original-price';
                            originalSpan.textContent = originalPrice;
                            priceSpan.appendChild(originalSpan);
                        }

                        // ++ 更新: 如果有備註，直接加在價格後面 ++
                        if (notes.trim() !== '') {
                            const notesInlineSpan = document.createElement('span');
                            notesInlineSpan.className = 'product-notes-inline';
                            notesInlineSpan.textContent = notes;
                            priceSpan.appendChild(notesInlineSpan);
                        }

                        // 將名稱和價格加入 <li>
                        li.appendChild(nameSpan);
                        li.appendChild(priceSpan);
                        // 將 <li> 加入 <ul>
                        listBody.appendChild(li);
                    });
                } else {
                    listBody.innerHTML = '<li>此分類目前無優惠產品。</li>';
                }
            }
        }

        // 綁定篩選按鈕事件 (此處不需再綁定，已由 initializeTabs 統一處理)
        // filterButtons.forEach(button => {
        //     button.addEventListener('click', () => {
        //         // 切換 active class 的邏輯已在 initializeTabs 中完成
        //         const filterValue = button.dataset.filter;
        //         renderProductList(filterValue);
        //     });
        // });
        
        // 由於篩選邏輯與頁籤切換邏輯不同，需另外綁定
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.dataset.filter;
                renderProductList(filterValue);
            });
        });

        // 初始載入預設內容 (主機板)
        renderProductList('motherboard');
    }




    /**************************************************************************
     * 備註摺疊功能 (優化版)
     **************************************************************************/
    function initializeCollapsible() {
        // 監聽整個揪團辦法區塊的點擊事件 (事件委派)
        const container = document.getElementById('揪團辦法');
        if (!container) return;

        container.addEventListener('click', function(event) {
            // 找到被點擊的目標，或者它的父元素中，符合 .remarks-toggle 的元素
            const toggle = event.target.closest('.remarks-toggle');

            // 如果點擊的不是 toggle 按鈕，就什麼都不做
            if (!toggle) return;

            // 找到 toggle 按鈕所在的 remarks-wrapper
            const wrapper = toggle.closest('.remarks-wrapper');
            if (!wrapper) return;

            // 在 wrapper 內尋找內容區塊
            const content = wrapper.querySelector('.remarks-content.collapsible');
            if (content) {
                // 切換 active class 來觸發 CSS 的顯示/隱藏動畫
                toggle.classList.toggle('active');
                content.classList.toggle('active');
            }
        });
    }
    initializeCollapsible(); // 執行初始化


    /**************************************************************************
     * 單品登錄區塊 摺疊列表功能
     **************************************************************************/
    function initializeAccordion() {
        const accordionContainer = document.querySelector('.product-accordion-container');
        if (!accordionContainer) return;

        const items = accordionContainer.querySelectorAll('.accordion-item');

        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (header && content) {
                header.addEventListener('click', () => {
                    // 如果已經是 active，就移除
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                        content.style.maxHeight = null;
                    } else {
                        // 先關閉所有其他的
                        items.forEach(otherItem => {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        });

                        // 再打開點擊的這一個
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        });
    }
    initializeAccordion(); // 執行初始化


    // ++ [新增] 活動條款手風琴邏輯 ++
  const termsButton = document.getElementById('terms-accordion-button');
  const termsContent = document.getElementById('terms-accordion-content');
  const termsIcon = document.getElementById('terms-accordion-icon');

  if (termsButton && termsContent && termsIcon) {
    termsButton.addEventListener('click', () => {
      const isOpen = termsContent.style.maxHeight && termsContent.style.maxHeight !== '0px';
      if (isOpen) {
        termsContent.style.maxHeight = '0px';
        termsIcon.classList.remove('open');
      } else {
        termsContent.style.maxHeight = termsContent.scrollHeight + 'px';
        termsIcon.classList.add('open');
      }
    });
  }

}); // DOMContentLoaded 結束


/******************************************************************************
 * 全域函式 (給 reCAPTCHA 和動態內容使用)
 ******************************************************************************/

/**
 * reCAPTCHA 回呼函式 (全域)
 * 當 reCAPTCHA 驗證成功後會呼叫此函式
 * @param {string} token - reCAPTCHA 產生的 token
 */
window.submitFormWithToken = function(token) {
    const getCodeForm = document.getElementById('getCodeForm');
    const getCodeBtn = document.getElementById('getCodeBtn');
    const modalResult = document.getElementById('modal-result');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxwdn8avExeJS1uUl4W5UJ2A3wMqS2Aj5IVUHJrwSkodsUf8xAfgoANpai9nmdadcH2/exec';

    // 防止重複提交
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
                            <p>${data.isExisting ? '您已申請過，這是您的專屬戰隊代碼:' : '您的專屬戰隊代碼是:'}</p>
                            <div class="code-container">
                                <span id="generated-code" class="team-code">${data.teamCode}</span>
                                <button id="copyCodeBtn" class="utility-button">複製代碼</button>
                            </div>
                        </div>
                        <div class="share-widget-wrapper">
                            
                            <div id="social-share-widget">
                                <a href="#" class="share-button" data-share-network="facebook" title="分享到 Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                                <a href="#" class="share-button" data-share-network="line" title="分享到 LINE"><svg viewBox="0 0 24 24"><path d="M21.2,6.3C20.2,4,18,2.3,15.4,1.4C13.2,0.6,10.8,0.7,8.5,1.5c-2,0.7-3.8,2-5.1,3.7c-1.3,1.7-2,3.7-2.2,5.8c-0.1,2.2,0.4,4.4,1.4,6.4c1,1.9,2.6,3.6,4.6,4.6c2.1,1,4.4,1.3,6.7,0.9c2.3-0.4,4.5-1.5,6.1-3.2c1.3-1.4,2.2-3,2.7-4.8c0.5-1.8,0.6-3.6,0.2-5.4C22,7.9,21.7,7.1,21.2,6.3z M18.1,11.8h-1.5v4.5h-2.5V11.8h-2.9V9.6h2.9V8.1c0-1.7,0.8-2.6,2.6-2.6h2.2v2.2h-1.6c-0.5,0-0.6,0.2-0.6,0.6v1.3h2.2L18.1,11.8z M8.1,16.2H5.7V9.6h2.5V16.2z"></path></svg></a>
                                <a href="#" class="share-button" data-share-network="twitter" title="分享到 X (Twitter)"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
                                <a href="#" class="share-button" data-share-network="copy" title="複製揪團訊息"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></a>
                            </div>
                        </div>`;

                    // 綁定複製代碼按鈕
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
                    // 初始化動態產生的分享元件
                    setupShareWidget(data.teamCode);
                } else {
                    modalResult.textContent = data.error || '產生失敗，請稍後再試。';
                    getCodeBtn.disabled = false;
                    getCodeBtn.textContent = '我要當隊長';
                }
            } catch (e) {
                console.error("Failed to parse JSON:", text, e);
                modalResult.textContent = '伺服器回傳格式錯誤，請聯繫管理員。';
                getCodeBtn.disabled = false;
                getCodeBtn.textContent = '我要當隊長';
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            modalResult.textContent = '發生網路連線錯誤，請檢查您的網路並稍後再試。';
            getCodeBtn.disabled = false;
            getCodeBtn.textContent = '我要當隊長';
        })
        .finally(() => {
            // 無論成功或失敗，都重設 reCAPTCHA
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        });
};


/**
 * 新版分享功能函式(全域)
 * @param {string} teamCode - 產生的隊伍代碼
 */
function setupShareWidget(teamCode) {
    const shareWidgetWrapper = document.querySelector('.share-widget-wrapper');
    if (!shareWidgetWrapper) return;

    const mainShareBtn = shareWidgetWrapper.querySelector('#main-share-btn');
    const shareWidget = shareWidgetWrapper.querySelector('#social-share-widget');
    const shareButtons = shareWidgetWrapper.querySelectorAll('[data-share-network]');

    if (!shareWidget || !mainShareBtn) return;

    // 點擊主分享按鈕，顯示/隱藏分享選項
    mainShareBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        shareWidget.classList.toggle('active');
    });

    // 點擊頁面其他地方，隱藏分享選項
    document.addEventListener('click', () => {
        shareWidget.classList.remove('active');
    });

    // 點擊分享選項本身，不隱藏 (防止事件冒泡)
    shareWidget.addEventListener('click', (e) => e.stopPropagation());

    const shareUrl = "https://www.asus.com/microsite/10000sp/tw/";
    const customShareText = `快來加入我的 ASUS/ROG 戰隊!使用我的專屬邀請碼【${teamCode}】參加華碩《普發萬元 十倍 FUN 大》活動，一起升級裝備抽大獎!`;
    const textForSharing = `${customShareText}\n\n活動詳情: ${shareUrl}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTextForSharing = encodeURIComponent(textForSharing);

    shareButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const network = button.dataset.shareNetwork;
            let url;
            
            // Google Analytics 4 事件追蹤
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'data_layer_event',
                    'event_name_ga4': 'share',
                    'event_category_DL': 'Social Share',
                    'event_action_DL': 'click',
                    'event_label_DL': network.charAt(0).toUpperCase() + network.slice(1)
                });
            }

            switch (network) {
                case 'facebook':
                    url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(customShareText)}`;
                    break;
                case 'line':
                    url = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTextForSharing}`;
                    break;
                case 'twitter':
                    url = `https://twitter.com/intent/tweet?text=${encodedTextForSharing}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(textForSharing).then(() => {
                        const originalTitle = button.title;
                        button.title = '已複製!';
                        setTimeout(() => {
                            button.title = originalTitle;
                        }, 2000);
                    }).catch(err => console.error('無法複製訊息:', err));
                    return; // copy 不開新視窗
            }

            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer,width=600,height=450');
            }
        });
    });
}

