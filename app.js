'use strict';

const VERSIONS = Object.freeze({
    scoring: 'sci-index-v3',
    recipes: 'recipes-v1',
    hardware: 'hardware-v1'
});

const SCI_CONFIG = Object.freeze({
    scaleMax: 100,
    achievableMax: 90,
    referenceReliefPercent: 75
});

// 暫定換算基準：1 小時知識工作交由影分身處理，含讀取資料與多輪產出的 token 量。
const TOKEN_CONFIG = Object.freeze({
    tokensPerHour: 40000
});

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

function makeRecipe(id, persona, title, workUnit, assist, review, manual, agent, profiles, cloneTag, roleTags, featured = false, tiers = [1, 1, 2]) {
    const descriptions = scaleDescriptions[id];
    return Object.freeze({
        id, persona, title, workUnit, assist, review, profiles, cloneTag, roleTags, featured,
        evidenceStatus: 'heuristic',
        integrationStatus: 'export-only',
        softwareValidationStatus: 'pending',
        recipeVersion: '1.0',
        scales: Object.freeze({
            small: Object.freeze({ label: '低負載', description: descriptions[0], manualMinutes: manual * 0.6, agentHumanMinutes: agent * 0.6, baseTier: tiers[0] }),
            standard: Object.freeze({ label: '中負載', description: descriptions[1], manualMinutes: manual, agentHumanMinutes: agent, baseTier: tiers[1] }),
            large: Object.freeze({ label: '高負載', description: descriptions[2], manualMinutes: manual * 2.5, agentHumanMinutes: agent * 2.5, baseTier: tiers[2] })
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
    entry: Object.freeze({
        label: '創作啟航型｜影分身協作工作站',
        amd: { name: 'AMD 高效運算平台', cpu: 'AMD Ryzen 7 9700X', mb: 'ASUS B850 系列主機板' },
        intel: { name: 'Intel 高效運算平台', cpu: 'Intel Core Ultra 7 265K', mb: 'ASUS Z890 系列主機板' },
        shared: { gpu: 'AMD Radeon AI PRO R9700 32GB', ram: '64GB DDR5', ssd: '2TB PCIe 4.0 M.2 NVMe', case: 'ROG Strix Helios II', cooling: 'TUF GAMING 360 水冷散熱', psu: '850W 金牌電源供應器' }
    }),
    mainstream: Object.freeze({
        label: '專業協作型｜多工影分身工作站',
        amd: { name: 'AMD 多工創作平台', cpu: 'AMD Ryzen 9 9900X', mb: 'ASUS B850／X870 系列主機板' },
        intel: { name: 'Intel 多工創作平台', cpu: 'Intel Core Ultra 7 265K', mb: 'ASUS Z890 系列主機板' },
        shared: { gpu: 'AMD Radeon AI PRO R9700 32GB', ram: '64GB DDR5，可擴充至 128GB', ssd: '2TB PCIe 4.0，可擴充至 4TB', case: 'ROG Cronox ARGB', cooling: 'ROG STRIX LC III 360 ARGB 水冷散熱', psu: '1000W 金牌電源供應器' }
    }),
    high: Object.freeze({
        label: '高效指揮型｜進階影分身工作站',
        amd: { name: 'AMD 旗艦運算平台', cpu: 'AMD Ryzen 9 9950X', mb: 'ASUS X870E 系列主機板' },
        intel: { name: 'Intel 旗艦運算平台', cpu: 'Intel Core Ultra 9 285K', mb: 'ASUS Z890 系列主機板' },
        shared: { gpu: 'NVIDIA GeForce RTX 5090 32GB', ram: '128GB DDR5', ssd: '4TB PCIe 4.0／5.0 NVMe', case: 'ROG Cronox ARGB', cooling: 'ROG RYUJIN III 360 ARGB 水冷散熱', psu: 'ROG THOR III 1200W 電源供應器' }
    })
});

const campaignConfig = Object.freeze({ tutorials: [], promotions: [], productLinks: {} });
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
    elements.hourlyCost.addEventListener('change', event => {
        assessmentState.hourlyCostTwd = event.target.value;
        invalidateResult();
    });
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
    elements.hourlyCost.value = assessmentState.hourlyCostTwd;
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
    assessmentState.hourlyCostTwd = elements.hourlyCost.value.trim();
    if (assessmentState.hourlyCostTwd === '') return showError('請填寫執行這些工作流程所需花費的金額。', elements.hourlyCost);
    const cost = Number(assessmentState.hourlyCostTwd);
    if (!Number.isFinite(cost) || cost <= 0 || cost > 100000) return showError('執行這些工作流程的金額必須大於 0，且不可超過 NT$100,000。', elements.hourlyCost);
    return true;
}

function createAssessmentSnapshot() {
    return JSON.parse(JSON.stringify({
        persona: assessmentState.persona,
        roleTag: assessmentState.roleTag,
        selectedRecipeIds: assessmentState.selectedRecipeIds,
        taskAnswers: assessmentState.taskAnswers,
        executionNeeds: assessmentState.executionNeeds,
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
        const target = Math.min(current, scale.agentHumanMinutes);
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
            agentReferenceMinutes: scale.agentHumanMinutes,
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
            evidenceStatus: recipe.evidenceStatus
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
    const hourlyCost = Number(snapshot.hourlyCostTwd);
    const currentHours = totals.current / 60;
    const targetHours = totals.target / 60;
    const loadingReductionPercent = totals.current > 0 ? Math.max(0, (totals.current - totals.target) / totals.current * 100) : 0;
    taskResults.forEach(task => {
        task.loadShare = totals.current > 0 ? task.currentMonthlyMinutes / totals.current * 100 : 0;
        task.reliefRate = task.currentMonthlyMinutes > 0 ? task.savedMonthlyMinutes / task.currentMonthlyMinutes * 100 : 0;
        task.reliefShare = totals.current > 0 ? task.savedMonthlyMinutes / totals.current * 100 : 0;
        task.savedCostMonthlyTwd = task.savedMonthlyMinutes / 60 * hourlyCost;
        task.savedTokensMonthly = task.savedMonthlyMinutes / 60 * TOKEN_CONFIG.tokensPerHour;
    });
    const recommendation = routeHardware(snapshot, taskResults);
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
        workload: { reductionPercent: loadingReductionPercent },
        time: { currentHoursMonthly: currentHours, targetHoursMonthly: targetHours, savedHoursMonthly: savedHours },
        cost: {
            kind: 'labor-value',
            hourlyCostTwd: hourlyCost,
            currentMonthlyTwd: currentHours * hourlyCost,
            targetMonthlyTwd: targetHours * hourlyCost,
            savedMonthlyTwd: savedHours * hourlyCost,
            savedAnnualTwd: savedHours * hourlyCost * 12,
            monthlyTwd: savedHours * hourlyCost,
            annualTwd: savedHours * hourlyCost * 12
        },
        tokens: {
            perHour: TOKEN_CONFIG.tokensPerHour,
            currentMonthly: currentHours * TOKEN_CONFIG.tokensPerHour,
            targetMonthly: targetHours * TOKEN_CONFIG.tokensPerHour,
            savedMonthly: savedHours * TOKEN_CONFIG.tokensPerHour,
            savedAnnual: savedHours * TOKEN_CONFIG.tokensPerHour * 12
        },
        taskResults: taskResults.sort((a, b) => b.currentMonthlyMinutes - a.currentMonthlyMinutes || a.selectionIndex - b.selectionIndex),
        clones: [...cloneMap.values()],
        recommendation,
        estimateStatus: 'heuristic'
    });
}

function routeHardware(snapshot, taskResults) {
    let tier = Math.max(...taskResults.map(task => getRecipe(task.recipeId).scales[task.scale].baseTier), 1);
    let needsReview = false;
    const reasons = [];
    const heavyTask = taskResults.slice().sort((a, b) => getRecipe(b.recipeId).scales[b.scale].baseTier - getRecipe(a.recipeId).scales[a.scale].baseTier)[0];
    if (heavyTask) reasons.push(`${heavyTask.title}採用${heavyTask.scaleLabel}規模，是本次配置等級的主要依據。`);
    const parallel = snapshot.executionNeeds.parallelBand;
    const hasLargeMedia = taskResults.some(task => task.scale === 'large' && task.profiles.includes('media'));
    const hasLargeKnowledge = taskResults.some(task => task.scale === 'large' && task.profiles.includes('knowledge'));
    if (parallel === '2' && (hasLargeMedia || hasLargeKnowledge)) tier = Math.max(tier, 2);
    if (parallel === '3-4') {
        tier = Math.max(tier, 2);
        if (hasLargeMedia) tier = 3;
        reasons.push('你預計同時處理 3 至 4 項工作，因此提高多工具與記憶體負載候選。');
    }
    if (parallel === '5+') {
        needsReview = true;
        reasons.push('5 項以上同時執行超出首版已確認的單機情境，需要進一步評估。');
    }
    if (parallel === '2') reasons.push('約 2 項同時處理已納入配置路由。');
    if (parallel === 'unknown') reasons.push('目前先以依序處理情境提供候選，實際同時執行能力仍需確認。');
    if (snapshot.persona === 'smb') {
        if (snapshot.executionNeeds.usersBand === '2-5') {
            tier = Math.max(tier, 2);
            reasons.push('2 至 5 人同時使用，因此至少提供 Mainstream 候選。');
        }
        if (['6-10', '10+'].includes(snapshot.executionNeeds.usersBand)) {
            needsReview = true;
            tier = Math.max(tier, 2);
            reasons.push('6 人以上同時使用需要部署與並行負載評估。');
        }
    }
    taskResults.forEach(task => {
        const weeklyFrequency = task.frequency;
        const batchProfiles = task.profiles.some(profile => ['document', 'analytics', 'knowledge', 'monitoring'].includes(profile));
        if (batchProfiles && ((task.scale === 'standard' && weeklyFrequency > 20) || (task.scale === 'large' && weeklyFrequency > 5))) {
            tier = Math.max(tier, 2);
        }
    });
    tier = clamp(tier, 1, 3);
    const tierKey = tier === 1 ? 'entry' : tier === 2 ? 'mainstream' : 'high';
    const profileNames = {
        document: '內容與文件製作', analytics: '資料分析', media: '影音內容處理',
        knowledge: '知識整理', monitoring: '持續追蹤', coding: '程式協作'
    };
    const demandSummary = [...new Set(taskResults.flatMap(task => task.profiles).map(profile => profileNames[profile]).filter(Boolean))].slice(0, 3);
    const cloneNames = [...new Set(taskResults.map(task => task.cloneTag))].slice(0, 2);
    const teamText = cloneNames.length > 1 ? `${cloneNames[0]}與${cloneNames[1]}` : cloneNames[0];
    return {
        tier: tierKey,
        tierLabel: hardwareCatalog[tierKey].label,
        validationStatus: 'pending',
        needsReview,
        platforms: { amd: { ...hardwareCatalog[tierKey].amd }, intel: { ...hardwareCatalog[tierKey].intel } },
        sharedParts: { ...hardwareCatalog[tierKey].shared },
        reasons: reasons.slice(0, 3),
        story: `您的任務需求涵蓋${formatChineseList(demandSummary)}，可由${teamText}協同完成；建議配置「${hardwareCatalog[tierKey].label}」，讓影分身團隊保持順暢多工。`
    };
}

function renderResult() {
    const result = assessmentState.result;
    if (!result) return;
    document.getElementById('result-summary').textContent = `你的 ${result.taskResults.length} 項工作可由影分身團隊重新分工，每月可釋放 ${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}、約 ${formatTokens(result.tokens.savedMonthly)} tokens 的工作量，相當於 ${formatCurrency(result.cost.savedMonthlyTwd)} 的成本空間。`;
    document.getElementById('sci-gap').textContent = `+${Math.round(result.sci.gap)} 點`;
    document.getElementById('current-sci-card').innerHTML = renderSciCard('目前 SCI', result.sci.current, getSciLevel(result.sci.current), 'SCI 採 100 分制；0 代表目前設定為全手動。', 'current', 0);
    document.getElementById('target-sci-card').innerHTML = renderSciCard('導入後 SCI', result.sci.target, '本次任務組合', '依本次選擇的任務、頻率與工作方式綜合計算。', 'target', result.sci.current);
    document.getElementById('metric-highlights').innerHTML = renderMetricHighlights(result);
    document.getElementById('time-metrics').innerHTML = renderEfficiencyComparison(result);
    document.getElementById('workflow-result-table').innerHTML = renderWorkflowResults(result);
    document.getElementById('clone-list').innerHTML = result.clones.map((clone, index) => renderCloneCard(clone, index)).join('');
    renderHardware(result.recommendation);
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
            <div><span>每月可釋放工時</span><strong>${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}</strong><p>依本次任務與頻率估算</p></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('zap')}</span>
            <div><span>等效 Token 工作量</span><strong>${formatTokens(result.tokens.savedMonthly)}</strong><p>以每小時約 ${formatTokens(result.tokens.perHour)} tokens 換算</p></div>
        </article>
        <article class="impact-hero">
            <span class="impact-hero__icon">${iconSvg('receipt')}</span>
            <div><span>每月減少花費</span><strong>${formatCurrency(result.cost.savedMonthlyTwd)}</strong><p>依你填寫的每小時執行成本估算</p></div>
        </article>`;
}

function renderEfficiencyComparison(result) {
    return `
        <div class="before-after before-after--compact">
            <article class="comparison-state comparison-state--before"><span>現在每月投入</span><strong>${formatHours(result.time.currentHoursMonthly)} ${getTimeUnit()}</strong><small>${formatTokens(result.tokens.currentMonthly)} tokens · ${formatCurrency(result.cost.currentMonthlyTwd)}</small></article>
            <div class="comparison-arrow" aria-hidden="true">${iconSvg('arrow-right')}</div>
            <article class="comparison-state comparison-state--after"><span>導入影分身後</span><strong>${formatHours(result.time.targetHoursMonthly)} ${getTimeUnit()}</strong><small>${formatTokens(result.tokens.targetMonthly)} tokens · ${formatCurrency(result.cost.targetMonthlyTwd)}</small></article>
        </div>`;
}

function renderWorkflowResults(result) {
    const topTask = result.taskResults.reduce((highest, task) => task.loadShare > highest.loadShare ? task : highest, result.taskResults[0]);
    return `<div class="workflow-stack">
        ${renderWorkloadOverview(result)}
        <aside class="top-workload-callout">
            <span class="top-workload-callout__icon">${iconSvg(getCloneIconType(topTask.recipeId))}</span>
            <div><small>最適合透過影分身來協作的工作流程</small><strong>${topTask.title}</strong><p>占目前人工工作量 ${Math.round(topTask.loadShare)}%。可交由「${topTask.cloneTag}」協助${getAgentSupportScope(topTask)}，每月預估可釋放 ${formatHours(topTask.savedMonthlyMinutes / 60)} ${getTimeUnit()}、約 ${formatTokens(topTask.savedTokensMonthly)} tokens 的工作量，相當於 ${formatCurrency(topTask.savedCostMonthlyTwd)} 的成本。</p></div>
        </aside>
    </div>`;
}

function renderWorkflowImpactCard(task, index) {
    const share = Math.max(1, Math.round(task.loadShare));
    return `<article class="workflow-impact-card">
        <header><div><span>TASK ${String(index + 1).padStart(2, '0')} · ${task.scaleLabel} · ${task.frequency} 次／週</span><h4>${task.title}</h4></div><strong class="load-chip">目前工作占比 ${share}%</strong></header>
        <p class="workflow-agent-note"><strong>交由「${task.cloneTag}」協助</strong>${getAgentSupportScope(task)}；每月預估可釋放 <b>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</b>。</p>
        <div class="workflow-impact-grid">
            <div><span>目前投入</span><strong>${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <span class="workflow-arrow" aria-hidden="true">${iconSvg('arrow-right')}</span>
            <div><span>導入後</span><strong>${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}／月</strong></div>
            <div class="saved-highlight"><span>每月省下</span><strong>${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}</strong><small>${formatTokens(task.savedTokensMonthly)} tokens</small><small>${formatCurrency(task.savedCostMonthlyTwd)}</small></div>
        </div>
    </article>`;
}

function renderWorkloadOverview(result) {
    const aiShare = clamp(result.workload.reductionPercent, 0, 100);
    const humanShare = 100 - aiShare;
    const beforeSegments = result.taskResults.map((task, index) => `
        <i class="workload-task-segment workload-task-segment--before" style="--segment:${task.loadShare}%;--task-color:${getWorkloadColor(index)};--delay:${index * 70}ms" title="${task.title}：${Math.round(task.loadShare)}%"></i>`).join('');
    const afterSegments = result.taskResults.map((task, index) => {
        const remaining = clamp(100 - task.reliefRate, 0, 100);
        const color = getWorkloadColor(index);
        return `<button type="button" class="workload-task-segment workload-task-segment--after" style="--segment:${task.loadShare}%;--delay:${240 + index * 70}ms" data-task-toggle="${index}" aria-expanded="false" aria-controls="workload-task-detail" title="${task.title}：其中約 ${100 - Math.round(remaining)}% 可交由影分身協助，點擊查看詳情"><b class="workload-part workload-part--human" style="--portion:${remaining}%;--task-color:${color}"></b><b class="workload-part workload-part--assist" style="--portion:${100 - remaining}%"></b></button>`;
    }).join('');
    const legend = result.taskResults.map((task, index) => `<span><i style="--task-color:${getWorkloadColor(index)}"></i>${task.title}<b>${Math.round(task.loadShare)}%</b></span>`).join('');
    return `<section class="workload-overview" aria-labelledby="workload-overview-title">
        <header><span>工作量視覺化</span><h4 id="workload-overview-title">影分身介入前後，工作如何重新分配</h4><p>以目前每月人工投入時間為基準，比較各任務占比與可交由影分身協助的部分。</p></header>
        <div class="workload-overall"><div><strong>整體協作比例</strong><span>依本次任務組合估算</span></div><div><div class="workload-overall-track"><i class="workload-overall-human" style="--portion:${humanShare}%"></i><i class="workload-overall-agent" style="--portion:${aiShare}%"></i></div><p><span>人工處理 <b>${Math.round(humanShare)}%</b></span><span>影分身可協助 <b>${Math.round(aiShare)}%</b></span></p></div></div>
        <div class="workload-chart-row"><div><strong>影分身介入前</strong><small>目前人工工作量</small></div><div class="workload-track" aria-label="影分身介入前各任務工作量占比">${beforeSegments}</div></div>
        <div class="workload-task-legend">${legend}</div>
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

function renderHardware(recommendation) {
    document.getElementById('hardware-tier').textContent = recommendation.tierLabel;
    document.getElementById('hardware-reasons').textContent = recommendation.story;
    document.getElementById('platform-grid').innerHTML = [
        ['主機板', 'MB', 'motherboard', recommendation.platforms.amd.mb, recommendation.platforms.intel.mb],
        ['處理器', 'CPU', 'cpu', recommendation.platforms.amd.cpu, recommendation.platforms.intel.cpu]
    ].map(([zh, en, icon, amd, intel]) => `<article class="hardware-dual-row">
        <span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div class="hardware-row-label"><small>${en}</small><strong>${zh}</strong></div>
        <div class="dual-spec"><span><em>AMD</em>${amd}</span><span><em>Intel</em>${intel}</span></div>
    </article>`).join('');
    const partLabels = {
        gpu: ['顯示卡', 'VGA', 'gpu'], ram: ['記憶體', 'RAM', 'memory'], ssd: ['儲存裝置', 'SSD', 'database'],
        case: ['機殼', 'CASE', 'case'], cooling: ['散熱系統', 'COOLING', 'fan'], psu: ['電源供應器', 'PSU', 'zap']
    };
    document.getElementById('shared-parts').innerHTML = Object.entries(recommendation.sharedParts).map(([key, value]) => {
        const [zh, en, icon] = partLabels[key];
        return `<article class="hardware-menu-row"><span class="hardware-menu-row__icon">${iconSvg(icon)}</span><div><small>${en}</small><strong>${zh}</strong></div><p>${value}</p></article>`;
    }).join('');
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
    const costHeight = result.cost ? 118 : 68;
    const height = 1570 + result.taskResults.length * taskRowHeight + costHeight;
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
        ['目前人工／月', `${formatHours(result.time.currentHoursMonthly)} ${getTimeUnit()}`],
        ['預估可釋放／月', `${formatHours(result.time.savedHoursMonthly)} ${getTimeUnit()}`],
        ['導入後人工／月', `${formatHours(result.time.targetHoursMonthly)} ${getTimeUnit()}`]
    ];
    reportMetrics.forEach((metric, index) => {
        const x = metricX + index * 168;
        canvasText(ctx, metric[0], x, y + 48, `600 11px ${font}`, '#7F8CA3');
        wrapCanvasText(ctx, metric[1], x, y + 88, 150, 26, 2, `800 22px ${font}`, '#FFFFFF');
    });

    y += 246;
    roundedRect(ctx, left, y, contentWidth, 94, 14, 'rgba(32,201,235,.07)', 'rgba(32,201,235,.26)');
    const costMetrics = [
        ['目前每月花費', formatCurrency(result.cost.currentMonthlyTwd), false],
        ['導入後每月花費', formatCurrency(result.cost.targetMonthlyTwd), false],
        ['每月可釋放金額', formatCurrency(result.cost.savedMonthlyTwd), true],
        ['等效 Token 工作量', `${formatTokens(result.tokens.savedMonthly)} tokens`, true]
    ];
    costMetrics.forEach((metric, index) => {
        const x = left + 24 + index * 228;
        canvasText(ctx, metric[0], x, y + 32, `600 11px ${font}`, '#AAB5C8');
        canvasText(ctx, metric[1], x, y + 70, `800 20px ${font}`, metric[2] ? '#20C9EB' : '#FFFFFF');
    });
    y += 122;

    canvasText(ctx, '影分身介入前後，工作如何重新分配', left, y + 22, `800 21px ${font}`, '#FFFFFF');
    canvasText(ctx, '以目前每月人工投入時間為基準', left, y + 44, `500 11px ${font}`, '#8391A7');
    const barX = left + 150;
    const barWidth = contentWidth - 150;
    const aiShare = clamp(result.workload.reductionPercent, 0, 100);
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
        canvasText(ctx, `${task.scaleLabel} · ${task.frequency} 次／週 · 目前工作占比 ${Math.round(task.loadShare)}%`, left + 20, y + 55, `500 11px ${font}`, '#8391A7');
        wrapCanvasText(ctx, `由「${task.cloneTag}」協助${getAgentSupportScope(task)}；每月預估可釋放 ${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()}。`, left + 20, y + 80, 420, 16, 2, `600 11px ${font}`, '#20C9EB');
        canvasText(ctx, `目前 ${formatHours(task.currentMonthlyMinutes / 60)} ${getTimeUnit()}`, left + 465, y + 32, `600 12px ${font}`, '#AAB5C8');
        canvasText(ctx, `導入後 ${formatHours(task.targetMonthlyMinutes / 60)} ${getTimeUnit()}`, left + 465, y + 60, `600 12px ${font}`, '#AAB5C8');
        canvasText(ctx, `每月省下 ${formatHours(task.savedMonthlyMinutes / 60)} ${getTimeUnit()} · ${formatCurrency(task.savedCostMonthlyTwd)}`, width - left - 18, y + 40, `800 14px ${font}`, '#20C9EB', 'right');
        canvasText(ctx, `約 ${formatTokens(task.savedTokensMonthly)} tokens 工作量`, width - left - 18, y + 62, `600 11px ${font}`, '#8391A7', 'right');
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

    roundedRect(ctx, left, y, contentWidth, 326, 18, 'rgba(20,121,232,.13)', 'rgba(32,201,235,.28)');
    canvasText(ctx, result.recommendation.tierLabel, left + 24, y + 36, `800 18px ${font}`, '#20C9EB');
    canvasText(ctx, '主機板 MB', left + 24, y + 78, `700 11px ${font}`, '#6F7E94');
    canvasText(ctx, `AMD｜${result.recommendation.platforms.amd.mb}`, left + 180, y + 78, `600 11px ${font}`, '#DCE3ED');
    canvasText(ctx, `Intel｜${result.recommendation.platforms.intel.mb}`, left + 550, y + 78, `600 11px ${font}`, '#DCE3ED');
    canvasText(ctx, '處理器 CPU', left + 24, y + 122, `700 11px ${font}`, '#6F7E94');
    canvasText(ctx, `AMD｜${result.recommendation.platforms.amd.cpu}`, left + 180, y + 122, `600 11px ${font}`, '#DCE3ED');
    canvasText(ctx, `Intel｜${result.recommendation.platforms.intel.cpu}`, left + 550, y + 122, `600 11px ${font}`, '#DCE3ED');
    const partLabels = { gpu: '顯示卡 VGA', ram: '記憶體 RAM', ssd: '儲存裝置 SSD', case: '機殼 CASE', cooling: '散熱系統', psu: '電源供應器 PSU' };
    Object.entries(result.recommendation.sharedParts).forEach(([key, value], index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const x = left + 24 + column * 302;
        const itemY = y + 170 + row * 70;
        canvasText(ctx, partLabels[key], x, itemY, `600 10px ${font}`, '#6F7E94');
        wrapCanvasText(ctx, value, x, itemY + 22, 280, 16, 2, `700 10px ${font}`, '#FFFFFF');
    });
    y += 354;

    wrapCanvasText(ctx, 'SCI（Shadow-Clone Index）採 100 分制，依人工負擔釋放比例校準；分數越高，代表越多工作可交由影分身協作。時間與成本仍依實際填答分鐘計算。完整設備配置可依常用軟體、資料容量與團隊規模彈性調整。', left, y, contentWidth, 20, 4, `500 11px ${font}`, '#77859B');
    canvasText(ctx, `${result.scoringVersion} · ${result.recipeCatalogVersion} · ${result.hardwareCatalogVersion}`, left, height - 38, `500 9px ${font}`, '#4F5C70');
    canvasText(ctx, 'ASUS AGENTIC AI', width - left, height - 38, `700 11px ${font}`, '#20C9EB', 'right');

    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')), 'image/png', 1));
}

function openSciInfoModal(trigger) {
    elements.modalContent.innerHTML = `
        <div class="sci-info-modal">
            <header>
                <span class="step-kicker">SCI 說明</span>
                <h2 id="modal-title">SCI（影分身指數）怎麼算？</h2>
                <p>SCI 用來衡量「您擺脫了多少雜務」與「影分身能背景並行處理多少工作」，分數越高，代表越多工作可以交由影分身團隊協助。</p>
            </header>
            <div class="sci-info-formula">SCI = (1 − <span>本體目前被迫兼任的雜役角色數量</span> ／ <span>完成該任務所需的總專業分工數</span>) × (<span>影子團隊可背景並行處理的流程數</span> ／ <span>總任務流程數</span>) × 100%</div>
            <div class="sci-info-examples">
                <article>
                    <strong>本體解放率</strong>
                    <span>你擺脫了多少雜務比例</span>
                    <p>例：一項工作共需 4 個角色分工，如果你一個人兼任 3 個雜役角色，兼任比例就是 3/4＝75%；你獲得的解放率就是 1－75%＝25%（代表你還有 75% 的雜務纏身）。如果你 0 兼任，解放率就是 100%。</p>
                </article>
                <article>
                    <strong>自動化涵蓋率</strong>
                    <span>電腦能幫多少比例</span>
                    <p>例：全部有 10 個步驟流程，如果 AI 影分身團隊可以背景同時處理 8 個，涵蓋率就是 8/10＝80%。</p>
                </article>
            </div>
            <p class="sci-info-note">本工具依您選擇的任務、頻率與工作方式，換算出對應的本體解放率與自動化涵蓋率；實際計算細節會依任務類型微調，但代表的概念一致。</p>
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
    return scaleData.manualMinutes * modeData.baselineWeight + scaleData.agentHumanMinutes * modeData.agentWeight;
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
    const calibrated = rawReliefPercent * SCI_CONFIG.achievableMax / SCI_CONFIG.referenceReliefPercent;
    return clamp(calibrated, 0, SCI_CONFIG.achievableMax);
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

function formatMinutes(value) {
    return new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 1 }).format(value);
}

function formatInputNumber(value) {
    const number = Number(value);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function formatCurrency(value) {
    return `NT$ ${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value)}`;
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
            const remaining = clamp(100 - task.reliefRate, 0, 100);
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
