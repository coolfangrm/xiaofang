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

// =========================================
// 简易 Markdown 解析器 (将 MD 转为 侧边栏+内容)
// =========================================
function parseMarkdownToHTML(md) {
    const lines = md.split('\n');
    let sidebarHtml = '<ul class="sidebar-menu">';
    let contentHtml = '';
    let currentCategory = '';

    lines.forEach(line => {
        // 处理一级标题 (作为大分类)
        if (line.startsWith('# ')) {
            const title = line.replace('# ', '');
            const id = generateId(title);
            
            // 侧边栏增加分类入口
            sidebarHtml += `<li class="category-item"><a href="#${id}">${title}</a></li>`;
            
            // 内容区增加分类区块
            contentHtml += `<section id="${id}" class="category-section"><h2>${title}</h2><div class="link-grid">`;
            currentCategory = id;
        } 
        // 处理二级标题 (作为子分类)
        else if (line.startsWith('## ')) {
            const subTitle = line.replace('## ', '');
            contentHtml += `<h3 class="sub-title">${subTitle}</h3>`;
        }
        // 处理列表项 (具体的链接)
        else if (line.startsWith('- ')) {
            const item = parseLinkItem(line);
            contentHtml += item;
        }
    });

    sidebarHtml += '</ul>';
    contentHtml += '</div></section>'; // 闭合最后的标签

    return `<aside class="sidebar">${sidebarHtml}</aside><main class="content">${contentHtml}</main>`;
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
