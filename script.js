// =========================================
// 核心配置与初始化
// =========================================
const CONFIG = {
    dataUrl: 'data/content.md', // 你的Markdown数据文件路径
    rootId: 'app',              // 挂载点的ID
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    try {
        // 1. 获取Markdown内容
        const response = await fetch(CONFIG.dataUrl);
        if (!response.ok) throw new Error('无法加载数据文件');
        const markdownText = await response.text();

        // 2. 解析并渲染 (这里使用简单的正则解析，也可以引入 marked.js)
        const htmlContent = parseMarkdownToHTML(markdownText);
        
        // 3. 插入页面
        document.getElementById(CONFIG.rootId).innerHTML = htmlContent;

        // 4. 绑定交互事件 (折叠/搜索)
        bindEvents();
        
    } catch (error) {
        console.error(error);
        document.getElementById(CONFIG.rootId).innerHTML = `<p style="color:red">加载失败: ${error.message}</p>`;
    }
}

// 简单的 Markdown 解析器 (替换掉你原来的解析逻辑)
function parseMarkdownToHTML(md) {
    const lines = md.split('\n');
    let html = '';
    let currentCategory = '';
    let currentSub = '';
    let gridOpen = false;

    // 辅助函数：关闭当前的网格
    const closeGrid = () => {
        if (gridOpen) {
            html += '</div>'; // 关闭 grid
            gridOpen = false;
        }
    };

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // 1. 一级标题 (## 影视资源) -> 新的大板块
        if (line.startsWith('## ')) {
            closeGrid();
            currentCategory = line.replace('## ', '');
            html += `<section class="category-section">`;
            html += `<h2 class="category-title">${currentCategory}</h2>`;
        } 
        // 2. 二级标题 (### 在线看剧) -> 子标题
        else if (line.startsWith('### ')) {
            closeGrid();
            currentSub = line.replace('### ', '');
            html += `<h3 class="sub-category-title">${currentSub}</h3>`;
        } 
        // 3. 列表项 (- [x] ...) -> 卡片
        else if (line.startsWith('- ')) {
            // 如果还没开始网格，就开启一个
            if (!gridOpen) {
                html += `<div class="card-grid">`;
                gridOpen = true;
            }

            // 解析链接内容
            const content = line.replace('- ', '').replace(/\[x\]|\[\]/g, '').trim();
            // 简单分割：假设格式是 "图标 标题 描述" 或者直接是链接
            // 这里做一个通用处理：如果是链接 [Title](Url)
            let title = content;
            let url = '#';
            let desc = '';

            // 尝试提取 Markdown 链接 [Title](Url)
            const linkMatch = content.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                title = linkMatch[1];
                url = linkMatch[2];
            } else {
                // 如果不是链接格式，就纯文本显示
                title = content;
            }

            // 生成卡片 HTML
            html += `
            <a href="${url}" target="_blank" class="resource-card">
                <div class="card-icon">🔗</div>
                <div class="card-info">
                    <h4>${title}</h4>
                    <p>${desc || '点击访问资源'}</p>
                </div>
            </a>`;
        }
    });

    closeGrid(); // 最后记得关闭所有标签
    html += `</section>`; 
    
    return html;
}
// 解析单行链接数据: - ✅ <名称> - 描述
function parseLinkItem(line) {
    // 简单的正则提取
    const statusMatch = line.match(/([✅❌])/);
    const nameMatch = line.match(/<([^>]+)>/);
    const urlMatch = line.match(/\(([^)]+)\)/); // 假设链接在括号里，或者你可以改为直接解析文本
    
    // 注意：如果你的MD格式是纯文本链接 [Name](URL)，需要调整这里的正则
    // 这里演示适配你之前提供的格式：- ✅ <名称> - 描述 (URL)
    
    const status = statusMatch ? statusMatch[1] : '';
    const name = nameMatch ? nameMatch[1] : '未知链接';
    
    // 尝试提取 URL (假设格式包含 URL)
    // 如果之前的 MD 模板没有 URL，这里建议改为：- ✅ [名称](URL) - 描述
    // 下面是一个兼容性较强的提取逻辑：
    let url = '#';
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/; // 标准 MD 链接
    const simpleRegex = /<([^>]+)>.*?\((https?:\/\/[^)]+)\)/; // 自定义格式

    if (linkRegex.test(line)) {
        const match = line.match(linkRegex);
        url = match[2];
    } else if (simpleRegex.test(line)) {
        const match = line.match(simpleRegex);
        url = match[2];
    }

    return `
        <a href="${url}" target="_blank" class="link-card ${status === '❌' ? 'disabled' : ''}">
            <span class="status-icon">${status}</span>
            <div class="info">
                <span class="name">${name}</span>
                <span class="desc">${line.split('-').pop().trim()}</span>
            </div>
        </a>
    `;
}

function generateId(text) {
    return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, '-');
}

// =========================================
// 交互逻辑
// =========================================
function bindEvents() {
    // 平滑滚动
    document.querySelectorAll('.sidebar-menu a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 简单的深色模式切换 (可选)
    // 可以在 HTML 中加一个按钮触发 toggleTheme()
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
}
