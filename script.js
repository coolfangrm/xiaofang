// 1. 加载 Markdown 文件并渲染
async function loadContent() {
    const response = await fetch('data/content.md');
    const markdown = await response.text();
    const html = marked.parse(markdown);
    document.getElementById('content').innerHTML = html;
    buildNavTree(); // 生成导航树
}

// 2. 根据标题层级自动生成导航树
function buildNavTree() {
    const headings = document.querySelectorAll('#content h1, #content h2, #content h3');
    const navTree = document.getElementById('navTree');
    navTree.innerHTML = '';

    headings.forEach(heading => {
        const li = document.createElement('li');
        li.className = `nav-item level-${heading.tagName[1]}`;
        li.textContent = heading.textContent;
        li.onclick = () => heading.scrollIntoView({ behavior: 'smooth' });
        navTree.appendChild(li);
    });
}

// 3. 实时搜索功能
document.getElementById('searchInput').addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('#content li');
    let count = 0;

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (keyword && text.includes(keyword)) {
            item.classList.add('highlight');
            count++;
        } else {
            item.classList.remove('highlight');
        }
    });

    document.getElementById('searchCount').textContent = 
        keyword ? `找到 ${count} 条结果` : '';
});

// 4. 主题切换
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// 初始化
loadContent();
