'use strict';

const VERSIONS = Object.freeze({
    scoring: 'sci-index-v5',
    workflows: 'workflow-model-v2',
    recipes: 'recipes-v2',
    hardware: 'hardware-v4'
});

const SCI_CONFIG = Object.freeze({
    scaleMax: 100
});

const COST_PERIOD_HOURS = Object.freeze({ hour: 1, week: 40, month: 160 });
const TOKEN_CONFIG = Object.freeze({ costPerTokenTwd: 0.00016, tokensPerTwd: 6250, label: '1 Token = NT$0.00016' });
const USD_TWD_RATE = 31.92;
function createCloudPlan(id, brandId, brand, plan, monthlyUsd) {
    return Object.freeze({
        id,
        brandId,
        brand,
        plan,
        monthlyUsd,
        monthlyTwd: Math.round(monthlyUsd * USD_TWD_RATE)
    });
}

const CLOUD_PLAN_CATALOG = Object.freeze([
    createCloudPlan('chatgpt-free', 'chatgpt', 'ChatGPT', 'Free', 0),
    createCloudPlan('chatgpt-go', 'chatgpt', 'ChatGPT', 'Go', 8),
    createCloudPlan('chatgpt-plus', 'chatgpt', 'ChatGPT', 'Plus', 20),
    createCloudPlan('chatgpt-pro-100', 'chatgpt', 'ChatGPT', 'Pro 100', 100),
    createCloudPlan('chatgpt-pro-200', 'chatgpt', 'ChatGPT', 'Pro 200', 200),
    createCloudPlan('chatgpt-pro-500', 'chatgpt', 'ChatGPT', 'Pro 500', 500),
    createCloudPlan('gemini-free', 'gemini', 'Gemini', 'Free', 0),
    createCloudPlan('gemini-ai-plus', 'gemini', 'Gemini', 'Google AI Plus', 4.99),
    createCloudPlan('gemini-ai-pro', 'gemini', 'Gemini', 'Google AI Pro', 19.99),
    createCloudPlan('gemini-ai-ultra-5x', 'gemini', 'Gemini', 'Google AI Ultra 5x', 99.99),
    createCloudPlan('gemini-ai-ultra-20x', 'gemini', 'Gemini', 'Google AI Ultra 20x', 199.99),
    createCloudPlan('claude-free', 'claude', 'Claude', 'Free', 0),
    createCloudPlan('claude-pro', 'claude', 'Claude', 'Pro', 20),
    createCloudPlan('claude-max-5x', 'claude', 'Claude', 'Max 5x', 100),
    createCloudPlan('claude-max-20x', 'claude', 'Claude', 'Max 20x', 200)
]);

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
            small: Object.freeze({ label: '少量', description: descriptions[0], manualMinutes: manual * 0.6, baseTier: tiers[0] }),
            standard: Object.freeze({ label: '參考量', description: descriptions[1], manualMinutes: manual, baseTier: tiers[1] }),
            large: Object.freeze({ label: '大量', description: descriptions[2], manualMinutes: manual * 2.5, baseTier: tiers[2] })
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
            Object.freeze({ name: 'Agent Pioneer-A', mb: 'AMD B850', cpu: 'AMD Ryzen 7 9700X', gpu: 'NVIDIA GeForce RTX 5070 12GB', ram: '64GB（32GB×2）DDR5 6000MHz', ssd: '2TB PCIe 4.0 NVMe M.2', case: 'ASUS PRIME AP303', cooling: 'TUF Gaming LC III 360 ARGB', psu: 'TUF GAMING 850W 金牌' }),
            Object.freeze({ name: 'Agent Pioneer-I', mb: 'Intel B860', cpu: 'Intel Core Ultra 7 265K', gpu: 'NVIDIA GeForce RTX 5070 12GB', ram: '64GB（32GB×2）DDR5 6000MHz', ssd: '2TB PCIe 4.0 NVMe M.2', case: 'ASUS PRIME AP303', cooling: 'TUF Gaming LC III 360 ARGB', psu: 'TUF GAMING 850W 金牌' })
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
            Object.freeze({ name: 'Agent Professional-A', mb: 'AMD X870', cpu: 'AMD Ryzen 9 9900X', gpu: 'AMD Radeon AI PRO R9700 32GB', ram: '128GB DDR5 6000MHz', ssd: '4TB PCIe 4.0 NVMe M.2', case: 'TUF GAMING GT502 Horizon', cooling: 'ROG STRIX LC III 360 ARGB', psu: 'ROG STRIX 1000W 金牌' }),
            Object.freeze({ name: 'Agent Professional-I', mb: 'Intel Z890', cpu: 'Intel Core Ultra 7 265K', gpu: 'NVIDIA GeForce RTX 5070 12GB', ram: '128GB DDR5 6000MHz', ssd: '4TB PCIe 4.0 NVMe M.2', case: 'TUF GAMING GT502 Horizon', cooling: 'ROG STRIX LC III 360 ARGB', psu: 'ROG STRIX 1000W 金牌' }),
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
            Object.freeze({ name: 'Agent Master-A', mb: 'AMD X870E', cpu: 'AMD Ryzen 9 9950X', gpu: 'NVIDIA GeForce RTX 5090 32GB', ram: '128GB DDR5 6000MHz', ssd: '4TB PCIe 5.0', case: 'ROG Strix Helios', cooling: 'ProArt LC 420', psu: 'ROG THOR III 1200W' }),
            Object.freeze({ name: 'Agent Master-I', mb: 'Intel Z890', cpu: 'Intel Core Ultra 9 285K', gpu: 'NVIDIA GeForce RTX 5090 32GB', ram: '128GB（32GB×4）DDR5 6000MHz', ssd: '4TB PCIe 5.0', case: 'ROG Strix Helios', cooling: 'ROG RYUJIN III 360 ARGB', psu: 'ROG THOR III 1200W' })
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
            Object.freeze({ name: 'ET700I W7', mb: 'Intel W790', cpu: 'Intel Xeon W-3400', gpu: 'NVIDIA RTX 6000 Ada', ram: '512GB RDIMM DDR5 4800', ssd: '4TB PCIe 4.0', case: 'ROG Cronox ARGB', cooling: '依工作站配置', psu: '1300W' }),
            Object.freeze({ name: 'RTX DGX／Spark', mb: '不適用（整合式系統）', cpu: 'NVIDIA DGX／Spark', gpu: 'NVIDIA Blackwell', ram: '128GB', ssd: '2TB', case: 'DGX Spark 整合式機身', integratedChassis: true, cooling: '整合式散熱', psu: '不適用（整合式系統）' })
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
    manual: { label: '主要手動完成', baselineWeight: 1, agentWeight: 0 },
    assisted: { label: '使用 AI 協助', baselineWeight: 0.58, agentWeight: 0.42 },
    automated: { label: '已有自動化流程', baselineWeight: 0.18, agentWeight: 0.82 }
});

const assessmentState = {
    currentStep: 1,
    persona: null,
    roleTag: null,
    selectedRecipeIds: [],
    taskAnswers: {},
    archivedAnswers: {},
    executionNeeds: { parallelBand: '' },
    costAmountTwd: '',
    costPeriod: 'hour',
    periodHours: 160,
    hourlyCostTwd: '',
    cloudUsage: '',
    cloudPlans: [],
    cloudOtherCostTwd: '',
    result: null
};

let reportPreviewUrl = null;
let lastModalTrigger = null;

const elements = {};

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    Object.assign(elements, {
        personaGrid: document.getElementById('persona-grid'),
        recipeGrid: document.getElementById('recipe-grid'),
        selectedCount: document.getElementById('selected-count'),
        taskSettings: document.getElementById('task-settings'),
        parallelOptions: document.getElementById('parallel-options'),
        hourlyCost: document.getElementById('hourly-cost'),
        costPeriod: document.getElementById('cost-period'),
        periodHours: document.getElementById('period-hours'),
        conversionHours: document.getElementById('conversion-hours'),
        costConversion: document.getElementById('cost-conversion'),
        cloudUsageOptions: document.getElementById('cloud-usage-options'),
        cloudPaidOptions: document.getElementById('cloud-paid-options'),
        cloudPlanOptions: document.getElementById('cloud-plan-options'),
        cloudOtherCost: document.getElementById('cloud-other-cost'),
        cloudCostTotal: document.getElementById('cloud-cost-total'),
        taskProgressSummary: document.getElementById('task-progress-summary'),
        loadWarning: document.getElementById('load-warning'),
        backButton: document.getElementById('back-button'),
        nextButton: document.getElementById('next-button'),
        formError: document.getElementById('form-error'),
        navigation: document.getElementById('form-navigation'),
        modal: document.getElementById('modal'),
        modalPanel: document.querySelector('.modal__panel'),
        modalContent: document.getElementById('modal-content')
    });

    document.getElementById('reset-button').addEventListener('click', requestResetAssessment);
    elements.backButton.addEventListener('click', previousStep);
    elements.nextButton.addEventListener('click', nextStep);
    elements.hourlyCost.addEventListener('input', syncCostSettings);
    elements.costPeriod.addEventListener('change', syncCostSettings);
    elements.periodHours.addEventListener('input', syncCostSettings);
    elements.cloudOtherCost.addEventListener('input', syncCloudSettings);
    document.querySelectorAll('[data-go-step]').forEach(button => {
        button.addEventListener('click', () => goToStep(Number(button.dataset.goStep)));
    });
    document.querySelectorAll('[data-progress-trigger]').forEach(button => {
        button.addEventListener('click', () => handleProgressStepClick(Number(button.dataset.progressTrigger)));
    });
    document.getElementById('result-reset-button').addEventListener('click', requestResetAssessment);
    document.getElementById('missing-work-button').addEventListener('click', event => openMissingWorkModal(event.currentTarget));
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
    elements.personaGrid.setAttribute('role', 'radiogroup');
    elements.personaGrid.setAttribute('aria-label', '主要工作身分');
    elements.personaGrid.innerHTML = Object.entries(personaCatalog).map(([key, persona]) => `
        <label class="persona-card ${assessmentState.persona === key ? 'is-selected' : ''}" data-persona="${key}">
            <input type="radio" name="persona" value="${key}" ${assessmentState.persona === key ? 'checked' : ''}>
            <span class="persona-icon" aria-hidden="true">${persona.icon}</span>
            <span class="persona-card__copy"><strong>${persona.name}</strong><span>${persona.description}</span></span>
            <i aria-hidden="true">✓</i>
        </label>
    `).join('');
    elements.personaGrid.querySelectorAll('input[name="persona"]').forEach(input => {
        input.addEventListener('change', () => selectPersona(input.value));
    });
}

function selectPersona(personaKey) {
    if (assessmentState.persona && assessmentState.persona !== personaKey && assessmentState.selectedRecipeIds.length) {
        renderPersonaSelection();
        elements.modalContent.innerHTML = `<div class="confirm-reset"><span class="step-kicker">更換工作身分</span><h2 id="modal-title">要切換到其他族群嗎？</h2><p>任務清單會跟著改變，目前已選任務與時間設定將清除。</p><div><button class="button button--quiet" type="button" data-close-modal>保留目前身分</button><button class="button button--accent" type="button" id="confirm-persona-button">確認切換</button></div></div>`;
        elements.modalContent.querySelector('[data-close-modal]').addEventListener('click', closeModal);
        document.getElementById('confirm-persona-button').addEventListener('click', () => {
            closeModal();
            applyPersonaSelection(personaKey);
        });
        openModal(elements.personaGrid.querySelector(`input[value="${assessmentState.persona}"]`));
        return;
    }
    applyPersonaSelection(personaKey);
}

function applyPersonaSelection(personaKey) {
    if (assessmentState.persona !== personaKey) {
        assessmentState.persona = personaKey;
        assessmentState.roleTag = null;
        assessmentState.selectedRecipeIds = [];
        assessmentState.taskAnswers = {};
        assessmentState.archivedAnswers = {};
        assessmentState.executionNeeds = { parallelBand: '' };
        invalidateResult();
    }
    clearError();
    renderPersonaSelection();
    updateNavigation();
}

function getPersonaRecipes() {
    const recipes = recipeCatalog.filter(recipe => recipe.persona === assessmentState.persona);
    return recipes.slice().sort((a, b) => a.id.localeCompare(b.id));
}

function renderRecipeSelection() {
    const recipes = getPersonaRecipes();
    const limitReached = assessmentState.selectedRecipeIds.length >= 6;
    const openDetailIds = new Set([...elements.recipeGrid.querySelectorAll('.recipe-detail[open]')].map(detail => detail.closest('[data-recipe-card]')?.dataset.recipeCard).filter(Boolean));
    elements.recipeGrid.innerHTML = recipes.map(recipe => {
        const selected = assessmentState.selectedRecipeIds.includes(recipe.id);
        return `
            <article class="recipe-card ${selected ? 'is-selected' : ''} ${limitReached && !selected ? 'is-limit-reached' : ''}" data-recipe-card="${recipe.id}">
                <label class="recipe-select">
                    <input type="checkbox" value="${recipe.id}" ${selected ? 'checked' : ''} ${limitReached && !selected ? 'disabled' : ''} aria-describedby="recipe-summary-${recipe.id}">
                    <span>
                        <strong>${recipe.title}</strong>
                        <p id="recipe-summary-${recipe.id}">${getRecipeContext(recipe)}</p>
                    </span>
                    ${limitReached && !selected ? '<em>已達上限</em>' : ''}
                </label>
                <details class="recipe-detail" ${openDetailIds.has(recipe.id) ? 'open' : ''}>
                    <summary>查看 AI 可協助的流程</summary>
                    <div class="recipe-detail__body">
                        <div><h4>AI 可協助</h4><p>${recipe.assist}</p></div>
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
        timeSource: '',
        timeConfirmed: false
    };
}

function renderPeriodOptions(selectedValue) {
    return [['day', '每天'], ['week', '每週'], ['month', '每月']].map(([value, label]) => `<option value="${value}" ${selectedValue === value ? 'selected' : ''}>${label}</option>`).join('');
}

function renderTaskSettings() {
    const ordered = assessmentState.selectedRecipeIds.map(getRecipe);
    elements.taskSettings.innerHTML = ordered.map((recipe, index) => {
        const answer = assessmentState.taskAnswers[recipe.id] || createDefaultAnswer(recipe.id);
        assessmentState.taskAnswers[recipe.id] = answer;
        const complete = isAnswerComplete(answer);
        const reference = getReferenceMinutes(recipe, answer.scale, answer.currentMode);
        const hasReference = Number.isFinite(reference);
        const monthlyFrequency = frequencyToMonthly(answer.frequency, answer.period);
        return `
            <details class="task-setting ${complete ? 'is-complete' : ''}" data-task-id="${recipe.id}" open>
                <summary>
                    <span class="task-summary-title"><span class="task-index">${index + 1}</span><span><strong>${recipe.title}</strong><small>${summarizeAnswer(recipe, answer)}</small></span></span>
                </summary>
                <div class="task-setting__body">
                    <div class="task-field-sequence">
                        <div class="task-field-step">
                            <span class="field-number">1</span><div class="field-block"><label for="frequency-${recipe.id}">多常做一次？</label><div class="frequency-sentence"><select data-field="period" aria-label="選擇執行週期">${renderPeriodOptions(answer.period)}</select><input id="frequency-${recipe.id}" data-field="frequency" type="number" min="1" max="1000" step="1" inputmode="numeric" value="${answer.frequency}" placeholder="次數"><span>次</span></div><p class="field-help" data-monthly-frequency>${monthlyFrequency > 0 ? `約每月 ${formatInputNumber(monthlyFrequency)} 次` : '例如每週 2 次或每月 1 次'}</p></div>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">2</span><fieldset><legend>這項工作約占你整體工時多少？</legend><div class="scale-options loading-options">${Object.keys(recipe.scales).map(key => { const loading = getLoadingMeta(key); return `<label class="scale-option loading-option"><input type="radio" name="scale-${recipe.id}" value="${key}" ${answer.scale === key ? 'checked' : ''}><span><i class="loading-meter" aria-hidden="true">${[1, 2, 3].map(level => `<em class="${level <= loading.level ? 'is-active' : ''}"></em>`).join('')}</i><b>${loading.label}</b></span></label>`; }).join('')}</div></fieldset>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">3</span><fieldset><legend>現在怎麼完成？</legend><div class="mode-options">${Object.entries(modeCatalog).map(([key, mode]) => `<label><input type="radio" name="mode-${recipe.id}" value="${key}" ${answer.currentMode === key ? 'checked' : ''}><span><b>${mode.label}</b><small>${getModeDescription(key)}</small></span></label>`).join('')}</div></fieldset>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">4</span><div class="field-block"><label for="minutes-${recipe.id}">每次人工投入時間</label><div class="input-prefix time-input"><input id="minutes-${recipe.id}" data-field="currentHumanMinutes" type="number" min="0.1" max="10080" step="0.1" inputmode="decimal" value="${answer.currentHumanMinutes === '' ? '' : formatInputNumber(answer.currentHumanMinutes)}" placeholder="完成前面設定後自動帶入"><span>分鐘</span></div><span class="reference-value" data-reference-value>${hasReference ? `已先套用參考估算：${formatMinutes(reference)} 分鐘／次，可直接修改` : '完成工時占比與目前做法後，系統會先帶入參考估算'}</span><p class="field-help">包含資料準備、操作、整理、檢查與修改。</p></div>
                        </div>
                    </div>
                </div>
            </details>
        `;
    }).join('');

    elements.taskSettings.querySelectorAll('[data-task-id]').forEach(card => bindTaskCard(card));
    updateTaskProgressSummary();
    renderLoadWarning();
}

function bindTaskCard(card) {
    const recipeId = card.dataset.taskId;
    card.querySelector('summary').addEventListener('click', () => handleTaskSummaryClick(card));
    card.querySelectorAll(`input[name="scale-${recipeId}"]`).forEach(input => input.addEventListener('change', () => updateAnswerScale(recipeId, input.value)));
    card.querySelectorAll(`input[name="mode-${recipeId}"]`).forEach(input => input.addEventListener('change', () => updateAnswerMode(recipeId, input.value)));
    card.querySelector('[data-field="frequency"]').addEventListener('input', event => updateSimpleAnswer(recipeId, 'frequency', event.target.value));
    card.querySelector('[data-field="period"]').addEventListener('change', event => updateSimpleAnswer(recipeId, 'period', event.target.value));
    card.querySelector('[data-field="currentHumanMinutes"]').addEventListener('input', event => updateHumanMinutes(recipeId, event.target.value));
}

function updateAnswerScale(recipeId, scale) {
    const answer = assessmentState.taskAnswers[recipeId];
    answer.scale = scale;
    if (answer.currentMode && answer.timeSource !== 'custom') {
        answer.currentHumanMinutes = getReferenceMinutes(getRecipe(recipeId), scale, answer.currentMode);
        answer.timeSource = 'reference';
        answer.timeConfirmed = true;
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
        answer.timeConfirmed = true;
    }
    invalidateResult();
    refreshTaskEstimate(recipeId);
}

function updateHumanMinutes(recipeId, value) {
    const answer = assessmentState.taskAnswers[recipeId];
    answer.currentHumanMinutes = value;
    answer.timeSource = 'custom';
    answer.timeConfirmed = Number(value) > 0;
    invalidateResult();
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    updateTaskCardStatus(recipeId);
    renderLoadWarning();
}

function updateSimpleAnswer(recipeId, field, value) {
    assessmentState.taskAnswers[recipeId][field] = value;
    invalidateResult();
    updateTaskCardStatus(recipeId);
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    const monthlyLabel = card?.querySelector('[data-monthly-frequency]');
    if (monthlyLabel) {
        const answer = assessmentState.taskAnswers[recipeId];
        const monthly = frequencyToMonthly(answer.frequency, answer.period);
        monthlyLabel.textContent = monthly > 0 ? `約每月 ${formatInputNumber(monthly)} 次` : '例如每週 2 次或每月 1 次';
    }
    renderLoadWarning();
}

function refreshTaskEstimate(recipeId) {
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return;
    const wasOpen = card.open;
    renderTaskSettings();
    const refreshedCard = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (refreshedCard) refreshedCard.open = wasOpen;
}

function updateTaskCardStatus(recipeId) {
    const answer = assessmentState.taskAnswers[recipeId];
    const recipe = getRecipe(recipeId);
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!card) return;
    const complete = isAnswerComplete(answer);
    card.classList.toggle('is-complete', complete);
    const summary = card.querySelector('.task-summary-title small');
    if (summary) summary.textContent = summarizeAnswer(recipe, answer);
    if (complete) clearTaskErrors(recipeId);
    else if (card.classList.contains('has-error')) markTaskErrors(recipeId, false);
    updateTaskProgressSummary();
}

function handleTaskSummaryClick(targetCard) {
    clearError();
}

function getMissingTaskFields(recipeId) {
    const answer = assessmentState.taskAnswers[recipeId];
    const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
    if (!answer || !card) return [];
    const missing = [];
    const frequency = Number(answer.frequency);
    const minutes = Number(answer.currentHumanMinutes);
    if (!Number.isInteger(frequency) || frequency <= 0 || frequency > 1000) missing.push(card.querySelector('[data-field="frequency"]'));
    if (!answer.scale) missing.push(card.querySelector('.scale-options'));
    if (!answer.currentMode) missing.push(card.querySelector('.mode-options'));
    if (answer.scale && answer.currentMode && (!answer.timeSource || !answer.timeConfirmed || !Number.isFinite(minutes) || minutes < 0.1 || minutes > 10080)) {
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
}

function updateTaskProgressSummary() {
    if (!elements.taskProgressSummary) return;
    const total = assessmentState.selectedRecipeIds.length;
    const complete = assessmentState.selectedRecipeIds.filter(id => isAnswerComplete(assessmentState.taskAnswers[id])).length;
    elements.taskProgressSummary.innerHTML = `<span><b>${complete}</b>／${total} 項已完成</span><i style="--progress:${total ? complete / total * 100 : 0}%" aria-hidden="true"></i>`;
}

function renderSharedOptions() {
    const parallelOptions = [
        ['1', '多半依序'], ['2', '約 2 項同時'], ['3-4', '3 至 4 項同時'], ['5+', '5 項以上'], ['unknown', '不確定']
    ];
    const cloudBrands = [
        ['chatgpt', 'ChatGPT'],
        ['gemini', 'Gemini'],
        ['claude', 'Claude']
    ];
    const cloudUsageOptions = [
        ['none', '未使用 AI'],
        ['free', '使用免費 AI'],
        ['paid', '訂閱 AI']
    ];
    elements.parallelOptions.innerHTML = parallelOptions.map(([value, label]) => `<label><input type="radio" name="parallel-band" value="${value}"><span>${label}</span></label>`).join('');
    elements.cloudUsageOptions.innerHTML = cloudUsageOptions.map(([value, label]) => `<label><input type="radio" name="cloud-usage" value="${value}"><span>${label}</span></label>`).join('');
    elements.cloudPlanOptions.innerHTML = cloudBrands.map(([brandId, brand]) => {
        const plans = CLOUD_PLAN_CATALOG.filter(plan => plan.brandId === brandId && plan.monthlyTwd > 0);
        return `<details class="cloud-service-group" data-cloud-provider="${brandId}">
            <summary><strong>${brand}</strong><span data-cloud-brand-summary="${brandId}">選擇方案</span></summary>
            <div class="cloud-service-plans">${plans.map(plan => `<label class="cloud-plan-option"><input type="checkbox" name="cloud-plan-${brandId}" value="${plan.id}" data-cloud-plan><span><strong>${plan.plan}</strong><small>${formatCurrency(plan.monthlyTwd)}／月</small></span><b aria-hidden="true">✓</b></label>`).join('')}</div>
        </details>`;
    }).join('');
    elements.parallelOptions.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        assessmentState.executionNeeds.parallelBand = input.value;
        invalidateResult();
    }));
    elements.cloudUsageOptions.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        assessmentState.cloudUsage = input.value;
        if (input.value !== 'paid') clearCloudPaidSelection();
        syncCloudSettings();
        invalidateResult();
    }));
    elements.cloudPlanOptions.querySelectorAll('[data-cloud-plan]').forEach(input => input.addEventListener('change', () => {
        if (input.checked) {
            elements.cloudPlanOptions.querySelectorAll(`input[name="${input.name}"]`).forEach(sibling => {
                if (sibling !== input) sibling.checked = false;
            });
        }
        assessmentState.cloudPlans = [...elements.cloudPlanOptions.querySelectorAll('[data-cloud-plan]:checked')].map(item => item.value);
        input.closest('details')?.removeAttribute('open');
        updateCloudProviderSummaries();
        syncCloudSettings();
        invalidateResult();
    }));
    elements.cloudPlanOptions.querySelectorAll('.cloud-service-group').forEach(group => group.addEventListener('toggle', () => {
        if (!group.open) return;
        elements.cloudPlanOptions.querySelectorAll('.cloud-service-group[open]').forEach(other => {
            if (other !== group) other.removeAttribute('open');
        });
    }));
}

function clearCloudPaidSelection() {
    assessmentState.cloudPlans = [];
    assessmentState.cloudOtherCostTwd = '';
    elements.cloudPlanOptions.querySelectorAll('[data-cloud-plan]').forEach(input => { input.checked = false; });
    elements.cloudOtherCost.value = '';
    updateCloudProviderSummaries();
}

function updateCloudProviderSummaries() {
    elements.cloudPlanOptions.querySelectorAll('[data-cloud-brand-summary]').forEach(summary => {
        const selected = assessmentState.cloudPlans.map(id => CLOUD_PLAN_CATALOG.find(plan => plan.id === id)).find(plan => plan?.brandId === summary.dataset.cloudBrandSummary);
        summary.textContent = selected ? `${selected.plan} · ${formatCurrency(selected.monthlyTwd)}` : '選擇方案';
    });
}

function restoreSharedOptions() {
    document.querySelectorAll('input[name="parallel-band"]').forEach(input => { input.checked = input.value === assessmentState.executionNeeds.parallelBand; });
    document.querySelectorAll('input[name="cloud-usage"]').forEach(input => { input.checked = input.value === assessmentState.cloudUsage; });
    document.querySelectorAll('[data-cloud-plan]').forEach(input => { input.checked = assessmentState.cloudPlans.includes(input.value); });
    elements.hourlyCost.value = assessmentState.costAmountTwd;
    elements.costPeriod.value = assessmentState.costPeriod;
    elements.periodHours.value = assessmentState.periodHours;
    elements.cloudOtherCost.value = assessmentState.cloudOtherCostTwd;
    updateCloudProviderSummaries();
    syncCloudSettings();
    updateCostConversion();
}

function syncCostSettings() {
    const previousPeriod = assessmentState.costPeriod;
    assessmentState.costAmountTwd = elements.hourlyCost.value;
    assessmentState.costPeriod = elements.costPeriod.value;
    if (previousPeriod !== assessmentState.costPeriod && assessmentState.costPeriod !== 'hour') {
        assessmentState.periodHours = assessmentState.costPeriod === 'week' ? 40 : 160;
        elements.periodHours.value = String(assessmentState.periodHours);
    }
    assessmentState.periodHours = validNumber(elements.periodHours.value, assessmentState.costPeriod === 'week' ? 40 : 160);
    assessmentState.hourlyCostTwd = normalizeHourlyCost(assessmentState.costAmountTwd, assessmentState.costPeriod, assessmentState.periodHours);
    updateCostConversion();
    invalidateResult();
}

function syncCloudSettings() {
    elements.cloudPaidOptions.hidden = assessmentState.cloudUsage !== 'paid';
    if (assessmentState.cloudUsage === 'paid') assessmentState.cloudOtherCostTwd = elements.cloudOtherCost.value;
    const total = assessmentState.cloudUsage === 'paid'
        ? getCloudMonthlyCost(assessmentState.cloudPlans, assessmentState.cloudOtherCostTwd)
        : 0;
    elements.cloudCostTotal.textContent = `目前雲端支出合計：${formatCurrency(total)}／月`;
}

function getCloudMonthlyCost(planIds, otherCost) {
    const planTotal = (planIds || []).reduce((sum, id) => sum + (CLOUD_PLAN_CATALOG.find(plan => plan.id === id)?.monthlyTwd || 0), 0);
    const other = Number(otherCost);
    return planTotal + (Number.isFinite(other) && other > 0 ? other : 0);
}

function normalizeHourlyCost(amount, period, customHours) {
    const numericAmount = Number(amount);
    const hours = period === 'hour' ? 1 : validNumber(customHours, COST_PERIOD_HOURS[period] || 1);
    return Number.isFinite(numericAmount) ? numericAmount / hours : 0;
}

function updateCostConversion() {
    const amount = Number(elements.hourlyCost.value);
    const period = elements.costPeriod.value;
    elements.conversionHours.hidden = period === 'hour';
    const hoursLabel = elements.conversionHours.querySelector('label');
    if (hoursLabel) hoursLabel.textContent = period === 'week' ? '每週工作時數' : '每月工作時數';
    if (!Number.isFinite(amount) || amount <= 0) {
        elements.costConversion.textContent = '請填入目前工作流程的成本。';
        return;
    }
    const periodHours = period === 'hour' ? 1 : validNumber(elements.periodHours.value, period === 'week' ? 40 : 160);
    const hourlyCost = normalizeHourlyCost(amount, period, periodHours);
    const assumption = period === 'week' ? `（每週以 ${periodHours} 小時換算）` : period === 'month' ? `（每月以 ${periodHours} 小時換算）` : '';
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
        const monthlyFrequency = frequencyToMonthly(answer?.frequency, answer?.period);
        return sum + monthlyFrequency * validNumber(answer?.currentHumanMinutes, 0) / 60;
    }, 0);
}

function nextStep() {
    clearError();
    if (assessmentState.currentStep === 1) {
        if (!assessmentState.persona) return showError('請先選擇主要工作身分。', elements.personaGrid.querySelector('input'));
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
    document.body.dataset.step = String(assessmentState.currentStep);
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
    const draftStatus = document.getElementById('draft-status');
    if (draftStatus) draftStatus.textContent = `步驟 ${assessmentState.currentStep}／4`;
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
    elements.nextButton.textContent = assessmentState.currentStep === 1
        ? '選擇日常任務'
        : assessmentState.currentStep === 2
            ? '填寫時間與頻率'
            : '查看我的影分身效益';
}

function validateStep3() {
    let firstIncomplete = null;
    let firstIncompleteRecipe = null;
    for (const recipeId of assessmentState.selectedRecipeIds) {
        const card = elements.taskSettings.querySelector(`[data-task-id="${recipeId}"]`);
        if (!isAnswerComplete(assessmentState.taskAnswers[recipeId])) {
            card.open = true;
            const firstMissing = markTaskErrors(recipeId, false);
            if (!firstIncomplete) {
                firstIncomplete = firstMissing || card.querySelector('summary');
                firstIncompleteRecipe = getRecipe(recipeId);
            }
        }
    }
    if (firstIncomplete) return showError(`請補完「${firstIncompleteRecipe.title}」的紅框欄位。`, firstIncomplete);
    if (!assessmentState.executionNeeds.parallelBand) return showError('請選擇平常會同時執行幾個任務。', elements.parallelOptions.querySelector('input'));
    syncCostSettings();
    const cost = Number(assessmentState.costAmountTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 10000000) return showError('請填入大於 0 的工作流程成本，且不可超過 NT$10,000,000。', elements.hourlyCost);
    syncCloudSettings();
    if (!assessmentState.cloudUsage) return showError('請選擇目前是否使用雲端 AI。', elements.cloudUsageOptions.querySelector('input'));
    if (assessmentState.cloudUsage === 'paid' && !assessmentState.cloudPlans.length && !(Number(assessmentState.cloudOtherCostTwd) > 0)) {
        return showError('請選擇至少一個訂閱方案，或填入其他 AI 支出。', elements.cloudPlanOptions.querySelector('summary'));
    }
    if (assessmentState.cloudUsage === 'paid' && assessmentState.cloudOtherCostTwd !== '') {
        const cloudCost = Number(assessmentState.cloudOtherCostTwd);
        if (!Number.isFinite(cloudCost) || cloudCost < 0 || cloudCost > 10000000) return showError('其他雲端支出不可小於 0，且不可超過 NT$10,000,000。', elements.cloudOtherCost);
    }
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
        periodHours: assessmentState.periodHours,
        hourlyCostTwd: assessmentState.hourlyCostTwd,
        cloudUsage: assessmentState.cloudUsage,
        cloudPlans: assessmentState.cloudPlans,
        cloudOtherCostTwd: assessmentState.cloudOtherCostTwd,
        scope: 'selected-workflows'
    }));
}

function calculateAssessment(snapshot) {
    const taskResults = snapshot.selectedRecipeIds.map((recipeId, selectionIndex) => {
        const recipe = getRecipe(recipeId);
        const answer = snapshot.taskAnswers[recipeId];
        const scale = recipe.scales[answer.scale];
        const monthlyFrequency = frequencyToMonthly(answer.frequency, answer.period);
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
            scaleLabel: getLoadingMeta(answer.scale).label,
            frequency: Number(answer.frequency),
            period: answer.period,
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
    const laborSavedMonthlyTwd = displayedSavedHours * hourlyCost;
    const cloudMonthlyTwd = snapshot.cloudUsage === 'paid'
        ? getCloudMonthlyCost(snapshot.cloudPlans, snapshot.cloudOtherCostTwd)
        : 0;
    const totalSavedMonthlyTwd = laborSavedMonthlyTwd + cloudMonthlyTwd;
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
                review: task.review,
                savedMonthlyMinutes: task.savedMonthlyMinutes,
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
            hasLaborValue: hourlyCost > 0,
            hourlyCostTwd: hourlyCost,
            inputAmountTwd: snapshot.costAmountTwd === '' ? null : Number(snapshot.costAmountTwd),
            inputPeriod: snapshot.costPeriod,
            periodHours: snapshot.periodHours,
            currentMonthlyTwd: currentHours * hourlyCost,
            targetMonthlyTwd: targetHours * hourlyCost,
            laborSavedMonthlyTwd,
            cloudSavedMonthlyTwd: cloudMonthlyTwd,
            savedMonthlyTwd: totalSavedMonthlyTwd,
            savedAnnualTwd: totalSavedMonthlyTwd * 12,
            monthlyTwd: totalSavedMonthlyTwd,
            annualTwd: totalSavedMonthlyTwd * 12
        },
        tokens: {
            status: 'converted',
            savedMonthly: totalSavedMonthlyTwd * TOKEN_CONFIG.tokensPerTwd,
            tokensPerTwd: TOKEN_CONFIG.tokensPerTwd,
            costPerTokenTwd: TOKEN_CONFIG.costPerTokenTwd,
            note: `依 ${TOKEN_CONFIG.label} 換算。`
        },
        cloud: {
            usage: snapshot.cloudUsage,
            selectedPlans: snapshot.cloudPlans,
            currentMonthlyTwd: cloudMonthlyTwd,
            reducibleMonthlyTwd: cloudMonthlyTwd
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
    reasons.push(`本次工作量約 ${Math.round(totalBaselineHours)} 小時／月，工作流運算強度為 ${weightedComputeIntensity.toFixed(1)}／5。`);
    if (tierKey === 'ss') reasons.push('高 SCI 代表大量流程可交由影分身處理，搭配極重工作量時需要更高的持續運算與記憶體容量。');
    if (parallel === '5+') needsReview = true;
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
        reasons: reasons.slice(0, 3)
    };
}

function renderResult() {
    const result = assessmentState.result;
    if (!result) return;
    const workHourReleaseRate = result.time.currentHoursMonthly > 0
        ? clamp((result.time.currentHoursMonthly - result.time.targetHoursMonthly) / result.time.currentHoursMonthly * 100, 0, 100)
        : 0;
    const targetScore = Math.round(result.sci.target);
    const targetDescription = `${getSciNarrative(result.sci.target, 'target')} 導入後 SCI 預估達 <strong>${targetScore} 分</strong>：既有工具、流程與影分身合計可承接約 <strong>${targetScore}% 的全人工工作量</strong>。相較目前，預估可釋放約 <strong>${formatPercent(workHourReleaseRate)}% 的現行人工工時</strong>。`;
    document.getElementById('sci-gap').textContent = `+${Math.round(result.sci.gap)} 點`;
    document.getElementById('current-sci-card').innerHTML = renderSciCard('目前 SCI', result.sci.current, getSciLevel(result.sci.current), getSciNarrative(result.sci.current, 'current'), 'current', 0);
    document.getElementById('target-sci-card').innerHTML = renderSciCard('導入後 SCI', result.sci.target, '建立本次影分身流程後', targetDescription, 'target', result.sci.current);
    document.getElementById('metric-highlights').innerHTML = renderMetricHighlights(result);
    document.getElementById('workflow-result-table').innerHTML = renderWorkflowResults(result);
    document.getElementById('clone-list').innerHTML = renderReportClonePlan(result.clones);
    renderHardware(result.recommendation, result);
    setResultSectionsHidden(false);
    requestAnimationFrame(animateSciJourney);
}

function setResultSectionsHidden(hidden) {
    document.querySelector('.workflow-results').hidden = hidden;
    document.getElementById('report-preview-button').disabled = hidden;
}

function renderSciCard(label, score, status, description, variant, fromValue) {
    const rounded = Math.round(score);
    const barPercent = clamp(score / SCI_CONFIG.scaleMax * 100, 0, 100);
    const infoButton = variant === 'current' ? '<button type="button" class="sci-info-trigger" id="sci-info-trigger" aria-label="SCI 是什麼？點擊查看計算方式">?</button>' : '';
    return `<div class="sci-card__top"><span class="sci-card__label"><strong>${label}</strong>${infoButton}</span><span>${status}</span></div><div class="sci-card__score"><strong data-sci-number data-from="${Math.round(fromValue)}" data-value="${rounded}">${Math.round(fromValue)}</strong><span>／${SCI_CONFIG.scaleMax}</span></div><div class="sci-card__bar" aria-hidden="true"><i data-sci-bar style="--score:${barPercent}%"></i></div><p>${description}</p>`;
}

function getSciNarrative(score, variant) {
    const narratives = [
        {
            max: 19,
            current: '目前的 SCI 偏低，工作仍以人工處理為主，還有許多環節可以運用影分身協作。',
            target: '預估導入後，可開始讓影分身承接重複性任務，建立第一批可複製的協作流程。'
        },
        {
            max: 39,
            current: '你已經透過部分工具或流程減少人工投入，但跨任務的協作仍有提升空間。',
            target: '預估導入後，更多工作可由影分身協助處理，減少人工在任務之間反覆切換。'
        },
        {
            max: 59,
            current: '你已有一定程度的工具協作基礎，下一步可以串接更多工作環節。',
            target: '預估導入後，影分身可參與更多工作環節，讓人力更集中在審核與決策。'
        },
        {
            max: 79,
            current: '多數工作已有工具或流程協助，人工主要投入在較複雜的環節。',
            target: '預估導入後，多數標準化工作可透過工具、流程與影分身協作完成。'
        },
        {
            max: 100,
            current: '你的工作已有高度協作基礎，可進一步檢視品質、例外處理與人工審核配置。',
            target: '預估導入後，人工可更聚焦於品質把關、例外處理及關鍵決策。'
        }
    ];
    const roundedScore = Math.round(score);
    const narrative = narratives.find(item => roundedScore <= item.max) || narratives[narratives.length - 1];
    return narrative[variant];
}

function renderMetricHighlights(result) {
    return `
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('clock')}</span>
            <div><span>釋放工時</span><strong>${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}</strong></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('receipt')}</span>
            <div><span>工時價值</span><strong>${formatCurrency(result.cost.laborSavedMonthlyTwd)}</strong></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('zap')}</span>
            <div><span>約等同於</span><strong>${formatTokens(result.tokens.savedMonthly)}</strong><span class="impact-hero__unit">雲端 Token 費用</span></div>
        </article>`;
}

function renderWorkflowResults(result) {
    return `<div class="workflow-stack">${renderWorkloadOverview(result)}</div>`;
}

function renderWorkflowImpactCard(task, index) {
    const shadowShare = clamp(task.targetReliefRate, 0, 100);
    const humanShare = 100 - shadowShare;
    return `<article class="workflow-impact-card">
        <header><div class="workflow-impact-card__identity"><img class="workflow-clone-avatar" src="${getCloneAvatarPath(task.recipeId)}" alt="${task.cloneTag}"><div><span>TASK ${String(index + 1).padStart(2, '0')} · ${task.scaleLabel} · ${getFrequencyLabel(task)}</span><h4>${task.title}</h4></div></div><div class="load-chip" aria-label="人工與影分身處理比例"><span>人工處理 <b>${formatPercent(humanShare)}%</b></span><span>影分身協助 <b>${formatPercent(shadowShare)}%</b></span></div></header>
        <div class="workflow-detail-columns"><div><span>影分身可協助</span><p>${task.assist}</p></div><div><span>仍需人工</span><p>${task.review}</p></div></div>
        <div class="workflow-impact-grid">
            <div><span>目前投入</span><strong>${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <span class="workflow-arrow" aria-hidden="true">${iconSvg('arrow-right')}</span>
            <div><span>導入後</span><strong>${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <div class="saved-highlight"><span>每月可釋放</span><strong>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</strong><small>${task.savedCostMonthlyTwd > 0 ? `工時價值 ${formatCurrency(task.savedCostMonthlyTwd)}` : '未填人力時間價值'}</small></div>
        </div>
    </article>`;
}

function renderWorkloadOverview(result) {
    const maxHours = Math.max(...result.taskResults.map(task => task.currentMonthlyMinutes / 60), 1);
    const rows = result.taskResults.map((task, index) => {
        const currentHours = task.currentMonthlyMinutes / 60;
        const targetHours = task.targetMonthlyMinutes / 60;
        const currentWidth = clamp(currentHours / maxHours * 100, 2, 100);
        const targetWidth = clamp(targetHours / maxHours * 100, 1, 100);
        return `<button type="button" class="time-comparison-row ${index === 0 ? 'is-selected' : ''}" data-task-toggle="${index}" aria-expanded="${index === 0}" aria-controls="workload-task-detail">
            <span class="time-comparison-row__title"><b>${String(index + 1).padStart(2, '0')}</b><strong>${task.title}${index === 0 ? '<em class="priority-task-label">優先導入</em>' : ''}</strong><small>${getFrequencyLabel(task)}</small></span>
            <span class="time-comparison-row__chart"><i class="time-bar time-bar--current" style="--bar:${currentWidth}%"><em>目前 ${formatHours(currentHours)} 小時</em></i><i class="time-bar time-bar--target" style="--bar:${targetWidth}%"><em>導入後 ${formatHours(targetHours)} 小時</em></i></span>
            <span class="time-comparison-row__saved"><small>每月減少</small><span class="time-reduction-value"><strong>${formatHours(task.savedMonthlyMinutes / 60)} 小時</strong><em aria-label="下降 ${formatPercent(task.reliefRate)}%">↓ ${formatPercent(task.reliefRate)}%</em></span></span>
        </button>`;
    }).join('');
    return `<section class="workload-overview" aria-labelledby="workload-overview-title">
        <header><h4 id="workload-overview-title">每月人工工時：導入前 → 導入後</h4></header>
        <div class="time-comparison-legend"><span><i></i>目前人工工時</span><span><i></i>導入後人工工時</span></div>
        <div class="time-comparison-list">${rows}</div>
        <div class="workload-task-detail" id="workload-task-detail" data-open-index="0">${renderWorkflowImpactCard(result.taskResults[0], 0)}</div>
    </section>`;
}

function toggleTaskDetail(index) {
    const result = assessmentState.result;
    if (!result || !result.taskResults[index]) return;
    const panel = document.getElementById('workload-task-detail');
    if (!panel) return;
    const buttons = document.querySelectorAll('[data-task-toggle]');
    const nextOpenIndex = index;
    buttons.forEach(button => {
        const isSelected = nextOpenIndex !== null && Number(button.dataset.taskToggle) === nextOpenIndex;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-expanded', String(isSelected));
    });
    panel.innerHTML = renderWorkflowImpactCard(result.taskResults[nextOpenIndex], nextOpenIndex);
    panel.hidden = false;
    panel.dataset.openIndex = String(nextOpenIndex);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

function getLoadingMeta(scale) {
    return {
        small: { label: '低', level: 1 },
        standard: { label: '中', level: 2 },
        large: { label: '高', level: 3 }
    }[scale] || { label: '未設定', level: 0 };
}

function getModeDescription(mode) {
    return {
        manual: '自己蒐集、整理、撰寫與檢查',
        assisted: 'AI 幫忙部分步驟，仍需複製資料及串接工具',
        automated: '工具已串接多個步驟，主要負責檢查與例外處理'
    }[mode] || '';
}

function getRecipeContext(recipe) {
    const contextByProfile = {
        document: '整理資料並產出可使用的內容草稿',
        analytics: '彙整資料、找出差異並準備分析結果',
        media: '處理影音素材與多版本內容準備',
        knowledge: '查找、摘要並組織知識內容',
        monitoring: '持續彙整狀態、變化與待辦事項',
        coding: '協助撰寫、修改及檢查程式工作'
    };
    return contextByProfile[recipe.profiles[0]] || '整理資料並完成固定工作流程';
}

function renderCloneCard(clone, index) {
    return `<article class="clone-card clone-card--compact" title="${clone.capability}">
        <div class="clone-avatar"><img src="${getCloneAvatarPath(clone.recipeId)}" alt=""><i aria-hidden="true"></i></div>
        <div class="clone-card__body"><span class="clone-card__index">SHADOW ${String(index + 1).padStart(2, '0')}</span><h4>${clone.name}</h4><p><b>專長</b>${clone.capability}</p><strong class="clone-card__saving">每月可釋放 ${formatHours(clone.savedMonthlyMinutes / 60)} 小時</strong></div>
    </article>`;
}

function renderReportClonePlan(clones) {
    const names = clones.map(clone => clone.name.replace(/分身$/u, ''));
    return `<p class="clone-plan-line">本次規劃：${names.join('、')}，共 ${clones.length} 個影分身</p>
        <div class="clone-plan-list">${clones.map(clone => `<article class="clone-plan-item">
            <span class="clone-plan-avatar"><img src="${getCloneAvatarPath(clone.recipeId)}" alt="${clone.name}"></span>
            <span class="clone-plan-copy"><strong>${clone.name}</strong><small>${clone.capability}</small></span>
        </article>`).join('')}</div>`;
}

function getCloneAvatarPath(recipeId) {
    return `avatars/${recipeId}.webp`;
}

function renderHardware(recommendation, result) {
    document.getElementById('shadow-strength').innerHTML = renderShadowStrength(recommendation.strength, result);
    const modelSpecLabels = {
        mb: ['主機板', 'MB', 'motherboard'], cpu: ['處理器', 'CPU', 'cpu'], gpu: ['顯示卡', 'VGA', 'gpu'],
        ram: ['記憶體', 'RAM', 'memory'], ssd: ['儲存裝置', 'SSD', 'database'], case: ['機殼', 'CASE', 'case'],
        cooling: ['散熱系統', 'COOLING', 'fan'], psu: ['電源供應器', 'PSU', 'zap']
    };
    document.getElementById('platform-grid').innerHTML = recommendation.models.map((model, index) => `<article class="hardware-model-card">
        <header><div><h4>${model.name}</h4><p>${getModelFit(model, index)}</p></div>${renderDeviceIllustration(model)}</header>
        <span class="hardware-grade-stamp" aria-label="影分身戰力 ${recommendation.grade} 級"><small>影分身戰力</small><strong>${recommendation.grade}</strong></span>
        <div class="hardware-quick-specs"><span><small>GPU／VRAM</small><strong>${model.gpu}</strong></span><span><small>記憶體</small><strong>${model.ram}</strong></span><span><small>儲存</small><strong>${model.ssd}</strong></span></div>
        <details class="hardware-full-specs" open><summary>完整配置</summary><div class="hardware-model-specs">${Object.entries(modelSpecLabels).filter(([key]) => !['gpu', 'ram', 'ssd'].includes(key) && !(key === 'case' && model.integratedChassis)).map(([key, [zh, en, icon]]) => `<div class="hardware-model-spec"><span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div><small>${en}</small><strong>${zh}</strong></div><p>${model[key]}</p></div>`).join('')}</div></details>
        <div class="hardware-model-card__action">${renderPurchaseLink(`查看 ${model.name} 配置與選購`, campaignConfig.productLinks.systems[recommendation.tier], `system-${index}`)}</div>
    </article>`).join('');
    const sharedParts = document.getElementById('shared-parts');
    sharedParts.innerHTML = '';
    sharedParts.hidden = true;
    document.getElementById('system-purchase-cta').innerHTML = '';
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
        return `<article class="component-series-card"><span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div class="component-series-card__heading"><small>${en}</small><strong>${zh}</strong><p>${getComponentReason(key)}</p></div><div class="component-series-card__spec">${specs}</div>${renderPurchaseLink(cta, link, key)}</article>`;
    }).join('');
    selectHardwareTab('system');
}

function getModelFit(model, index) {
    if (index === 0) return '符合本次任務的運算強度與並行需求';
    if (model.integratedChassis) return '適合重視體積、整合部署或特定平台的使用情境';
    if (/-I$/.test(model.name)) return 'Intel 平台配置，適合既有 Intel 工作環境';
    return '可依軟體相容性與擴充需求選擇的平台配置';
}

function renderDeviceIllustration(model) {
    const compact = model.integratedChassis;
    return `<svg class="device-illustration ${compact ? 'is-compact' : ''}" viewBox="0 0 120 92" aria-hidden="true"><path d="M18 8h72a8 8 0 0 1 8 8v62a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z"/><path d="M25 20h46M25 29h34M79 20h7M79 29h7"/><circle cx="76" cy="59" r="15"/><circle cx="76" cy="59" r="7"/><path d="M25 49h24v25H25zM106 25v42"/></svg>`;
}

function getComponentReason(key) {
    return {
        cpu: '影響資料整理、工具串接與多工作流程的反應速度。',
        mb: '決定處理器平台、擴充空間與後續升級彈性。',
        gpu: '影響地端模型可用容量、生成速度與影音運算能力。'
    }[key] || '';
}

function renderShadowStrength(strength, result) {
    const comparisons = getLocalValueComparisons(result);
    return `<article class="shadow-strength-card">
        <div class="shadow-strength-card__score"><span>影分身戰力</span><strong>${strength.grade}</strong><b>級</b></div>
        <div class="shadow-strength-card__body"><div><strong>${strength.label}</strong><span>${strength.capacity}</span></div><div class="shadow-strength-meter" aria-label="影分身戰力 ${strength.grade} 級"><i style="--strength:${strength.meter}%"></i></div><p>${strength.description} 這是依設備規格與本次工作負載提供的相對運算餘裕建議。</p><details class="strength-scale"><summary>查看 A 至 SS 分級</summary><p>A、A+、S、S+、SS 代表地端模型、多工具與平行流程可使用的運算餘裕；不代表固定速度倍數，也不等同 SCI。</p></details></div>
        <header class="local-value-heading"><span>從目前限制到地端工作方式</span><strong>為什麼值得把影分身軍團建立在自己的設備上</strong></header>
        <div class="local-value-comparisons">${comparisons.map(item => `<article><div><span>目前痛點</span><p>${item.before}</p></div><i aria-hidden="true">→</i><div><span>地端影分身</span><p>${item.after}</p></div></article>`).join('')}</div>
    </article>`;
}

function getLocalValueComparisons(result) {
    const lowSciPain = result.sci.current < 35
        ? '目前 SCI 偏低，重複工作仍大量占用人工時間。'
        : '既有工具各自運作，工作仍需要人工來回串接。';
    const cloudPain = result.cloud.usage === 'paid'
        ? `目前雲端 AI 仍受訂閱與用量方案影響${Number.isFinite(result.cloud.currentMonthlyTwd) ? `，已填費用為 ${formatCurrency(result.cloud.currentMonthlyTwd)}／月` : ''}。`
        : result.cloud.usage === 'free'
            ? '免費雲端方案常受模型、額度與使用時段限制。'
            : '尚未建立 AI 工作流程，重複任務仍需從零開始處理。';
    return [
        { before: lowSciPain, after: '讓固定流程交由地端影分身持續協作，逐步釋放人工工作量。' },
        { before: cloudPain, after: '把適合的流程移到自己的設備執行，減少可替代的訂閱與用量依賴。' },
        { before: '工作檔案需要上傳，流程也容易受到連線、額度與服務方案調整影響。', after: '資料與模型流程留在地端，建立可持續使用及擴充的工作環境。' }
    ];
}

function renderPurchaseLink(label, href, kind) {
    const available = Boolean(href);
    if (!available) return `<button class="button button--accent hardware-buy-link is-placeholder" type="button" data-buy-link="${kind}" disabled>${label}<small>連結準備中</small></button>`;
    return `<a class="button button--accent hardware-buy-link" href="${href}" data-buy-link="${kind}" target="_blank" rel="noopener noreferrer">${label}</a>`;
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
        elements.modalContent.innerHTML = `<div class="report-preview"><header><span class="step-kicker">完整報告預覽</span><h2 id="modal-title">SCI 影分身完整報告</h2><p>請先檢查內容，確認後再下載 PNG 圖片。</p></header><div class="report-preview__toolbar"><button class="text-button" type="button" id="preview-size-toggle" aria-pressed="false">查看原始尺寸</button></div><div class="report-preview__image"><img src="${reportPreviewUrl}" alt="SCI 影分身工作效益完整報告預覽"></div><div class="report-preview__actions"><button class="button button--quiet" type="button" data-close-modal>返回報告</button><a class="button button--accent" href="${reportPreviewUrl}" download="${filename}" id="report-download-link">下載 PNG 圖片</a></div></div>`;
        elements.modalContent.querySelector('[data-close-modal]').addEventListener('click', closeModal);
        document.getElementById('preview-size-toggle').addEventListener('click', event => {
            const preview = elements.modalContent.querySelector('.report-preview__image');
            const original = preview.classList.toggle('is-original');
            event.currentTarget.setAttribute('aria-pressed', String(original));
            event.currentTarget.textContent = original ? '適應視窗寬度' : '查看原始尺寸';
        });
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
    const cloneRows = Math.ceil(result.clones.length / 3);
    const cloneAvatarImages = new Map(await Promise.all(result.clones.map(async clone => [clone.recipeId, await loadImageAsset(getCloneAvatarPath(clone.recipeId))])));
    const height = 1566 + result.taskResults.length * taskRowHeight + additionalHardwareHeight + cloneRows * 38;
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
        ['釋放工時', `${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}`],
        ['工時價值', formatCurrency(result.cost.laborSavedMonthlyTwd)],
        ['約等同於', formatTokens(result.tokens.savedMonthly), '雲端 Token 費用']
    ];
    reportMetrics.forEach((metric, index) => {
        const x = metricX + index * 168;
        canvasText(ctx, metric[0], x, y + 48, `600 11px ${font}`, '#7F8CA3');
        wrapCanvasText(ctx, metric[1], x, y + 88, 150, 26, 2, `800 22px ${font}`, '#FFFFFF');
        if (metric[2]) canvasText(ctx, metric[2], x, y + 112, `600 11px ${font}`, '#7F8CA3');
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
        canvasText(ctx, `${task.scaleLabel} · ${getFrequencyLabel(task)} · 目前 ${formatHours(task.currentMonthlyMinutes / 60)} 小時／月`, left + 20, y + 55, `500 11px ${font}`, '#8391A7');
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
        const cardY = y + row * 78;
        roundedRect(ctx, x, cardY, 294, 68, 8, 'rgba(32,201,235,.10)', 'rgba(32,201,235,.28)');
        const avatar = cloneAvatarImages.get(clone.recipeId);
        roundedRect(ctx, x + 10, cardY + 10, 48, 48, 8, '#16283B', 'rgba(32,201,235,.24)');
        if (avatar) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x + 10, cardY + 10, 48, 48, 8);
            ctx.clip();
            ctx.drawImage(avatar, x + 10, cardY + 10, 48, 48);
            ctx.restore();
        }
        canvasText(ctx, clone.name, x + 68, cardY + 20, `700 11px ${font}`, '#BFF4FF');
        wrapCanvasText(ctx, clone.capability, x + 68, cardY + 38, 212, 13, 1, `500 9px ${font}`, '#9AA8BC');
        canvasText(ctx, `每月可釋放 ${formatHours(clone.savedMonthlyMinutes / 60)} 小時`, x + 68, cardY + 56, `700 9px ${font}`, '#55D6A6');
    });
    y += cloneRows * 78 + 34;

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

    wrapCanvasText(ctx, `SCI（Shadow-Clone Index）採 100 分制，代表相對於全人工基準，可由影分身協助承接的人工工作比例。影分身戰力採 A、A+、S、S+、SS 五級，代表推薦設備的相對地端運算餘裕，不等同 SCI。Token 依 ${TOKEN_CONFIG.label} 換算。`, left, y, contentWidth, 20, 4, `500 11px ${font}`, '#77859B');
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
            <div class="sci-info-formula"><strong>先看例子：</strong>同一批工作若全人工需要 10 小時，導入後只需 4 小時人工處理，SCI 就是 60 分；其餘 40% 仍由人工完成。</div>
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
        </div>`;
    openModal(trigger);
}

function openMissingWorkModal(trigger) {
    elements.modalContent.innerHTML = `<div class="sci-info-modal"><header><span class="step-kicker">任務清單</span><h2 id="modal-title">目前先評估固定任務</h2></header><div class="sci-info-formula">請選擇最接近的工作，再以頻率與實際人工時間校正結果。</div></div>`;
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

function requestResetAssessment(event) {
    const hasProgress = Boolean(assessmentState.persona || assessmentState.selectedRecipeIds.length || assessmentState.result);
    if (!hasProgress) {
        resetAssessment();
        return;
    }
    elements.modalContent.innerHTML = `<div class="confirm-reset"><span class="step-kicker">重新評估</span><h2 id="modal-title">要重新開始嗎？</h2><p>目前填寫的工作身分、任務與時間設定將會清除。</p><div><button class="button button--quiet" type="button" data-close-modal>保留目前評估</button><button class="button button--accent" type="button" id="confirm-reset-button">重新開始</button></div></div>`;
    elements.modalContent.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    document.getElementById('confirm-reset-button').addEventListener('click', () => {
        closeModal();
        resetAssessment();
    });
    openModal(event?.currentTarget || document.getElementById('reset-button'));
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
        executionNeeds: { parallelBand: '' },
        costAmountTwd: '',
        costPeriod: 'hour',
        periodHours: 160,
        hourlyCostTwd: '',
        cloudUsage: '',
        cloudPlans: [],
        cloudOtherCostTwd: '',
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
    return Boolean(answer.scale && answer.currentMode && answer.period && answer.timeSource && answer.timeConfirmed) && Number.isInteger(frequency) && frequency > 0 && frequency <= 1000 && Number.isFinite(minutes) && minutes >= 0.1 && minutes <= 10080;
}

function summarizeAnswer(recipe, answer) {
    if (!answer || !answer.frequency) return '尚未設定頻率';
    const parts = [`${getFrequencyLabel(answer)}`];
    if (answer.scale && recipe.scales[answer.scale]) parts.push(getLoadingMeta(answer.scale).label);
    if (answer.currentMode && modeCatalog[answer.currentMode]) parts.push(modeCatalog[answer.currentMode].label);
    if (answer.timeConfirmed && Number(answer.currentHumanMinutes) > 0) parts.push(`${formatInputNumber(answer.currentHumanMinutes)} 分鐘／次`);
    return parts.join(' · ');
}

function frequencyToMonthly(frequency, period) {
    const value = Number(frequency);
    if (!Number.isFinite(value) || value <= 0) return 0;
    if (period === 'day') return value * 365 / 12;
    if (period === 'month') return value;
    return value * 52 / 12;
}

function getFrequencyLabel(answer) {
    const labels = { day: '天', week: '週', month: '月' };
    return `${formatInputNumber(answer.frequency)} 次／${labels[answer.period] || '週'}`;
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
    const roundedScore = Math.round(score);
    if (roundedScore < 20) return 'L1 工作待分擔';
    if (roundedScore < 40) return 'L2 分身初步協助';
    if (roundedScore < 60) return 'L3 部分流程串接';
    if (roundedScore < 80) return 'L4 分身協作';
    return 'L5 高度流程化';
}

function getTimeUnit() {
    return '小時';
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
    const numericValue = Number(value) || 0;
    if (numericValue >= 100000000) return `${new Intl.NumberFormat('zh-TW', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(numericValue / 100000000)} 億`;
    if (numericValue >= 10000) return `${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 1 }).format(numericValue / 10000)} 萬`;
    return new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(numericValue);
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

function loadImageAsset(src) {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
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
