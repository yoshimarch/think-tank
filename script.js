// Think-Tank リンク集 - メインJavaScript

class ThinkTankApp {
    constructor() {
        this.allLinks = [];
        this.filteredLinks = [];
        this.activeFilters = new Set();
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadLinks();
    }
    
    // DOM要素の初期化
    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearch');
        this.linksContainer = document.getElementById('linksContainer');
        this.popularTags = document.getElementById('popularTags');
        this.totalLinksCounter = document.getElementById('totalLinks');
        this.filteredLinksCounter = document.getElementById('filteredLinks');
        this.noResults = document.getElementById('noResults');
        this.loading = document.getElementById('loading');
    }
    
    // イベントリスナーの設定
    bindEvents() {
        // 検索機能
        this.searchInput.addEventListener('input', 
            this.debounce(this.handleSearch.bind(this), 300)
        );
        
        // 検索クリア
        this.clearSearchBtn.addEventListener('click', this.clearSearch.bind(this));
        
        // Enterキーでの検索
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }
    
    // デバウンス関数（検索のパフォーマンス向上）
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // リンクデータの読み込み
    async loadLinks() {
        try {
            this.showLoading(true);
            
            const response = await fetch('data/links.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.allLinks = Array.isArray(data) ? data : (data.links || []);
            
            this.processData();
            this.renderLinks();
            this.renderPopularTags();
            this.updateStats();
            
        } catch (error) {
            console.error('リンクデータの読み込みに失敗しました:', error);
            this.showError('リンクデータを読み込めませんでした。');
        } finally {
            this.showLoading(false);
        }
    }
    
    // データの前処理
    processData() {
        // 日付順でソート（新しい順）
        this.allLinks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // 初期状態では全リンクを表示
        this.filteredLinks = [...this.allLinks];
    }
    
    // 検索処理
    handleSearch() {
        this.searchTerm = this.searchInput.value.toLowerCase().trim();
        this.filterLinks();
    }
    
    // 検索クリア
    clearSearch() {
        this.searchInput.value = '';
        this.searchTerm = '';
        this.activeFilters.clear();
        this.updateTagsUI();
        this.filterLinks();
    }
    
    // タグフィルタ処理
    toggleTagFilter(tag) {
        if (this.activeFilters.has(tag)) {
            this.activeFilters.delete(tag);
        } else {
            this.activeFilters.add(tag);
        }
        this.updateTagsUI();
        this.filterLinks();
    }
    
    // リンクのフィルタリング
    filterLinks() {
        this.filteredLinks = this.allLinks.filter(link => {
            // テキスト検索
            const matchesSearch = !this.searchTerm || 
                link.title.toLowerCase().includes(this.searchTerm) ||
                link.hashtags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            // タグフィルタ
            const matchesTags = this.activeFilters.size === 0 ||
                [...this.activeFilters].some(activeTag => 
                    link.hashtags.includes(activeTag)
                );
            
            return matchesSearch && matchesTags;
        });
        
        this.renderLinks();
        this.updateStats();
    }
    
    // リンクの表示
    renderLinks() {
        this.linksContainer.innerHTML = '';
        
        if (this.filteredLinks.length === 0) {
            this.showNoResults(true);
            return;
        }
        
        this.showNoResults(false);
        
        this.filteredLinks.forEach((link, index) => {
            const linkCard = this.createLinkCard(link, index);
            this.linksContainer.appendChild(linkCard);
        });
    }
    
    // リンクカードの作成
    createLinkCard(link, index) {
        const card = document.createElement('div');
        card.className = 'link-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // 日付のフォーマット
        const date = new Date(link.created_at);
        const formattedDate = date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // ハッシュタグのHTML生成
        const tagsHTML = link.hashtags.map(tag => 
            `<span class="link-tag">#${tag}</span>`
        ).join('');
        
        // URLの短縮表示
        const shortUrl = this.shortenUrl(link.url);
        
        card.innerHTML = `
            <div class="link-title">${this.escapeHtml(link.title)}</div>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-url">
                ${shortUrl}
            </a>
            <div class="link-tags">${tagsHTML}</div>
            <div class="link-actions">
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="visit-btn">
                    <i class="fas fa-external-link-alt"></i>
                    サイトを開く
                </a>
                <span class="link-date">${formattedDate}</span>
            </div>
        `;
        
        return card;
    }
    
    // 人気タグの表示
    renderPopularTags() {
        const tagCount = new Map();
        
        // タグの出現回数をカウント
        this.allLinks.forEach(link => {
            link.hashtags.forEach(tag => {
                tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
            });
        });
        
        // 出現回数順でソート（上位10個）
        const sortedTags = Array.from(tagCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        this.popularTags.innerHTML = '';
        
        sortedTags.forEach(([tag, count]) => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = `#${tag} (${count})`;
            tagElement.addEventListener('click', () => this.toggleTagFilter(tag));
            
            this.popularTags.appendChild(tagElement);
        });
    }
    
    // タグUIの更新
    updateTagsUI() {
        const tagElements = this.popularTags.querySelectorAll('.tag');
        tagElements.forEach(tagElement => {
            const tagName = tagElement.textContent.split(' ')[0].substring(1); // #を除去
            tagElement.classList.toggle('active', this.activeFilters.has(tagName));
        });
    }
    
    // 統計情報の更新
    updateStats() {
        this.totalLinksCounter.textContent = this.allLinks.length;
        this.filteredLinksCounter.textContent = this.filteredLinks.length;
    }
    
    // ローディング状態の表示/非表示
    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.linksContainer.style.display = show ? 'none' : 'grid';
    }
    
    // 結果なし状態の表示/非表示
    showNoResults(show) {
        this.noResults.style.display = show ? 'block' : 'none';
    }
    
    // エラー表示
    showError(message) {
        this.linksContainer.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #e53e3e;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>エラーが発生しました</h3>
                <p>${message}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #718096;">
                    data/links.json ファイルが存在し、正しい形式であることを確認してください。
                </p>
            </div>
        `;
    }
    
    // ユーティリティ関数：HTMLエスケープ
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // ユーティリティ関数：URL短縮表示
    shortenUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');
            const pathname = urlObj.pathname;
            
            if (pathname.length > 30) {
                return hostname + pathname.substring(0, 27) + '...';
            }
            return hostname + pathname;
        } catch (e) {
            return url.length > 50 ? url.substring(0, 47) + '...' : url;
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ThinkTankApp();
});

// サービスワーカーの登録（PWA対応のため、オプション）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}