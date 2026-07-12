let highlightIndex = -1;
let highlightElements = [];
let isExpanding = false;
let isCollapsing = false;
let searchType = 'partial';

document.addEventListener('DOMContentLoaded', () => {
    loadContentFromMarkdown();
});

async function loadContentFromMarkdown() {
    try {
        const basePath = window.location.pathname.replace(/\/[^\/]+$/, '');
        const paths = [
            'data/content.md',
            `${basePath}/data/content.md`,
            './data/content.md'
        ];
        
        let markdown = null;
        for (const path of paths) {
            const response = await fetch(path);
            if (response.ok) {
                markdown = await response.text();
                break;
            }
        }
        
        if (!markdown) {
            console.warn('无法加载 content.md，使用默认内容');
            const contentContainer = document.querySelector('.content');
            if (contentContainer) {
                contentContainer.innerHTML = getDefaultContent();
            }
            return;
        }
        
        const html = parseMarkdownToHtml(markdown);
        const contentContainer = document.querySelector('.content');
        if (contentContainer) {
            contentContainer.innerHTML = html;
        }
        updateHighlightElements();
    } catch (error) {
        console.warn('加载 content.md 失败:', error);
        const contentContainer = document.querySelector('.content');
        if (contentContainer) {
            contentContainer.innerHTML = getDefaultContent();
        }
    }
}

function parseMarkdownToHtml(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let currentLevel = 0;
    let inList = false;
    
    lines.forEach(line => {
        if (line.startsWith('# ')) {
            html += closeTags(currentLevel);
            html += `<details class="indent-level-1">
                <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">${escapeHtml(line.slice(2))}</span></summary>
                <div class="content-container">`;
            currentLevel = 1;
            inList = false;
        } else if (line.startsWith('## ')) {
            html += closeTags(currentLevel);
            html += `<details class="indent-level-2">
                <summary><span class="folder-icon" data-level="2" style="cursor: pointer;"></span><span class="clickable-title">${escapeHtml(line.slice(3))}</span></summary>
                <div class="content-container">`;
            currentLevel = 2;
            inList = false;
        } else if (line.startsWith('### ')) {
            html += closeTags(currentLevel);
            html += `<details class="indent-level-3">
                <summary><span class="folder-icon" data-level="3" style="cursor: pointer;"></span><span class="clickable-title">${escapeHtml(line.slice(4))}</span></summary>
                <div class="content-container">`;
            currentLevel = 3;
            inList = false;
        } else if (line.startsWith('#### ')) {
            html += closeTags(currentLevel);
            html += `<details class="indent-level-4">
                <summary><span class="folder-icon" data-level="4" style="cursor: pointer;"></span><span class="clickable-title">${escapeHtml(line.slice(5))}</span></summary>
                <div class="content-container">`;
            currentLevel = 4;
            inList = false;
        } else if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${parseInlineMarkdown(line.slice(2))}</li>`;
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
            html += `<p>${parseInlineMarkdown(line)}</p>`;
        }
    });
    
    html += closeTags(currentLevel);
    
    html += `
        <div class="wechat-section">
            <div class="wechat-title">欢迎关注我的公众号：小帅随笔</div>
            <div class="wechat-title">访问量:<span id="busuanzi_value_page_pv"></span>次 | 访客数:<span id="busuanzi_value_site_uv"></span>人</div>
        </div>
        <button class="recent-updates-button" title="查看最近更新">🚴‍♀️</button>
        <button class="sidebar-toggle" onclick="toggleSidebar()">☰</button>
        <div id="sidebar" class="sidebar-ad">
            <div class="sidebar-header">
                <h3>快捷链接</h3>
            </div>
            <div class="sidebar-body">
                <div class="link-section">
                    <h4>常用站点</h4>
                    <ul>
                        <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google</a></li>
                        <li><a href="https://www.bing.com" target="_blank" rel="noopener noreferrer">Bing</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
    
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
    text = text.replace(/✅/g, '✅ ');
    return text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateHighlightElements() {
    highlightElements = [];
}

function getDefaultContent() {
    return `
        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">📢近期公告</span></summary>
            <div class="content-container">
                <p>2025.02.23 储物间全面更新，具体可查看文章：<a href="https://mp.weixin.qq.com/s/4iu8ZsqzpAzBF2PsrYgqww" target="_blank" rel="noopener noreferrer">从永硕E盘到智能本地化管理：3次迭代的储物间有多能打！</a></p>
                <blockquote>
                    <p>💨1，失效链接全部替换，标记❌的表示「需要魔法/失效网址」</p>
                    <p>💨2，爆火AI栏大批量更新AI办公、生成图片、视频、音乐、语音等</p>
                    <p>💨3，02-10-1 栏增加最新版离线下载的浏览器(谷歌、微软等)</p>
                    <p>💨4，02-12 栏更新大批量 Adobe 全家桶下载地址</p>
                    <p>💨5，07-05 栏更新大批量洛雪音乐音源地址</p>
                    <p>💨6，03-03 栏更新大批量电子书/漫画源地址</p>
                    <p>💨7，06-01 栏更新大批量影视观看/下载地址</p>
                    <p>💨8，储物间替换阿里的 Thoughts 文档分享的失效软件/教程链接</p>
                </blockquote>
                <details class="indent-level-2">
                    <summary><span class="folder-icon" data-level="2" style="cursor: pointer;"></span><span class="clickable-title">近期精选：开源软件和网站</span></summary>
                    <div class="content-container">
                        <ul>
                            <li>Trae国际版免费领取600次所有AI模型的使用，领取地址：- ✅ <a href="https://www.trae.ai/2026-anniversary-gift" target="_blank" rel="noopener noreferrer">Anniversary Gift | TRAE - Collaborate with Intelligence</a></li>
                            <li>✅ <a href="https://github.com/AndroidCoderPeng/DailyTask" target="_blank" rel="noopener noreferrer">GitHub - AndroidCoderPeng/DailyTask: 钉钉自动打卡</a>【✅ <a href="https://pan.quark.cn/s/44d51363b4b8" target="_blank" rel="noopener noreferrer">夸克网盘</a>】</li>
                            <li>✅ <a href="https://github.com/kanadeblisst00/WechatVideoSniffer2.0" target="_blank" rel="noopener noreferrer">GitHub - kanadeblisst00/WechatVideoSniffer2.0: 微信视频号下载工具</a></li>
                            <li>✅ <a href="https://github.com/Frica01/WeChatMassTool" target="_blank" rel="noopener noreferrer">GitHub - Frica01/WeChatMassTool: 微信自动发送信息，微信群发消息，Windows系统微信客户端</a></li>
                            <li>✅ <a href="https://github.com/fishjar/kiss-translator" target="_blank" rel="noopener noreferrer">GitHub - fishjar/kiss-translator: 一个简约、开源的双语对照翻译扩展 & 油猴脚本</a></li>
                            <li>✅ <a href="https://github.com/Bistutu/FluentRead?tab=readme-ov-file" target="_blank" rel="noopener noreferrer">GitHub - Bistutu/FluentRead: Open Immersive Translate. 开源的沉浸式翻译</a></li>
                        </ul>
                    </div>
                </details>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">┄┄✂┄┄</span></summary>
            <div class="content-container"></div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">01 爆火 AI🔥</span></summary>
            <div class="content-container">
                <p>✅ <a href="https://aihot.virxact.com/" target="_blank" rel="noopener noreferrer">AIHOT——今日热点（AI 自动挑选的高价值内容）👍</a></p>
                <p>✅ <a href="https://arena.ai/zh/leaderboard" target="_blank" rel="noopener noreferrer">Arena Leaderboard | Compare & Benchmark the Best Frontier AI Models（AI最新榜单）👍</a></p>
                <details class="indent-level-2">
                    <summary><span class="folder-icon" data-level="2" style="cursor: pointer;"></span><span class="clickable-title">00.AI 编程 & Vibe Coding</span></summary>
                    <div class="content-container">
                        <blockquote>
                            <p>不写代码，也能做产品；写代码，AI 帮你写得更好</p>
                        </blockquote>
                        <details class="indent-level-3">
                            <summary><span class="folder-icon" data-level="3" style="cursor: pointer;"></span><span class="clickable-title">00.入门教程</span></summary>
                            <div class="content-container">
                                <ul>
                                    <li>✅ <a href="https://www.vibevibe.cn/" target="_blank" rel="noopener noreferrer">教程：Vibe Vibe</a>【人人都能 AI 创造】</li>
                                    <li>✅ <a href="https://jiangren.com.au/roadmaps/vibe-coding" target="_blank" rel="noopener noreferrer">教程：Vibe Coding 学习路线图</a></li>
                                </ul>
                            </div>
                        </details>
                        <details class="indent-level-3">
                            <summary><span class="folder-icon" data-level="3" style="cursor: pointer;"></span><span class="clickable-title">01.Agent 工具</span></summary>
                            <div class="content-container">
                                <ul>
                                    <li>✅ <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer">OpenClaw-开源👍</a> - 自主 Agent 平台</li>
                                    <li>✅ <a href="https://hermes-agent.nousresearch.com/" target="_blank" rel="noopener noreferrer">Hermes Agent | Nous Research 👍</a></li>
                                </ul>
                            </div>
                        </details>
                    </div>
                </details>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">02 电脑软件</span></summary>
            <div class="content-container">
                <p>常用电脑软件和工具集合</p>
                <details class="indent-level-2">
                    <summary><span class="folder-icon" data-level="2" style="cursor: pointer;"></span><span class="clickable-title">浏览器</span></summary>
                    <div class="content-container">
                        <ul>
                            <li>✅ <a href="https://www.google.com/chrome" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                            <li>✅ <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                        </ul>
                    </div>
                </details>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">03 手机软件</span></summary>
            <div class="content-container">
                <p>手机应用和工具推荐</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">04 全端软件</span></summary>
            <div class="content-container">
                <p>跨平台软件集合</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">05 实用网站</span></summary>
            <div class="content-container">
                <p>实用在线工具和网站</p>
                <details class="indent-level-2">
                    <summary><span class="folder-icon" data-level="2" style="cursor: pointer;"></span><span class="clickable-title">在线工具</span></summary>
                    <div class="content-container">
                        <ul>
                            <li>✅ <a href="https://www.baidu.com" target="_blank" rel="noopener noreferrer">百度搜索</a></li>
                            <li>✅ <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google搜索</a></li>
                        </ul>
                    </div>
                </details>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">06 影音专区</span></summary>
            <div class="content-container">
                <p>影视、音乐、动漫资源</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">07 游戏专栏</span></summary>
            <div class="content-container">
                <p>游戏资源和攻略</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">08 冷门网站</span></summary>
            <div class="content-container">
                <p>有趣的冷门网站</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">09 资源套萃</span></summary>
            <div class="content-container">
                <p>精选资源合集</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">10 共同进步</span></summary>
            <div class="content-container">
                <p>学习交流和分享</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">┄┄✂┄┄</span></summary>
            <div class="content-container"></div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">11 小帅随笔</span></summary>
            <div class="content-container">
                <p>个人随笔和思考</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">12 学习指南</span></summary>
            <div class="content-container">
                <p>学习资源和教程</p>
            </div>
        </details>

        <details class="indent-level-1">
            <summary><span class="folder-icon" data-level="1" style="cursor: pointer;"></span><span class="clickable-title">13 加密内容</span></summary>
            <div class="content-container">
                <p>需要密码访问的内容</p>
            </div>
        </details>

        <div class="wechat-section">
            <div class="wechat-title">欢迎关注我的公众号：小帅随笔</div>
            <div class="wechat-title">访问量:<span id="busuanzi_value_page_pv"></span>次 | 访客数:<span id="busuanzi_value_site_uv"></span>人</div>
        </div>
        <button class="recent-updates-button" title="查看最近更新">🚴‍♀️</button>
        <button class="sidebar-toggle" onclick="toggleSidebar()">☰</button>
        <div id="sidebar" class="sidebar-ad">
            <div class="sidebar-header">
                <h3>快捷链接</h3>
            </div>
            <div class="sidebar-body">
                <div class="link-section">
                    <h4>常用站点</h4>
                    <ul>
                        <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google</a></li>
                        <li><a href="https://www.bing.com" target="_blank" rel="noopener noreferrer">Bing</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '💧';
    }
}

function expandAll() {
    if (isExpanding) return;
    isExpanding = true;
    const details = document.querySelectorAll('details');
    details.forEach(d => d.open = true);
    isExpanding = false;
}

function collapseAll() {
    if (isCollapsing) return;
    isCollapsing = true;
    const details = document.querySelectorAll('details');
    details.forEach(d => d.open = false);
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
    const options = document.querySelectorAll('.search-type-option');
    options.forEach(opt => opt.classList.remove('selected'));
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
    
    content.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            highlightElements.push(el);
            el.innerHTML = el.innerHTML.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
        }
    });
    
    highlightIndex = 0;
    updateHighlight();
}

function updateHighlight() {
    highlightElements.forEach((el, idx) => {
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
    document.querySelectorAll('#engineDropdown input[type="checkbox"]:checked').forEach(cb => {
        engines.push(cb.value);
    });
    
    if (engines.length === 0) {
        alert('请至少选择一个搜索引擎');
        return;
    }
    
    const firstEngine = engines[0];
    let url = '';
    
    switch(firstEngine) {
        case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; break;
        case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
        case 'baidu': url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`; break;
        case 'ddgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
        default: url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    }
    
    window.open(url, '_blank');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

document.addEventListener('keydown', (e) => {
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

document.addEventListener('click', (e) => {
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

const recommendedEngines = ['bing', 'google', 'weixin', '52pojie', 'linuxdo', 'bilibili'];

document.getElementById('selectRecommendedEngines').addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('#engineDropdown input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (recommendedEngines.includes(cb.value)) {
            cb.checked = e.target.checked;
        }
    });
    updateEngineSelectionText();
});

document.getElementById('selectAllEngines').addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('#engineDropdown input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
    updateEngineSelectionText();
});

document.querySelectorAll('#engineDropdown input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateEngineSelectionText);
});

function updateEngineSelectionText() {
    const checked = document.querySelectorAll('#engineDropdown input[type="checkbox"]:checked');
    document.getElementById('engineSelectionText').textContent = `已选择 ${checked.length} 个引擎`;
}

document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});