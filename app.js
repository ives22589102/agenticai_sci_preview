'use strict';

const VERSIONS = Object.freeze({
    scoring: 'sci-index-v4',
    workflows: 'workflow-model-v1',
    recipes: 'recipes-v1',
    hardware: 'hardware-v3'
});

const SCI_CONFIG = Object.freeze({
    scaleMax: 100
});

const COST_PERIOD_HOURS = Object.freeze({ hour: 1, week: 40, month: 160 });
const TOKEN_CONFIG = Object.freeze({ twdPerMillionTokens: 190 });

function twdToTokens(twd) {
    return twd / TOKEN_CONFIG.twdPerMillionTokens * 1000000;
}

const personaCatalog = Object.freeze({
    soho: {
        name: 'SOHO 自由工作者',
        short: 'SOHO',
        icon: 'S',
        description: '接案、內容、設計與個人事業工作者',
        note: '以個人工作流程與專案交付為主',
        roleTags: [
            ['creative', '影音與設計'],
            ['content', '內容與行銷'],
            ['admin', '接案與行政']
        ]
    },
    edu: {
        name: 'Education 教育與學習',
        short: 'Education',
        icon: 'E',
        description: '教師、學生與研究工作者',
        note: '以教學、學習與研究流程為主',
        roleTags: [
            ['teacher', '教師'],
            ['student', '學生'],
            ['research', '研究人員']
        ]
    },
    smb: {
        name: 'SMB 中小企業與團隊',
        short: 'SMB',
        icon: 'B',
        description: '電商、行銷、客服與營運團隊',
        note: '以團隊協作與營運資料為主',
        roleTags: [
            ['commerce', '電商與業務'],
            ['marketing', '行銷與客服'],
            ['operations', '行政與營運']
        ]
    }
});

const scaleDescriptions = Object.freeze({
    S01: ['5 張票據', '10 張票據', '30 張票據'],
    S02: ['5 分鐘素材／1 支短片', '10 分鐘素材／1 支短片', '30 分鐘素材／3 支短片'],
    S03: ['1 案、簡單範本', '1 案、客製需求', '1 案、多階段需求'],
    S04: ['1 個版本', '3 個版本', '6 個版本'],
    S05: ['1 個尺寸', '3 個尺寸', '6 個尺寸'],
    S06: ['15 分鐘錄音', '30 分鐘錄音', '90 分鐘錄音'],
    S07: ['5 則訊息', '10 則訊息', '30 則訊息'],
    S08: ['簡單修改', '1 個小模組', '跨模組修改'],
    E01: ['1 篇 PDF／5 題', '3 篇 PDF／10 題', '10 篇 PDF／30 題'],
    E02: ['5 頁投影片', '15 頁投影片', '30 頁投影片'],
    E03: ['5 份作業', '10 份作業', '30 份作業'],
    E04: ['1 千列資料', '1 萬列資料', '10 萬列資料'],
    E05: ['15 分鐘錄音', '30 分鐘錄音', '90 分鐘錄音'],
    E06: ['10 題', '20 題', '50 題'],
    E07: ['簡單修改', '1 個小模組', '跨模組修改'],
    E08: ['10 筆資料', '20 筆資料', '60 筆資料'],
    B01: ['20 筆訂單', '100 筆訂單', '500 筆訂單'],
    B02: ['5 商品／20 評論', '10 商品／50 評論', '30 商品／200 評論'],
    B03: ['1 個部門', '3 個部門', '6 個部門'],
    B04: ['5 件工單', '20 件工單', '100 件工單'],
    B05: ['3 項商品', '10 項商品', '30 項商品'],
    B06: ['3 頁合約', '10 頁合約', '30 頁合約'],
    B07: ['1 筆、3 類', '1 筆、8 類', '5 筆、8 類'],
    B08: ['15 分鐘錄音', '30 分鐘錄音', '90 分鐘錄音']
});

function makeRecipe(id, persona, title, workUnit, assist, review, manual, _legacyAgentMinutes, profiles, cloneTag, roleTags, featured = false, tiers = [1, 1, 2]) {
    const descriptions = scaleDescriptions[id];
    return Object.freeze({
        id, persona, title, workUnit, assist, review, profiles, cloneTag, roleTags, featured,
        evidenceStatus: 'heuristic',
        integrationStatus: 'export-only',
        softwareValidationStatus: 'pending',
        recipeVersion: '1.0',
        scales: Object.freeze({
            small: Object.freeze({ label: '低負載', description: descriptions[0], manualMinutes: manual * 0.6, baseTier: tiers[0] }),
            standard: Object.freeze({ label: '中負載', description: descriptions[1], manualMinutes: manual, baseTier: tiers[1] }),
            large: Object.freeze({ label: '高負載', description: descriptions[2], manualMinutes: manual * 2.5, baseTier: tiers[2] })
        })
    });
}

const recipeCatalog = Object.freeze([
    makeRecipe('S01', 'soho', '票據整理與記帳', '10 張票據', '欄位辨識、分類、重複提示與表格草稿', '金額、稅別、分類與異常', 25, 8, ['document', 'analytics'], '票據整理分身', ['admin'], true),
    makeRecipe('S02', 'soho', '短影音多平台內容準備', '10 分鐘素材，產出 1 支短片', '候選剪輯、字幕、尺寸版本、文案與排程草稿', '剪輯品質、字幕、版權與發布', 90, 25, ['media', 'document'], '影音內容分身', ['creative', 'content'], true, [1, 2, 3]),
    makeRecipe('S03', 'soho', '客製化報價與時程', '1 個專案', '需求整理、規則計價、排程與報價草稿', '價格、範圍、可行性與寄送', 30, 10, ['document', 'analytics'], '報價企劃分身', ['admin'], true),
    makeRecipe('S04', 'soho', '社群內容企劃與版本改寫', '1 個主題、3 個版本', '彙整需求、初稿、平台版本與檢核表', '溝通策略與品牌審稿', 45, 18, ['document'], '內容企劃分身', ['content']),
    makeRecipe('S05', 'soho', '設計素材版本與輸出', '1 個主視覺、3 個尺寸', '素材整理、尺寸版型、候選修圖與輸出清單', '產品細節與視覺品質', 60, 25, ['media'], '視覺版本分身', ['creative'], false, [1, 2, 3]),
    makeRecipe('S06', 'soho', '訪談逐字稿與內容整理', '30 分鐘錄音', '轉錄、段落、重點、待辦與引用候選', '人名、數字與原意核對', 60, 15, ['media', 'knowledge'], '訪談整理分身', ['content']),
    makeRecipe('S07', 'soho', '客戶需求與專案追蹤', '1 專案、10 則訊息', '整理需求、缺漏、待辦與進度草稿', '客戶承諾與優先順序', 30, 10, ['document', 'monitoring'], '專案追蹤分身', ['admin']),
    makeRecipe('S08', 'soho', '網頁／程式維護協助', '1 個小功能', '需求整理、修改草稿、檢查與測試建議', '驗證、合併與發布', 60, 30, ['coding'], '程式維護分身', ['creative']),

    makeRecipe('E01', 'edu', '文獻摘要與測驗草稿', '3 篇 PDF、10 題', '來源定位、摘要、概念分類、題目與答案草稿', '引用、答案與學術判斷', 60, 25, ['knowledge', 'document'], '文獻研究分身', ['student', 'research'], true),
    makeRecipe('E02', 'edu', '備課簡報與 LMS 內容', '1 課、15 頁投影片', '教案、投影片、講義與 LMS 待上傳內容', '教材適切性、內容正確性與發布', 120, 40, ['document', 'knowledge'], '備課教材分身', ['teacher'], true),
    makeRecipe('E03', 'edu', '作業格式與異常提示', '10 份作業', '規則比對、缺漏、相似內容提示與異常清單', '逐案查證、原創性判斷與正式評分', 45, 20, ['document', 'knowledge'], '作業檢核分身', ['teacher'], true),
    makeRecipe('E04', 'edu', '研究資料清理與圖表', '1 個 CSV、1 萬列', '缺值、格式、描述統計與圖表草稿', '分析方法與結論', 90, 35, ['analytics', 'coding'], '研究資料分身', ['research']),
    makeRecipe('E05', 'edu', '課堂／研究會議整理', '30 分鐘錄音', '轉錄、章節、待辦與複習摘要', '重點與內容核對', 60, 15, ['media', 'knowledge'], '會議整理分身', ['teacher', 'research']),
    makeRecipe('E06', 'edu', '學習計畫與錯題整理', '20 題', '錯題分類、解題草稿與複習安排', '解法驗證與真正理解', 45, 20, ['document', 'knowledge'], '學習規劃分身', ['student']),
    makeRecipe('E07', 'edu', '程式作業與研究程式協助', '1 個小模組', '程式草稿、Debug 提示、測試與註解', '正確性、可重現性與作業規則', 90, 40, ['coding'], '程式研究分身', ['student', 'research']),
    makeRecipe('E08', 'edu', '教學／研究行政資料整理', '20 筆資料', '欄位整理、名單、通知草稿與缺漏提示', '個資、名單與寄送', 40, 12, ['document', 'analytics'], '教研行政分身', ['teacher', 'research']),

    makeRecipe('B01', 'smb', '訂單整理與對帳', '100 筆訂單', '欄位映射、去重、對帳與匯入草稿', '差異訂單與正式寫入／開票', 60, 20, ['analytics', 'monitoring'], '訂單對帳分身', ['commerce'], true),
    makeRecipe('B02', 'smb', '競品與市場週報', '10 商品、50 則評論', '價格快照、評論分類、來源與報告草稿', '商品對應、來源偏誤與市場解讀', 180, 45, ['monitoring', 'knowledge', 'analytics'], '市場情報分身', ['marketing'], true),
    makeRecipe('B03', 'smb', '跨部門報表', '3 部門、1 份報告', '匯總、口徑統一、缺漏、圖表與摘要草稿', '數字、指標口徑與決策內容', 90, 30, ['analytics', 'document'], '營運報表分身', ['operations'], true),
    makeRecipe('B04', 'smb', '客服工單分類與回覆草稿', '20 件工單', '分類、知識查找、回覆草稿與升級事件', '非標準問題、退款與承諾', 60, 25, ['knowledge', 'monitoring'], '客服協作分身', ['marketing']),
    makeRecipe('B05', 'smb', '商品上架內容與圖片版本', '10 項商品', '規格整理、文案、圖檔與上架草稿', '規格、價格與發布', 90, 30, ['document', 'media'], '商品內容分身', ['commerce'], false, [1, 2, 3]),
    makeRecipe('B06', 'smb', '合約條款差異整理', '2 個版本、10 頁', '差異、缺漏、條款索引與待確認項', '專業審閱與法律判斷', 60, 30, ['knowledge', 'document'], '合約整理分身', ['operations']),
    makeRecipe('B07', 'smb', '費用分攤與請款資料', '1 筆、8 類', '規則分配、整數調整與表單草稿', '預算歸屬與請款核准', 30, 10, ['analytics', 'document'], '費用整理分身', ['operations']),
    makeRecipe('B08', 'smb', '會議與跨部門待辦追蹤', '30 分鐘錄音', '轉錄、決議、負責人與待辦更新草稿', '決議、權責與通知', 60, 18, ['media', 'monitoring', 'document'], '會議追蹤分身', ['operations'])
]);

const hardwareCatalog = Object.freeze({
    a: Object.freeze({
        label: 'A 級影分身戰力',
        strength: Object.freeze({ grade: 'A', meter: 20, label: '初階協作', capacity: '適合日常內容、文件與單一工作流', description: '從地端文件整理、內容生成與一般資料工作開始建立影分身流程。' }),
        models: Object.freeze([
            Object.freeze({ name: 'Agent Pioneer-A', mb: 'AMD B850', cpu: 'AMD Ryzen 7 9700X', gpu: 'NVIDIA GeForce RTX 5070 12GB／RTX 5060 Ti 16GB', ram: '64GB（32GB×2）DDR5 5600／6000MHz', ssd: '2TB PCIe 4.0 NVMe M.2', case: 'ASUS PRIME AP303', cooling: 'TUF Gaming LC III 360 ARGB', psu: 'TUF GAMING 750W／850W 金牌' }),
            Object.freeze({ name: 'Agent Pioneer-I', mb: 'Intel B860', cpu: 'Intel Core Ultra 7 265K', gpu: 'NVIDIA GeForce RTX 5070 12GB／RTX 5060 Ti 16GB', ram: '64GB（32GB×2）DDR5 5600／6000MHz', ssd: '2TB PCIe 4.0 NVMe M.2', case: 'ASUS PRIME AP303', cooling: 'TUF Gaming LC III 360 ARGB', psu: 'TUF GAMING 750W／850W 金牌' })
        ]),
        components: Object.freeze({
            cpu: { amd: 'AMD Ryzen 7 9000 系列', intel: 'Intel Core Ultra 7 桌上型處理器（系列 2）' },
            mb: { amd: 'ASUS TUF Gaming B850 系列', intel: 'ASUS TUF Gaming B860 系列' },
            gpu: { all: 'ASUS GeForce RTX 5060 Ti／RTX 5070 系列' }
        })
    }),
    aplus: Object.freeze({
        label: 'A+ 級影分身戰力',
        strength: Object.freeze({ grade: 'A+', meter: 40, label: '進階協作', capacity: '適合多項內容與資料工作流', description: '提供更多顯示記憶體、系統記憶體與多工具並行空間。' }),
        models: Object.freeze([
            Object.freeze({ name: 'Agent Professional-A', mb: 'AMD B850／X870', cpu: 'AMD Ryzen 9 9900X', gpu: 'AI Pro R9700 32GB／RTX 5070 12GB／RTX 5060 Ti 16GB', ram: '64GB／128GB DDR5 6000MHz', ssd: '2TB／4TB PCIe 4.0 NVMe M.2', case: 'TUF GAMING GT502 Horizon', cooling: 'ROG STRIX LC III 360 ARGB', psu: 'ROG STRIX／TUF 850W／1000W 金牌' }),
            Object.freeze({ name: 'Agent Professional-I', mb: 'Intel Z890', cpu: 'Intel Core Ultra 7 265K', gpu: 'AI Pro R9700 32GB／RTX 5070 12GB／RTX 5060 Ti 16GB', ram: '64GB／128GB DDR5 6000MHz', ssd: '2TB／4TB PCIe 4.0 NVMe M.2', case: 'TUF GAMING GT502 Horizon', cooling: 'ROG STRIX LC III 360 ARGB', psu: 'ROG STRIX／TUF 850W／1000W 金牌' }),
            Object.freeze({ name: 'ASUS／ROG NUC', mb: '不適用（整合式系統）', cpu: 'Intel Core Ultra 9', gpu: 'NVIDIA GeForce RTX 5070 Laptop GPU 12GB GDDR7', ram: '16GB DDR5-6400 CSO-DIMM×2', ssd: '1TB M.2 2280 NVMe PCIe 4.0 SSD', case: 'NUC 整合式機身', integratedChassis: true, cooling: '整合式散熱', psu: '不適用（整合式系統）' })
        ]),
        components: Object.freeze({
            cpu: { amd: 'AMD Ryzen 9 9900X 系列', intel: 'Intel Core Ultra 7／Ultra 9 系列' },
            mb: { amd: 'ASUS ROG Strix B850／X870 系列', intel: 'ASUS ROG Strix Z890 系列' },
            gpu: { all: 'ASUS GeForce RTX 5060 Ti／RTX 5070 系列或 AI Pro R9700' }
        })
    }),
    s: Object.freeze({
        label: 'S 級影分身戰力',
        strength: Object.freeze({ grade: 'S', meter: 60, label: '高效協作', capacity: '適合高負載創作與多流程持續運行', description: '以 RTX 5090 級顯示卡與高階桌上型平台承接高負載地端模型及創作流程。' }),
        models: Object.freeze([
            Object.freeze({ name: 'Agent Master-A', mb: 'AMD X870E', cpu: 'AMD Ryzen 9 9950X', gpu: 'NVIDIA GeForce RTX 5090 32GB', ram: '64GB／128GB DDR5 6000MHz', ssd: '2TB／4TB PCIe 4.0／5.0', case: 'ROG Strix Helios', cooling: 'ProArt LC 420／ROG RYUJIN III 360 ARGB', psu: 'ROG THOR III' }),
            Object.freeze({ name: 'Agent Master-I', mb: 'Intel Z890', cpu: 'Intel Core Ultra 9 285K', gpu: 'NVIDIA GeForce RTX 5090 32GB', ram: '128GB（32GB×4）DDR5 6000MHz', ssd: '4TB PCIe 4.0／5.0', case: 'ROG Strix Helios', cooling: 'ProArt LC 420／ROG RYUJIN III 360 ARGB', psu: 'ROG THOR III 1000W／1200W' })
        ]),
        components: Object.freeze({
            cpu: { amd: 'AMD Ryzen 9 9950X 系列', intel: 'Intel Core Ultra 9 285K 系列' },
            mb: { amd: 'ASUS ROG Crosshair X870E 系列', intel: 'ASUS ROG Maximus Z890 系列' },
            gpu: { all: 'ASUS ROG Astral GeForce RTX 5090 系列' }
        })
    }),
    splus: Object.freeze({
        label: 'S+ 級影分身戰力',
        strength: Object.freeze({ grade: 'S+', meter: 80, label: '專業算力協作', capacity: '適合大型模型、專業資料與高併發工作', description: '面向工作站級顯示卡、大容量記憶體或整合式 Blackwell 平台。' }),
        models: Object.freeze([
            Object.freeze({ name: 'ET700I W7', mb: 'Intel W790', cpu: 'Intel Xeon W-3400', gpu: 'NVIDIA RTX 6000 Ada', ram: '512GB RDIMM DDR5 4800', ssd: '2TB／4TB PCIe 4.0', case: 'ROG Cronox ARGB', cooling: '不適用／依工作站配置', psu: '1300W' }),
            Object.freeze({ name: 'RTX DGX／Spark', mb: '不適用（整合式系統）', cpu: 'NVIDIA DGX／Spark', gpu: 'NVIDIA Blackwell', ram: '64GB／128GB', ssd: '1TB／2TB', case: 'DGX Spark 整合式機身', integratedChassis: true, cooling: '整合式散熱', psu: '不適用（整合式系統）' })
        ]),
        components: Object.freeze({
            cpu: { amd: 'NVIDIA GB10 Grace Blackwell Superchip', intel: 'Intel Xeon W-3400 系列', leftLabel: 'NVIDIA 平台', rightLabel: 'Intel 工作站' },
            mb: { amd: 'NVIDIA DGX Spark 整合平台', intel: 'Intel W790 工作站平台', leftLabel: 'NVIDIA 平台', rightLabel: 'Intel 工作站' },
            gpu: { all: 'NVIDIA RTX 6000 Ada／Blackwell 工作站系列' }
        })
    }),
    ss: Object.freeze({
        label: 'SS 級影分身戰力',
        strength: Object.freeze({ grade: 'SS', meter: 100, label: '極致算力協作', capacity: '適合超大型算力需求與極重工作負載', description: '為高 SCI 且需要大量影分身工作持續並行的極重度情境提供最高階地端算力。' }),
        models: Object.freeze([
            Object.freeze({ name: 'ET900N G3', mb: '整合式 NVIDIA GB300 平台', cpu: 'Grace 72-Core Neoverse V2', gpu: 'NVIDIA GB300 Grace Blackwell Ultra', ram: '748GB', ssd: '8TB', case: 'ET900N G3 整合式機箱', integratedChassis: true, cooling: '整合式散熱', psu: '1600W Titanium' })
        ]),
        components: Object.freeze({
            cpu: { all: 'NVIDIA Grace 72-Core Neoverse V2' },
            mb: { all: 'NVIDIA GB300 整合式運算平台' },
            gpu: { all: 'NVIDIA GB300 Grace Blackwell Ultra' }
        })
    })
});

const campaignConfig = Object.freeze({
    tutorials: [], promotions: [],
    productLinks: {
        systems: { a: '', aplus: '', s: '', splus: '', ss: '' },
        components: {
            a: { cpu: '', mb: '', gpu: '' },
            aplus: { cpu: '', mb: '', gpu: '' },
            s: { cpu: '', mb: '', gpu: '' },
            splus: { cpu: '', mb: '', gpu: '' },
            ss: { cpu: '', mb: '', gpu: '' }
        }
    }
});
const modeCatalog = Object.freeze({
    manual: { label: '大多手動', baselineWeight: 1, agentWeight: 0 },
    assisted: { label: 'AI 輔助，但仍手動串接', baselineWeight: 0.58, agentWeight: 0.42 },
    automated: { label: '已有自動化流程', baselineWeight: 0.18, agentWeight: 0.82 }
});

const assessmentState = {
    currentStep: 1,
    persona: null,
    roleTag: null,
    selectedRecipeIds: [],
    taskAnswers: {},
    archivedAnswers: {},
    executionNeeds: { parallelBand: '', usersBand: '' },
    costAmountTwd: '',
    costPeriod: 'hour',
    hourlyCostTwd: '',
    result: null
};

let reportPreviewUrl = null;
let lastModalTrigger = null;

const elements = {};

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    Object.assign(elements, {
        personaGrid: document.getElementById('persona-grid'),
        rolePanel: document.getElementById('role-tag-panel'),
        roleTags: document.getElementById('role-tags'),
        recipeGrid: document.getElementById('recipe-grid'),
        selectedCount: document.getElementById('selected-count'),
        taskSettings: document.getElementById('task-settings'),
        usersFieldset: document.getElementById('users-fieldset'),
        parallelOptions: document.getElementById('parallel-options'),
        usersOptions: document.getElementById('users-options'),
        hourlyCost: document.getElementById('hourly-cost'),
        costPeriod: document.getElementById('cost-period'),
        costConversion: document.getElementById('cost-conversion'),
        loadWarning: document.getElementById('load-warning'),
        backButton: document.getElementById('back-button'),
        nextButton: document.getElementById('next-button'),
        formError: document.getElementById('form-error'),
        navigation: document.getElementById('form-navigation'),
        modal: document.getElementById('modal'),
        modalPanel: document.querySelector('.modal__panel'),
        modalContent: document.getElementById('modal-content')
    });

    document.getElementById('reset-button').addEventListener('click', resetAssessment);
    elements.backButton.addEventListener('click', previousStep);
    elements.nextButton.addEventListener('click', nextStep);
    elements.hourlyCost.addEventListener('input', syncCostSettings);
    elements.costPeriod.addEventListener('change', syncCostSettings);
    document.querySelectorAll('[data-go-step]').forEach(button => {
        button.addEventListener('click', () => goToStep(Number(button.dataset.goStep)));
    });
    document.querySelectorAll('[data-progress-trigger]').forEach(button => {
        button.addEventListener('click', () => handleProgressStepClick(Number(button.dataset.progressTrigger)));
    });
    document.getElementById('result-reset-button').addEventListener('click', resetAssessment);
    document.getElementById('report-preview-button').addEventListener('click', event => previewReport(event.currentTarget));
    document.querySelector('.sci-overview').addEventListener('click', event => {
        const trigger = event.target.closest('#sci-info-trigger');
        if (trigger) openSciInfoModal(trigger);
    });
    document.getElementById('workflow-result-table').addEventListener('click', event => {
        const trigger = event.target.closest('[data-task-toggle]');
        if (trigger) toggleTaskDetail(Number(trigger.dataset.taskToggle));
    });
    document.getElementById('hardware-section').addEventListener('click', handleHardwareInteraction);
    document.getElementById('hardware-section').addEventListener('keydown', handleHardwareKeydown);
    document.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal));
    document.addEventListener('keydown', handleModalKeys);

    renderPersonaSelection();
    renderSharedOptions();
    updateStepUI(false);
}

function renderPersonaSelection() {
    elements.personaGrid.innerHTML = Object.entries(personaCatalog).map(([key, persona]) => `
        <button class="persona-card ${assessmentState.persona === key ? 'is-selected' : ''}" type="button" data-persona="${key}" aria-pressed="${assessmentState.persona === key}">
            <span class="persona-icon" aria-hidden="true">${persona.icon}</span>
            <h3>${persona.name}</h3>
            <p>${persona.description}</p>
            <small>${persona.note}</small>
        </button>
    `).join('');
    elements.personaGrid.querySelectorAll('[data-persona]').forEach(button => {
        button.addEventListener('click', () => selectPersona(button.dataset.persona));
    });
    renderRoleTags();
}

function selectPersona(personaKey) {
    if (assessmentState.persona !== personaKey) {
        assessmentState.persona = personaKey;
        assessmentState.roleTag = null;
        assessmentState.selectedRecipeIds = [];
        assessmentState.taskAnswers = {};
        assessmentState.archivedAnswers = {};
        assessmentState.executionNeeds = { parallelBand: '', usersBand: '' };
        invalidateResult();
    }
    clearError();
    renderPersonaSelection();
    updateNavigation();
}

function renderRoleTags() {
    if (!assessmentState.persona) {
        elements.rolePanel.hidden = true;
        return;
    }
    const persona = personaCatalog[assessmentState.persona];
    elements.rolePanel.hidden = false;
    elements.roleTags.innerHTML = [
        `<label class="choice-chip"><input type="radio" name="role-tag" value="" ${!assessmentState.roleTag ? 'checked' : ''}><span>不指定</span></label>`,
        ...persona.roleTags.map(([value, label]) => `<label class="choice-chip"><input type="radio" name="role-tag" value="${value}" ${assessmentState.roleTag === value ? 'checked' : ''}><span>${label}</span></label>`)
    ].join('');
    elements.roleTags.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            assessmentState.roleTag = input.value || null;
            if (assessmentState.currentStep === 2) renderRecipeSelection();
        });
    });
}

function getPersonaRecipes() {
    const recipes = recipeCatalog.filter(recipe => recipe.persona === assessmentState.persona);
    return recipes.slice().sort((a, b) => {
        const aTag = assessmentState.roleTag && a.roleTags.includes(assessmentState.roleTag) ? 1 : 0;
        const bTag = assessmentState.roleTag && b.roleTags.includes(assessmentState.roleTag) ? 1 : 0;
        return bTag - aTag || a.id.localeCompare(b.id);
    });
}

function renderRecipeSelection() {
    const recipes = getPersonaRecipes();
    elements.recipeGrid.innerHTML = recipes.map(recipe => {
        const selected = assessmentState.selectedRecipeIds.includes(recipe.id);
        return `
            <article class="recipe-card ${selected ? 'is-selected' : ''}" data-recipe-card="${recipe.id}">
                <label class="recipe-select">
                    <input type="checkbox" value="${recipe.id}" ${selected ? 'checked' : ''} aria-describedby="recipe-summary-${recipe.id}">
                    <span>
                        <strong>${recipe.title}</strong>
                        <p id="recipe-summary-${recipe.id}">一次工作量：${recipe.workUnit}</p>
                    </span>
                </label>
                <details class="recipe-detail">
                    <summary>查看流程與人工確認項目</summary>
                    <div class="recipe-detail__body">
                        <div><h4>影分身可協助</h4><p>${recipe.assist}</p></div>
                        <div><h4>你仍需確認</h4><p>${recipe.review}</p></div>
                    </div>
                </details>
            </article>
        `;
    }).join('');
    elements.recipeGrid.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => toggleRecipe(input.value, input.checked, input));
    });
    elements.selectedCount.textContent = String(assessmentState.selectedRecipeIds.length);
    clearError();
}

function toggleRecipe(recipeId, checked, inputElement = null) {
    const selected = assessmentState.selectedRecipeIds;
    if (checked) {
        if (selected.length >= 6) {
            if (inputElement) inputElement.checked = false;
            showError('最多選擇 6 項完整工作流程。請先取消一項再加入。', inputElement);
            return;
        }
        if (!selected.includes(recipeId)) selected.push(recipeId);
        if (assessmentState.archivedAnswers[recipeId]) {
            assessmentState.taskAnswers[recipeId] = { ...assessmentState.archivedAnswers[recipeId] };
        } else {
            assessmentState.taskAnswers[recipeId] = createDefaultAnswer(recipeId);
        }
    } else {
        const index = selected.indexOf(recipeId);
        if (index >= 0) selected.splice(index, 1);
        if (assessmentState.taskAnswers[recipeId]) {
            assessmentState.archivedAnswers[recipeId] = { ...assessmentState.taskAnswers[recipeId] };
            delete assessmentState.taskAnswers[recipeId];
        }
    }
    invalidateResult();
    renderRecipeSelection();
}

function createDefaultAnswer(recipeId) {
    return {
        recipeId,
        scale: '',
        frequency: '',
        period: 'week',
        currentMode: '',
        currentHumanMinutes: '',
        timeSource: 'reference'
    };
}

function renderFrequencyOptions(selectedValue) {
    const values = [...Array.from({ length: 30 }, (_, index) => index + 1), 40, 50, 75, 100];
    return `<option value="">請選擇</option>${values.map(value => `<option value="${value}" ${String(selectedValue) === String(value) ? 'selected' : ''}>${value}</option>`).join('')}`;
}

function renderTaskSettings() {
    const ordered = assessmentState.selectedRecipeIds.map(getRecipe);
    let openedIncomplete = false;
    elements.taskSettings.innerHTML = ordered.map((recipe, index) => {
        const answer = assessmentState.taskAnswers[recipe.id] || createDefaultAnswer(recipe.id);
        answer.period = 'week';
        assessmentState.taskAnswers[recipe.id] = answer;
        const complete = isAnswerComplete(answer);
        const shouldOpen = !complete && !openedIncomplete;
        if (shouldOpen) openedIncomplete = true;
        const reference = getReferenceMinutes(recipe, answer.scale, answer.currentMode);
        const hasReference = Number.isFinite(reference);
        return `
            <details class="task-setting ${complete ? 'is-complete' : ''}" data-task-id="${recipe.id}" ${shouldOpen ? 'open' : ''}>
                <summary>
                    <span class="task-summary-title"><span class="task-index">${index + 1}</span><span><strong>${recipe.title}</strong><small>${summarizeAnswer(recipe, answer)}</small></span></span>
                    <span class="completion-state ${complete ? 'is-complete' : ''}">${complete ? '已完成' : '待填寫'}</span>
                </summary>
                <div class="task-setting__body">
                    <div class="field-grid">
                        <div class="field-block">
                            <label for="frequency-${recipe.id}">執行頻率</label>
                            <div class="frequency-sentence">
                                <span>這項工作每週要做</span>
                                <select id="frequency-${recipe.id}" data-field="frequency" aria-label="選擇執行次數">${renderFrequencyOptions(answer.frequency)}</select>
                                <span>次</span>
                            </div>
                        </div>
                        <fieldset>
                            <legend>工作負載 <span class="legend-en">Loading</span></legend>
                            <div class="scale-options">
                                ${Object.entries(recipe.scales).map(([key, scale]) => `<label class="scale-option"><input type="radio" name="scale-${recipe.id}" value="${key}" ${answer.scale === key ? 'checked' : ''}><span><b>${scale.label}</b></span></label>`).join('')}
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>目前做法</legend>
                            <div class="mode-options">
                                ${Object.entries(modeCatalog).map(([key, mode]) => `<label><input type="radio" name="mode-${recipe.id}" value="${key}" ${answer.currentMode === key ? 'checked' : ''}>${mode.label}</label>`).join('')}
                            </div>
                        </fieldset>
                        <div class="field-block">
                            <label for="minutes-${recipe.id}">目前每次人工投入時間</label>
                            <div class="input-prefix"><input id="minutes-${recipe.id}" data-field="currentHumanMinutes" type="number" min="0.1" max="10080" step="0.1" inputmode="decimal" value="${answer.currentHumanMinutes === '' ? '' : formatInputNumber(answer.currentHumanMinutes)}" placeholder="選完負載與做法後自動帶入" ${hasReference ? '' : 'disabled'}><span>分鐘</span></div>
                            <span class="reference-value" data-reference-value>${hasReference ? `系統依此任務、工作負載與目前做法推算：${formatMinutes(reference)} 分鐘` : '選完工作負載與目前做法後，系統會自動推算時間'}</span>
                            <p class="field-help">已包含操作、整理、檢查與修改時間，也可直接調整成你的實際數字。</p>
                        </div>
                    </div>
                </div>
            </details>
        `;
    }).join('');

    elements.taskSettings.querySelectorAll('[data-task-id]').forEach(card => bindTaskCard(card));
    renderLoadWarning();
}

function bindTaskCard(card) {
    const recipeId = card.dataset.taskId;
    card.querySelector('summary').addEventListener('click', () => handleTaskSummaryClick(card));
    card.querySelectorAll(`input[name="scale-${recipeId}"]`).forEach(input => input.addEventListener('change', () => updateAnswerScale(recipeId, input.value)));
    card.querySelectorAll(`input[name="mode-${recipeId}"]`).forEach(input => input.addEventListener('change', () => updateAnswerMode(recipeId, input.value)));
    card.querySelector('[data-field="frequency"]').addEventListener('change', event => updateSimpleAnswer(recipeId, 'frequency', event.target.value));
    card.querySelector('[data-field="currentHumanMinutes"]').addEventListener('change', event => updateHumanMinutes(recipeId, event.target.value));
}

function updateAnswerScale(recipeId, scale) {
    const answer = assessmentState.taskAnswers[recipeId];
    answer.scale = scale;
    if (answer.currentMode && answer.timeSource !== 'custom') {
        answer.currentHumanMinutes = getReferenceMinutes(getRecipe(recipeId), scale, answer.currentMode);
        answer.timeSource = 'reference';
    }
    invalidateResult();
    refreshTaskEstimate(recipeId);
}

function updateAnswerMode(recipeId, mode) {
    const answer = assessmentState.taskAnswers[recipeId];
    answer.currentMode = mode;
    if (answer.scale && answer.timeSource !== 'custom') {
        answer.currentHumanMinutes = getReferenceMinutes(getRecipe(recipeId), answer.scale, mode);
        answer.timeSource = 'reference';
    }
    invalidateResult();
    refreshTaskEstimate(recipeId);
}

function updateHumanMinutes(recipeId, value) {
    const answer = assessmentState.taskAnswers[recipeId];
    answer.currentHumanMinutes = value;
    answer.timeSource = 'custom';
    invalidateResult();
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    updateTaskCardStatus(recipeId);
    renderLoadWarning();
}

function updateSimpleAnswer(recipeId, field, value) {
    assessmentState.taskAnswers[recipeId][field] = value;
    invalidateResult();
    updateTaskCardStatus(recipeId);
    renderLoadWarning();
}

function refreshTaskEstimate(recipeId) {
    const answer = assessmentState.taskAnswers[recipeId];
    const recipe = getRecipe(recipeId);
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return;
    const reference = getReferenceMinutes(recipe, answer.scale, answer.currentMode);
    const hasReference = Number.isFinite(reference);
    const referenceLabel = card.querySelector('[data-reference-value]');
    if (referenceLabel) referenceLabel.textContent = hasReference
        ? `系統依此任務、工作負載與目前做法推算：${formatMinutes(reference)} 分鐘`
        : '選完工作負載與目前做法後，系統會自動推算時間';
    const minutesInput = card.querySelector('[data-field="currentHumanMinutes"]');
    if (minutesInput) minutesInput.disabled = !hasReference;
    if (answer.timeSource !== 'custom') {
        if (minutesInput) minutesInput.value = answer.currentHumanMinutes === '' ? '' : formatInputNumber(answer.currentHumanMinutes);
    }
    updateTaskCardStatus(recipeId);
    renderLoadWarning();
}

function updateTaskCardStatus(recipeId) {
    const answer = assessmentState.taskAnswers[recipeId];
    const recipe = getRecipe(recipeId);
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return;
    const complete = isAnswerComplete(answer);
    card.classList.toggle('is-complete', complete);
    const summary = card.querySelector('.task-summary-title small');
    const stateLabel = card.querySelector('.completion-state');
    if (summary) summary.textContent = summarizeAnswer(recipe, answer);
    if (stateLabel) {
        stateLabel.textContent = complete ? '已完成' : '待填寫';
        stateLabel.classList.toggle('is-complete', complete);
        stateLabel.classList.toggle('is-error', !complete && card.classList.contains('has-error'));
    }
    if (complete) clearTaskErrors(recipeId);
    else if (card.classList.contains('has-error')) markTaskErrors(recipeId, false);
}

function handleTaskSummaryClick(targetCard) {
    const currentOpenCards = [...elements.taskSettings.querySelectorAll('[data-task-id][open]')].filter(card => card !== targetCard);
    if (targetCard.open && !isAnswerComplete(assessmentState.taskAnswers[targetCard.dataset.taskId])) {
        markTaskErrors(targetCard.dataset.taskId, false);
    }
    currentOpenCards.forEach(currentOpen => {
        const currentId = currentOpen.dataset.taskId;
        if (!isAnswerComplete(assessmentState.taskAnswers[currentId])) {
            markTaskErrors(currentId, false);
        }
    });
    clearError();
}

function getMissingTaskFields(recipeId) {
    const answer = assessmentState.taskAnswers[recipeId];
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!answer || !card) return [];
    const missing = [];
    const frequency = Number(answer.frequency);
    const minutes = Number(answer.currentHumanMinutes);
    if (!Number.isInteger(frequency) || frequency < 1 || frequency > 100) missing.push(card.querySelector('[data-field="frequency"]'));
    if (!answer.scale) missing.push(card.querySelector('.scale-options'));
    if (!answer.currentMode) missing.push(card.querySelector('.mode-options'));
    if (answer.scale && answer.currentMode && (!Number.isFinite(minutes) || minutes < 0.1 || minutes > 10080)) {
        missing.push(card.querySelector('[data-field="currentHumanMinutes"]'));
    }
    return missing.filter(Boolean);
}

function markTaskErrors(recipeId, focusFirst = false) {
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return null;
    clearTaskErrors(recipeId);
    const missing = getMissingTaskFields(recipeId);
    if (!missing.length) {
        updateTaskCardStatus(recipeId);
        return null;
    }
    card.open = true;
    card.classList.add('has-error');
    missing.forEach(element => element.classList.add('field-error'));
    const stateLabel = card.querySelector('.completion-state');
    if (stateLabel) {
        stateLabel.textContent = '請補填';
        stateLabel.classList.add('is-error');
    }
    if (focusFirst) {
        missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        missing[0].focus?.({ preventScroll: true });
    }
    return missing[0];
}

function clearTaskErrors(recipeId) {
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return;
    card.classList.remove('has-error');
    card.querySelectorAll('.field-error').forEach(element => element.classList.remove('field-error'));
    const stateLabel = card.querySelector('.completion-state');
    stateLabel?.classList.remove('is-error');
}

function renderSharedOptions() {
    const parallelOptions = [
        ['1', '多半依序'], ['2', '約 2 項同時'], ['3-4', '3 至 4 項同時'], ['5+', '5 項以上'], ['unknown', '不確定']
    ];
    const usersOptions = [
        ['1', '單人'], ['2-5', '2 至 5 人'], ['6-10', '6 至 10 人'], ['10+', '10 人以上']
    ];
    elements.parallelOptions.innerHTML = parallelOptions.map(([value, label]) => `<label><input type="radio" name="parallel-band" value="${value}"><span>${label}</span></label>`).join('');
    elements.usersOptions.innerHTML = usersOptions.map(([value, label]) => `<label><input type="radio" name="users-band" value="${value}"><span>${label}</span></label>`).join('');
    elements.parallelOptions.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        assessmentState.executionNeeds.parallelBand = input.value;
        invalidateResult();
    }));
    elements.usersOptions.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        assessmentState.executionNeeds.usersBand = input.value;
        invalidateResult();
    }));
}

function restoreSharedOptions() {
    document.querySelectorAll('input[name="parallel-band"]').forEach(input => { input.checked = input.value === assessmentState.executionNeeds.parallelBand; });
    document.querySelectorAll('input[name="users-band"]').forEach(input => { input.checked = input.value === assessmentState.executionNeeds.usersBand; });
    elements.usersFieldset.hidden = assessmentState.persona !== 'smb';
    elements.hourlyCost.value = assessmentState.costAmountTwd;
    elements.costPeriod.value = assessmentState.costPeriod;
    updateCostConversion();
}

function syncCostSettings() {
    assessmentState.costAmountTwd = elements.hourlyCost.value;
    assessmentState.costPeriod = elements.costPeriod.value;
    assessmentState.hourlyCostTwd = normalizeHourlyCost(assessmentState.costAmountTwd, assessmentState.costPeriod);
    updateCostConversion();
    invalidateResult();
}

function normalizeHourlyCost(amount, period) {
    const numericAmount = Number(amount);
    const hours = COST_PERIOD_HOURS[period] || COST_PERIOD_HOURS.hour;
    return Number.isFinite(numericAmount) ? numericAmount / hours : 0;
}

function updateCostConversion() {
    const amount = Number(elements.hourlyCost.value);
    const period = elements.costPeriod.value;
    if (!Number.isFinite(amount) || amount <= 0) {
        elements.costConversion.textContent = '目前將以每小時成本計算。';
        return;
    }
    const hourlyCost = normalizeHourlyCost(amount, period);
    const assumption = period === 'week' ? '（每週以 40 小時換算）' : period === 'month' ? '（每月以 160 小時換算）' : '';
    elements.costConversion.textContent = `換算後為 ${formatCurrencyRate(hourlyCost)}／小時${assumption}`;
}

function renderLoadWarning() {
    if (assessmentState.currentStep !== 3) return;
    const monthlyHours = estimateCurrentMonthlyHours();
    const nearLimit = Object.values(assessmentState.taskAnswers).some(answer => Number(answer.frequency) >= 9000 || Number(answer.currentHumanMinutes) >= 9000);
    const singleUserExcess = assessmentState.persona !== 'smb' && monthlyHours > 240;
    if (!nearLimit && !singleUserExcess) {
        elements.loadWarning.hidden = true;
        elements.loadWarning.innerHTML = '';
        return;
    }
    elements.loadWarning.hidden = false;
    elements.loadWarning.innerHTML = `<strong>高工作負載已納入分析</strong><p>${singleUserExcess ? `目前工作量約為 ${formatHours(monthlyHours)} 小時／月。` : '目前包含高頻率或長時間任務。'} 報告會同步強化多工效能與設備配置建議。</p>`;
}

function estimateCurrentMonthlyHours() {
    return assessmentState.selectedRecipeIds.reduce((sum, id) => {
        const answer = assessmentState.taskAnswers[id];
        const frequency = validNumber(answer?.frequency, 0);
        const monthlyFrequency = frequency * 52 / 12;
        return sum + monthlyFrequency * validNumber(answer?.currentHumanMinutes, 0) / 60;
    }, 0);
}

function nextStep() {
    clearError();
    if (assessmentState.currentStep === 1) {
        if (!assessmentState.persona) return showError('請先選擇主要工作身分。', elements.personaGrid.querySelector('button'));
        goToStep(2);
        return;
    }
    if (assessmentState.currentStep === 2) {
        if (!assessmentState.selectedRecipeIds.length) {
            return showError('請至少選擇 1 項平常會處理的工作。', elements.recipeGrid.querySelector('input'));
        }
        renderTaskSettings();
        restoreSharedOptions();
        goToStep(3);
        return;
    }
    if (assessmentState.currentStep === 3) {
        if (!validateStep3()) return;
        assessmentState.result = calculateAssessment(createAssessmentSnapshot());
        renderResult();
        goToStep(4);
    }
}

function previousStep() {
    if (assessmentState.currentStep > 1) goToStep(assessmentState.currentStep - 1);
}

function canReachStep(step) {
    if (step <= 1) return true;
    if (step === 2) return Boolean(assessmentState.persona);
    if (step === 3) return assessmentState.selectedRecipeIds.length > 0;
    if (step === 4) return Boolean(assessmentState.result);
    return false;
}

function handleProgressStepClick(step) {
    if (step === assessmentState.currentStep) return;
    if (!canReachStep(step)) {
        showError('請先完成前面的步驟。');
        return;
    }
    clearError();
    goToStep(step);
}

function goToStep(step) {
    if (step === 2) renderRecipeSelection();
    if (step === 3) {
        renderTaskSettings();
        restoreSharedOptions();
    }
    if (step === 4 && assessmentState.result) renderResult();
    assessmentState.currentStep = step;
    updateStepUI(true);
}

function updateStepUI(moveFocus) {
    document.querySelectorAll('.step').forEach(section => { section.hidden = Number(section.dataset.step) !== assessmentState.currentStep; });
    document.querySelectorAll('[data-progress-step]').forEach(item => {
        const step = Number(item.dataset.progressStep);
        const reachable = canReachStep(step);
        item.classList.toggle('is-active', step === assessmentState.currentStep);
        item.classList.toggle('is-complete', step < assessmentState.currentStep);
        item.classList.toggle('is-locked', !reachable);
        const trigger = item.querySelector('[data-progress-trigger]');
        if (trigger) trigger.disabled = !reachable;
    });
    document.getElementById('progress-fill').style.width = `${((assessmentState.currentStep - 1) / 3) * 100}%`;
    elements.navigation.hidden = assessmentState.currentStep === 4;
    elements.backButton.hidden = assessmentState.currentStep === 1;
    updateNavigation();
    clearError();
    if (moveFocus) {
        const title = document.getElementById(`step-${assessmentState.currentStep}-title`);
        title?.focus({ preventScroll: true });
        document.querySelector('.assessment-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateNavigation() {
    elements.nextButton.disabled = assessmentState.currentStep === 1 && !assessmentState.persona;
    elements.nextButton.textContent = assessmentState.currentStep === 3 ? '查看我的影分身效益' : '下一步';
}

function validateStep3() {
    for (const recipeId of assessmentState.selectedRecipeIds) {
        const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
        if (!isAnswerComplete(assessmentState.taskAnswers[recipeId])) {
            card.open = true;
            const firstMissing = markTaskErrors(recipeId, false);
            return showError(`請補完「${getRecipe(recipeId).title}」的紅框欄位。`, firstMissing || card.querySelector('summary'));
        }
    }
    if (!assessmentState.executionNeeds.parallelBand) return showError('請選擇通常同時處理幾項工作。', elements.parallelOptions.querySelector('input'));
    if (assessmentState.persona === 'smb' && !assessmentState.executionNeeds.usersBand) return showError('請選擇同時使用這套流程的人數。', elements.usersOptions.querySelector('input'));
    syncCostSettings();
    if (assessmentState.costAmountTwd === '') return showError('請填寫執行這些工作的成本費用。', elements.hourlyCost);
    const cost = Number(assessmentState.costAmountTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 10000000) return showError('成本費用必須大於 0，且不可超過 NT$10,000,000。', elements.hourlyCost);
    return true;
}

function createAssessmentSnapshot() {
    return JSON.parse(JSON.stringify({
        persona: assessmentState.persona,
        roleTag: assessmentState.roleTag,
        selectedRecipeIds: assessmentState.selectedRecipeIds,
        taskAnswers: assessmentState.taskAnswers,
        executionNeeds: assessmentState.executionNeeds,
        costAmountTwd: assessmentState.costAmountTwd,
        costPeriod: assessmentState.costPeriod,
        hourlyCostTwd: assessmentState.hourlyCostTwd,
        scope: 'selected-workflows'
    }));
}

function calculateAssessment(snapshot) {
    const taskResults = snapshot.selectedRecipeIds.map((recipeId, selectionIndex) => {
        const recipe = getRecipe(recipeId);
        const answer = snapshot.taskAnswers[recipeId];
        const scale = recipe.scales[answer.scale];
        const monthlyFrequency = Number(answer.frequency) * 52 / 12;
        const baseline = scale.manualMinutes;
        const current = Number(answer.currentHumanMinutes);
        const effectiveBaseline = Math.max(baseline, current);
        const workflowMetrics = calculateWorkflowMetrics(recipeId);
        const workflowTargetMinutes = effectiveBaseline * workflowMetrics.retainedHumanRatio;
        const target = Math.min(current, workflowTargetMinutes);
        const currentMonthlyMinutes = monthlyFrequency * current;
        const targetMonthlyMinutes = monthlyFrequency * target;
        return {
            recipeId,
            selectionIndex,
            title: recipe.title,
            workUnit: recipe.workUnit,
            scale: answer.scale,
            scaleLabel: scale.label,
            frequency: Number(answer.frequency),
            period: 'week',
            currentMode: answer.currentMode,
            baselineMinutes: baseline,
            effectiveBaselineMinutes: effectiveBaseline,
            currentMinutes: current,
            agentReferenceMinutes: workflowTargetMinutes,
            targetMinutes: target,
            monthlyFrequency,
            baselineMonthlyMinutes: monthlyFrequency * effectiveBaseline,
            currentMonthlyMinutes,
            targetMonthlyMinutes,
            savedMonthlyMinutes: Math.max(0, currentMonthlyMinutes - targetMonthlyMinutes),
            baselineAdjusted: current > baseline,
            assist: recipe.assist,
            review: recipe.review,
            cloneTag: recipe.cloneTag,
            profiles: recipe.profiles,
            evidenceStatus: recipe.evidenceStatus,
            workflowMetrics
        };
    });
    const totals = taskResults.reduce((sum, task) => {
        sum.baseline += task.baselineMonthlyMinutes;
        sum.current += task.currentMonthlyMinutes;
        sum.target += task.targetMonthlyMinutes;
        return sum;
    }, { baseline: 0, current: 0, target: 0 });
    const rawCurrentRelief = totals.baseline > 0 ? clamp(100 * (1 - totals.current / totals.baseline), 0, 100) : 0;
    const rawTargetRelief = totals.baseline > 0 ? clamp(100 * (1 - totals.target / totals.baseline), 0, 100) : 0;
    const currentSci = calculateSciScore(rawCurrentRelief);
    const targetSci = calculateSciScore(rawTargetRelief);
    const savedHours = Math.max(0, (totals.current - totals.target) / 60);
    const displayedSavedHours = roundHoursForDisplay(savedHours);
    const hourlyCost = Number(snapshot.hourlyCostTwd);
    const currentHours = totals.current / 60;
    const targetHours = totals.target / 60;
    taskResults.forEach(task => {
        task.loadShare = totals.current > 0 ? task.currentMonthlyMinutes / totals.current * 100 : 0;
        task.baselineLoadShare = totals.baseline > 0 ? task.baselineMonthlyMinutes / totals.baseline * 100 : 0;
        task.reliefRate = task.currentMonthlyMinutes > 0 ? task.savedMonthlyMinutes / task.currentMonthlyMinutes * 100 : 0;
        task.targetReliefRate = task.baselineMonthlyMinutes > 0 ? clamp(100 * (1 - task.targetMonthlyMinutes / task.baselineMonthlyMinutes), 0, 100) : 0;
        task.reliefShare = totals.current > 0 ? task.savedMonthlyMinutes / totals.current * 100 : 0;
        task.savedCostMonthlyTwd = roundHoursForDisplay(task.savedMonthlyMinutes / 60) * hourlyCost;
    });
    const recommendation = routeHardware(snapshot, taskResults, { currentSci, targetSci });
    const cloneMap = new Map();
    taskResults.forEach(task => {
        if (!cloneMap.has(task.cloneTag)) {
            cloneMap.set(task.cloneTag, {
                name: task.cloneTag,
                recipeId: task.recipeId,
                taskTitle: task.title,
                capability: task.assist,
                profiles: task.profiles
            });
        }
    });
    return Object.freeze({
        assessmentId: `SCI-${Date.now().toString(36).toUpperCase()}`,
        scoringVersion: VERSIONS.scoring,
        recipeCatalogVersion: VERSIONS.recipes,
        hardwareCatalogVersion: VERSIONS.hardware,
        workflowCatalogVersion: VERSIONS.workflows,
        generatedAt: new Date().toISOString(),
        timezone: 'Asia/Taipei',
        persona: snapshot.persona,
        roleTag: snapshot.roleTag,
        scope: snapshot.scope,
        sci: {
            current: currentSci,
            target: targetSci,
            gap: targetSci - currentSci,
            max: SCI_CONFIG.scaleMax,
            rawCurrentRelief,
            rawTargetRelief
        },
        workload: { humanPercent: 100 - targetSci, clonePercent: targetSci },
        time: { currentHoursMonthly: currentHours, targetHoursMonthly: targetHours, savedHoursMonthly: displayedSavedHours },
        cost: {
            kind: 'labor-value',
            hourlyCostTwd: hourlyCost,
            inputAmountTwd: Number(snapshot.costAmountTwd),
            inputPeriod: snapshot.costPeriod,
            currentMonthlyTwd: currentHours * hourlyCost,
            targetMonthlyTwd: targetHours * hourlyCost,
            savedMonthlyTwd: displayedSavedHours * hourlyCost,
            savedAnnualTwd: displayedSavedHours * hourlyCost * 12,
            monthlyTwd: displayedSavedHours * hourlyCost,
            annualTwd: displayedSavedHours * hourlyCost * 12
        },
        tokens: {
            twdPerMillionTokens: TOKEN_CONFIG.twdPerMillionTokens,
            savedMonthly: twdToTokens(displayedSavedHours * hourlyCost)
        },
        taskResults: taskResults.sort((a, b) => b.currentMonthlyMinutes - a.currentMonthlyMinutes || a.selectionIndex - b.selectionIndex),
        clones: [...cloneMap.values()],
        recommendation,
        estimateStatus: 'heuristic'
    });
}

function routeHardware(snapshot, taskResults, sciScores) {
    const gradeKeys = ['a', 'aplus', 's', 'splus', 'ss'];
    const baseTier = Math.max(...taskResults.map(task => getRecipe(task.recipeId).scales[task.scale].baseTier), 1);
    let gradeIndex = clamp(baseTier - 1, 0, 2);
    let needsReview = false;
    const reasons = [];
    const parallel = snapshot.executionNeeds.parallelBand;
    const largeTasks = taskResults.filter(task => task.scale === 'large');
    const hasLargeMediaOrCoding = largeTasks.some(task => task.profiles.some(profile => ['media', 'coding'].includes(profile)));
    const totalBaselineMinutes = taskResults.reduce((sum, task) => sum + task.baselineMonthlyMinutes, 0);
    const totalBaselineHours = totalBaselineMinutes / 60;
    const weightedComputeIntensity = totalBaselineMinutes > 0
        ? taskResults.reduce((sum, task) => sum + task.workflowMetrics.computeIntensity * task.baselineMonthlyMinutes, 0) / totalBaselineMinutes
        : 1;

    if (parallel === '2' && largeTasks.length) gradeIndex = Math.max(gradeIndex, 1);
    if (parallel === '3-4') gradeIndex = Math.max(gradeIndex, hasLargeMediaOrCoding ? 2 : 1);
    if (parallel === '5+') gradeIndex = Math.max(gradeIndex, 2);
    if (snapshot.persona === 'smb') {
        if (snapshot.executionNeeds.usersBand === '2-5') gradeIndex = Math.max(gradeIndex, 1);
        if (snapshot.executionNeeds.usersBand === '6-10') gradeIndex = Math.max(gradeIndex, 2);
        if (snapshot.executionNeeds.usersBand === '10+') gradeIndex = Math.max(gradeIndex, 3);
    }
    taskResults.forEach(task => {
        const batchProfile = task.profiles.some(profile => ['document', 'analytics', 'knowledge', 'monitoring'].includes(profile));
        if (batchProfile && ((task.scale === 'standard' && task.frequency > 20) || (task.scale === 'large' && task.frequency > 5))) {
            gradeIndex = Math.max(gradeIndex, 1);
        }
    });
    if (weightedComputeIntensity >= 3.35) gradeIndex = Math.max(gradeIndex, 1);
    if (weightedComputeIntensity >= 4 && ['3-4', '5+'].includes(parallel)) gradeIndex = Math.max(gradeIndex, 2);

    const sPlusDemand = weightedComputeIntensity >= 3.5
        && (totalBaselineHours >= 160 || parallel === '5+' || largeTasks.length >= 3);
    if (sPlusDemand) gradeIndex = Math.max(gradeIndex, 3);

    const ssDemand = sciScores.targetSci >= 75
        && weightedComputeIntensity >= 3.35
        && (totalBaselineHours >= 320 || (parallel === '5+' && largeTasks.length >= 3));
    if (ssDemand) gradeIndex = 4;

    gradeIndex = clamp(gradeIndex, 0, gradeKeys.length - 1);
    const tierKey = gradeKeys[gradeIndex];
    const tier = hardwareCatalog[tierKey];
    const profileNames = {
        document: '內容與文件製作', analytics: '資料分析', media: '影音內容處理',
        knowledge: '知識整理', monitoring: '持續追蹤', coding: '程式協作'
    };
    const demandSummary = [...new Set(taskResults.flatMap(task => task.profiles).map(profile => profileNames[profile]).filter(Boolean))].slice(0, 3);
    const cloneNames = [...new Set(taskResults.map(task => task.cloneTag))].slice(0, 2);
    const teamText = cloneNames.length > 1 ? `${cloneNames[0]}與${cloneNames[1]}` : cloneNames[0];
    const modelNames = tier.models.map(model => model.name);
    reasons.push(`本次工作量約 ${Math.round(totalBaselineHours)} 小時／月，工作流運算強度為 ${weightedComputeIntensity.toFixed(1)}／5。`);
    if (tierKey === 'ss') reasons.push('高 SCI 代表大量流程可交由影分身處理，搭配極重工作量時需要更高的持續運算與記憶體容量。');
    if (parallel === '5+' || snapshot.executionNeeds.usersBand === '10+') needsReview = true;
    return {
        tier: tierKey,
        grade: tier.strength.grade,
        tierLabel: tier.label,
        validationStatus: 'pending',
        needsReview,
        models: tier.models.map(model => ({ ...model })),
        primaryModel: { ...tier.models[0] },
        componentSeries: JSON.parse(JSON.stringify(tier.components)),
        strength: { ...tier.strength },
        reasons: reasons.slice(0, 3),
        story: `您的任務需求涵蓋${formatChineseList(demandSummary)}，可由${teamText}協同完成。建議採用 ${tier.label} 的 ${formatChineseList(modelNames)}，把主要運算與工作檔案留在自己的設備中，降低長期雲端訂閱、用量計價與網路依賴。`
    };
}

function renderResult() {
    const result = assessmentState.result;
    if (!result) return;
    document.getElementById('result-summary').textContent = `你的 ${result.taskResults.length} 項工作已完成分析，以下是導入影分身團隊後的工作效益。`;
    document.getElementById('sci-gap').textContent = `+${Math.round(result.sci.gap)} 點`;
    document.getElementById('current-sci-card').innerHTML = renderSciCard('目前 SCI', result.sci.current, getSciLevel(result.sci.current), '代表目前已由工具或流程承接的人工工作比例。', 'current', 0);
    document.getElementById('target-sci-card').innerHTML = renderSciCard('導入後 SCI', result.sci.target, '本次任務組合', `預估有 ${Math.round(result.sci.target)}% 的人工工作可由影分身協助。`, 'target', result.sci.current);
    document.getElementById('metric-highlights').innerHTML = renderMetricHighlights(result);
    document.getElementById('workflow-result-table').innerHTML = renderWorkflowResults(result);
    document.getElementById('clone-list').innerHTML = result.clones.map((clone, index) => renderCloneCard(clone, index)).join('');
    renderHardware(result.recommendation, result);
    setResultSectionsHidden(false);
    requestAnimationFrame(animateSciJourney);
}

function setResultSectionsHidden(hidden) {
    document.querySelector('.workflow-results').hidden = hidden;
    document.querySelector('.clone-section').hidden = hidden;
    document.getElementById('report-preview-button').disabled = hidden;
}

function renderSciCard(label, score, status, description, variant, fromValue) {
    const rounded = Math.round(score);
    const barPercent = clamp(score / SCI_CONFIG.scaleMax * 100, 0, 100);
    const infoButton = variant === 'current' ? '<button type="button" class="sci-info-trigger" id="sci-info-trigger" aria-label="SCI 是什麼？點擊查看計算方式">?</button>' : '';
    return `<div class="sci-card__top"><span class="sci-card__label"><strong>${label}</strong>${infoButton}</span><span>${status}</span></div><div class="sci-card__score"><strong data-sci-number data-from="${Math.round(fromValue)}" data-value="${rounded}">${Math.round(fromValue)}</strong><span>／${SCI_CONFIG.scaleMax}</span></div><div class="sci-card__bar" aria-hidden="true"><i data-sci-bar style="--score:${barPercent}%"></i></div><p>${description}</p><span class="sci-card__caption">${variant === 'target' ? '本次任務結果' : '現在的位置'}</span>`;
}

function renderMetricHighlights(result) {
    return `
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('clock')}</span>
            <div><span>每月釋放工時</span><strong>${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}</strong></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('zap')}</span>
            <div><span>每月節省 Token</span><strong>${formatTokens(result.tokens.savedMonthly)}</strong></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('receipt')}</span>
            <div><span>每月省下費用</span><strong>${formatCurrency(result.cost.savedMonthlyTwd)}</strong></div>
        </article>`;
}

function renderWorkflowResults(result) {
    const topTask = result.taskResults.reduce((highest, task) => task.loadShare > highest.loadShare ? task : highest, result.taskResults[0]);
    return `<div class="workflow-stack">
        ${renderWorkloadOverview(result)}
        <aside class="top-workload-callout">
            <span class="top-workload-callout__icon">${iconSvg(getCloneIconType(topTask.recipeId))}</span>
            <div><small>最適合透過影分身來協作的工作流程</small><strong>${topTask.title}</strong><p>占目前人工工作量 ${formatPercent(topTask.loadShare)}%。可交由「${topTask.cloneTag}」協助${getAgentSupportScope(topTask)}，每月預估可釋放 ${formatHours(topTask.savedMonthlyMinutes / 60)} ${getTimeUnit()}，相當於 ${formatCurrency(topTask.savedCostMonthlyTwd)} 的人力成本價值。</p></div>
        </aside>
    </div>`;
}

function renderWorkflowImpactCard(task, index) {
    const shadowShare = clamp(task.targetReliefRate, 0, 100);
    const humanShare = 100 - shadowShare;
    return `<article class="workflow-impact-card">
        <header><div><span>TASK ${String(index + 1).padStart(2, '0')} · ${task.scaleLabel} · ${task.frequency} 次／週</span><h4>${task.title}</h4></div><div class="load-chip" aria-label="人工與影分身處理比例"><span>人工處理 <b>${formatPercent(humanShare)}%</b></span><span>影分身處理 <b>${formatPercent(shadowShare)}%</b></span></div></header>
        <p class="workflow-agent-note"><strong>交由「${task.cloneTag}」協助</strong>${getAgentSupportScope(task)}；每月預估可釋放 <b>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</b>。</p>
        <div class="workflow-impact-grid">
            <div><span>目前投入</span><strong>${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <span class="workflow-arrow" aria-hidden="true">${iconSvg('arrow-right')}</span>
            <div><span>導入後</span><strong>${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <div class="saved-highlight"><span>每月可釋放</span><strong>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</strong><small>人力成本價值 ${formatCurrency(task.savedCostMonthlyTwd)}</small></div>
        </div>
    </article>`;
}

function renderWorkloadOverview(result) {
    const aiShare = clamp(result.sci.target, 0, 100);
    const humanShare = 100 - aiShare;
    const beforeLabels = result.taskResults.map((task, index) => `
        <span style="--segment:${task.loadShare}%" title="${task.title}"><b>${index + 1}</b></span>`).join('');
    const beforeSegments = result.taskResults.map((task, index) => `
        <i class="workload-task-segment workload-task-segment--before" style="--segment:${task.loadShare}%;--task-color:${getWorkloadColor(index)};--delay:${index * 70}ms" title="${task.title}：目前工作占比 ${formatPercent(task.loadShare)}%"></i>`).join('');
    const afterSegments = result.taskResults.map((task, index) => {
        const remaining = clamp(100 - task.targetReliefRate, 0, 100);
        const assist = 100 - remaining;
        const color = getWorkloadColor(index);
        return `<button type="button" class="workload-task-segment workload-task-segment--after" style="--segment:${task.loadShare}%;--delay:${240 + index * 70}ms;--task-color:${color}" data-task-toggle="${index}" aria-label="查看 ${task.title} 的協作細項" aria-expanded="false" aria-controls="workload-task-detail" title="${task.title}：目前工作占比 ${formatPercent(task.loadShare)}%，可由影分身協作 ${formatPercent(assist)}%"><b class="workload-part workload-part--human" style="--portion:${remaining}%"></b><b class="workload-part workload-part--assist" style="--portion:${assist}%"></b><span class="workload-segment-index">${index + 1}</span></button>`;
    }).join('');
    const legend = result.taskResults.map((task, index) => `<button type="button" data-task-toggle="${index}" aria-expanded="false" aria-controls="workload-task-detail"><i style="--task-color:${getWorkloadColor(index)}"></i><span>${String(index + 1).padStart(2, '0')} · ${task.title}</span><b>${formatPercent(task.loadShare)}%</b></button>`).join('');
    return `<section class="workload-overview" aria-labelledby="workload-overview-title">
        <header><span>工作量視覺化</span><h4 id="workload-overview-title">影分身介入前後，工作如何重新分配</h4><p>以目前每月人工投入時間為基準，比較各任務占比與可交由影分身協助的部分。</p></header>
        <div class="workload-overall"><div><strong>整體協作比例</strong><span>依本次任務組合估算</span></div><div><div class="workload-overall-track"><i class="workload-overall-human" style="--portion:${humanShare}%"></i><i class="workload-overall-agent" style="--portion:${aiShare}%"></i></div><p><span>人工處理 <b>${Math.round(humanShare)}%</b></span><span>影分身可協助 <b>${Math.round(aiShare)}%</b></span></p></div></div>
        <div class="workload-task-legend" aria-label="選擇任務查看協作細項">${legend}</div>
        <div class="workload-chart-row"><div><strong>影分身介入前</strong><small>目前人工投入占比</small></div><div class="workload-track-group"><div class="workload-track-labels" aria-hidden="true">${beforeLabels}</div><div class="workload-track" aria-label="影分身介入前各任務目前工作占比">${beforeSegments}</div></div></div>
        <div class="workload-chart-row"><div><strong>影分身介入後</strong><small>各任務的重新分配</small></div><div><div class="workload-track" aria-label="影分身介入後人工與影分身協助分布，點擊長條可展開該任務詳情">${afterSegments}</div><span class="workload-track-hint"><svg viewBox="0 0 24 24"><path d="M9 11a3 3 0 1 1 6 0v5a3 3 0 0 1-6 0Z"/><path d="M15 12V6a2 2 0 0 0-4 0M9 13V9a2 2 0 0 0-4 0v6a5 5 0 0 0 5 5h3a5 5 0 0 0 5-5v-1"/></svg>點擊長條，查看該任務的協作細項</span></div></div>
        <div class="workload-state-legend"><span><i class="is-agent-hint"></i>影分身可協助工作區域</span></div>
        <div class="workload-task-detail" id="workload-task-detail" hidden></div>
    </section>`;
}

function toggleTaskDetail(index) {
    const result = assessmentState.result;
    if (!result || !result.taskResults[index]) return;
    const panel = document.getElementById('workload-task-detail');
    if (!panel) return;
    const buttons = document.querySelectorAll('[data-task-toggle]');
    const wasOpenSameTask = !panel.hidden && panel.dataset.openIndex === String(index);
    const nextOpenIndex = wasOpenSameTask ? null : index;
    buttons.forEach(button => {
        const isSelected = nextOpenIndex !== null && Number(button.dataset.taskToggle) === nextOpenIndex;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-expanded', String(isSelected));
    });
    if (nextOpenIndex === null) {
        panel.hidden = true;
        panel.innerHTML = '';
        delete panel.dataset.openIndex;
        return;
    }
    panel.innerHTML = renderWorkflowImpactCard(result.taskResults[nextOpenIndex], nextOpenIndex);
    panel.hidden = false;
    panel.dataset.openIndex = String(nextOpenIndex);
}

function getWorkloadColor(index) {
    return ['#376FAE', '#2D82B8', '#2796BE', '#22A9C5', '#20B8C9', '#43AFC1', '#5D98B5', '#7187A8'][index % 8];
}

function getAgentSupportScope(task) {
    const scopeByProfile = {
        document: '資料整理、內容初稿與例行格式處理',
        analytics: '資料彙整、初步分析與結果整理',
        media: '素材整理、內容初稿與版本準備',
        knowledge: '資訊查找、摘要整理與工作草稿準備',
        monitoring: '狀態彙整、提醒整理與例行追蹤',
        coding: '程式草稿、修改建議與基本測試'
    };
    const primaryProfile = task.profiles.find(profile => scopeByProfile[profile]);
    return scopeByProfile[primaryProfile] || '資料整理、工作草稿與例行流程處理';
}

function renderCloneCard(clone, index) {
    return `<article class="clone-card" title="${clone.capability}">
        <div class="clone-avatar"><span>${iconSvg(getCloneIconType(clone.recipeId))}</span><i aria-hidden="true"></i></div>
        <div class="clone-card__body"><span class="clone-card__index">SHADOW ${String(index + 1).padStart(2, '0')}</span><h4>${clone.name}</h4><p>${clone.taskTitle}</p></div>
    </article>`;
}

function renderHardware(recommendation, result) {
    document.getElementById('hardware-reasons').textContent = recommendation.story;
    document.getElementById('shadow-strength').innerHTML = renderShadowStrength(recommendation.strength, result);
    const modelSpecLabels = {
        mb: ['主機板', 'MB', 'motherboard'], cpu: ['處理器', 'CPU', 'cpu'], gpu: ['顯示卡', 'VGA', 'gpu'],
        ram: ['記憶體', 'RAM', 'memory'], ssd: ['儲存裝置', 'SSD', 'database'], case: ['機殼', 'CASE', 'case'],
        cooling: ['散熱系統', 'COOLING', 'fan'], psu: ['電源供應器', 'PSU', 'zap']
    };
    document.getElementById('platform-grid').innerHTML = recommendation.models.map(model => `<article class="hardware-model-card">
        <header><div><span>推薦整機</span><h4>${model.name}</h4></div></header>
        <span class="hardware-grade-stamp" aria-label="影分身戰力 ${recommendation.grade} 級"><small>影分身戰力</small><strong>${recommendation.grade}</strong></span>
        <div class="hardware-model-specs">${Object.entries(modelSpecLabels).filter(([key]) => !(key === 'case' && model.integratedChassis)).map(([key, [zh, en, icon]]) => `<div class="hardware-model-spec"><span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div><small>${en}</small><strong>${zh}</strong></div><p>${model[key]}</p></div>`).join('')}</div>
    </article>`).join('');
    const sharedParts = document.getElementById('shared-parts');
    sharedParts.innerHTML = '';
    sharedParts.hidden = true;
    document.getElementById('system-purchase-cta').innerHTML = renderPurchaseLink(`前往選購 ${recommendation.grade} 級推薦整機`, campaignConfig.productLinks.systems[recommendation.tier], 'system');
    const componentLabels = {
        cpu: ['處理器系列', 'CPU', 'cpu', '選購處理器系列'],
        mb: ['主機板系列', 'MB', 'motherboard', '選購主機板系列'],
        gpu: ['顯示卡系列', 'VGA', 'gpu', '選購顯示卡系列']
    };
    document.getElementById('component-series-grid').innerHTML = Object.entries(recommendation.componentSeries).map(([key, series]) => {
        const [zh, en, icon, cta] = componentLabels[key];
        const specs = series.all
            ? `<p class="component-series-single">${series.all}</p>`
            : `<div class="dual-spec"><span><em>${series.leftLabel || 'AMD 平台'}</em>${series.amd}</span><span><em>${series.rightLabel || 'Intel 平台'}</em>${series.intel}</span></div>`;
        const link = campaignConfig.productLinks.components[recommendation.tier][key];
        return `<article class="component-series-card"><span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div class="component-series-card__heading"><small>${en}</small><strong>${zh}</strong></div><div class="component-series-card__spec">${specs}</div>${renderPurchaseLink(cta, link, key)}</article>`;
    }).join('');
    selectHardwareTab('system');
}

function renderShadowStrength(strength, result) {
    const comparisons = getLocalValueComparisons(result);
    return `<article class="shadow-strength-card">
        <div class="shadow-strength-card__score"><span>影分身戰力</span><strong>${strength.grade}</strong><b>級</b></div>
        <div class="shadow-strength-card__body"><div><strong>${strength.label}</strong><span>${strength.capacity}</span></div><div class="shadow-strength-meter" aria-label="影分身戰力 ${strength.grade} 級"><i style="--strength:${strength.meter}%"></i></div><p>${strength.description} 戰力分為 A、A+、S、S+、SS；等級越高，代表設備能為地端模型、多工具與平行工作提供更多運算餘裕。此為依設備規格與本次工作負載提供的相對建議，不代表特定模型的固定速度倍數；完整配置仍可依常用軟體、資料容量與團隊規模調整。</p></div>
        <div class="local-value-comparisons">${comparisons.map(item => `<article><div><span>目前痛點</span><p>${item.before}</p></div><i aria-hidden="true">→</i><div><span>地端影分身</span><p>${item.after}</p></div></article>`).join('')}</div>
    </article>`;
}

function getLocalValueComparisons(result) {
    const lowSciPain = result.sci.current < 35
        ? '目前 SCI 偏低，重複工作仍大量占用人工時間。'
        : '既有工具各自運作，工作仍需要人工來回串接。';
    return [
        { before: lowSciPain, after: '讓固定流程交由地端影分身持續協作，逐步釋放人工工作量。' },
        { before: '雲端服務按月訂閱或按量計價，工作增加時支出也可能持續增加。', after: '把主要運算轉成自己的設備算力，降低長期訂閱與用量費依賴。' },
        { before: '工作檔案需要上傳，流程也容易受到連線、額度與服務方案調整影響。', after: '資料與模型流程留在地端，建立可持續使用及擴充的工作環境。' }
    ];
}

function renderPurchaseLink(label, href, kind) {
    const available = Boolean(href);
    return `<a class="button button--accent hardware-buy-link ${available ? '' : 'is-placeholder'}" href="${available ? href : '#'}" data-buy-link="${kind}" ${available ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true" title="導購連結準備中"'}>${label}${available ? '' : '<small>連結準備中</small>'}</a>`;
}

function handleHardwareInteraction(event) {
    const tab = event.target.closest('[data-hardware-tab]');
    if (tab) {
        selectHardwareTab(tab.dataset.hardwareTab);
        return;
    }
    const buyLink = event.target.closest('[data-buy-link]');
    if (buyLink?.getAttribute('aria-disabled') === 'true') event.preventDefault();
}

function handleHardwareKeydown(event) {
    const activeTab = event.target.closest('[data-hardware-tab]');
    if (!activeTab || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextTab = activeTab.dataset.hardwareTab === 'system' ? 'components' : 'system';
    selectHardwareTab(nextTab);
    document.querySelector(`[data-hardware-tab="${nextTab}"]`)?.focus();
}

function selectHardwareTab(tabName) {
    document.querySelectorAll('[data-hardware-tab]').forEach(button => {
        const selected = button.dataset.hardwareTab === tabName;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('hardware-panel-system').hidden = tabName !== 'system';
    document.getElementById('hardware-panel-components').hidden = tabName !== 'components';
}

async function previewReport(trigger) {
    const result = assessmentState.result;
    if (!result || result.unavailable) return;
    trigger.disabled = true;
    const originalText = trigger.textContent;
    trigger.textContent = '正在產生報告…';
    try {
        await document.fonts.ready;
        const blob = await createReportBlob(result);
        clearReportPreview();
        reportPreviewUrl = URL.createObjectURL(blob);
        const filename = `ASUS-SCI-完整報告-${taipeiDateStamp()}.png`;
        elements.modalContent.innerHTML = `<div class="report-preview"><header><span class="step-kicker">分享圖預覽</span><h2 id="modal-title">SCI 影分身完整報告</h2><p>請先檢查內容，確認後再下載 PNG 圖片。</p></header><div class="report-preview__image"><img src="${reportPreviewUrl}" alt="SCI 影分身工作效益完整報告預覽"></div><div class="report-preview__actions"><button class="button button--quiet" type="button" data-close-modal>返回報告</button><a class="button button--accent" href="${reportPreviewUrl}" download="${filename}" id="report-download-link">下載 PNG 圖片</a></div></div>`;
        elements.modalContent.querySelector('[data-close-modal]').addEventListener('click', closeModal);
        document.getElementById('report-download-link').addEventListener('click', () => trackEvent('report_downloaded', { tier: result.recommendation.tier }));
        openModal(trigger);
    } catch (error) {
        showError('報告圖片產生失敗，請稍後再試。');
    } finally {
        trigger.disabled = false;
        trigger.textContent = originalText;
    }
}

async function createReportBlob(result) {
    const width = 1080;
    const taskRowHeight = 146;
    const hardwareCardHeight = 326;
    const hardwareCardGap = 18;
    const additionalHardwareHeight = Math.max(0, result.recommendation.models.length - 1) * (hardwareCardHeight + hardwareCardGap);
    const height = 1566 + result.taskResults.length * taskRowHeight + additionalHardwareHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const font = '"Segoe UI", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
    const left = 64;
    const contentWidth = width - left * 2;
    let y = 0;

    ctx.fillStyle = '#080D16';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(920, 0, 0, 920, 0, 560);
    glow.addColorStop(0, 'rgba(20,121,232,.22)');
    glow.addColorStop(1, 'rgba(20,121,232,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(400, 0, 680, 620);

    y = 64;
    roundedRect(ctx, left, y, 46, 46, 11, '#1479E8');
    canvasText(ctx, 'A', left + 23, y + 33, `900 25px ${font}`, '#FFFFFF', 'center');
    canvasText(ctx, 'ASUS', left + 62, y + 22, `800 23px ${font}`, '#FFFFFF');
    canvasText(ctx, 'AGENTIC AI', left + 62, y + 44, `700 12px ${font}`, '#20C9EB');
    canvasText(ctx, `診斷日期 ${formatTaipeiDate(result.generatedAt)}`, width - left, y + 29, `500 13px ${font}`, '#8391A7', 'right');

    y += 96;
    canvasText(ctx, 'SCI 影分身工作效益報告', left, y, `800 38px ${font}`, '#FFFFFF');
    canvasText(ctx, `${personaCatalog[result.persona].name} · ${result.taskResults.length} 項工作`, left, y + 34, `500 15px ${font}`, '#9AA8BC');

    y += 82;
    roundedRect(ctx, left, y, contentWidth, 218, 18, '#101826', 'rgba(148,163,184,.22)');
    canvasText(ctx, '目前 SCI', left + 28, y + 38, `700 14px ${font}`, '#9AA8BC');
    canvasText(ctx, `${Math.round(result.sci.current)}`, left + 28, y + 116, `900 58px ${font}`, '#AAB5C8');
    canvasText(ctx, '／100', left + 125, y + 116, `600 15px ${font}`, '#6F7E94');
    canvasText(ctx, getSciLevel(result.sci.current), left + 28, y + 154, `700 14px ${font}`, '#20C9EB');
    ctx.fillStyle = 'rgba(148,163,184,.22)';
    ctx.fillRect(left + 210, y + 26, 1, 166);
    canvasText(ctx, '影分身團隊加入後 · 導入後 SCI', left + 244, y + 38, `700 14px ${font}`, '#20C9EB');
    canvasText(ctx, `${Math.round(result.sci.target)}`, left + 244, y + 116, `900 76px ${font}`, '#20C9EB');
    canvasText(ctx, '／100', left + 341, y + 116, `600 15px ${font}`, '#6F7E94');
    canvasText(ctx, `提升 ${Math.round(result.sci.gap)} 點`, left + 244, y + 154, `700 14px ${font}`, '#55D6A6');
    const metricX = left + 448;
    const reportMetrics = [
        ['每月釋放工時', `${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}`],
        ['每月節省 Token', formatTokens(result.tokens.savedMonthly)],
        ['每月省下費用', formatCurrency(result.cost.savedMonthlyTwd)]
    ];
    reportMetrics.forEach((metric, index) => {
        const x = metricX + index * 168;
        canvasText(ctx, metric[0], x, y + 48, `600 11px ${font}`, '#7F8CA3');
        wrapCanvasText(ctx, metric[1], x, y + 88, 150, 26, 2, `800 22px ${font}`, '#FFFFFF');
    });

    y += 246;

    canvasText(ctx, '影分身介入前後，工作如何重新分配', left, y + 22, `800 21px ${font}`, '#FFFFFF');
    canvasText(ctx, '以同一批工作全人工完成所需時間為基準', left, y + 44, `500 11px ${font}`, '#8391A7');
    const barX = left + 150;
    const barWidth = contentWidth - 150;
    const aiShare = clamp(result.sci.target, 0, 100);
    const humanShare = 100 - aiShare;
    canvasText(ctx, '整體協作比例', left, y + 78, `700 11px ${font}`, '#AAB5C8');
    drawOverallDistributionBar(ctx, barX, y + 65, barWidth, 22, humanShare, aiShare);
    canvasText(ctx, `人工處理 ${Math.round(humanShare)}%`, barX, y + 107, `600 11px ${font}`, '#AAB5C8');
    canvasText(ctx, `影分身可協助 ${Math.round(aiShare)}%`, barX + barWidth, y + 107, `700 11px ${font}`, '#55D6A6', 'right');
    canvasText(ctx, '影分身介入前', left, y + 145, `700 11px ${font}`, '#AAB5C8');
    drawTaskDistributionBar(ctx, result.taskResults, barX, y + 132, barWidth, 18, false, font);
    canvasText(ctx, '影分身介入後', left, y + 183, `700 11px ${font}`, '#AAB5C8');
    drawTaskDistributionBar(ctx, result.taskResults, barX, y + 170, barWidth, 18, true, font);
    y += 218;

    canvasText(ctx, '逐項工作效益', left, y + 24, `800 21px ${font}`, '#FFFFFF');
    y += 48;
    result.taskResults.forEach((task, index) => {
        roundedRect(ctx, left, y, contentWidth, 128, 12, index % 2 ? '#121D2B' : '#101826');
        canvasText(ctx, `TASK ${String(index + 1).padStart(2, '0')} · ${task.title}`, left + 20, y + 29, `700 15px ${font}`, '#F5F7FB');
        canvasText(ctx, `${task.scaleLabel} · ${task.frequency} 次／週 · 目前工作占比 ${formatPercent(task.loadShare)}%`, left + 20, y + 55, `500 11px ${font}`, '#8391A7');
        wrapCanvasText(ctx, `由「${task.cloneTag}」協助${getAgentSupportScope(task)}；每月預估可釋放 ${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}。`, left + 20, y + 80, 420, 16, 2, `600 11px ${font}`, '#20C9EB');
        canvasText(ctx, `目前 ${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}`, left + 465, y + 32, `600 12px ${font}`, '#AAB5C8');
        canvasText(ctx, `導入後 ${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}`, left + 465, y + 60, `600 12px ${font}`, '#AAB5C8');
        canvasText(ctx, `每月可釋放 ${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}`, width - left - 18, y + 40, `800 14px ${font}`, '#20C9EB', 'right');
        canvasText(ctx, `人力成本價值 ${formatCurrency(task.savedCostMonthlyTwd)}`, width - left - 18, y + 62, `600 11px ${font}`, '#8391A7', 'right');
        y += taskRowHeight;
    });

    canvasText(ctx, '影分身團隊', left, y + 22, `800 21px ${font}`, '#FFFFFF');
    y += 46;
    result.clones.forEach((clone, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const x = left + column * 312;
        roundedRect(ctx, x, y + row * 44, 294, 34, 8, 'rgba(32,201,235,.10)', 'rgba(32,201,235,.28)');
        canvasText(ctx, clone.name, x + 14, y + 23 + row * 44, `700 11px ${font}`, '#BFF4FF');
    });
    y += Math.ceil(result.clones.length / 3) * 44 + 34;

    const hardwareLabels = { mb: '主機板 MB', cpu: '處理器 CPU', gpu: '顯示卡 VGA', ram: '記憶體 RAM', ssd: '儲存裝置 SSD', case: '機殼 CASE', cooling: '散熱系統', psu: '電源供應器 PSU' };
    result.recommendation.models.forEach((hardware, hardwareIndex) => {
        roundedRect(ctx, left, y, contentWidth, hardwareCardHeight, 18, 'rgba(20,121,232,.13)', 'rgba(32,201,235,.28)');
        canvasText(ctx, hardware.name, left + 24, y + 36, `800 18px ${font}`, '#20C9EB');
        canvasText(ctx, `推薦機台 ${hardwareIndex + 1}／${result.recommendation.models.length} · 整機配置`, left + 24, y + 58, `600 11px ${font}`, '#8391A7');
        drawHardwareGradeStamp(ctx, result.recommendation.strength.grade, width - left - 48, y + 44, font);
        Object.entries(hardwareLabels).filter(([key]) => !(key === 'case' && hardware.integratedChassis)).forEach(([key, label], index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            const x = left + 24 + column * 232;
            const itemY = y + 96 + row * 82;
            canvasText(ctx, label, x, itemY, `600 10px ${font}`, '#6F7E94');
            wrapCanvasText(ctx, hardware[key], x, itemY + 21, 214, 15, 3, `700 10px ${font}`, '#FFFFFF');
        });
        y += hardwareCardHeight + hardwareCardGap;
    });

    wrapCanvasText(ctx, `SCI（Shadow-Clone Index）採 100 分制，代表相對於全人工基準，可由影分身協助承接的人工工作比例。影分身戰力採 A、A+、S、S+、SS 五級，代表推薦設備的相對地端運算餘裕，不是固定速度倍數。費用依使用者填寫的時／週／月成本統一換算；Token 為費用等值估算。`, left, y, contentWidth, 20, 4, `500 11px ${font}`, '#77859B');
    canvasText(ctx, `${result.scoringVersion} · ${result.workflowCatalogVersion} · ${result.recipeCatalogVersion} · ${result.hardwareCatalogVersion}`, left, height - 38, `500 9px ${font}`, '#4F5C70');
    canvasText(ctx, 'ASUS AGENTIC AI', width - left, height - 38, `700 11px ${font}`, '#20C9EB', 'right');

    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')), 'image/png', 1));
}

function openSciInfoModal(trigger) {
    elements.modalContent.innerHTML = `
        <div class="sci-info-modal">
            <header>
                <span class="step-kicker">SCI 說明</span>
                <h2 id="modal-title">SCI（影分身指數）怎麼算？</h2>
                <p>SCI 用來衡量相對於全人工完成同一批工作的基準，有多少人工工作可由既有工具、流程或影分身協助承接。</p>
            </header>
            <div class="sci-info-formula">SCI = (1 − <span>人工投入時間</span> ／ <span>同一批工作全人工完成所需時間</span>) × 100</div>
            <div class="sci-info-examples">
                <article>
                    <strong>目前 SCI</strong>
                    <span>現在已被工具或流程承接的比例</span>
                    <p>以你填寫的目前人工時間，和同範圍工作的全人工基準比較。若目前仍完全手動，SCI 就接近 0。</p>
                </article>
                <article>
                    <strong>導入後 SCI</strong>
                    <span>影分身預估可承接的比例</span>
                    <p>例如導入後 SCI 為 67，代表約 67% 的全人工工作量可由影分身協助，仍有約 33% 需要人工處理。</p>
                </article>
            </div>
            <p class="sci-info-note">導入後人工時間會納入各任務流程中的必要操作、審核與例外處理，再換算成每月分鐘數加總；頻率只負責加權工作量，不會另外替 SCI 加分。報告中的整體協作比例與導入後 SCI 使用同一數值。</p>
        </div>`;
    openModal(trigger);
}

function openModal(trigger) {
    lastModalTrigger = trigger;
    elements.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    elements.modalPanel.focus();
}

function closeModal() {
    if (elements.modal.hidden) return;
    elements.modal.hidden = true;
    document.body.style.overflow = '';
    clearReportPreview();
    lastModalTrigger?.focus();
}

function handleModalKeys(event) {
    if (elements.modal.hidden) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...elements.modalPanel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(element => !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function clearReportPreview() {
    if (reportPreviewUrl) URL.revokeObjectURL(reportPreviewUrl);
    reportPreviewUrl = null;
}

function resetAssessment() {
    clearReportPreview();
    Object.assign(assessmentState, {
        currentStep: 1,
        persona: null,
        roleTag: null,
        selectedRecipeIds: [],
        taskAnswers: {},
        archivedAnswers: {},
        executionNeeds: { parallelBand: '', usersBand: '' },
        costAmountTwd: '',
        costPeriod: 'hour',
        hourlyCostTwd: '',
        result: null
    });
    renderPersonaSelection();
    goToStep(1);
}

function invalidateResult() {
    assessmentState.result = null;
    clearReportPreview();
}

function getRecipe(id) {
    return recipeCatalog.find(recipe => recipe.id === id);
}

function getReferenceMinutes(recipe, scale, mode) {
    const scaleData = recipe.scales[scale];
    const modeData = modeCatalog[mode];
    if (!scaleData || !modeData) return NaN;
    const workflowTarget = scaleData.manualMinutes * calculateWorkflowMetrics(recipe.id).retainedHumanRatio;
    return scaleData.manualMinutes * modeData.baselineWeight + workflowTarget * modeData.agentWeight;
}

function calculateWorkflowMetrics(recipeId) {
    const model = workflowProcessCatalog[recipeId];
    if (!model) throw new Error(`Missing workflow process model: ${recipeId}`);
    const totals = model.steps.reduce((sum, step) => {
        const retained = clamp((1 - step.delegation) + step.delegation * step.review + step.delegation * step.exceptionRate * step.exceptionEffort, 0, 1);
        sum.share += step.share;
        sum.retainedHumanRatio += step.share * retained;
        sum.coverage += step.share * step.delegation;
        sum.autonomousWork += step.share * step.delegation * (1 - step.review);
        sum.computeIntensity += step.share * step.compute;
        return sum;
    }, { share: 0, retainedHumanRatio: 0, coverage: 0, autonomousWork: 0, computeIntensity: 0 });
    if (Math.abs(totals.share - 1) > 0.0001) throw new Error(`Workflow shares must total 1: ${recipeId}`);
    return Object.freeze({
        retainedHumanRatio: clamp(totals.retainedHumanRatio, 0, 1),
        coverageRate: clamp(totals.coverage * 100, 0, 100),
        autonomyRate: totals.coverage > 0 ? clamp(totals.autonomousWork / totals.coverage * 100, 0, 100) : 0,
        computeIntensity: clamp(totals.computeIntensity, 1, 5),
        stepCount: model.steps.length,
        modelVersion: model.version
    });
}

function isAnswerComplete(answer) {
    if (!answer) return false;
    const frequency = Number(answer.frequency);
    const minutes = Number(answer.currentHumanMinutes);
    return Boolean(answer.scale && answer.currentMode) && Number.isInteger(frequency) && frequency >= 1 && frequency <= 100 && Number.isFinite(minutes) && minutes >= 0.1 && minutes <= 10080;
}

function summarizeAnswer(recipe, answer) {
    if (!answer || !answer.frequency) return '尚未設定頻率';
    const parts = [`${answer.frequency} 次／週`];
    if (answer.scale && recipe.scales[answer.scale]) parts.push(recipe.scales[answer.scale].label);
    if (answer.currentMode && modeCatalog[answer.currentMode]) parts.push(modeCatalog[answer.currentMode].label);
    if (Number(answer.currentHumanMinutes) > 0) parts.push(`${formatInputNumber(answer.currentHumanMinutes)} 分鐘／次`);
    return parts.join(' · ');
}

function animateSciJourney() {
    const overview = document.querySelector('.sci-overview');
    if (!overview) return;
    overview.classList.remove('is-animated');
    void overview.offsetWidth;
    overview.classList.add('is-animated');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    overview.querySelectorAll('[data-sci-number]').forEach(element => {
        const from = Number(element.dataset.from);
        const to = Number(element.dataset.value);
        if (reduceMotion) {
            element.textContent = String(to);
            return;
        }
        const start = performance.now();
        const duration = element.closest('.sci-card--target') ? 1100 : 650;
        const tick = now => {
            const progress = clamp((now - start) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(from + (to - from) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

function getCloneIconType(recipeId) {
    const iconsByRecipe = {
        S01: 'receipt', S02: 'clapperboard', S03: 'calculator', S04: 'pen-tool', S05: 'layers', S06: 'waveform', S07: 'list-check', S08: 'code',
        E01: 'book-open', E02: 'presentation', E03: 'scan-search', E04: 'chart', E05: 'mic', E06: 'graduation', E07: 'terminal', E08: 'clipboard',
        B01: 'package-check', B02: 'radar', B03: 'chart-pie', B04: 'headset', B05: 'shopping-bag', B06: 'files', B07: 'wallet', B08: 'users'
    };
    return iconsByRecipe[recipeId] || 'document';
}

function iconSvg(type) {
    const icons = {
        document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/>',
        analytics: '<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>',
        media: '<path d="m16 13 5 3-5 3v-6Z"/><rect width="13" height="16" x="3" y="4" rx="2"/><path d="M7 8h5M7 12h3"/>',
        knowledge: '<path d="M12 5a3 3 0 1 0-5.83 1H6a3 3 0 0 0 0 6h.17A3 3 0 1 0 12 13Z"/><path d="M12 5a3 3 0 1 1 5.83 1H18a3 3 0 0 1 0 6h-.17A3 3 0 1 1 12 13ZM12 5v14"/>',
        monitoring: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a8 8 0 1 0-14.8 0M16.9 17a6 6 0 0 1-9.8 0"/>',
        coding: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
        cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
        gpu: '<rect width="18" height="14" x="3" y="5" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M3 9H1M3 15H1M21 10h2M21 14h2"/>',
        memory: '<rect width="18" height="12" x="3" y="6" rx="2"/><path d="M7 10h2v4H7zM11 10h2v4h-2zM15 10h2v4h-2zM7 18v3M11 18v3M15 18v3"/>',
        database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
        fan: '<circle cx="12" cy="12" r="2"/><path d="M12 10c-1-4 1-7 4-7 2 0 3 2 2 4-1 2-3 3-6 3ZM14 12c4-1 7 1 7 4 0 2-2 3-4 2-2-1-3-3-3-6ZM12 14c1 4-1 7-4 7-2 0-3-2-2-4 1-2 3-3 6-3ZM10 12c-4 1-7-1-7-4 0-2 2-3 4-2 2 1 3 3 3 6Z"/>',
        zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'
        ,motherboard: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="7" height="7" rx="1"/><path d="M17 7h1M17 10h1M7 17v1M10 17v1M14 17h4M17 13v5"/>',
        case: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="8" r="3"/><circle cx="12" cy="16" r="3"/>',
        receipt: '<path d="M6 2v20l3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2Z"/><path d="M9 9h6M9 13h6"/>',
        clapperboard: '<path d="M4 11h16v9H4zM4 7l15-4 1 4-15 4-1-4ZM8 6l2 4M14 4l2 4"/>',
        calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4"/>',
        'pen-tool': '<path d="m12 19 7-7 3 3-7 7-3-3ZM18 13l-1.5-7.5L2 2l3.5 14.5L13 18M2 2l7.6 7.6M12 11a2 2 0 1 1-2.8-2.8A2 2 0 0 1 12 11Z"/>',
        layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
        waveform: '<path d="M2 12h2l2-7 4 14 4-14 4 14 2-7h2"/>',
        'list-check': '<path d="m3 5 2 2 4-4M3 12l2 2 4-4M3 19l2 2 4-4M13 6h8M13 13h8M13 20h8"/>',
        code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>',
        'book-open': '<path d="M2 4h6a4 4 0 0 1 4 4v13a4 4 0 0 0-4-4H2V4ZM22 4h-6a4 4 0 0 0-4 4v13a4 4 0 0 1 4-4h6V4Z"/>',
        presentation: '<path d="M2 3h20M4 3v13h16V3M12 16v5M8 21h8M8 10l3-3 2 2 3-3"/>',
        'scan-search': '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="11" cy="11" r="4"/><path d="m14 14 3 3"/>',
        chart: '<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
        mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
        graduation: '<path d="m2 10 10-5 10 5-10 5L2 10Z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>',
        terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
        clipboard: '<rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h5"/>',
        'package-check': '<path d="m3 7 9-5 9 5-9 5-9-5ZM3 7v10l9 5 9-5V7M12 12v10"/><path d="m15 15 2 2 4-4"/>',
        radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18 6M12 3v2M21 12h-2M12 21v-2M3 12h2"/>',
        'chart-pie': '<path d="M12 2v10h10A10 10 0 1 1 12 2Z"/><path d="M16 2.8A10 10 0 0 1 21.2 8H16V2.8Z"/>',
        headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5ZM17 20c0 1-2 2-5 2"/>',
        'shopping-bag': '<path d="M6 8 4 22h16L18 8H6ZM9 10V6a3 3 0 0 1 6 0v4"/>',
        files: '<path d="M15 2H6a2 2 0 0 0-2 2v13M18 7h-8a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>',
        wallet: '<path d="M4 5h15a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3h13v3M16 11h5v4h-5a2 2 0 0 1 0-4Z"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
    };
    const paths = icons[type] || icons.document;
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function formatChineseList(items) {
    if (!items.length) return '多元日常工作';
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join('、')}與${items.at(-1)}`;
}

function calculateSciScore(rawReliefPercent) {
    return clamp(rawReliefPercent, 0, SCI_CONFIG.scaleMax);
}

function getSciLevel(score) {
    if (score < 18) return 'L1 工作待分擔';
    if (score < 36) return 'L2 分身初步協助';
    if (score < 54) return 'L3 部分流程串接';
    if (score < 72) return 'L4 分身協作';
    return 'L5 高度流程化';
}

function getTimeUnit() {
    return assessmentState.persona === 'smb' && assessmentState.executionNeeds.usersBand !== '1' ? '人時' : '小時';
}

function showError(message, target = null) {
    elements.formError.textContent = message;
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => target.focus?.({ preventScroll: true }), 220);
    }
    return false;
}

function clearError() {
    if (elements.formError) elements.formError.textContent = '';
}

function formatHours(value) {
    return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value) {
    return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(Number(value) || 0);
}

function roundHoursForDisplay(value) {
    return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

function formatMinutes(value) {
    return new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 1 }).format(value);
}

function formatInputNumber(value) {
    const number = Number(value);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function formatCurrency(value) {
    const numericValue = Number(value) || 0;
    const sign = numericValue < 0 ? '-' : '';
    return `${sign}NT$ ${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(Math.abs(numericValue))}`;
}

function formatCurrencyRate(value) {
    return `NT$ ${new Intl.NumberFormat('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value) || 0)}`;
}

function formatTokens(value) {
    if (value >= 1000000) return `${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 1 }).format(value / 1000000)}M`;
    if (value >= 1000) return `${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value / 1000)}K`;
    return new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value);
}

function formatTaipeiDate(iso) {
    return new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

function taipeiDateStamp() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${map.year}-${map.month}-${map.day}`;
}

function validNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function drawTaskDistributionBar(ctx, tasks, x, y, width, height, splitForAgent, font) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 5);
    ctx.clip();
    ctx.fillStyle = 'rgba(148,163,184,.12)';
    ctx.fillRect(x, y, width, height);
    let offset = x;
    tasks.forEach((task, index) => {
        const segmentWidth = width * task.loadShare / 100;
        ctx.fillStyle = getWorkloadColor(index);
        ctx.fillRect(offset, y, segmentWidth, height);
        if (splitForAgent) {
            const remaining = clamp(100 - task.targetReliefRate, 0, 100);
            const assistX = offset + segmentWidth * remaining / 100;
            const assistWidth = segmentWidth * (100 - remaining) / 100;
            ctx.fillStyle = '#55D6A6';
            ctx.fillRect(assistX, y, assistWidth, height);
        }
        if (index > 0) {
            ctx.fillStyle = 'rgba(6,16,25,.68)';
            ctx.fillRect(offset, y, 1, height);
        }
        offset += segmentWidth;
    });
    ctx.restore();
    if (!splitForAgent) {
        let labelOffset = x;
        tasks.forEach((task, index) => {
            const segmentWidth = width * task.loadShare / 100;
            if (segmentWidth >= 24) canvasText(ctx, String(index + 1).padStart(2, '0'), labelOffset + segmentWidth / 2, y + 13, `700 8px ${font}`, '#FFFFFF', 'center');
            labelOffset += segmentWidth;
        });
    }
}

function drawOverallDistributionBar(ctx, x, y, width, height, humanShare, aiShare) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 6);
    ctx.clip();
    ctx.fillStyle = '#4B5768';
    ctx.fillRect(x, y, width * humanShare / 100, height);
    ctx.fillStyle = '#55D6A6';
    ctx.fillRect(x + width * humanShare / 100, y, width * aiShare / 100, height);
    ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke = null) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function drawHardwareGradeStamp(ctx, grade, x, y, font) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.strokeStyle = 'rgba(32,201,235,.82)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 31, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#20C9EB';
    ctx.font = `800 7px ${font}`;
    ctx.fillText('影分身戰力', 0, -7);
    ctx.font = `900 23px ${font}`;
    ctx.fillText(String(grade), 0, 15);
    ctx.restore();
}

function canvasText(ctx, text, x, y, font, color, align = 'left') {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(String(text), x, y);
    ctx.textAlign = 'left';
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    const chars = Array.from(String(text));
    const lines = [];
    let line = '';
    chars.forEach(char => {
        const candidate = line + char;
        if (line && ctx.measureText(candidate).width > maxWidth) {
            lines.push(line);
            line = char;
        } else {
            line = candidate;
        }
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((current, index) => {
        let output = current;
        if (index === maxLines - 1 && lines.length > maxLines) {
            while (output.length && ctx.measureText(`${output}…`).width > maxWidth) output = output.slice(0, -1);
            output += '…';
        }
        ctx.fillText(output, x, y + index * lineHeight);
    });
}

function trackEvent(name, detail) {
    document.dispatchEvent(new CustomEvent('sci:analytics', { detail: { name, ...detail, versions: VERSIONS } }));
}
