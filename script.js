let highlightIndex = -1;
let highlightElements = [];
let isExpanding = false;
let isCollapsing = false;
let searchType = 'partial';

function loadContentFromMarkdown() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/content.md', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const markdown = xhr.responseText;
                const html = parseMarkdownToHtml(markdown);
                var container = document.getElementById('main-content');
                if (container) container.innerHTML = html;
            } else {
                console.log('尝试其他路径...');
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', '/xiaofang/data/content.md', true);
                xhr2.onreadystatechange = function() {
                    if (xhr2.readyState === 4) {
                        if (xhr2.status === 200) {
                            const markdown = xhr2.responseText;
                            const html = parseMarkdownToHtml(markdown);
                            var container = document.getElementById('main-content');
                            if (container) container.innerHTML = html;
                        } else {
                            console.log('content.md 加载失败');
                        }
                    }
                };
                xhr2.send();
            }
        }
    };
    xhr.send();
}

function parseMarkdownToHtml(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let currentLevel = 0;
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('# ')) {
            html += closeTags(currentLevel);
            html += '<details class="indent-level-1"><summary><span class="folder-icon" data-level="1"></span><span class="clickable-title">' + escapeHtml(line.slice(2)) + '</span></summary><div class="content-container">';
            currentLevel = 1;
            inList = false;
        } else if (line.startsWith('## ')) {
            html += closeTags(currentLevel);
            html += '<details class="indent-level-2"><summary><span class="folder-icon" data-level="2"></span><span class="clickable-title">' + escapeHtml(line.slice(3)) + '</span></summary><div class="content-container">';
            currentLevel = 2;
            inList = false;
        } else if (line.startsWith('### ')) {
            html += closeTags(currentLevel);
            html += '<details class="indent-level-3"><summary><span class="folder-icon" data-level="3"></span><span class="clickable-title">' + escapeHtml(line.slice(4)) + '</span></summary><div class="content-container">';
            currentLevel = 3;
            inList = false;
        } else if (line.startsWith('#### ')) {
            html += closeTags(currentLevel);
            html += '<details class="indent-level-4"><summary><span class="folder-icon" data-level="4"></span><span class="clickable-title">' + escapeHtml(line.slice(5)) + '</span></summary><div class="content-container">';
            currentLevel = 4;
            inList = false;
        } else if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += '<li>' + parseInlineMarkdown(line.slice(2)) + '</li>';
        } else if (line.trim() === '') {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += '<p>' + parseInlineMarkdown(line) + '</p>';
        }
    }
    
    html += closeTags(currentLevel);
    html += '<div class="wechat-section"><div class="wechat-title">欢迎关注我的公众号：小帅随笔</div><div class="wechat-title">访问量:<span id="busuanzi_value_page_pv"></span>次 | 访客数:<span id="busuanzi_value_site_uv"></span>人</div></div><button class="recent-updates-button" title="查看最近更新" onclick="toggleSidebar()">🚴‍♀️</button><button class="sidebar-toggle" onclick="toggleSidebar()">☰</button><div id="sidebar" class="sidebar-ad"><div class="sidebar-header"><h3>快捷链接</h3></div><div class="sidebar-body"><div class="link-section"><h4>常用站点</h4><ul><li><a href="https://github.com" target="_blank">GitHub</a></li><li><a href="https://www.google.com" target="_blank">Google</a></li><li><a href="https://www.bing.com" target="_blank">Bing</a></li></ul></div></div></div>';
    
    return html;
}

function closeTags(level) {
    let html = '';
    for (let i = level; i > 0; i--) {
        html += '</div></details>';
    }
    return html;
}

function parseInlineMarkdown(text) {
    text = escapeHtml(text);
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getDefaultContent() {
    return '<details class="indent-level-1"><summary><span class="folder-icon" data-level="1"></span><span class="clickable-title">📢近期公告</span></summary><div class="content-container"><p>加载失败，请检查网络连接</p></div></details>';
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    body.classList.toggle('dark-theme');
    themeIcon.textContent = body.classList.contains('dark-theme') ? '🌙' : '💧';
}

function expandAll() {
    if (isExpanding) return;
    isExpanding = true;
    document.querySelectorAll('details').forEach(function(d) { d.open = true; });
    isExpanding = false;
}

function collapseAll() {
    if (isCollapsing) return;
    isCollapsing = true;
    document.querySelectorAll('details').forEach(function(d) { d.open = false; });
    isCollapsing = false;
}

function showSearchTypeDropdown() {
    document.getElementById('searchTypeDropdown').classList.add('show');
}

function hideSearchTypeDropdown() {
    document.getElementById('searchTypeDropdown').classList.remove('show');
}

function selectSearchType(type) {
    searchType = type;
    const text = document.getElementById('searchTypeText');
    document.querySelectorAll('.search-type-option').forEach(function(opt) { opt.classList.remove('selected'); });
    event.target.classList.add('selected');
    
    if (type === 'partial') text.textContent = '本站搜索';
    else if (type === 'pan') text.textContent = '帅盘搜索';
    else if (type === 'pan_api') text.textContent = '聚合搜索';
    else if (type === 'engine') text.textContent = '联网搜索';
    
    document.getElementById('panFilters').style.display = type === 'pan' ? 'flex' : 'none';
    document.getElementById('shuaiPanFilters').style.display = type === 'pan_api' ? 'flex' : 'none';
    document.getElementById('engineFilters').style.display = type === 'engine' ? 'flex' : 'none';
    
    hideSearchTypeDropdown();
}

function showEngineDropdown() {
    document.getElementById('engineDropdown').classList.add('show');
}

function hideEngineDropdown() {
    document.getElementById('engineDropdown').classList.remove('show');
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    if (searchType === 'partial') {
        localSearch(query);
    } else if (searchType === 'engine') {
        searchEngines(query);
    }
}

function localSearch(query) {
    const content = document.querySelectorAll('.content-container p, .content-container li, .content-container a, summary .clickable-title');
    highlightElements = [];
    
    content.forEach(function(el) {
        const text = el.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            highlightElements.push(el);
            el.innerHTML = el.innerHTML.replace(new RegExp(query, 'gi'), function(match) { return '<span class="highlight">' + match + '</span>'; });
        }
    });
    
    highlightIndex = 0;
    updateHighlight();
}

function updateHighlight() {
    highlightElements.forEach(function(el, idx) {
        if (idx === highlightIndex) {
            el.classList.add('active-highlight');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            el.classList.remove('active-highlight');
        }
    });
}

function prevHighlight() {
    if (highlightElements.length === 0) return;
    highlightIndex = (highlightIndex - 1 + highlightElements.length) % highlightElements.length;
    updateHighlight();
}

function nextHighlight() {
    if (highlightElements.length === 0) return;
    highlightIndex = (highlightIndex + 1) % highlightElements.length;
    updateHighlight();
}

function searchEngines(query) {
    const engines = [];
    document.querySelectorAll('#engineDropdown input[type="checkbox"]:checked').forEach(function(cb) {
        engines.push(cb.value);
    });
    
    if (engines.length === 0) {
        alert('请至少选择一个搜索引擎');
        return;
    }
    
    const firstEngine = engines[0];
    let url = '';
    
    switch(firstEngine) {
        case 'bing': url = 'https://www.bing.com/search?q=' + encodeURIComponent(query); break;
        case 'google': url = 'https://www.google.com/search?q=' + encodeURIComponent(query); break;
        case 'baidu': url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(query); break;
        case 'ddgo': url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query); break;
        default: url = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
    }
    
    window.open(url, '_blank');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('searchTypeDropdown').classList.remove('show');
        document.getElementById('engineDropdown').classList.remove('show');
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-type-container')) {
        hideSearchTypeDropdown();
    }
    if (!e.target.closest('.multi-select-container')) {
        hideEngineDropdown();
    }
    if (!e.target.closest('.sidebar-ad') && !e.target.classList.contains('sidebar-toggle')) {
        document.getElementById('sidebar').classList.remove('open');
    }
});

var recommendedEngines = ['bing', 'google', 'weixin', '52pojie', 'linuxdo', 'bilibili'];

document.getElementById('selectRecommendedEngines').addEventListener('change', function(e) {
    document.querySelectorAll('#engineDropdown input[type="checkbox"]').forEach(function(cb) {
        if (recommendedEngines.indexOf(cb.value) !== -1) {
            cb.checked = e.target.checked;
        }
    });
    updateEngineSelectionText();
});

document.getElementById('selectAllEngines').addEventListener('change', function(e) {
    document.querySelectorAll('#engineDropdown input[type="checkbox"]').forEach(function(cb) {
        cb.checked = e.target.checked;
    });
    updateEngineSelectionText();
});

document.querySelectorAll('#engineDropdown input[type="checkbox"]').forEach(function(cb) {
    cb.addEventListener('change', updateEngineSelectionText);
});

function updateEngineSelectionText() {
    var checked = document.querySelectorAll('#engineDropdown input[type="checkbox"]:checked');
    document.getElementById('engineSelectionText').textContent = '已选择 ' + checked.length + ' 个引擎';
}

document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting loadContentFromMarkdown...');
    loadContentFromMarkdown();
});