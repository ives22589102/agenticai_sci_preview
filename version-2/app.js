'use strict';

const VERSIONS = Object.freeze({
    scoring: 'sci-index-v5',
    workflows: 'workflow-model-v3',
    recipes: 'recipes-v3',
    hardware: 'hardware-v4',
    taxonomy: 'sci-taxonomy-v2'
});

const SCI_CONFIG = Object.freeze({
    scaleMax: 100
});

const COST_PERIOD_HOURS = Object.freeze({ hour: 1, week: 40, month: 160 });
const TOKEN_CONFIG = Object.freeze({ costPerTokenTwd: 0.00016, tokensPerTwd: 6250, label: '1 Token = NT$0.00016' });
const USD_TWD_RATE = 31.92;
const DATA_COLLECTION_CONFIG = Object.freeze({
    endpoint: 'https://script.google.com/macros/s/AKfycbz1FH2xnWpIOnC2vqWhYEDDT-CIIIV0EwygB1X6ZES3BJazoTiZ0uijJvoIRnFN0Eib/exec',
    schemaVersion: 'sci-assessment-v1',
    anonymousIdStorageKey: 'asus-sci-anonymous-id-v1',
    timeoutMs: 45000
});
const anonymousVisitorId = getOrCreateAnonymousId();
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
        description: '自由工作者、一人工作室與小型創作團隊',
        note: '以個人工作流程與專案交付為主',
        roleTags: [
            ['creative', '影音與設計'],
            ['content', '內容與行銷'],
            ['admin', '接案與行政']
        ]
    },
    edu: {
        name: '教育',
        short: '教育',
        icon: 'E',
        description: '學生、教師、研究與校園支援工作者',
        note: '以教學、學習、研究與校園流程為主',
        roleTags: [
            ['teacher', '教師'],
            ['student', '學生'],
            ['research', '研究人員']
        ]
    },
    smb: {
        name: '中小企業',
        short: '中小企業',
        icon: 'B',
        description: '依部門與業務職能協作的團隊',
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

function makeRecipe(id, persona, title, workUnit, assist, review, manual, _legacyAgentMinutes, profiles, cloneTag, roleTags, featured = false, tiers = [1, 1, 2], metadata = {}) {
    const descriptions = scaleDescriptions[id] || ['較低工作量', '一般工作量', '較高工作量'];
    return Object.freeze({
        id, persona, personas: metadata.personas || [persona], title, workUnit, assist, review, profiles, cloneTag, roleTags, featured,
        functionNames: metadata.functionNames || [],
        roleTitles: metadata.roleTitles || [],
        taskCluster: metadata.taskCluster || '',
        workflowId: metadata.workflowId || id,
        isOriginal: metadata.isOriginal !== false,
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

// 僅保留原 24 個任務的資產識別；內容、單位及參考工時均讀 canonical catalog。
const baseRecipeCatalog = Object.freeze(globalThis.SCIWorkflowV2.workflowIds.filter(id=>globalThis.SCIWorkflowV2.getWorkflow(id).hasExistingAvatar).map(id=>({id})));
function normalizeSciPersona(persona) { return persona === 'education' ? 'edu' : persona; }

const recipeCatalog = Object.freeze(globalThis.SCIWorkflowV2.workflowIds.map(id => {
    const task = globalThis.SCIWorkflowV2.getWorkflow(id);
    const legacy = baseRecipeCatalog.find(recipe => recipe.id === id);
    const referencing = Object.values(globalThis.SCIWorkflowV2.roles).filter(role => [...role.workflowIds, ...role.extensionWorkflowIds].includes(id));
    const recipe = makeRecipe(id, normalizeSciPersona(referencing[0]?.persona || 'soho'), task.title, task.workUnit,
        task.stages.map(stage => stage.ai).join('；'), task.stages.map(stage => stage.human).join('；'),
        task.manualMinutes, 0, task.profiles,
        task.cloneTag, [], false, [1,1,2], {personas:[...new Set(referencing.map(role=>normalizeSciPersona(role.persona)))],functionNames:[...new Set(referencing.map(role=>role.functionName))],workflowId:id,isOriginal:Boolean(legacy)});
    return Object.freeze({...recipe, scales:task.referenceScales, description:task.description, boundary:task.boundary, evidenceStatus:'expert-model-estimate', recipeVersion:'3.0'});
}));

// 分類只負責導覽與題目排序；計分仍以使用者填寫的任務工作流為準。
const functionCatalog = Object.freeze(Object.fromEntries(['soho','edu','smb'].map(persona => {
 const roles=globalThis.SCIWorkflowV2.getRolesForPersona(persona==='edu'?'education':persona);
 const names=[...new Set(roles.map(role=>role.functionName))];
 return [persona,Object.freeze(names.map(label=>({id:persona+'.'+label,label,roles:roles.filter(role=>role.functionName===label).map(role=>role.title),recipeIds:[...new Set(roles.filter(role=>role.functionName===label).flatMap(role=>[...role.workflowIds,...role.extensionWorkflowIds]))]})))];
})));
const taskTaxonomyCatalog = Object.freeze(Object.fromEntries(recipeCatalog.map(recipe=>[recipe.id,{canonical:recipe.title,cluster:'具體日常任務',functions:Object.values(functionCatalog).flat().filter(domain=>domain.recipeIds.includes(recipe.id)).map(domain=>domain.id)}])));

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
    functionId: null,
    roleTag: null,
    taskSearch: '',
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
    collectionStatus: 'idle',
    collectionSubmittedAssessmentId: null,
    collectionSubmittedFingerprint: null,
    collectionFailureReason: '',
    resultFingerprint: null,
    result: null
};

let reportPreviewUrl = null;
let lastModalTrigger = null;

const elements = {};

let step3PanelIndex = 0;

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    Object.assign(elements, {
        landingHero: document.getElementById('landing-hero'),
        startAssessment: document.getElementById('start-assessment'),
        personaGrid: document.getElementById('persona-grid'),
        functionOptions: document.getElementById('function-options'),
        recipeSearch: document.getElementById('recipe-search'),
        recipeControls: document.getElementById('recipe-controls'),
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
        loadWarning: document.getElementById('load-warning'),
        backButton: document.getElementById('back-button'),
        nextButton: document.getElementById('next-button'),
        consentNote: document.getElementById('consent-note'),
        consentDetailButton: document.getElementById('consent-detail-button'),
        formError: document.getElementById('form-error'),
        navigation: document.getElementById('form-navigation'),
        modal: document.getElementById('modal'),
        modalPanel: document.querySelector('.modal__panel'),
        modalContent: document.getElementById('modal-content'),
        taskProgress: document.getElementById('task-progress'),
        taskNextButton: document.getElementById('task-next-button'),
        taskPrevButton: document.getElementById('task-prev-button'),
        sharedSettings: document.querySelector('.shared-settings')
    });

    elements.taskNextButton?.addEventListener('click', nextStep3Panel);
    elements.taskPrevButton?.addEventListener('click', previousStep3Panel);
    document.getElementById('hardware-section').addEventListener('click', event => {
        const trigger = event.target.closest('[data-strength-scale]');
        if (trigger) openStrengthScaleModal(trigger);
        setTimeout(checkReveals, 80);
    });
    document.getElementById('clone-list').addEventListener('click', event => {
        const trigger = event.target.closest('[data-clone-toggle]');
        if (trigger) toggleClonePlanDetail(trigger);
    });
    // Any edit in Step 3 can change completion, so refresh the progress strip and the report button together.
    ['input', 'change'].forEach(type => document.getElementById('step-3').addEventListener(type, () => {
        if (assessmentState.currentStep !== 3) return;
        renderTaskProgress();
        updateNavigation();
    }));

    elements.startAssessment?.addEventListener('click', enterAssessment);
    // Banner layers drift slightly with the pointer; each layer's --depth sets how far.
    const landingStage = document.getElementById('landing-stage');
    if (landingStage && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
        elements.landingHero.addEventListener('pointermove', event => {
            landingStage.style.setProperty('--px', ((event.clientX / window.innerWidth) - 0.5).toFixed(3));
            landingStage.style.setProperty('--py', ((event.clientY / window.innerHeight) - 0.5).toFixed(3));
        });
        elements.landingHero.addEventListener('pointerleave', () => {
            landingStage.style.setProperty('--px', '0');
            landingStage.style.setProperty('--py', '0');
        });
    }
    document.getElementById('reset-button')?.addEventListener('click', requestResetAssessment);
    elements.backButton.addEventListener('click', previousStep);
    elements.nextButton.addEventListener('click', nextStep);
    elements.consentDetailButton.addEventListener('click', event => showDataCollectionDetails(event.currentTarget));
    elements.hourlyCost.addEventListener('input', syncCostSettings);
    elements.costPeriod.addEventListener('change', syncCostSettings);
    elements.periodHours.addEventListener('input', syncCostSettings);
    elements.cloudOtherCost.addEventListener('input', syncCloudSettings);
    elements.recipeSearch?.addEventListener('input', event => {
        assessmentState.taskSearch = event.target.value;
        renderRecipeSelection();
    });
    document.querySelectorAll('[data-go-step]').forEach(button => {
        button.addEventListener('click', () => goToStep(Number(button.dataset.goStep)));
    });
    document.querySelectorAll('[data-progress-trigger]').forEach(button => {
        button.addEventListener('click', () => handleProgressStepClick(Number(button.dataset.progressTrigger)));
    });
    document.getElementById('result-reset-button').addEventListener('click', requestResetAssessment);
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

function enterAssessment() {
    trackEvent('assessment_started', { entry: 'landing_banner' });
    document.body.classList.remove('landing-active');
    if (elements.landingHero) elements.landingHero.hidden = true;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => document.getElementById('step-1-title')?.focus({ preventScroll: true }));
}

function renderPersonaSelection() {
    elements.personaGrid.setAttribute('role', 'radiogroup');
    elements.personaGrid.setAttribute('aria-label', '目前工作情境');
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
        assessmentState.functionId = null;
        assessmentState.roleTag = null;
        assessmentState.taskSearch = '';
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

function getSelectedRoleProfile() {
    if (!assessmentState.persona || !assessmentState.functionId || !assessmentState.roleTag) return null;
    const catalogPersona = assessmentState.persona === 'edu' ? 'education' : assessmentState.persona;
    const selectedFunction = getFunction(assessmentState.functionId);
    if (!selectedFunction || assessmentState.functionId === 'cross_domain') return null;
    return (globalThis.SCIWorkflowV2?.getRolesForPersona(catalogPersona) || [])
        .find(role => role.functionName === selectedFunction.label && role.title === assessmentState.roleTag) || null;
}

function getCurrentRoleCatalog() {
    const catalogPersona = assessmentState.persona === 'edu' ? 'education' : assessmentState.persona;
    return globalThis.SCIWorkflowV2?.getRolesForPersona(catalogPersona) || [];
}

function getPersonaRecipes() {
    const selectedFunction = getFunction(assessmentState.functionId);
    const roleCatalog = getCurrentRoleCatalog();
    const matchingRoles = selectedFunction && selectedFunction.id !== 'cross_domain'
        ? roleCatalog.filter(role => role.functionName === selectedFunction.label)
        : [];
    const selectedRole = assessmentState.roleTag
        ? matchingRoles.find(role => role.title === assessmentState.roleTag)
        : null;
    const query = String(assessmentState.taskSearch || '').trim().toLocaleLowerCase();
    if (!selectedFunction && !query) return [];
    const workflowIds = selectedFunction
        ? selectedRole
            ? [...selectedRole.workflowIds, ...(selectedRole.extensionWorkflowIds || [])]
            : [...new Set(matchingRoles.flatMap(role => [...role.workflowIds, ...(role.extensionWorkflowIds || [])]))]
        : recipeCatalog.map(recipe => recipe.id);
    const recipesById = new Map(recipeCatalog.map(recipe => [recipe.id, recipe]));
    return [...new Set(workflowIds)].map(workflowId => recipesById.get(workflowId)).filter(recipe => {
        if (!recipe || !query) return Boolean(recipe);
        const taxonomy = getRecipeTaxonomy(recipe.id);
        return [recipe.title, taxonomy.canonical, taxonomy.cluster, recipe.workUnit, recipe.assist, recipe.review]
            .join(' ').toLocaleLowerCase().includes(query);
    });
}

function getPersonaFunctions() {
    const base = [...(functionCatalog[assessmentState.persona] || [])];
    const catalogPersona = assessmentState.persona === 'edu' ? 'education' : assessmentState.persona;
    const roleCatalog = globalThis.SCIWorkflowV2?.getRolesForPersona(catalogPersona) || [];
    const enriched = base.map(item => {
        const roles = [...new Set(roleCatalog.filter(role => role.functionName === item.label).map(role => role.title))];
        return roles.length ? { ...item, roles } : item;
    });
    return enriched;
}

function getFunction(functionId) {
    return Object.values(functionCatalog).flat().find(item => item.id === functionId);
}

function getRecipeTaxonomy(recipeId) {
    if (taskTaxonomyCatalog[recipeId]) return taskTaxonomyCatalog[recipeId];
    const recipe = getRecipe(recipeId);
    const functionIds = (recipe?.functionNames || []).map(name => Object.values(functionCatalog).flat().find(item => item.label === name)?.id).filter(Boolean);
    return { canonical: recipe?.title || '', cluster: recipe?.taskCluster || '一般工作流程', functions: functionIds };
}

function getRecipeDisplayTitle(recipe) {
    return getRecipeTaxonomy(recipe.id).canonical || recipe.title;
}

function renderFunctionSelection() {
    if (!elements.functionOptions) return;
    const functions = getPersonaFunctions();
    const selected = functions.find(item => item.id === assessmentState.functionId);
    // Domains sit in one horizontal row; the optional role filter for the chosen domain follows on its own row.
    elements.functionOptions.innerHTML = functions.map(item => `
        <div class="function-option-shell ${assessmentState.functionId === item.id ? 'is-selected' : ''}">
            <label class="function-option ${assessmentState.functionId === item.id ? 'is-selected' : ''}">
                <input type="radio" name="function-id" value="${item.id}" ${assessmentState.functionId === item.id ? 'checked' : ''}>
                <span><strong>${item.label}</strong></span>
            </label>
        </div>
    `).join('') + (selected?.roles?.length ? `
        <div class="function-role-list" role="group" aria-label="依${selected.label}職務篩選">
            <span class="function-role-list__label">依職務篩選</span>
            <button class="role-option ${!assessmentState.roleTag ? 'is-selected' : ''}" type="button" aria-pressed="${!assessmentState.roleTag}" data-role-filter="">全部</button>
            ${selected.roles.map(role => `<button class="role-option ${assessmentState.roleTag === role ? 'is-selected' : ''}" type="button" aria-pressed="${assessmentState.roleTag === role}" data-role-filter="${role}">${role}</button>`).join('')}
        </div>
    ` : '');
    elements.functionOptions.querySelectorAll('input[name="function-id"]').forEach(input => input.addEventListener('change', () => selectFunction(input.value)));
    elements.functionOptions.querySelectorAll('[data-role-filter]').forEach(button => button.addEventListener('click', () => {
        assessmentState.roleTag = button.dataset.roleFilter || null;
        renderRecipeSelection();
        invalidateResult();
    }));
}

function selectFunction(functionId) {
    assessmentState.functionId = functionId;
    assessmentState.roleTag = null;
    invalidateResult();
    renderRecipeSelection();
}

function renderRecipeSelection() {
    renderFunctionSelection();
    const recipes = getPersonaRecipes();
    const hasFunction = Boolean(assessmentState.functionId && getFunction(assessmentState.functionId));
    if (elements.recipeSearch && elements.recipeSearch.value !== assessmentState.taskSearch) elements.recipeSearch.value = assessmentState.taskSearch;
    if (elements.recipeSearch) {
        elements.recipeSearch.placeholder = assessmentState.roleTag
            ? `搜尋「${assessmentState.roleTag}」工作內容`
            : hasFunction
                ? '搜尋此工作領域'
                : '搜尋全部工作內容';
    }
    elements.recipeGrid.dataset.hint = '先選擇上方的工作領域，這裡會列出該領域的工作內容';
    if (!hasFunction && !assessmentState.taskSearch.trim()) {
        elements.recipeGrid.innerHTML = '';
        elements.selectedCount.textContent = String(assessmentState.selectedRecipeIds.length);
        clearError();
        return;
    }
    if (!recipes.length) {
        elements.recipeGrid.innerHTML = '<div class="recipe-empty" role="status">找不到符合的工作內容，請換個關鍵字或篩選條件。</div>';
        elements.selectedCount.textContent = String(assessmentState.selectedRecipeIds.length);
        clearError();
        return;
    }
    const limitReached = assessmentState.selectedRecipeIds.length >= 6;
    elements.recipeGrid.innerHTML = recipes.map(recipe => {
        const selected = assessmentState.selectedRecipeIds.includes(recipe.id);
        return `
            <article class="recipe-card ${selected ? 'is-selected' : ''} ${limitReached && !selected ? 'is-limit-reached' : ''}" data-recipe-card="${recipe.id}">
                <label class="recipe-select">
                    <input type="checkbox" value="${recipe.id}" ${selected ? 'checked' : ''} ${limitReached && !selected ? 'disabled' : ''} aria-describedby="recipe-summary-${recipe.id}">
                    <span>
                        <strong>${getRecipeDisplayTitle(recipe)}</strong>
                        <p id="recipe-summary-${recipe.id}">${getRecipeContext(recipe).replace(/^本次工作[：:]\s*/u, '')}</p>
                    </span>
                    ${limitReached && !selected ? '<em>已達上限</em>' : ''}
                </label>
                <details class="recipe-detail">
                    <summary>查看影分身可協助的流程</summary>
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
        const task = globalThis.SCIWorkflowV2.getWorkflow(recipeId);
        if (task?.conflictsWith?.some(id => selected.includes(id))) {
            if(inputElement)inputElement.checked=false;
            showError('這項工作與已選任務涵蓋相同工時，請擇一填寫。', inputElement); return;
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
        baselineHumanMinutes: '',
        targetHumanMinutes: '',
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
                    <span class="task-summary-title"><span class="task-index">${index + 1}</span><span><strong>${getRecipeDisplayTitle(recipe)}</strong><small>${summarizeAnswer(recipe, answer)}</small></span></span>
                </summary>
                <div class="task-setting__body">
                    <div class="task-field-sequence">
                        <div class="task-field-step">
                            <span class="field-number">1</span><div class="field-block"><label for="frequency-${recipe.id}">多常做一次？</label><div class="frequency-sentence"><select data-field="period" aria-label="選擇執行週期">${renderPeriodOptions(answer.period)}</select><input id="frequency-${recipe.id}" data-field="frequency" type="number" min="1" max="1000" step="1" inputmode="numeric" value="${answer.frequency}" placeholder="次數"><span>次</span></div><p class="field-help" data-monthly-frequency>${monthlyFrequency > 0 ? `約每月 ${formatInputNumber(monthlyFrequency)} 次` : '例如每週 2 次或每月 1 次'}</p></div>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">2</span><fieldset><legend>每次工作量或複雜度？</legend><div class="scale-options loading-options">${Object.keys(recipe.scales).map(key => { const loading = getLoadingMeta(key); return `<label class="scale-option loading-option"><input type="radio" name="scale-${recipe.id}" value="${key}" ${answer.scale === key ? 'checked' : ''}><span><i class="loading-meter" aria-hidden="true">${[1, 2, 3].map(level => `<em class="${level <= loading.level ? 'is-active' : ''}"></em>`).join('')}</i><b>${loading.label}</b></span></label>`; }).join('')}</div></fieldset>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">3</span><fieldset><legend>現在怎麼完成？</legend><div class="mode-options">${Object.entries(modeCatalog).map(([key, mode]) => `<label><input type="radio" name="mode-${recipe.id}" value="${key}" ${answer.currentMode === key ? 'checked' : ''}><span><b>${mode.label}</b><small>${getModeDescription(key)}</small></span></label>`).join('')}</div></fieldset>
                        </div>
                        <div class="task-field-step">
                            <span class="field-number">4</span><div class="field-block"><label for="minutes-${recipe.id}">每次人工投入時間</label><div class="input-prefix time-input"><input id="minutes-${recipe.id}" data-field="currentHumanMinutes" type="number" min="0.1" max="10080" step="0.1" inputmode="decimal" value="${answer.currentHumanMinutes === '' ? '' : formatInputNumber(answer.currentHumanMinutes)}" placeholder="完成前面設定後自動帶入"><span>分鐘</span></div><span class="reference-value" data-reference-value>${hasReference ? `已先套用參考估算：${formatMinutes(reference)} 分鐘／次，可直接修改` : '完成工時占比與目前做法後，系統會先帶入參考估算'}</span><p class="field-help">包含資料準備、操作、整理、檢查與修改；同一份工時只填一次。</p></div>
                        </div>
                    </div>
                </div>
            </details>
        `;
    }).join('');

    elements.taskSettings.querySelectorAll('[data-task-id]').forEach(card => bindTaskCard(card));
    renderLoadWarning();
    applyStep3Panel();
}

// Step 3 shows one panel at a time: each selected task, then the shared usage settings.
function getStep3PanelCount() {
    return assessmentState.selectedRecipeIds.length + 1;
}

function isSharedSettingsComplete() {
    if (!assessmentState.executionNeeds.parallelBand) return false;
    const cost = Number(assessmentState.costAmountTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 10000000) return false;
    if (!assessmentState.cloudUsage) return false;
    if (assessmentState.cloudUsage === 'paid') {
        const otherCost = Number(assessmentState.cloudOtherCostTwd);
        if (!assessmentState.cloudPlans.length && !(otherCost > 0)) return false;
        if (assessmentState.cloudOtherCostTwd !== '' && (!Number.isFinite(otherCost) || otherCost < 0 || otherCost > 10000000)) return false;
    }
    return true;
}

function isStep3Complete() {
    return assessmentState.selectedRecipeIds.every(id => isAnswerComplete(assessmentState.taskAnswers[id])) && isSharedSettingsComplete();
}

function applyStep3Panel() {
    const taskIds = assessmentState.selectedRecipeIds;
    step3PanelIndex = clamp(step3PanelIndex, 0, taskIds.length);
    elements.taskSettings.querySelectorAll('[data-task-id]').forEach(card => {
        card.hidden = card.dataset.taskId !== taskIds[step3PanelIndex];
        card.open = true;
    });
    elements.taskSettings.hidden = step3PanelIndex >= taskIds.length;
    if (elements.sharedSettings) elements.sharedSettings.hidden = step3PanelIndex < taskIds.length;
    renderTaskProgress();
    updateNavigation();
}

function renderTaskProgress() {
    if (!elements.taskProgress) return;
    const taskIds = assessmentState.selectedRecipeIds;
    const items = taskIds.map((id, index) => ({
        label: getRecipeDisplayTitle(getRecipe(id)),
        complete: isAnswerComplete(assessmentState.taskAnswers[id]),
        error: Boolean(elements.taskSettings.querySelector(`[data-task-id="${id}"].has-error`)),
        index
    }));
    items.push({ label: '使用情境', complete: isSharedSettingsComplete(), error: false, index: taskIds.length });
    const doneCount = items.filter(item => item.complete).length;
    elements.taskProgress.innerHTML = `
        <p class="task-progress__count">已完成 <strong>${doneCount}</strong>／${items.length}</p>
        <ol>${items.map(item => `<li><button type="button" class="task-progress__item ${item.index === step3PanelIndex ? 'is-active' : ''} ${item.complete ? 'is-complete' : ''} ${item.error ? 'has-error' : ''}" data-step3-panel="${item.index}" ${item.index === step3PanelIndex ? 'aria-current="step"' : ''}><i aria-hidden="true">${item.complete ? '✓' : item.index + 1}</i><span>${item.label}</span></button></li>`).join('')}</ol>`;
    elements.taskProgress.querySelectorAll('[data-step3-panel]').forEach(button => button.addEventListener('click', () => goToStep3Panel(Number(button.dataset.step3Panel))));
}

// Moving forward (arrow or progress tab) requires the current task to be complete; moving back never does.
function goToStep3Panel(targetIndex) {
    clearError();
    if (targetIndex === step3PanelIndex) return;
    const recipeId = assessmentState.selectedRecipeIds[step3PanelIndex];
    if (targetIndex > step3PanelIndex && recipeId && !isAnswerComplete(assessmentState.taskAnswers[recipeId])) {
        const firstMissing = markTaskErrors(recipeId, false);
        renderTaskProgress();
        return showError('請先補完紅框標示的必填欄位。', firstMissing);
    }
    const direction = targetIndex > step3PanelIndex ? 'next' : 'prev';
    step3PanelIndex = targetIndex;
    applyStep3Panel();
    const step = document.getElementById('step-3');
    step.scrollTop = 0;
    const panel = step.querySelector('.task-setting:not([hidden])') || (elements.sharedSettings.hidden ? null : elements.sharedSettings);
    if (panel) {
        panel.classList.remove('is-entering-next', 'is-entering-prev');
        void panel.offsetWidth;
        panel.classList.add(`is-entering-${direction}`);
        panel.addEventListener('animationend', () => panel.classList.remove('is-entering-next', 'is-entering-prev'), { once: true });
    }
}

function nextStep3Panel() {
    goToStep3Panel(step3PanelIndex + 1);
}

function renderDonut(percent) {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference * (1 - clamp(percent, 0, 100) / 100);
    return `<svg class="donut" viewBox="0 0 100 100" aria-hidden="true" style="--circ:${circumference.toFixed(2)};--offset:${offset.toFixed(2)}"><defs><linearGradient id="donut-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5c3bff"/><stop offset="1" stop-color="#133ed4"/></linearGradient></defs><circle class="donut__track" cx="50" cy="50" r="42"/><circle class="donut__value" cx="50" cy="50" r="42" transform="rotate(-90 50 50)"/></svg>`;
}

let revealObserver = null;
// Report blocks fade up and their charts draw in the first time they scroll into view.
function observeReveals(root = document.getElementById('step-4')) {
    const targets = root.querySelectorAll('.impact-hero, .saving-summary, .time-comparison-row, .workflow-impact-card, .hardware-model-card, .component-series-card, .shadow-strength-card, .local-value-comparisons article');
    targets.forEach(target => target.classList.add('reveal'));
    if (!revealObserver) {
        // Position checks on scroll rather than IntersectionObserver, so blocks can never stay hidden if no callback fires.
        revealObserver = true;
        document.getElementById('step-4').addEventListener('scroll', checkReveals, { passive: true });
        window.addEventListener('scroll', checkReveals, { passive: true });
        window.addEventListener('resize', checkReveals);
    }
    setTimeout(checkReveals, 80);
}

function checkReveals() {
    const limit = window.innerHeight * 0.94;
    document.querySelectorAll('#step-4 .reveal:not(.is-inview)').forEach(target => {
        const rect = target.getBoundingClientRect();
        if (rect.width && rect.top < limit && rect.bottom > 0) target.classList.add('is-inview');
    });
}

function bindTaskCard(card) {
    const recipeId = card.dataset.taskId;
    card.querySelector('summary').addEventListener('click', event => { event.preventDefault(); handleTaskSummaryClick(card); });
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
    renderTaskProgress();
    updateNavigation();
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
        return `<label class="cloud-plan-select"><span>${brand}</span><select data-cloud-brand="${brandId}" aria-label="${brand} 訂閱方案"><option value="">未訂閱</option>${plans.map(plan => `<option value="${plan.id}">${plan.plan}｜${formatCurrency(plan.monthlyTwd)}／月</option>`).join('')}</select></label>`;
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
    elements.cloudPlanOptions.querySelectorAll('[data-cloud-brand]').forEach(select => select.addEventListener('change', () => {
        assessmentState.cloudPlans = [...elements.cloudPlanOptions.querySelectorAll('[data-cloud-brand]')].map(item => item.value).filter(Boolean);
        syncCloudSettings();
        invalidateResult();
    }));
}

function clearCloudPaidSelection() {
    assessmentState.cloudPlans = [];
    assessmentState.cloudOtherCostTwd = '';
    elements.cloudOtherCost.value = '';
    updateCloudProviderSummaries();
}

// One plan per brand: each select shows the plan in cloudPlans that belongs to it.
function updateCloudProviderSummaries() {
    elements.cloudPlanOptions.querySelectorAll('[data-cloud-brand]').forEach(select => {
        const selected = assessmentState.cloudPlans.map(id => CLOUD_PLAN_CATALOG.find(plan => plan.id === id)).find(plan => plan?.brandId === select.dataset.cloudBrand);
        select.value = selected?.id || '';
    });
}

function restoreSharedOptions() {
    document.querySelectorAll('input[name="parallel-band"]').forEach(input => { input.checked = input.value === assessmentState.executionNeeds.parallelBand; });
    document.querySelectorAll('input[name="cloud-usage"]').forEach(input => { input.checked = input.value === assessmentState.cloudUsage; });
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
    if (!elements.loadWarning) return;
    elements.loadWarning.hidden = true;
    elements.loadWarning.innerHTML = '';
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
        if (!assessmentState.persona) return showError('請先選擇工作情境。', elements.personaGrid.querySelector('input'));
        goToStep(2);
        return;
    }
    if (assessmentState.currentStep === 2) {
        if (!assessmentState.selectedRecipeIds.length) {
            return showError('請至少選擇 1 項平常會處理的工作。', elements.recipeGrid.querySelector('input') || elements.recipeSearch);
        }
        renderTaskSettings();
        restoreSharedOptions();
        goToStep(3);
        return;
    }
    if (assessmentState.currentStep === 3) {
        if (!validateStep3()) return;
        refreshAssessmentResult();
        goToStep(4);
    }
}

function previousStep() {
    if (assessmentState.currentStep > 1) goToStep(assessmentState.currentStep - 1);
}

function canReachStep(step) {
    if (step <= 1) return true;
    if (step === 2) return Boolean(assessmentState.persona);
    if (step === 3) return Boolean(assessmentState.functionId) && assessmentState.selectedRecipeIds.length > 0;
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
        const firstIncomplete = assessmentState.selectedRecipeIds.findIndex(id => !isAnswerComplete(assessmentState.taskAnswers[id]));
        step3PanelIndex = firstIncomplete >= 0 ? firstIncomplete : 0;
        renderTaskSettings();
        restoreSharedOptions();
    }
    if (step === 4 && assessmentState.result) {
        refreshAssessmentResult();
        renderResult();
        startAnonymousSubmission();
    }
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
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) progressFill.style.width = `${((assessmentState.currentStep - 1) / 3) * 100}%`;
    elements.navigation.hidden = assessmentState.currentStep === 4;
    elements.backButton.hidden = assessmentState.currentStep === 1;
    const draftStatus = document.getElementById('draft-status');
    if (draftStatus) draftStatus.textContent = `步驟 ${assessmentState.currentStep}／4`;
    updateNavigation();
    clearError();
    if (moveFocus) {
        const title = document.getElementById(`step-${assessmentState.currentStep}-title`);
        title?.focus({ preventScroll: true });
        document.querySelectorAll('.step, .function-picker, .recipe-grid').forEach(panel => { panel.scrollTop = 0; });
        window.scrollTo(0, 0);
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }));
    }
}

function updateNavigation() {
    const onStep3 = assessmentState.currentStep === 3;
    elements.nextButton.disabled = (assessmentState.currentStep === 1 && !assessmentState.persona) || (onStep3 && !isStep3Complete());
    elements.nextButton.textContent = assessmentState.currentStep === 1
        ? '選擇日常任務'
        : assessmentState.currentStep === 2
            ? '填寫時間與頻率'
            : '查看我的影分身效益';
    elements.backButton.textContent = onStep3 ? '重新選擇工作領域' : '上一步';
    if (elements.taskNextButton) {
        const isLastPanel = step3PanelIndex >= getStep3PanelCount() - 1;
        elements.taskNextButton.disabled = isLastPanel;
        elements.taskNextButton.setAttribute('aria-label', step3PanelIndex === getStep3PanelCount() - 2 ? '下一個：使用情境' : '下一個任務');
        if (elements.taskPrevButton) elements.taskPrevButton.disabled = step3PanelIndex <= 0;
    }
    elements.consentNote.hidden = !onStep3;
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
                step3PanelIndex = assessmentState.selectedRecipeIds.indexOf(recipeId);
                applyStep3Panel();
            }
        }
    }
    if (firstIncomplete) return showError(`請補完「${getRecipeDisplayTitle(firstIncompleteRecipe)}」的紅框欄位。`, firstIncomplete);
    if (!assessmentState.executionNeeds.parallelBand) return showError('請選擇平常會同時執行幾個任務。', elements.parallelOptions.querySelector('input'));
    syncCostSettings();
    const cost = Number(assessmentState.costAmountTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 10000000) return showError('請填寫工作流程成本。', elements.hourlyCost);
    syncCloudSettings();
    if (!assessmentState.cloudUsage) return showError('請選擇目前是否使用雲端 AI。', elements.cloudUsageOptions.querySelector('input'));
    if (assessmentState.cloudUsage === 'paid' && !assessmentState.cloudPlans.length && !(Number(assessmentState.cloudOtherCostTwd) > 0)) {
        return showError('請選擇至少一個訂閱方案，或填入其他 AI 支出。', elements.cloudPlanOptions.querySelector('select'));
    }
    if (assessmentState.cloudUsage === 'paid' && assessmentState.cloudOtherCostTwd !== '') {
        const cloudCost = Number(assessmentState.cloudOtherCostTwd);
        if (!Number.isFinite(cloudCost) || cloudCost < 0 || cloudCost > 10000000) return showError('請確認其他 AI 支出金額。', elements.cloudOtherCost);
    }
    return true;
}

function createAssessmentSnapshot() {
    return JSON.parse(JSON.stringify({
        persona: assessmentState.persona,
        functionId: assessmentState.functionId,
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
        schemaVersion: '3.0',
        roleId: getSelectedRoleProfile()?.id || null,
        scope: 'selected-workflows'
    }));
}

function calculateAssessment(snapshot) {
    if(snapshot.schemaVersion !== '3.0') throw Error('舊資料請重新選擇職業及確認工時');
    const allowed=new Set(globalThis.SCIWorkflowV2.workflowIds);
    if(new Set(snapshot.selectedRecipeIds).size!==snapshot.selectedRecipeIds.length || snapshot.selectedRecipeIds.some(id=>!allowed.has(id)))throw Error('任務資料不一致，請重新選擇');
    globalThis.SCIWorkflowV2.calculateTime(snapshot.selectedRecipeIds.map(id=>({id,baselineMinutes:1,humanMinutes:1})));

    const taskResults = snapshot.selectedRecipeIds.map((recipeId, selectionIndex) => {
        const recipe = getRecipe(recipeId);
        const answer = snapshot.taskAnswers[recipeId];
        const scale = recipe.scales[answer.scale];
        const monthlyFrequency = frequencyToMonthly(answer.frequency, answer.period);
        const baseline = scale.manualMinutes;
        const current = Number(answer.currentHumanMinutes);
        const effectiveBaseline = answer.baselineHumanMinutes !== '' && answer.baselineHumanMinutes != null ? Number(answer.baselineHumanMinutes) : answer.currentMode === 'manual' ? current : baseline;
        const workflowMetrics = calculateWorkflowMetrics(recipeId);
        const taxonomy = getRecipeTaxonomy(recipeId);
        const workflowTargetMinutes = effectiveBaseline * workflowMetrics.retainedHumanRatio;
        const target = answer.targetHumanMinutes !== '' && answer.targetHumanMinutes != null ? Number(answer.targetHumanMinutes) : workflowTargetMinutes;
        const currentMonthlyMinutes = monthlyFrequency * current;
        const targetMonthlyMinutes = monthlyFrequency * target;
        return {
            recipeId,
            selectionIndex,
            title: getRecipeDisplayTitle(recipe),
            canonicalTask: taxonomy.canonical,
            taskCluster: taxonomy.cluster,
            functionIds: taxonomy.functions,
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
            evidenceStatus: answer.targetHumanMinutes !== '' && answer.targetHumanMinutes != null ? 'user-observed-retained-time' : recipe.evidenceStatus,
            baselineTimeSource: answer.baselineHumanMinutes !== '' && answer.baselineHumanMinutes != null ? 'user-input' : answer.currentMode === 'manual' ? answer.timeSource : 'model-estimate',
            targetTimeSource: answer.targetHumanMinutes !== '' && answer.targetHumanMinutes != null ? 'user-input' : 'model-estimate',
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
        assessmentId: `SCI-${Date.now().toString(36).toUpperCase()}-${randomToken(6)}`,
        scoringVersion: VERSIONS.scoring,
        recipeCatalogVersion: VERSIONS.recipes,
        taxonomyVersion: VERSIONS.taxonomy,
        hardwareCatalogVersion: VERSIONS.hardware,
        workflowCatalogVersion: VERSIONS.workflows,
        generatedAt: new Date().toISOString(),
        timezone: 'Asia/Taipei',
        persona: snapshot.persona,
        functionId: snapshot.functionId,
        roleTag: snapshot.roleTag,
        scope: snapshot.scope,
        schemaVersion: '3.0',
        roleId: snapshot.roleId,
        evidence: 'expert-model-estimate',
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
    observeReveals();
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
        <header><div class="workflow-impact-card__identity"><img class="workflow-clone-avatar" src="${getCloneAvatarPath(task.recipeId)}" alt="${task.cloneTag}"><div><span>TASK ${String(index + 1).padStart(2, '0')} · ${task.scaleLabel} · ${getFrequencyLabel(task)}</span><h4>${task.title}</h4></div></div></header>
        <div class="workflow-detail-columns"><div><span>影分身可協助</span><p>${task.assist}</p></div><div><span>仍需人工</span><p>${task.review}</p></div>
            <div class="share-chart" role="img" aria-label="影分身協助 ${formatPercent(shadowShare)}%，人工處理 ${formatPercent(humanShare)}%">
                <div class="share-donut">${renderDonut(shadowShare)}<strong>${formatPercent(shadowShare)}<small>%</small></strong></div>
                <ul><li class="is-shadow"><i></i>影分身協助 <b>${formatPercent(shadowShare)}%</b></li><li><i></i>人工處理 <b>${formatPercent(humanShare)}%</b></li></ul>
            </div>
        </div>
        <div class="workflow-impact-grid">
            <div><span>目前投入</span><strong>${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <span class="workflow-arrow" aria-hidden="true">${iconSvg('arrow-right')}</span>
            <div><span>導入後</span><strong>${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <div class="saved-highlight"><span>每月可釋放</span><strong>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</strong><small>${task.savedCostMonthlyTwd > 0 ? `工時價值 ${formatCurrency(task.savedCostMonthlyTwd)}` : '未填人力時間價值'}</small></div>
        </div>
    </article>`;
}

function renderWorkloadOverview(result) {
    const totalCurrentHours = result.taskResults.reduce((sum, task) => sum + task.currentMonthlyMinutes, 0) / 60;
    const totalTargetHours = result.taskResults.reduce((sum, task) => sum + task.targetMonthlyMinutes, 0) / 60;
    const totalSavedHours = Math.max(totalCurrentHours - totalTargetHours, 0);
    const totalSavedShare = totalCurrentHours > 0 ? clamp(totalSavedHours / totalCurrentHours * 100, 0, 100) : 0;
    const rows = result.taskResults.map((task, index) => {
        const currentHours = task.currentMonthlyMinutes / 60;
        const targetHours = task.targetMonthlyMinutes / 60;
        const keptShare = currentHours > 0 ? clamp(targetHours / currentHours * 100, 0, 100) : 100;
        return `<button type="button" class="time-comparison-row ${index === 0 ? 'is-selected' : ''}" data-task-toggle="${index}" aria-expanded="${index === 0}" aria-controls="workload-task-detail">
            <span class="time-comparison-row__title"><b>${String(index + 1).padStart(2, '0')}</b><strong>${task.title}${index === 0 ? '<em class="priority-task-label">優先導入</em>' : ''}</strong><small>${getFrequencyLabel(task)}・目前 ${formatHours(currentHours)} 小時／月</small></span>
            <span class="time-comparison-row__chart">
                <span class="saving-bar" style="--kept:${keptShare}%" aria-hidden="true"><i class="saving-bar__kept"></i><i class="saving-bar__saved"></i><em>${formatPercent(task.reliefRate)}%</em></span>
                <span class="saving-bar__labels"><span>仍需人工 <b>${formatHours(targetHours)} 小時</b></span><span>影分身可協助 <b>${formatHours(task.savedMonthlyMinutes / 60)} 小時</b></span></span>
            </span>
            <span class="time-comparison-row__saved"><small>每月省下</small><span class="time-reduction-value"><strong aria-label="每月省下 ${formatHours(task.savedMonthlyMinutes / 60)} 小時，下降 ${formatPercent(task.reliefRate)}%">${formatHours(task.savedMonthlyMinutes / 60)} 小時</strong></span></span>
        </button>`;
    }).join('');
    return `<section class="workload-overview" aria-labelledby="workload-overview-title">
        <div class="saving-summary">
            <div class="saving-donut" role="img" aria-label="整體人工工時減少 ${Math.round(totalSavedShare)}%">${renderDonut(totalSavedShare)}<strong>${Math.round(totalSavedShare)}<small>%</small></strong><span>工時減少</span></div>
            <div class="saving-summary__copy">
                <h4 id="workload-overview-title">導入影分身後，每月合計省下</h4>
                <strong>${formatHours(totalSavedHours)}<small> 小時</small></strong>
            </div>
            <div class="saving-summary__compare">
                <div><span>導入前工時</span><i style="--bar:100%"></i><b>${formatHours(totalCurrentHours)} 小時</b></div>
                <div class="is-after"><span>導入後工時</span><i style="--bar:${100 - totalSavedShare}%"></i><b>${formatHours(totalTargetHours)} 小時</b></div>
            </div>
        </div>
        <div class="time-comparison-legend"><span><i></i>導入後仍需人工</span><span><i></i>影分身可協助的工時</span></div>
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
    observeReveals(panel);
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

function getRecipeContext(recipe) { return recipe.description; }
function renderCloneCard(clone, index) {
    return `<article class="clone-card clone-card--compact" title="${clone.capability}">
        <div class="clone-avatar"><img src="${getCloneAvatarPath(clone.recipeId)}" alt=""><i aria-hidden="true"></i></div>
        <div class="clone-card__body"><span class="clone-card__index">SHADOW ${String(index + 1).padStart(2, '0')}</span><h4>${clone.name}</h4><p><b>專長</b>${clone.capability}</p><strong class="clone-card__saving">每月可釋放 ${formatHours(clone.savedMonthlyMinutes / 60)} 小時</strong></div>
    </article>`;
}

function renderReportClonePlan(clones) {
    const names = clones.map(clone => clone.name.replace(/分身$/u, ''));
    // Names only, side by side; a clone's capability opens below when its chip is pressed.
    return `<p class="clone-plan-line">本次規劃 ${clones.length} 個影分身，點選名稱查看可協助的內容</p>
        <div class="clone-plan-list">${clones.map((clone, index) => `<button type="button" class="clone-plan-item" data-clone-toggle="${index}" aria-expanded="false" aria-controls="clone-plan-detail">
            <span class="clone-plan-avatar"><img src="${getCloneAvatarPath(clone.recipeId)}" alt=""></span>
            <strong>${names[index]}</strong>
        </button>`).join('')}</div>
        <div class="clone-plan-detail" id="clone-plan-detail" hidden>${clones.map((clone, index) => `<p data-clone-detail="${index}" hidden><strong>${clone.name}</strong>${clone.capability}</p>`).join('')}</div>`;
}

function toggleClonePlanDetail(button) {
    const list = button.closest('#clone-list');
    const detail = list.querySelector('.clone-plan-detail');
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    list.querySelectorAll('[data-clone-toggle]').forEach(item => item.setAttribute('aria-expanded', String(willOpen && item === button)));
    list.querySelectorAll('[data-clone-detail]').forEach(item => { item.hidden = !(willOpen && item.dataset.cloneDetail === button.dataset.cloneToggle); });
    detail.hidden = !willOpen;
}

function previousStep3Panel() {
    goToStep3Panel(step3PanelIndex - 1);
}

function getCloneAvatarPath(recipeId) {
    const family = String(recipeId || '').charAt(0);
    const number = Number.parseInt(String(recipeId || '').slice(1), 10);
    const fallbackNumber = Number.isFinite(number) ? ((number - 1) % 8) + 1 : 1;
    const avatarId = ['S', 'E', 'B'].includes(family) ? `${family}${String(fallbackNumber).padStart(2, '0')}` : 'S08';
    return `avatars/${avatarId}.webp`;
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
        <div class="hardware-model-card__action">${renderPurchaseLink('了解更多', campaignConfig.productLinks.systems[recommendation.tier], `system-${index}`)}</div>
    </article>`).join('');
    const sharedParts = document.getElementById('shared-parts');
    sharedParts.innerHTML = '';
    sharedParts.hidden = true;
    document.getElementById('system-purchase-cta').innerHTML = '';
    const componentLabels = {
        cpu: ['處理器系列', 'CPU', 'cpu', '了解更多'],
        mb: ['主機板系列', 'MB', 'motherboard', '了解更多'],
        gpu: ['顯示卡系列', 'VGA', 'gpu', '了解更多']
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
        <div class="shadow-strength-card__body"><div><strong>${strength.label}</strong><span>${strength.capacity}</span></div><div class="shadow-strength-meter" aria-label="影分身戰力 ${strength.grade} 級"><i style="--strength:${strength.meter}%"></i></div><p>${strength.description} 這是依設備規格與本次工作負載提供的相對運算餘裕建議。</p><button class="strength-scale-button" type="button" data-strength-scale="${strength.grade}">查看 A 至 SS 各級配置<span aria-hidden="true">→</span></button></div>
        <header class="local-value-heading"><span>從目前限制到地端工作方式</span><strong>為什麼值得把影分身軍團建立在自己的設備上</strong></header>
        <div class="local-value-comparisons">${comparisons.map(item => `<article><div><span>目前痛點</span><p>${item.before}</p></div><i aria-hidden="true"></i><div><span>地端影分身</span><p>${item.after}</p></div></article>`).join('')}</div>
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
    return `<button class="button button--accent hardware-buy-link" type="button" data-buy-link="${kind}" aria-label="${label}">${label}</button>`;
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

function refreshAssessmentResult() {
    const snapshot = createAssessmentSnapshot();
    const fingerprint = JSON.stringify(snapshot);
    if (assessmentState.result && assessmentState.resultFingerprint === fingerprint) return false;
    if (assessmentState.result && !answersReadyForCalculation()) return false;
    assessmentState.result = calculateAssessment(snapshot);
    assessmentState.resultFingerprint = fingerprint;
    return true;
}

function answersReadyForCalculation() {
    if (!assessmentState.persona || !assessmentState.selectedRecipeIds.length) return false;
    if (!assessmentState.selectedRecipeIds.every(id => isAnswerComplete(assessmentState.taskAnswers[id]))) return false;
    if (!assessmentState.executionNeeds.parallelBand) return false;
    const cost = Number(assessmentState.costAmountTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 10000000) return false;
    return Boolean(assessmentState.cloudUsage);
}

function startAnonymousSubmission() {
    const result = assessmentState.result;
    if (!result || result.unavailable) return;
    const fingerprint = assessmentState.resultFingerprint;
    if (assessmentState.collectionStatus === 'submitting') return;
    if (assessmentState.collectionSubmittedFingerprint === fingerprint) return;
    assessmentState.collectionStatus = 'submitting';
    submitAnonymousAssessment()
        .then(response => {
            if (response.ok) {
                assessmentState.collectionStatus = 'submitted';
                assessmentState.collectionSubmittedFingerprint = fingerprint;
                assessmentState.collectionSubmittedAssessmentId = result.assessmentId;
                trackEvent('anonymous_data_submitted', { tier: result.recommendation.tier });
            } else {
                assessmentState.collectionStatus = 'failed';
                assessmentState.collectionFailureReason = response.reason || '';
                trackEvent('anonymous_data_failed', { reason: response.reason || 'unknown' });
            }
        })
        .catch(error => {
            assessmentState.collectionStatus = 'failed';
            assessmentState.collectionFailureReason = error?.message || '';
            trackEvent('anonymous_data_failed', { reason: error?.message || 'unknown' });
        });
}

function showDataCollectionDetails(trigger) {
    elements.modalContent.innerHTML = `
        <div class="data-consent-modal">
            <header>
                <span class="step-kicker">匿名資料蒐集說明</span>
                <h2 id="modal-title">我們會蒐集什麼？</h2>
                <p>當你按下「查看我的影分身效益」時，系統會把這次評估的內容匿名傳回，用於分析常見工作型態並改善這項工具。</p>
            </header>
            <ul class="data-consent-list">
                <li>Step 1–3 的填寫內容：工作身分、選擇的任務、時間與頻率、成本與雲端 AI 使用狀況。</li>
                <li>計算結果：SCI 分數、每月釋放工時、節省費用、影分身與設備推薦。</li>
                <li>與「下載 PNG」相同的那張完整報表圖片。</li>
            </ul>
            <div class="data-consent-privacy">
                <strong>不蒐集姓名、Email、電話</strong>
                <p>資料僅以這組瀏覽器隨機識別碼區分。你可以清除瀏覽器資料來重設它。</p>
                <code>${escapeHtml(anonymousVisitorId)}</code>
            </div>
            <p class="data-consent-hint">若不希望提供資料，請不要按下「查看我的影分身效益」。</p>
            <div class="data-consent-actions">
                <button class="button button--accent" type="button" data-close-modal>我了解了</button>
            </div>
        </div>`;
    elements.modalContent.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    openModal(trigger);
}

async function submitAnonymousAssessment() {
    if (!DATA_COLLECTION_CONFIG.endpoint) {
        return { ok: false, reason: '資料收集端點尚未設定，本次資料尚未送出。' };
    }
    const result = assessmentState.result;
    if (!result) return { ok: false, reason: '找不到本次評估結果。' };
    await document.fonts.ready;
    const reportBlob = await createReportBlobV2(result);
    const reportBase64 = await blobToBase64(reportBlob);
    const payload = {
        schemaVersion: DATA_COLLECTION_CONFIG.schemaVersion,
        anonymousId: anonymousVisitorId,
        assessmentId: result.assessmentId,
        consent: true,
        consentedAt: new Date().toISOString(),
        sourcePage: `${location.origin}${location.pathname}`,
        assessment: createAssessmentSnapshot(),
        result,
        reportImage: {
            filename: `ASUS-SCI-${result.assessmentId}.png`,
            mimeType: 'image/png',
            dataBase64: reportBase64
        }
    };
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), DATA_COLLECTION_CONFIG.timeoutMs);
    try {
        const response = await fetch(DATA_COLLECTION_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            redirect: 'follow',
            signal: controller.signal
        });
        let data = null;
        try {
            data = await response.json();
        } catch (error) {
            void error;
        }
        return {
            ok: Boolean(response.ok && (!data || data.ok !== false)),
            reason: data?.reason || (!response.ok ? `HTTP ${response.status}` : '')
        };
    } catch (error) {
        if (error.name === 'AbortError') return { ok: false, reason: '資料送出逾時，您可以重試或直接查看報告。' };
        return { ok: false, reason: '目前無法連線至資料收集服務，您可以重試或直接查看報告。' };
    } finally {
        window.clearTimeout(timer);
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(new Error('報表圖片轉換失敗。'));
        reader.readAsDataURL(blob);
    });
}

async function previewReport(trigger) {
    const result = assessmentState.result;
    if (!result || result.unavailable) return;
    trigger.disabled = true;
    const originalText = trigger.textContent;
    trigger.textContent = '正在產生報告…';
    try {
        await document.fonts.ready;
        // The download mirrors the on-screen report; the hand-drawn canvas version is only a fallback.
        let blob;
        try {
            blob = await createReportSnapshotBlob();
        } catch (snapshotError) {
            blob = await createReportBlobV2(result);
        }
        clearReportPreview();
        reportPreviewUrl = URL.createObjectURL(blob);
        const filename = `ASUS-影分身導入報告-${taipeiDateStamp()}.png`;
        elements.modalContent.innerHTML = `<div class="report-preview"><header><span class="step-kicker">完整報告預覽</span><h2 id="modal-title">你的影分身導入報告</h2><p>請先檢查內容，確認後再下載 PNG 圖片。</p></header><div class="report-preview__toolbar"><button class="text-button" type="button" id="preview-size-toggle" aria-pressed="false">查看原始尺寸</button></div><div class="report-preview__image"><img src="${reportPreviewUrl}" alt="影分身導入報告預覽"></div><div class="report-preview__actions"><button class="button button--quiet" type="button" data-close-modal>返回報告</button><a class="button button--accent" href="${reportPreviewUrl}" download="${filename}" id="report-download-link">下載 PNG 圖片</a></div></div>`;
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

const REPORT_SNAPSHOT_WIDTH = 1200;
const REPORT_SNAPSHOT_CSS = `
    html, body { height: auto !important; overflow: visible !important; }
    body { margin: 0 !important; background: #eef3ff !important; }
    *, *::before, *::after { animation: none !important; transition: none !important; }
    .report-snapshot { width: ${REPORT_SNAPSHOT_WIDTH}px; padding: 44px 48px 48px; box-sizing: border-box; background: radial-gradient(ellipse at center, #fff 50%, #e3ecff 100%); }
    .report-snapshot__brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; padding-bottom: 18px; border-bottom: 1.5px solid #e2e8f0; color: #4f5f75; font-size: 15px; }
    .report-snapshot__brand img { width: 150px; height: 58px; object-fit: contain; }
    .report-snapshot .step { display: grid !important; height: auto !important; min-height: 0 !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
    .report-snapshot .reveal { opacity: 1 !important; transform: none !important; }
    .report-snapshot .result-actions, .report-snapshot .sci-info-trigger, .report-snapshot .strength-scale-button, .report-snapshot .clone-plan-line, .report-snapshot .hardware-tabs, .report-snapshot .hardware-buy-link, .report-snapshot .result-header .step-kicker { display: none !important; }
`;

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

async function fetchAsDataUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return blobToDataUrl(await response.blob());
}

// Manrope carries the report's numerals; embed its Latin subset so the image matches the screen.
// CJK text falls back to the system font inside the image, because embedding Noto Sans TC would be far too large.
async function getReportFontCss() {
    try {
        const link = document.querySelector('link[href*="fonts.googleapis.com/css2"]');
        if (!link) return '';
        const css = await (await fetch(link.href)).text();
        const blocks = css.split('}').map(block => `${block}}`).filter(block => block.includes('Manrope') && /U\+0000-00FF/i.test(block));
        const embedded = await Promise.all(blocks.map(async block => {
            const url = block.match(/url\((https:[^)]+)\)/)?.[1];
            return url ? block.replace(url, await fetchAsDataUrl(url)) : '';
        }));
        return embedded.join('\n');
    } catch (error) {
        return '';
    }
}

async function createReportSnapshotBlob() {
    const source = document.getElementById('step-4');
    const clone = source.cloneNode(true);
    clone.hidden = false;
    clone.querySelectorAll('.reveal').forEach(node => node.classList.add('is-inview'));
    clone.querySelectorAll('.sci-overview').forEach(node => node.classList.add('is-animated'));
    clone.querySelectorAll('[id]').forEach(node => { if (node.id !== 'donut-grad') node.removeAttribute('id'); });
    clone.id = 'step-4';

    const stylesheetHref = document.querySelector('link[rel="stylesheet"][href*="styles.css"]').href;
    const [pageCss, fontCss] = await Promise.all([fetch(stylesheetHref).then(response => response.text()), getReportFontCss()]);
    const style = document.createElement('style');
    // Relative url() references cannot load inside an image, and none of them are part of the report body.
    style.textContent = `${fontCss}\n${pageCss.replace(/url\((?!["']?(?:data:|#))[^)]*\)/g, 'none')}\n${REPORT_SNAPSHOT_CSS}`;

    const root = document.createElement('div');
    root.className = 'report-snapshot';
    const brand = document.createElement('div');
    brand.className = 'report-snapshot__brand';
    brand.innerHTML = `<img src="img/ASUS AI agent computer badge.png" alt="ASUS AI Agent Computer"><span>診斷日期 ${taipeiDateStamp().replace(/-/g, '/')}</span>`;
    root.append(brand, clone);
    await Promise.all([...root.querySelectorAll('img')].map(async image => {
        try {
            image.src = await fetchAsDataUrl(new URL(image.getAttribute('src'), document.baseURI).href);
        } catch (error) {
            image.remove();
        }
    }));

    // Lay the report out in a hidden frame of the export width so its height matches what the image will render.
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.cssText = `position:fixed;left:-99999px;top:0;width:${REPORT_SNAPSHOT_WIDTH}px;height:900px;border:0;visibility:hidden;`;
    document.body.appendChild(frame);
    let height;
    try {
        const frameDocument = frame.contentDocument;
        frameDocument.open();
        frameDocument.write('<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"></head><body data-step="4"></body></html>');
        frameDocument.close();
        frameDocument.head.appendChild(frameDocument.importNode(style, true));
        const framedRoot = frameDocument.importNode(root, true);
        frameDocument.body.appendChild(framedRoot);
        // A timer rather than requestAnimationFrame: frames do not fire while the tab is in the background.
        await new Promise(resolve => setTimeout(resolve, 120));
        height = Math.ceil(framedRoot.getBoundingClientRect().height);
    } finally {
        frame.remove();
    }
    if (!height) throw new Error('Report snapshot has no height.');

    const wrapper = document.createElement('div');
    wrapper.append(style, root);
    const markup = new XMLSerializer().serializeToString(wrapper);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${REPORT_SNAPSHOT_WIDTH}" height="${height}" viewBox="0 0 ${REPORT_SNAPSHOT_WIDTH} ${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
    const image = new Image();
    image.decoding = 'sync';
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error('Report snapshot could not be rendered.'));
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
    const scale = Math.min(2, Math.sqrt(16000000 / (REPORT_SNAPSHOT_WIDTH * height)));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(REPORT_SNAPSHOT_WIDTH * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Report snapshot export failed.')), 'image/png'));
}

async function createReportBlobV2(result) {
    const width = 1080;
    const left = 64;
    const contentWidth = width - left * 2;
    const taskHeight = 116;
    const hardwareHeight = 250;
    const cloneRows = Math.max(1, Math.ceil(result.clones.length / 3));
    const height = 780 + cloneRows * 92 + result.taskResults.length * taskHeight
        + result.recommendation.models.length * (hardwareHeight + 18) + 120;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const font = '"Segoe UI", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
    const colors = {
        page: '#F3F7FD', surface: '#FFFFFF', soft: '#EAF3FF', line: '#D7E3F2',
        text: '#17243D', muted: '#64748B', subtle: '#8A9AB2',
        blue: '#1769D8', cyan: '#1EAED1', green: '#37B987'
    };
    const avatars = new Map(await Promise.all(
        result.clones.map(async clone => [clone.recipeId, await loadImageAsset(getCloneAvatarPath(clone.recipeId))])
    ));
    const card = (x, y, w, h, fill = colors.surface) => roundedRect(ctx, x, y, w, h, 18, fill, colors.line);
    const label = (value, x, y, align = 'left') => canvasText(ctx, value, x, y, `700 12px ${font}`, colors.muted, align);
    const value = (text, x, y, size = 28, color = colors.text, align = 'left') => canvasText(ctx, text, x, y, `800 ${size}px ${font}`, color, align);
    const heading = (text, y) => {
        canvasText(ctx, text, left, y, `800 25px ${font}`, colors.text);
        ctx.fillStyle = colors.blue;
        ctx.fillRect(left, y + 13, 36, 3);
    };

    ctx.fillStyle = colors.page;
    ctx.fillRect(0, 0, width, height);
    const wash = ctx.createLinearGradient(0, 0, width, 0);
    wash.addColorStop(0, 'rgba(245,111,151,.10)');
    wash.addColorStop(.52, 'rgba(255,255,255,0)');
    wash.addColorStop(1, 'rgba(67,114,238,.14)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, 300);

    let y = 54;
    roundedRect(ctx, left, y, 52, 52, 15, colors.blue);
    canvasText(ctx, 'AI', left + 26, y + 35, `900 22px ${font}`, '#FFFFFF', 'center');
    canvasText(ctx, 'AGENT COMPUTER', left + 68, y + 23, `900 17px ${font}`, colors.text);
    canvasText(ctx, '影分身戰力測驗', left + 68, y + 45, `700 12px ${font}`, colors.blue);
    canvasText(ctx, `診斷日期 ${formatTaipeiDate(result.generatedAt)}`, width - left, y + 30, `600 12px ${font}`, colors.muted, 'right');

    y += 92;
    canvasText(ctx, '你的影分身導入報告', left, y, `900 40px ${font}`, colors.text);
    canvasText(ctx, `${personaCatalog[result.persona].name} · ${result.taskResults.length} 項工作`, left, y + 31, `600 14px ${font}`, colors.muted);

    y += 70;
    card(left, y, contentWidth, 176);
    label('目前 SCI', left + 28, y + 36);
    value(String(Math.round(result.sci.current)), left + 28, y + 104, 58);
    canvasText(ctx, '/100', left + 104, y + 104, `600 14px ${font}`, colors.subtle);
    canvasText(ctx, '→', left + 218, y + 99, `700 34px ${font}`, colors.blue, 'center');
    label('導入後 SCI', left + 270, y + 36);
    value(String(Math.round(result.sci.target)), left + 270, y + 104, 66, colors.blue);
    canvasText(ctx, '/100', left + 356, y + 104, `600 14px ${font}`, colors.subtle);
    canvasText(ctx, `提升 ${Math.round(result.sci.gap)} 點`, left + 270, y + 140, `800 13px ${font}`, colors.green);

    const metricStart = left + 450;
    const metrics = [
        ['釋放工時', `${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}`],
        ['工時價值', formatCurrency(result.cost.laborSavedMonthlyTwd)],
        ['等值約節省', formatTokens(result.tokens.savedMonthly)]
    ];
    metrics.forEach((metric, index) => {
        const x = metricStart + index * 164;
        label(metric[0], x, y + 44);
        wrapCanvasText(ctx, metric[1], x, y + 84, 146, 29, 2, `800 25px ${font}`, colors.text);
        if (index === 2) canvasText(ctx, '雲端 Token 費用', x, y + 139, `600 10px ${font}`, colors.muted);
    });

    y += 220;
    heading(`本次規劃：共 ${result.clones.length} 個影分身`, y);
    y += 34;
    result.clones.forEach((clone, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const x = left + column * 318;
        const cardY = y + row * 92;
        card(x, cardY, 302, 76);
        const avatar = avatars.get(clone.recipeId);
        roundedRect(ctx, x + 12, cardY + 12, 52, 52, 12, colors.soft);
        if (avatar) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x + 12, cardY + 12, 52, 52, 12);
            ctx.clip();
            ctx.drawImage(avatar, x + 12, cardY + 12, 52, 52);
            ctx.restore();
        }
        canvasText(ctx, clone.name, x + 76, cardY + 29, `800 12px ${font}`, colors.text);
        wrapCanvasText(ctx, clone.capability, x + 76, cardY + 50, 210, 14, 2, `500 9px ${font}`, colors.muted);
    });
    y += cloneRows * 92 + 34;

    heading('哪些工作交給影分身？', y);
    y += 36;
    result.taskResults.forEach((task, index) => {
        card(left, y, contentWidth, 98, index === 0 ? '#F4FAFF' : '#FFFFFF');
        roundedRect(ctx, left + 18, y + 18, 34, 34, 10, colors.soft);
        canvasText(ctx, String(index + 1).padStart(2, '0'), left + 35, y + 41, `800 11px ${font}`, colors.blue, 'center');
        wrapCanvasText(ctx, task.title, left + 66, y + 31, 310, 19, 2, `800 14px ${font}`, colors.text);
        canvasText(ctx, getFrequencyLabel(task), left + 66, y + 75, `600 10px ${font}`, colors.muted);
        label('每月人工工時', left + 420, y + 29);
        canvasText(ctx, `${formatHours(task.currentMonthlyMinutes / 60)} → ${formatHours(task.targetMonthlyMinutes / 60)} 小時`, left + 420, y + 58, `800 16px ${font}`, colors.text);
        label('每月減少', width - left - 20, y + 29, 'right');
        canvasText(ctx, `${formatHours(task.savedMonthlyMinutes / 60)} 小時`, width - left - 20, y + 58, `900 18px ${font}`, colors.blue, 'right');
        y += taskHeight;
    });

    y += 12;
    heading('找尋最適合您影分身軍團的設備', y);
    y += 38;
    const hardwareLabels = {
        mb: '主機板 MB', cpu: '處理器 CPU', gpu: '顯示卡 VGA', ram: '記憶體 RAM',
        ssd: '儲存裝置 SSD', case: '機殼 CASE', cooling: '散熱系統', psu: '電源供應器 PSU'
    };
    result.recommendation.models.forEach(hardware => {
        card(left, y, contentWidth, hardwareHeight);
        canvasText(ctx, hardware.name, left + 24, y + 36, `900 19px ${font}`, colors.text);
        canvasText(ctx, `${result.recommendation.strength.grade} 級影分身戰力`, width - left - 24, y + 36, `800 13px ${font}`, colors.blue, 'right');
        ctx.strokeStyle = colors.line;
        ctx.beginPath();
        ctx.moveTo(left + 24, y + 58);
        ctx.lineTo(width - left - 24, y + 58);
        ctx.stroke();
        Object.entries(hardwareLabels)
            .filter(([key]) => !(key === 'case' && hardware.integratedChassis))
            .forEach(([key, title], index) => {
                const column = index % 4;
                const row = Math.floor(index / 4);
                const x = left + 24 + column * 230;
                const itemY = y + 88 + row * 72;
                canvasText(ctx, title, x, itemY, `700 10px ${font}`, colors.muted);
                wrapCanvasText(ctx, hardware[key], x, itemY + 22, 205, 15, 3, `700 10px ${font}`, colors.text);
            });
        y += hardwareHeight + 18;
    });

    ctx.fillStyle = colors.line;
    ctx.fillRect(left, height - 66, contentWidth, 1);
    canvasText(ctx, 'SCI · Shadow-Clone Index', left, height - 36, `600 10px ${font}`, colors.muted);
    canvasText(ctx, 'ASUS AGENT COMPUTER', width - left, height - 36, `800 10px ${font}`, colors.blue, 'right');

    return new Promise((resolve, reject) => canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')),
        'image/png',
        1
    ));
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

function openStrengthScaleModal(trigger) {
    const currentGrade = trigger.dataset.strengthScale;
    elements.modalContent.innerHTML = `
        <div class="strength-scale-modal">
            <header>
                <span class="step-kicker">影分身戰力分級</span>
                <h2 id="modal-title">A 至 SS 各級配置</h2>
                <p>分級代表地端模型、多工具與平行流程可使用的運算餘裕；不代表固定速度倍數，也不等同 SCI。</p>
            </header>
            <div class="strength-scale-list">${Object.values(hardwareCatalog).map(tier => {
                const model = tier.models[0];
                const isCurrent = tier.strength.grade === currentGrade;
                return `<article class="${isCurrent ? 'is-current' : ''}">
                    <div class="strength-scale-grade"><strong>${tier.strength.grade}</strong>${isCurrent ? '<em>本次建議</em>' : ''}</div>
                    <div class="strength-scale-copy">
                        <h3>${tier.strength.label}<small>${tier.strength.capacity}</small></h3>
                        <dl><div><dt>GPU</dt><dd>${model.gpu}</dd></div><div><dt>CPU</dt><dd>${model.cpu}</dd></div><div><dt>記憶體</dt><dd>${model.ram}</dd></div><div><dt>儲存</dt><dd>${model.ssd}</dd></div></dl>
                        <p>代表機型：${tier.models.map(item => item.name).join('、')}</p>
                    </div>
                </article>`;
            }).join('')}</div>
        </div>`;
    openModal(trigger);
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

function openModal(trigger, options = {}) {
    lastModalTrigger = trigger;
    elements.modal.dataset.locked = options.locked ? 'true' : 'false';
    elements.modal.querySelector('.modal__close').hidden = Boolean(options.locked);
    elements.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    elements.modalPanel.focus();
}

function closeModal(options = {}) {
    if (elements.modal.hidden) return;
    if (elements.modal.dataset.locked === 'true' && !options.force) return;
    elements.modal.hidden = true;
    elements.modal.dataset.locked = 'false';
    elements.modal.querySelector('.modal__close').hidden = false;
    document.body.style.overflow = '';
    clearReportPreview();
    lastModalTrigger?.focus();
}

function handleModalKeys(event) {
    if (elements.modal.hidden) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        if (elements.modal.dataset.locked !== 'true') closeModal();
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
        functionId: null,
        roleTag: null,
        taskSearch: '',
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
        collectionStatus: 'idle',
        collectionSubmittedAssessmentId: null,
        collectionSubmittedFingerprint: null,
        collectionFailureReason: '',
        resultFingerprint: null,
        result: null
    });
    renderPersonaSelection();
    goToStep(1);
}

function invalidateResult() {
    assessmentState.result = null;
    assessmentState.collectionStatus = 'idle';
    assessmentState.collectionSubmittedAssessmentId = null;
    assessmentState.collectionSubmittedFingerprint = null;
    assessmentState.collectionFailureReason = '';
    assessmentState.resultFingerprint = null;
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

function calculateWorkflowMetrics(recipeId) { return globalThis.SCIWorkflowV2.metrics(recipeId); }

function isAnswerComplete(answer) {
    if (!answer) return false;
    const frequency = Number(answer.frequency);
    const minutes = Number(answer.currentHumanMinutes);
    const optionalTimesValid = ['baselineHumanMinutes','targetHumanMinutes'].every(field => answer[field] === '' || answer[field] == null || (Number.isFinite(Number(answer[field])) && Number(answer[field]) >= (field==='baselineHumanMinutes' ? .1 : 0) && Number(answer[field]) <= 10080));
    return optionalTimesValid && Boolean(answer.scale && answer.currentMode && answer.period && answer.timeSource && answer.timeConfirmed) && Number.isInteger(frequency) && frequency > 0 && frequency <= 1000 && Number.isFinite(minutes) && minutes >= 0.1 && minutes <= 10080;
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

function getOrCreateAnonymousId() {
    try {
        const stored = localStorage.getItem(DATA_COLLECTION_CONFIG.anonymousIdStorageKey);
        if (stored && /^SCI-U-[A-Z0-9-]{20,}$/i.test(stored)) return stored;
        const created = createAnonymousId();
        localStorage.setItem(DATA_COLLECTION_CONFIG.anonymousIdStorageKey, created);
        return created;
    } catch (error) {
        void error;
        return createAnonymousId();
    }
}

function createAnonymousId() {
    const hex = randomHex(16);
    return `SCI-U-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    const source = window.crypto || window.msCrypto;
    if (source && typeof source.getRandomValues === 'function') {
        source.getRandomValues(bytes);
    } else {
        for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
    }
    return [...bytes].map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function randomToken(length) {
    return randomHex(Math.ceil(length / 2)).slice(0, length);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function trackEvent(name, detail) {
    document.dispatchEvent(new CustomEvent('sci:analytics', { detail: { name, ...detail, versions: VERSIONS } }));
}

// Imported snapshots must pass migration; no guesses when old occupations split.
function restoreSciAssessment(saved) {
    const migration = globalThis.SCIWorkflowV2.migrate(saved);
    if (migration.status !== 'valid') {
        assessmentState.previousAssessment = migration.previous;
        assessmentState.persona = saved?.persona === 'education' ? 'edu' : (saved?.persona || null);
        assessmentState.functionId = null;
        assessmentState.roleTag = null;
        assessmentState.selectedRecipeIds = [];
        assessmentState.taskAnswers = {};
        assessmentState.archivedAnswers = {};
        invalidateResult();
        if (assessmentState.persona) { renderPersonaSelection(); goToStep(2); }
        showError(migration.reason || '職業或任務已改版，請重新選擇職業並確認任務及工時。');
        return migration;
    }
    const value = migration.value;
    const role = globalThis.SCIWorkflowV2.getRole(value.roleId);
    Object.assign(assessmentState, {persona:normalizeSciPersona(role.persona),functionId:normalizeSciPersona(role.persona)+'.'+role.functionName,roleTag:role.title,selectedRecipeIds:[...(value.selectedRecipeIds||[])],taskAnswers:JSON.parse(JSON.stringify(value.taskAnswers||{})),archivedAnswers:{},taskSearch:''});
    invalidateResult(); renderPersonaSelection(); goToStep(2);
    return migration;
}
if (typeof globalThis !== 'undefined') globalThis.restoreSciAssessment = restoreSciAssessment;
