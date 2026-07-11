# 小方同学的储物间

> 一个基于纯 HTML/CSS/JS 的树形目录导航网站，复刻自 [xiaoshuai.link/locker](https://xiaoshuai.link/locker/) 的设计。

## 项目结构

```
my-locker/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 交互逻辑
├── data/
│   └── content.md      # Markdown 数据文件（核心内容）
├── assets/
│   └── favicon.ico     # 网站图标
└── README.md           # 说明文档
```

## 功能特性

- **树形目录结构** - 支持多层级文件夹嵌套展开/折叠
- **本站搜索** - 高亮匹配搜索词，上一个/下一个导航
- **联网搜索** - 支持 13 个搜索引擎（必应、Google、百度等）多选
- **帅盘搜索** - 网盘资源搜索（夸克、百度等）
- **聚合搜索** - 多网盘聚合搜索
- **明暗主题切换** - 支持手动切换和系统跟随
- **侧边栏** - 快捷链接浮动侧边栏
- **移动端适配** - 响应式设计，完美适配手机
- **访问统计** - 集成不蒜子访客统计

## 快速开始

### 本地预览

直接用浏览器打开 `index.html` 即可，或使用本地服务器：

```bash
# Node.js
npx serve .

# 或 Python
python -m http.server 8080
```

### 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 进入仓库 Settings > Pages
3. Source 选择 `main` 分支，目录选 `/ (root)`
4. 保存后等待部署完成

## 自定义内容

编辑 `data/content.md` 修改目录结构和链接内容。

## 技术栈

- HTML5 `<details>` / `<summary>` 原生折叠组件
- CSS3 变量（暗色主题）
- 原生 JavaScript（无框架依赖）
- Google Fonts (Noto Sans SC)

## License

MIT
