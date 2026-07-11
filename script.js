        let highlightIndex = -1;
        let highlightElements = [];
        let isExpanding = false;
        let isCollapsing = false;
        let searchType = 'partial';

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
