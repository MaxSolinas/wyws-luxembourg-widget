(function() {
    // -----------------------------------------------------------
    // CONFIGURATION
    // -----------------------------------------------------------
    const CONFIG = {
        containerId: 'wyws-luxembourg-widget',
        // URL du fichier GeoJSON (Vérifiez que ce lien est toujours valide)
        apiUrl: 'https://download.data.public.lu/resources/durete-de-leau/20251111-020330/wasserharte.geojson',
        vdlLink: 'https://www.vdl.lu/fr/vivre/domicile-au-quotidien/verifier-la-qualite-de-leau-chez-soi#',
        quoteLink: '/durete-de-leau-au-luxembourg#Obtenez-votre-devis'
    };

    // -----------------------------------------------------------
    // STYLES CSS
    // -----------------------------------------------------------
    const css = `
        #wyws-luxembourg-container {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #e1e4e8;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            overflow: visible; text-align: center; position: relative;
        }
        .kw-header { padding: 30px 20px 10px; border-radius: 12px 12px 0 0; }
        .kw-headline { text-transform: uppercase; line-height: 1.1; color: #00ADEF; font-size: 2.2rem; margin: 0; }
        .kw-top-line { font-weight: 800; display: block; }
        .kw-second-line { display: block; color: #0054A4; }
        .kw-word-water { font-weight: 400; } 
        .kw-word-score { font-weight: 800; }
        .kw-tm { font-size: 0.3em; vertical-align: top; position: relative; top: 0.1em; font-weight: 400; margin-left: 2px; line-height: 1; }
        .kw-subtext { color: #666; margin-top: 10px; font-size: 0.95rem; }
        .kw-search-area { padding: 0 30px 20px; position: relative; }
        .kw-input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 50px; font-size: 16px; outline: none; text-align: center; transition: 0.3s; }
        .kw-input:focus { border-color: #0054A4; box-shadow: 0 0 0 3px rgba(0, 84, 164, 0.1); }
        .kw-suggestions { position: absolute; top: 65px; left: 30px; right: 30px; background: white; border: 1px solid #cce4f7; z-index: 9999; max-height: 250px; overflow-y: auto; box-shadow: 0 15px 30px rgba(0,0,0,0.15); display: none; border-radius: 8px; }
        .kw-suggestion-item { padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #f0f0f0; text-align: left; }
        .kw-suggestion-item:hover { background: #f0f7ff; color: #0054A4; }
        .kw-result-panel { display: none; padding: 0 20px 30px; animation: kw-fadein 0.6s ease-out; }
        .kw-commune-title { font-size: 1.3rem; font-weight: bold; color: #0054A4; margin-top: 10px; }
        .kw-zone-info { font-size: 0.9rem; color: #666; margin-bottom: 20px; font-style: italic; }
        .kw-slider-container { position: relative; height: 60px; margin: 40px 10px; }
        .kw-slider-bar { height: 40px; width: 100%; border-radius: 4px; background: linear-gradient(90deg, #F57F20 0%, #E5007E 50%, #00ADEF 100%); position: relative; top: 10px; }
        .kw-grid-lines { position: absolute; top: 10px; left: 0; width: 100%; height: 40px; display: flex; justify-content: space-between; pointer-events: none; }
        .kw-line { width: 1px; background: rgba(255,255,255,0.4); height: 100%; }
        .kw-water-drop { position: absolute; top: -15px; transform: translateX(-50%); width: 50px; height: 65px; transition: left 1.5s cubic-bezier(0.22, 1, 0.36, 1); z-index: 10; filter: drop-shadow(0 3px 5px rgba(0,0,0,0.2)); }
        .kw-drop-shape { width: 42px; height: 42px; background: #00ADEF; border-radius: 0 50% 50% 50%; transform: rotate(45deg); margin: 0 auto; border: 3px solid white; transition: background 1.5s; }
        .kw-drop-value { position: absolute; top: 13px; left: 0; width: 100%; text-align: center; color: white; font-weight: 800; font-size: 15px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .kw-labels { display: flex; justify-content: space-between; margin-top: 15px; color: #999; font-size: 11px; font-weight: bold; padding: 0 2px; }
        .kw-message-box { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 25px; }
        .kw-cta-button { display: none; margin-top: 15px; background: #0054A4; color: white; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
        .kw-cta-button:hover { background: #003d7a; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,84,164,0.3); }
        .kw-redirect-btn { display: inline-block; background-color: #00ADEF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; transition: background-color 0.3s; }
        .kw-redirect-btn:hover { background-color: #005bb8; }
        .kw-footer-block { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
        .kw-dealer-info { font-size: 11px; color: #555; font-weight: 400; font-family: Arial, sans-serif; line-height: 1.4; display: block; }
        .kw-source-data { font-size: 9px; color: #aaa; margin-top: 10px; display: block; }
        .kw-loader { color: #888; display: none; margin: 20px; font-style: italic; }
        .kw-error-msg { color: #d32f2f; display: none; margin: 20px; font-weight: bold; padding: 10px; background: #fff5f5; border-radius: 5px; }
        @keyframes kw-fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;

    // -----------------------------------------------------------
    // STRUCTURE HTML
    // -----------------------------------------------------------
    const htmlTemplate = `
        <div id="wyws-luxembourg-container">
            <div class="kw-header">
                <h2 class="kw-headline">
                    <span class="kw-top-line">WHAT'S YOUR</span>
                    <span class="kw-second-line">
                        <span class="kw-word-water">WATER</span> <span class="kw-word-score">SCORE?<sup class="kw-tm">TM</sup></span>
                    </span>
                </h2>
                <div class="kw-subtext">Découvrez la qualité de votre eau en quelques secondes.</div>
            </div>

            <div class="kw-search-area">
                <input type="text" id="kw-input-lux" class="kw-input" placeholder="Ex: Bertrange..." autocomplete="off">
                <div id="kw-suggestions-lux" class="kw-suggestions"></div>
                <div id="kw-loader-lux" class="kw-loader">Chargement des données...</div>
                <div id="kw-error-lux" class="kw-error-msg"></div>
            </div>

            <div id="kw-result-lux" class="kw-result-panel">
                <div id="kw-commune-display" class="kw-commune-title"></div>

                <div id="kw-score-container">
                    <div class="kw-slider-container">
                        <div class="kw-slider-bar">
                            <div class="kw-grid-lines">
                                <div class="kw-line"></div><div class="kw-line"></div><div class="kw-line"></div>
                                <div class="kw-line"></div><div class="kw-line"></div><div class="kw-line"></div>
                                <div class="kw-line"></div><div class="kw-line"></div>
                            </div>
                        </div>
                        <div id="kw-drop-lux" class="kw-water-drop">
                            <div id="kw-drop-shape-lux" class="kw-drop-shape"></div>
                            <div id="kw-score-val-lux" class="kw-drop-value">--</div>
                        </div>
                        <div class="kw-labels">
                            <span>30</span><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span><span>90</span><span>100</span>
                        </div>
                    </div>
                    <div class="kw-message-box">
                        <strong id="kw-title-lux" style="font-size: 1.2em; display:block; margin-bottom:8px;"></strong>
                        <p id="kw-desc-lux" style="font-size: 0.95em; color:#555; margin:0; line-height: 1.5;"></p>
                        <a href="${CONFIG.quoteLink}" id="kw-cta-btn-lux" class="kw-cta-button">RAISE YOUR WATER SCORE TODAY!</a>
                    </div>
                </div>

                <div id="kw-vdl-container" style="display:none; text-align: center; margin-top:20px;">
                    <p style="color:#666;">La Ville de Luxembourg possède un réseau complexe avec plusieurs sources d'eau différentes.</p>
                    <a href="${CONFIG.vdlLink}" target="_blank" class="kw-redirect-btn">Vérifier mon adresse précise sur vdl.lu</a>
                </div>

                <div class="kw-footer-block">
                    <div class="kw-dealer-info">
                        Aqua Purify<br>Authorized, Independent Kinetico Dealer
                    </div>
                    <span class="kw-source-data">Données : data.public.lu / Administration de la gestion de l'eau</span>
                </div>
            </div>
        </div>
    `;

    // -----------------------------------------------------------
    // LOGIQUE
    // -----------------------------------------------------------
    function initWidget() {
        const root = document.getElementById(CONFIG.containerId);
        if (!root) return; 

        const styleTag = document.createElement('style');
        styleTag.textContent = css;
        document.head.appendChild(styleTag);

        root.innerHTML = htmlTemplate;

        // Variables
        const input = document.getElementById('kw-input-lux');
        const suggestions = document.getElementById('kw-suggestions-lux');
        const resultPanel = document.getElementById('kw-result-lux');
        const loader = document.getElementById('kw-loader-lux');
        const errorMsg = document.getElementById('kw-error-lux');
        const displayCommune = document.getElementById('kw-commune-display');
        const scoreContainer = document.getElementById('kw-score-container');
        const vdlContainer = document.getElementById('kw-vdl-container');
        const drop = document.getElementById('kw-drop-lux');
        const dropShape = document.getElementById('kw-drop-shape-lux');
        const scoreVal = document.getElementById('kw-score-val-lux');
        const titleEl = document.getElementById('kw-title-lux');
        const descEl = document.getElementById('kw-desc-lux');
        const ctaBtn = document.getElementById('kw-cta-btn-lux');

        let communesData = [];

        // LOAD DATA
        async function loadData() {
            try {
                loader.style.display = 'block';
                errorMsg.style.display = 'none';
                
                const response = await fetch(CONFIG.apiUrl);
                if (!response.ok) throw new Error('Impossible de contacter le serveur de données (404/500).');
                
                const geoData = await response.json();
                
                const communesMap = new Map();
                if(geoData.features) {
                    geoData.features.forEach(feature => {
                        const name = feature.properties['trinkwasser.GISADMIN.DWDnationalReportingDurete.Commune'];
                        const th = feature.properties['trinkwasser.GISADMIN.DWDnationalReportingDurete.WSZDurete'];
                        if (name && !name.startsWith('*')) {
                            if (!communesMap.has(name)) {
                                communesMap.set(name, { name: name, th: th !== null ? th : 0 });
                            }
                        }
                    });
                }
                
                communesData = Array.from(communesMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
                loader.style.display = 'none';
                
                if(communesData.length === 0) {
                    throw new Error("Fichier de données vide ou mal formaté.");
                }

            } catch (e) {
                console.error("Widget Error:", e);
                loader.style.display = 'none';
                errorMsg.innerHTML = "Les données sont temporairement indisponibles.<br>Veuillez réessayer plus tard.";
                errorMsg.style.display = 'block';
            }
        }

        // SEARCH
        input.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            resultPanel.style.display = 'none';
            if(val.length < 2) { suggestions.style.display = 'none'; return; }
            
            // Sécurité si les données ne sont pas chargées
            if(!communesData || communesData.length === 0) return;

            const matches = communesData.filter(c => c.name.toLowerCase().includes(val)).slice(0, 8);
            renderSuggestions(matches);
        });

        function renderSuggestions(list) {
            suggestions.innerHTML = '';
            if(!list.length) { suggestions.style.display = 'none'; return; }
            list.forEach(c => {
                const div = document.createElement('div');
                div.className = 'kw-suggestion-item';
                div.textContent = c.name;
                div.onclick = () => {
                    input.value = c.name;
                    suggestions.style.display = 'none';
                    processSelection(c);
                };
                suggestions.appendChild(div);
            });
            suggestions.style.display = 'block';
        }

        function processSelection(commune) {
            displayCommune.textContent = "Qualité de l'eau à " + commune.name;
            resultPanel.style.display = 'block';
            if (commune.name === 'Luxembourg') {
                scoreContainer.style.display = 'none';
                vdlContainer.style.display = 'block';
            } else {
                vdlContainer.style.display = 'none';
                scoreContainer.style.display = 'block';
                updateScoreUI(commune.th);
            }
        }

        function updateScoreUI(thValue) {
            const th = parseFloat(thValue);
            let score;
            if (th < 5) score = 100 - (th * 2); 
            else if (th < 15) score = 96 - (th * 1.4); 
            else if (th < 30) score = 98 - (th * 1.6);
            else score = 49 - ((th - 30) * 0.4); 
            score = Math.max(30, Math.min(100, Math.round(score)));

            let color, title, text;
            if (th < 5) {
                color = '#00ADEF'; title = "EXCELLENT SCORE"; text = `Votre eau est douce (${th.toFixed(1)}°f). La qualité est idéale pour vos appareils.`; ctaBtn.style.display = 'none';
            } else if (th < 15) {
                color = '#00ADEF'; title = "BON SCORE, MAIS..."; text = `Votre eau est peu calcaire (${th.toFixed(1)}°f). Votre confort pourrait tout de même être amélioré avec un adoucisseur d'eau.`; ctaBtn.style.display = 'inline-block';
            } else if (th < 30) {
                color = '#E5007E'; title = "ADOUCISSEUR RECOMMANDÉ"; text = `Votre eau est calcaire (${th.toFixed(1)}°f). Un adoucisseur d'eau est vivement recommandé pour protéger votre maison.`; ctaBtn.style.display = 'inline-block';
            } else {
                color = '#F57F20'; title = "ADOUCISSEUR INDISPENSABLE"; text = `Votre eau est très dure (${th.toFixed(1)}°f). L'installation d'un adoucisseur d'eau est impérative pour éviter les dégâts.`; ctaBtn.style.display = 'inline-block';
            }

            titleEl.textContent = title;
            titleEl.style.color = color;
            descEl.textContent = text;
            scoreVal.textContent = score;
            dropShape.style.background = color;
            dropShape.style.borderColor = "white";
            const percent = ((score - 30) / 70) * 100;
            drop.style.left = `${percent}%`;
        }

        document.addEventListener('click', (e) => {
            if(input && suggestions && !input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });

        loadData();
    }

    let attempts = 0;
    const interval = setInterval(function() {
        const root = document.getElementById(CONFIG.containerId);
        if (root) {
            clearInterval(interval);
            initWidget();
        }
        attempts++;
        if (attempts > 30) clearInterval(interval);
    }, 300);

})();
