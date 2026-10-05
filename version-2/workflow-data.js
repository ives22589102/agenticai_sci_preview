'use strict';
// 職業內容與數值均為模型估計；SCI 只按實際勾選任務工時計算。
const SCIWorkflowV2 = (() => {
const tasks = {
  "S01": {
    "id": "S01",
    "title": "票據整理與記帳",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "收集與辨識票據",
        "ai": "辨識影像中的商家、日期、品項與金額",
        "human": "確認票據來源及影像可讀性",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.95,
        "humanWorkShare": 0.050000000000000044,
        "reviewAttention": 0.04,
        "exceptionRate": 0.04,
        "exceptionEffort": 0.18,
        "compute": 2,
        "name": "收集與辨識票據",
        "input": "確認票據來源及影像可讀性所需原始文件、資料及版本",
        "output": "辨識影像中的商家、日期、品項與金額；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "欄位標準化",
        "ai": "統一幣別、日期及欄位格式並保留原件連結",
        "human": "抽查日期、幣別、金額及商家欄位",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "欄位標準化",
        "input": "前一階段成果及本次原始資料",
        "output": "統一幣別、日期及欄位格式並保留原件連結；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "分類與稅別建議",
        "ai": "依已提供規則提出費用科目與稅別候選",
        "human": "核對科目、稅別與不可扣抵項目",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "分類與稅別建議",
        "input": "前一階段成果及本次原始資料",
        "output": "依已提供規則提出費用科目與稅別候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "重複與異常檢查",
        "ai": "比對發票號碼、金額與商家以標示疑似重複",
        "human": "處理同號票據與疑似重複費用",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.16,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "重複與異常檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "比對發票號碼、金額與商家以標示疑似重複；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "確認並匯入帳務",
        "ai": "整理待核准匯入表及差異清單",
        "human": "核准帳務歸屬後才匯入正式系統",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.35,
        "humanWorkShare": 0.65,
        "reviewAttention": 0.52,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.24,
        "compute": 1,
        "name": "確認並匯入帳務",
        "input": "前一階段成果及本次原始資料",
        "output": "整理待核准匯入表及差異清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7888,
    "input": "確認票據來源及影像可讀性所需原始文件、資料及版本",
    "output": "整理待核准匯入表及差異清單及人工覆核紀錄",
    "boundary": "只計「票據整理與記帳」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 25,
    "workUnit": "10 張票據",
    "profiles": [
      "document",
      "analytics"
    ],
    "cloneTag": "票據整理與記帳分身",
    "description": "本次工作：辨識影像中的商家、日期、品項與金額；完成：整理待核准匯入表及差異清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 張票據",
        "manualMinutes": 15,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 張票據",
        "manualMinutes": 25,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 張票據",
        "manualMinutes": 62.5,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.31713296,
    "status": "active"
  },
  "S02": {
    "id": "S02",
    "title": "短影音剪輯",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "素材盤點與片段偵測",
        "ai": "偵測場景、人物與可用片段並建立索引",
        "human": "確認素材使用權與剪輯目的",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 4,
        "name": "素材盤點與片段偵測",
        "input": "確認素材使用權與剪輯目的所需原始文件、資料及版本",
        "output": "偵測場景、人物與可用片段並建立索引；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "候選剪輯與節奏編排",
        "ai": "依腳本產生粗剪、節奏與轉場候選",
        "human": "選定敘事、節奏與取捨片段",
        "ownership": "assist",
        "stageWorkShare": 0.3,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 5,
        "name": "候選剪輯與節奏編排",
        "input": "前一階段成果及本次原始資料",
        "output": "依腳本產生粗剪、節奏與轉場候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "字幕與文字校正",
        "ai": "轉錄語音並對齊字幕時間軸",
        "human": "核對人名、數字與術語",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 4,
        "name": "字幕與文字校正",
        "input": "前一階段成果及本次原始資料",
        "output": "轉錄語音並對齊字幕時間軸；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "平台尺寸與文案版本",
        "ai": "轉換畫面比例並提出標題、簡介及封面候選",
        "human": "檢視畫面安全區與平台規範",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 4,
        "name": "平台尺寸與文案版本",
        "input": "前一階段成果及本次原始資料",
        "output": "轉換畫面比例並提出標題、簡介及封面候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "版權確認與發布",
        "ai": "彙整素材來源、音樂授權及發布前檢查表",
        "human": "完成版權、肖像及發布核准",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.28,
        "humanWorkShare": 0.72,
        "reviewAttention": 0.58,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "版權確認與發布",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整素材來源、音樂授權及發布前檢查表；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7852,
    "input": "確認素材使用權與剪輯目的所需原始文件、資料及版本",
    "output": "彙整素材來源、音樂授權及發布前檢查表及人工覆核紀錄",
    "boundary": "只計「短影音剪輯」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "10 分鐘素材，產出 1 支短片",
    "profiles": [
      "media",
      "document"
    ],
    "cloneTag": "短影音剪輯分身",
    "description": "本次工作：偵測場景、人物與可用片段並建立索引；完成：彙整素材來源、音樂授權及發布前檢查表。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 分鐘素材／1 支短片",
        "manualMinutes": 54,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 分鐘素材／1 支短片",
        "manualMinutes": 90,
        "baseTier": 2
      },
      "large": {
        "label": "大量",
        "description": "30 分鐘素材／3 支短片",
        "manualMinutes": 225,
        "baseTier": 3
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.3131224,
    "status": "active"
  },
  "S03": {
    "id": "S03",
    "title": "報價單製作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "彙整客戶需求",
        "ai": "從電子郵件與會議中擷取交付項目和限制",
        "human": "釐清需求範圍及交付條件",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.1,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "彙整客戶需求",
        "input": "釐清需求範圍及交付條件所需原始文件、資料及版本",
        "output": "從電子郵件與會議中擷取交付項目和限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "套用服務與價格規則",
        "ai": "依核准價目表計算品項、折扣與稅額",
        "human": "確認價格表與例外折扣",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.12,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "套用服務與價格規則",
        "input": "前一階段成果及本次原始資料",
        "output": "依核准價目表計算品項、折扣與稅額；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "估算時程與資源",
        "ai": "依歷史工時產生時程及人力估算區間",
        "human": "估算實際產能及履約風險",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.18,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "估算時程與資源",
        "input": "前一階段成果及本次原始資料",
        "output": "依歷史工時產生時程及人力估算區間；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "產生報價文件草稿",
        "ai": "套版生成報價、條款及版本差異",
        "human": "檢查品項、金額、效期與條款",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.06,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.18,
        "compute": 2,
        "name": "產生報價文件草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "套版生成報價、條款及版本差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "商業判斷與寄送確認",
        "ai": "標記超出標準價格或承諾的項目",
        "human": "核准價格及承諾後寄出",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.22,
        "humanWorkShare": 0.78,
        "reviewAttention": 0.65,
        "exceptionRate": 0.04,
        "exceptionEffort": 0.18,
        "compute": 1,
        "name": "商業判斷與寄送確認",
        "input": "前一階段成果及本次原始資料",
        "output": "標記超出標準價格或承諾的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7144,
    "input": "釐清需求範圍及交付條件所需原始文件、資料及版本",
    "output": "標記超出標準價格或承諾的項目及人工覆核紀錄",
    "boundary": "只計「報價單製作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 30,
    "workUnit": "1 個專案",
    "profiles": [
      "document",
      "analytics"
    ],
    "cloneTag": "報價單製作分身",
    "description": "本次工作：從電子郵件與會議中擷取交付項目和限制；完成：標記超出標準價格或承諾的項目。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 案、簡單範本",
        "manualMinutes": 18,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 案、客製需求",
        "manualMinutes": 30,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 案、多階段需求",
        "manualMinutes": 75,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.39498272,
    "status": "active"
  },
  "S04": {
    "id": "S04",
    "title": "文案與貼文撰寫",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "整理主題與溝通目標",
        "ai": "整理目標受眾、產品資料和傳播目的",
        "human": "決定受眾、目標與主張",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.15,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "整理主題與溝通目標",
        "input": "決定受眾、目標與主張所需原始文件、資料及版本",
        "output": "整理目標受眾、產品資料和傳播目的；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "內容架構與初稿",
        "ai": "依已核准資料產生架構、標題及初稿",
        "human": "檢視觀點與內容取捨",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "內容架構與初稿",
        "input": "前一階段成果及本次原始資料",
        "output": "依已核准資料產生架構、標題及初稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "平台版本改寫",
        "ai": "改寫不同平台長度、語氣及格式",
        "human": "確認各平台語氣及限制",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.08,
        "exceptionRate": 0.07,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "平台版本改寫",
        "input": "前一階段成果及本次原始資料",
        "output": "改寫不同平台長度、語氣及格式；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "品牌與事實檢核",
        "ai": "標出無來源數字、規格與可能誇大宣稱",
        "human": "逐項查核產品規格、來源及品牌用語",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.56,
        "humanWorkShare": 0.43999999999999995,
        "reviewAttention": 0.26,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "品牌與事實檢核",
        "input": "前一階段成果及本次原始資料",
        "output": "標出無來源數字、規格與可能誇大宣稱；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "核准與排程發布",
        "ai": "整理核稿差異及排程清單",
        "human": "負責最終核稿與排程",
        "ownership": "human_gate",
        "stageWorkShare": 0.12,
        "aiAssistShare": 0.22,
        "humanWorkShare": 0.78,
        "reviewAttention": 0.68,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.2,
        "compute": 1,
        "name": "核准與排程發布",
        "input": "前一階段成果及本次原始資料",
        "output": "整理核稿差異及排程清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7024,
    "input": "決定受眾、目標與主張所需原始文件、資料及版本",
    "output": "整理核稿差異及排程清單及人工覆核紀錄",
    "boundary": "只計「文案與貼文撰寫」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 45,
    "workUnit": "1 個主題、3 個版本",
    "profiles": [
      "document"
    ],
    "cloneTag": "文案與貼文撰寫分身",
    "description": "本次工作：整理目標受眾、產品資料和傳播目的；完成：整理核稿差異及排程清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 個版本",
        "manualMinutes": 27,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "3 個版本",
        "manualMinutes": 45,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "6 個版本",
        "manualMinutes": 112.5,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.42156351999999997,
    "status": "active"
  },
  "S05": {
    "id": "S05",
    "title": "視覺素材延伸",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "整理主視覺與素材",
        "ai": "分類產品圖、字型、識別與設計規範",
        "human": "確認原始素材與授權",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.12,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "整理主視覺與素材",
        "input": "確認原始素材與授權所需原始文件、資料及版本",
        "output": "分類產品圖、字型、識別與設計規範；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "套用尺寸與版型",
        "ai": "依既有元件自動配置常用尺寸及安全區",
        "human": "檢查版面、字級和安全區",
        "ownership": "assist",
        "stageWorkShare": 0.26,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.18,
        "compute": 4,
        "name": "套用尺寸與版型",
        "input": "前一階段成果及本次原始資料",
        "output": "依既有元件自動配置常用尺寸及安全區；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "候選修圖與延伸版本",
        "ai": "產生裁切、去背及延伸版候選並標記生成區",
        "human": "核對產品外觀、標示與修圖失真",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.14,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.3,
        "compute": 5,
        "name": "候選修圖與延伸版本",
        "input": "前一階段成果及本次原始資料",
        "output": "產生裁切、去背及延伸版候選並標記生成區；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "輸出格式與檔名整理",
        "ai": "批次輸出規格與檔名並列出缺檔",
        "human": "抽查格式、色彩與檔名",
        "ownership": "assist",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.94,
        "humanWorkShare": 0.06000000000000005,
        "reviewAttention": 0.05,
        "exceptionRate": 0.04,
        "exceptionEffort": 0.16,
        "compute": 3,
        "name": "輸出格式與檔名整理",
        "input": "前一階段成果及本次原始資料",
        "output": "批次輸出規格與檔名並列出缺檔；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "視覺品質與品牌確認",
        "ai": "對比原始產品圖提示變形或標示差異",
        "human": "核准品牌及產品細節",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.18,
        "humanWorkShare": 0.8200000000000001,
        "reviewAttention": 0.72,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "視覺品質與品牌確認",
        "input": "前一階段成果及本次原始資料",
        "output": "對比原始產品圖提示變形或標示差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7512000000000001,
    "input": "確認原始素材與授權所需原始文件、資料及版本",
    "output": "對比原始產品圖提示變形或標示差異及人工覆核紀錄",
    "boundary": "只計「視覺素材延伸」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "1 個主視覺、3 個尺寸",
    "profiles": [
      "media"
    ],
    "cloneTag": "視覺素材延伸分身",
    "description": "本次工作：分類產品圖、字型、識別與設計規範；完成：對比原始產品圖提示變形或標示差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 個尺寸",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "3 個尺寸",
        "manualMinutes": 60,
        "baseTier": 2
      },
      "large": {
        "label": "大量",
        "description": "6 個尺寸",
        "manualMinutes": 150,
        "baseTier": 3
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.34881568,
    "status": "active"
  },
  "S06": {
    "id": "S06",
    "title": "語音轉錄與摘要",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "音訊前處理",
        "ai": "清理底噪、切分音訊並標記難辨區段",
        "human": "確認錄音同意及可用性",
        "ownership": "assist",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.05,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.18,
        "compute": 3,
        "name": "音訊前處理",
        "input": "確認錄音同意及可用性所需原始文件、資料及版本",
        "output": "清理底噪、切分音訊並標記難辨區段；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "語音轉錄與分段",
        "ai": "轉錄語音、時間碼及說話者候選",
        "human": "抽查聽不清與說話者辨識",
        "ownership": "assist",
        "stageWorkShare": 0.42,
        "aiAssistShare": 0.96,
        "humanWorkShare": 0.040000000000000036,
        "reviewAttention": 0.04,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.2,
        "compute": 4,
        "name": "語音轉錄與分段",
        "input": "前一階段成果及本次原始資料",
        "output": "轉錄語音、時間碼及說話者候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "人名數字與專有名詞校對",
        "ai": "對照術語表提示專有名詞與數字疑點",
        "human": "校對人名、日期、金額及術語",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.22,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 2,
        "name": "人名數字與專有名詞校對",
        "input": "前一階段成果及本次原始資料",
        "output": "對照術語表提示專有名詞與數字疑點；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "摘要重點與待辦整理",
        "ai": "產出摘要、決議與待辦候選並附時間碼",
        "human": "核對待辦的負責人和期限",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 3,
        "name": "摘要重點與待辦整理",
        "input": "前一階段成果及本次原始資料",
        "output": "產出摘要、決議與待辦候選並附時間碼；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "原意與引用確認",
        "ai": "標出可能超出原話或缺乏證據的敘述",
        "human": "確認原意、引用與對外用途",
        "ownership": "human_gate",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.24,
        "humanWorkShare": 0.76,
        "reviewAttention": 0.62,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.24,
        "compute": 1,
        "name": "原意與引用確認",
        "input": "前一階段成果及本次原始資料",
        "output": "標出可能超出原話或缺乏證據的敘述；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.8176,
    "input": "確認錄音同意及可用性所需原始文件、資料及版本",
    "output": "標出可能超出原話或缺乏證據的敘述及人工覆核紀錄",
    "boundary": "只計「語音轉錄與摘要」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "30 分鐘錄音",
    "profiles": [
      "media",
      "knowledge"
    ],
    "cloneTag": "語音轉錄與摘要分身",
    "description": "本次工作：清理底噪、切分音訊並標記難辨區段；完成：標出可能超出原話或缺乏證據的敘述。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "15 分鐘錄音",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "30 分鐘錄音",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "90 分鐘錄音",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "B08",
      "E05"
    ],
    "estimatedRetainedHumanShare": 0.27472016000000005,
    "status": "active"
  },
  "S07": {
    "id": "S07",
    "title": "需求與待辦管理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "收集訊息與需求",
        "ai": "收集授權信件、表單及會議需求",
        "human": "確認來源與需求是否完整",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "收集訊息與需求",
        "input": "確認來源與需求是否完整所需原始文件、資料及版本",
        "output": "收集授權信件、表單及會議需求；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "需求分類與缺漏提示",
        "ai": "依主題、緊急程度及缺件分類",
        "human": "釐清矛盾及缺失資訊",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "需求分類與缺漏提示",
        "input": "前一階段成果及本次原始資料",
        "output": "依主題、緊急程度及缺件分類；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建立待辦與負責人草稿",
        "ai": "提出待辦、責任人及期限候選",
        "human": "指派實際負責人與可行期限",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.1,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "建立待辦與負責人草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "提出待辦、責任人及期限候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "進度彙整與提醒",
        "ai": "彙總狀態並生成提醒草稿",
        "human": "確認提醒對象及溝通節奏",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "進度彙整與提醒",
        "input": "前一階段成果及本次原始資料",
        "output": "彙總狀態並生成提醒草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "承諾與優先順序確認",
        "ai": "標示互相衝突的時程與未經確認的承諾",
        "human": "決定優先順序並承擔承諾",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.2,
        "humanWorkShare": 0.8,
        "reviewAttention": 0.68,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.24,
        "compute": 1,
        "name": "承諾與優先順序確認",
        "input": "前一階段成果及本次原始資料",
        "output": "標示互相衝突的時程與未經確認的承諾；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7492,
    "input": "確認來源與需求是否完整所需原始文件、資料及版本",
    "output": "標示互相衝突的時程與未經確認的承諾及人工覆核紀錄",
    "boundary": "只計「需求與待辦管理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 30,
    "workUnit": "1 專案、10 則訊息",
    "profiles": [
      "document",
      "monitoring"
    ],
    "cloneTag": "需求與待辦管理分身",
    "description": "本次工作：收集授權信件、表單及會議需求；完成：標示互相衝突的時程與未經確認的承諾。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 則訊息",
        "manualMinutes": 18,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 則訊息",
        "manualMinutes": 30,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 則訊息",
        "manualMinutes": 75,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.35149536000000003,
    "status": "legacy-unassigned"
  },
  "S08": {
    "id": "S08",
    "title": "程式開發與除錯",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "理解需求與既有程式",
        "ai": "摘要需求、相依套件與既有程式邏輯",
        "human": "釐清驗收標準與安全邊界",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.22,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "理解需求與既有程式",
        "input": "釐清驗收標準與安全邊界所需原始文件、資料及版本",
        "output": "摘要需求、相依套件與既有程式邏輯；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "產生修改方案與程式草稿",
        "ai": "提出局部修改方案及程式碼草稿",
        "human": "審查架構及修改方案",
        "ownership": "assist",
        "stageWorkShare": 0.3,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.16,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 4,
        "name": "產生修改方案與程式草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "提出局部修改方案及程式碼草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建立基本測試",
        "ai": "生成單元及邊界測試候選",
        "human": "補足極端情境和整合測試",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.74,
        "humanWorkShare": 0.26,
        "reviewAttention": 0.16,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 4,
        "name": "建立基本測試",
        "input": "前一階段成果及本次原始資料",
        "output": "生成單元及邊界測試候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "除錯與修正建議",
        "ai": "根據錯誤紀錄提出可重現步驟和修正",
        "human": "重現缺陷並驗證修正",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.24,
        "exceptionRate": 0.18,
        "exceptionEffort": 0.42,
        "compute": 4,
        "name": "除錯與修正建議",
        "input": "前一階段成果及本次原始資料",
        "output": "根據錯誤紀錄提出可重現步驟和修正；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "審查合併與發布",
        "ai": "整理程式碼差異、測試結果與上線檢查清單",
        "human": "程式碼審查、合併與部署核准",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.12,
        "humanWorkShare": 0.88,
        "reviewAttention": 0.8,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "審查合併與發布",
        "input": "前一階段成果及本次原始資料",
        "output": "整理程式碼差異、測試結果與上線檢查清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.602,
    "input": "釐清驗收標準與安全邊界所需原始文件、資料及版本",
    "output": "整理程式碼差異、測試結果與上線檢查清單及人工覆核紀錄",
    "boundary": "只計「程式開發與除錯」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "1 個小功能",
    "profiles": [
      "coding"
    ],
    "cloneTag": "程式開發與除錯分身",
    "description": "本次工作：摘要需求、相依套件與既有程式邏輯；完成：整理程式碼差異、測試結果與上線檢查清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "簡單修改",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 個小模組",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "跨模組修改",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "E07",
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "estimatedRetainedHumanShare": 0.55017952,
    "status": "legacy-unassigned"
  },
  "E01": {
    "id": "E01",
    "title": "測驗題目生成",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "文件解析與來源定位",
        "ai": "擷取教材段落並保留頁碼與引用位置",
        "human": "確認資料來源及授權",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "文件解析與來源定位",
        "input": "確認資料來源及授權所需原始文件、資料及版本",
        "output": "擷取教材段落並保留頁碼與引用位置；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "摘要與概念分類",
        "ai": "分類概念、學習目標和難度",
        "human": "檢查概念是否符合課程範圍",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "摘要與概念分類",
        "input": "前一階段成果及本次原始資料",
        "output": "分類概念、學習目標和難度；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "題目與選項草稿",
        "ai": "生成題幹、選項與干擾選項草稿",
        "human": "審查題意、難度及干擾選項",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.16,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "題目與選項草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成題幹、選項與干擾選項草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "答案與解析草稿",
        "ai": "提出答案解析並標示教材根據",
        "human": "逐題驗證答案與解析",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.22,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.34,
        "compute": 3,
        "name": "答案與解析草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "提出答案解析並標示教材根據；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "引用與學術判斷",
        "ai": "檢查引用是否對得上原文與題目",
        "human": "教師確認引用、教學目的與公布版本",
        "ownership": "human_gate",
        "stageWorkShare": 0.12,
        "aiAssistShare": 0.14,
        "humanWorkShare": 0.86,
        "reviewAttention": 0.78,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.26,
        "compute": 1,
        "name": "引用與學術判斷",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查引用是否對得上原文與題目；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7176,
    "input": "確認資料來源及授權所需原始文件、資料及版本",
    "output": "檢查引用是否對得上原文與題目及人工覆核紀錄",
    "boundary": "只計「測驗題目生成」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "3 篇 PDF、10 題",
    "profiles": [
      "knowledge",
      "document"
    ],
    "cloneTag": "測驗題目生成分身",
    "description": "本次工作：擷取教材段落並保留頁碼與引用位置；完成：檢查引用是否對得上原文與題目。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 篇 PDF／5 題",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "3 篇 PDF／10 題",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "10 篇 PDF／30 題",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.41007808,
    "status": "active"
  },
  "E02": {
    "id": "E02",
    "title": "教案與教材製作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "整理教學目標與資料",
        "ai": "彙整課綱、先備知識與教學資源",
        "human": "確立學習目標及學生程度",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.16,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "整理教學目標與資料",
        "input": "確立學習目標及學生程度所需原始文件、資料及版本",
        "output": "彙整課綱、先備知識與教學資源；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "教案與課程結構草稿",
        "ai": "產出單元安排、活動和時間分配草稿",
        "human": "檢視教學節奏與活動設計",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.14,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "教案與課程結構草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產出單元安排、活動和時間分配草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "簡報與講義內容生成",
        "ai": "生成投影片、講義、範例及練習題候選",
        "human": "檢查案例、教材正確性與無障礙",
        "ownership": "assist",
        "stageWorkShare": 0.34,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.09,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.26,
        "compute": 4,
        "name": "簡報與講義內容生成",
        "input": "前一階段成果及本次原始資料",
        "output": "生成投影片、講義、範例及練習題候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "LMS 內容與作業格式準備",
        "ai": "整理學習平台欄位、作業與日期草稿",
        "human": "確認平台權限、作業規則及日期",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.07,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "LMS 內容與作業格式準備",
        "input": "前一階段成果及本次原始資料",
        "output": "整理學習平台欄位、作業與日期草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "正確性與教學適切性審核",
        "ai": "標記內容正確性與學生程度的疑點",
        "human": "教師審核適切性後發布",
        "ownership": "human_gate",
        "stageWorkShare": 0.12,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.74,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.24,
        "compute": 1,
        "name": "正確性與教學適切性審核",
        "input": "前一階段成果及本次原始資料",
        "output": "標記內容正確性與學生程度的疑點；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.746,
    "input": "確立學習目標及學生程度所需原始文件、資料及版本",
    "output": "標記內容正確性與學生程度的疑點及人工覆核紀錄",
    "boundary": "只計「教案與教材製作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 120,
    "workUnit": "1 課、15 頁投影片",
    "profiles": [
      "document",
      "knowledge"
    ],
    "cloneTag": "教案與教材製作分身",
    "description": "本次工作：彙整課綱、先備知識與教學資源；完成：標記內容正確性與學生程度的疑點。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 頁投影片",
        "manualMinutes": 72,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "15 頁投影片",
        "manualMinutes": 120,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 頁投影片",
        "manualMinutes": 300,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.36438848,
    "status": "active"
  },
  "E03": {
    "id": "E03",
    "title": "作業格式與異常檢核",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "讀取作業與格式規則",
        "ai": "解析繳交檔案及作業格式",
        "human": "確認作業規範、授權與學生身分",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.09,
        "exceptionRate": 0.07,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "讀取作業與格式規則",
        "input": "確認作業規範、授權與學生身分所需原始文件、資料及版本",
        "output": "解析繳交檔案及作業格式；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "格式與缺漏比對",
        "ai": "比對必要欄位、附件和遲交紀錄",
        "human": "核對格式問題是否影響評分",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "格式與缺漏比對",
        "input": "前一階段成果及本次原始資料",
        "output": "比對必要欄位、附件和遲交紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "相似內容與異常提示",
        "ai": "指出重複段落與需查證的相似處",
        "human": "人工調查相似內容，不以相似度定罪",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.16,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 3,
        "name": "相似內容與異常提示",
        "input": "前一階段成果及本次原始資料",
        "output": "指出重複段落與需查證的相似處；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建立逐案檢核清單",
        "ai": "生成逐案證據與人工覆核清單",
        "human": "審閱每案證據及脈絡",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.1,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.26,
        "compute": 2,
        "name": "建立逐案檢核清單",
        "input": "前一階段成果及本次原始資料",
        "output": "生成逐案證據與人工覆核清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "查證與正式評分",
        "ai": "整理已確認依據供教師評分",
        "human": "教師查證並依評分規準正式評分",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.1,
        "humanWorkShare": 0.9,
        "reviewAttention": 0.86,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.28,
        "compute": 1,
        "name": "查證與正式評分",
        "input": "前一階段成果及本次原始資料",
        "output": "整理已確認依據供教師評分；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.71,
    "input": "確認作業規範、授權與學生身分所需原始文件、資料及版本",
    "output": "整理已確認依據供教師評分及人工覆核紀錄",
    "boundary": "只計「作業檢核與評分」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 45,
    "workUnit": "10 份作業",
    "profiles": [
      "document",
      "knowledge"
    ],
    "cloneTag": "作業格式與異常檢核分身",
    "description": "本次工作：解析繳交檔案及作業格式；完成：整理已確認依據供教師評分。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 份作業",
        "manualMinutes": 27,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 份作業",
        "manualMinutes": 45,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 份作業",
        "manualMinutes": 112.5,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.39406144,
    "status": "active"
  },
  "E04": {
    "id": "E04",
    "title": "研究資料分析",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "資料格式與欄位檢查",
        "ai": "辨識欄位型態、單位與資料版本",
        "human": "確認欄位定義與研究設計",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "資料格式與欄位檢查",
        "input": "確認欄位定義與研究設計所需原始文件、資料及版本",
        "output": "辨識欄位型態、單位與資料版本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "缺值與異常資料處理",
        "ai": "標出缺值、極端值和轉換候選",
        "human": "決定缺值、離群值的處理方式",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.14,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 3,
        "name": "缺值與異常資料處理",
        "input": "前一階段成果及本次原始資料",
        "output": "標出缺值、極端值和轉換候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "描述統計與轉換",
        "ai": "執行已指定的統計與資料轉換",
        "human": "驗證統計方法與重現性",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 4,
        "name": "描述統計與轉換",
        "input": "前一階段成果及本次原始資料",
        "output": "執行已指定的統計與資料轉換；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "圖表與結果摘要草稿",
        "ai": "生成圖表及描述性文字草稿",
        "human": "檢查圖表尺度及解釋",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 4,
        "name": "圖表與結果摘要草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成圖表及描述性文字草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "方法與結論判斷",
        "ai": "整理方法、敏感度分析及未解釋差異",
        "human": "研究者對方法與結論負責",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.76,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "方法與結論判斷",
        "input": "前一階段成果及本次原始資料",
        "output": "整理方法、敏感度分析及未解釋差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7456,
    "input": "確認欄位定義與研究設計所需原始文件、資料及版本",
    "output": "整理方法、敏感度分析及未解釋差異及人工覆核紀錄",
    "boundary": "只計「研究資料分析」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 個 CSV、1 萬列",
    "profiles": [
      "analytics",
      "coding"
    ],
    "cloneTag": "研究資料分析分身",
    "description": "本次工作：辨識欄位型態、單位與資料版本；完成：整理方法、敏感度分析及未解釋差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 千列資料",
        "manualMinutes": 54,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 萬列資料",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "10 萬列資料",
        "manualMinutes": 225,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "S19"
    ],
    "estimatedRetainedHumanShare": 0.36940368,
    "status": "active"
  },
  "E05": {
    "id": "E05",
    "title": "課堂或會議紀錄",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "音訊整理與降噪",
        "ai": "切分音檔、降噪並標記模糊段落",
        "human": "確認錄音許可與隱私",
        "ownership": "assist",
        "stageWorkShare": 0.08,
        "aiAssistShare": 0.98,
        "humanWorkShare": 0.020000000000000018,
        "reviewAttention": 0.02,
        "exceptionRate": 0.03,
        "exceptionEffort": 0.1,
        "compute": 3,
        "name": "音訊整理與降噪",
        "input": "確認錄音許可與隱私所需原始文件、資料及版本",
        "output": "切分音檔、降噪並標記模糊段落；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "轉錄與說話者分段",
        "ai": "轉錄文字、說話者和時間碼",
        "human": "抽查專有名詞及說話者",
        "ownership": "assist",
        "stageWorkShare": 0.52,
        "aiAssistShare": 0.99,
        "humanWorkShare": 0.010000000000000009,
        "reviewAttention": 0.01,
        "exceptionRate": 0.03,
        "exceptionEffort": 0.12,
        "compute": 4,
        "name": "轉錄與說話者分段",
        "input": "前一階段成果及本次原始資料",
        "output": "轉錄文字、說話者和時間碼；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "章節與重點整理",
        "ai": "彙整章節摘要與術語候選",
        "human": "對照原錄音檢查重點",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.95,
        "humanWorkShare": 0.050000000000000044,
        "reviewAttention": 0.03,
        "exceptionRate": 0.04,
        "exceptionEffort": 0.15,
        "compute": 3,
        "name": "章節與重點整理",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整章節摘要與術語候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "待辦與複習摘要",
        "ai": "產生待辦和複習重點並附來源段落",
        "human": "核對待辦與是否為正式決議",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.95,
        "humanWorkShare": 0.050000000000000044,
        "reviewAttention": 0.03,
        "exceptionRate": 0.04,
        "exceptionEffort": 0.15,
        "compute": 3,
        "name": "待辦與複習摘要",
        "input": "前一階段成果及本次原始資料",
        "output": "產生待辦和複習重點並附來源段落；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "內容與決議抽查",
        "ai": "標出不確定發言與可能非正式決議",
        "human": "確認內容後才能轉寄或引用",
        "ownership": "human_gate",
        "stageWorkShare": 0.06,
        "aiAssistShare": 0.35,
        "humanWorkShare": 0.65,
        "reviewAttention": 0.4,
        "exceptionRate": 0.05,
        "exceptionEffort": 0.2,
        "compute": 1,
        "name": "內容與決議抽查",
        "input": "前一階段成果及本次原始資料",
        "output": "標出不確定發言與可能非正式決議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.9372,
    "input": "確認錄音許可與隱私所需原始文件、資料及版本",
    "output": "標出不確定發言與可能非正式決議及人工覆核紀錄",
    "boundary": "只計「課堂或會議紀錄」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "30 分鐘錄音",
    "profiles": [
      "media",
      "knowledge"
    ],
    "cloneTag": "課堂或會議紀錄分身",
    "description": "本次工作：切分音檔、降噪並標記模糊段落；完成：標出不確定發言與可能非正式決議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "15 分鐘錄音",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "30 分鐘錄音",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "90 分鐘錄音",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "S06"
    ],
    "estimatedRetainedHumanShare": 0.09184248000000002,
    "status": "active"
  },
  "E06": {
    "id": "E06",
    "title": "錯題解析與複習",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "匯入題目與作答紀錄",
        "ai": "整理題目、答案與作答歷史",
        "human": "確認題目及作答紀錄正確",
        "ownership": "assist",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "匯入題目與作答紀錄",
        "input": "確認題目及作答紀錄正確所需原始文件、資料及版本",
        "output": "整理題目、答案與作答歷史；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "錯題類型分類",
        "ai": "分類錯誤知識點與可能迷思",
        "human": "核對錯誤分類是否合理",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "錯題類型分類",
        "input": "前一階段成果及本次原始資料",
        "output": "分類錯誤知識點與可能迷思；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "解題提示與解析草稿",
        "ai": "生成逐步提示、替代解法和解析草稿",
        "human": "驗證解法並辨識假答案",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.18,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 3,
        "name": "解題提示與解析草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成逐步提示、替代解法和解析草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "複習計畫與提醒安排",
        "ai": "依錯題間隔安排練習候選",
        "human": "與學習者協調複習負擔",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.1,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "複習計畫與提醒安排",
        "input": "前一階段成果及本次原始資料",
        "output": "依錯題間隔安排練習候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "解法驗證與理解確認",
        "ai": "檢查計算步驟並標記不一致答案",
        "human": "學習者或教師確認真正理解",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.76,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.3,
        "compute": 1,
        "name": "解法驗證與理解確認",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查計算步驟並標記不一致答案；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.716,
    "input": "確認題目及作答紀錄正確所需原始文件、資料及版本",
    "output": "檢查計算步驟並標記不一致答案及人工覆核紀錄",
    "boundary": "E12 計筆記整理與一般學習安排；E06 計錯題解析與針對錯題練習；同一份複習計畫只計一次。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 45,
    "workUnit": "20 題",
    "profiles": [
      "document",
      "knowledge"
    ],
    "cloneTag": "錯題解析與複習分身",
    "description": "本次工作：整理題目、答案與作答歷史；完成：檢查計算步驟並標記不一致答案。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "10 題",
        "manualMinutes": 27,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "20 題",
        "manualMinutes": 45,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "50 題",
        "manualMinutes": 112.5,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.40897344,
    "status": "active"
  },
  "E07": {
    "id": "E07",
    "title": "程式測試與審查",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "理解規格與既有程式",
        "ai": "摘要規格、測試環境與程式結構",
        "human": "確認需求及授權程式碼",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.56,
        "humanWorkShare": 0.43999999999999995,
        "reviewAttention": 0.24,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.34,
        "compute": 3,
        "name": "理解規格與既有程式",
        "input": "確認需求及授權程式碼所需原始文件、資料及版本",
        "output": "摘要規格、測試環境與程式結構；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "產生程式與註解草稿",
        "ai": "生成局部程式與註解草稿",
        "human": "審查學術規範和程式邏輯",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.16,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 4,
        "name": "產生程式與註解草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成局部程式與註解草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "測試案例與執行檢查",
        "ai": "提出測試案例並整理實際執行結果",
        "human": "檢查測試涵蓋及執行結果",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.14,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.34,
        "compute": 4,
        "name": "測試案例與執行檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "提出測試案例並整理實際執行結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "除錯與修正建議",
        "ai": "分析錯誤紀錄及修正候選",
        "human": "重現錯誤並檢查修正",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.22,
        "exceptionRate": 0.18,
        "exceptionEffort": 0.42,
        "compute": 4,
        "name": "除錯與修正建議",
        "input": "前一階段成果及本次原始資料",
        "output": "分析錯誤紀錄及修正候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "正確性與可重現性確認",
        "ai": "整理重現步驟、相依版本和測試證據",
        "human": "人工確認正確性、可重現性與提交",
        "ownership": "human_gate",
        "stageWorkShare": 0.14,
        "aiAssistShare": 0.12,
        "humanWorkShare": 0.88,
        "reviewAttention": 0.8,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.32,
        "compute": 2,
        "name": "正確性與可重現性確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理重現步驟、相依版本和測試證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.6104,
    "input": "確認需求及授權程式碼所需原始文件、資料及版本",
    "output": "整理重現步驟、相依版本和測試證據及人工覆核紀錄",
    "boundary": "只計「程式測試與審查」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 個小模組",
    "profiles": [
      "coding"
    ],
    "cloneTag": "程式測試與審查分身",
    "description": "本次工作：摘要規格、測試環境與程式結構；完成：整理重現步驟、相依版本和測試證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "簡單修改",
        "manualMinutes": 54,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 個小模組",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "跨模組修改",
        "manualMinutes": 225,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "S08"
    ],
    "estimatedRetainedHumanShare": 0.5414070400000001,
    "status": "active"
  },
  "E08": {
    "id": "E08",
    "title": "校務表單與通知",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "匯入與辨識行政資料",
        "ai": "擷取報名、學籍或課程表單欄位",
        "human": "確認資料使用權及個資範圍",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "匯入與辨識行政資料",
        "input": "確認資料使用權及個資範圍所需原始文件、資料及版本",
        "output": "擷取報名、學籍或課程表單欄位；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "欄位標準化與名單整理",
        "ai": "統一欄位格式並比對名單",
        "human": "抽查學生身分及欄位配對",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "欄位標準化與名單整理",
        "input": "前一階段成果及本次原始資料",
        "output": "統一欄位格式並比對名單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "缺漏與衝突提示",
        "ai": "標出重複、衝突和缺件",
        "human": "處理衝突與缺漏資料",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "缺漏與衝突提示",
        "input": "前一階段成果及本次原始資料",
        "output": "標出重複、衝突和缺件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "通知與表單草稿",
        "ai": "生成依對象分組的通知草稿",
        "human": "確認通知內容與收件範圍",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "通知與表單草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成依對象分組的通知草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "個資、名單與寄送確認",
        "ai": "整理收件人與附件清單並提示個資風險",
        "human": "核准名單、權限及寄送",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.18,
        "humanWorkShare": 0.8200000000000001,
        "reviewAttention": 0.72,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.26,
        "compute": 1,
        "name": "個資、名單與寄送確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理收件人與附件清單並提示個資風險；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7728,
    "input": "確認資料使用權及個資範圍所需原始文件、資料及版本",
    "output": "整理收件人與附件清單並提示個資風險及人工覆核紀錄",
    "boundary": "只計「校務表單與通知」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 40,
    "workUnit": "20 筆資料",
    "profiles": [
      "document",
      "analytics"
    ],
    "cloneTag": "校務表單與通知分身",
    "description": "本次工作：擷取報名、學籍或課程表單欄位；完成：整理收件人與附件清單並提示個資風險。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "10 筆資料",
        "manualMinutes": 24,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "20 筆資料",
        "manualMinutes": 40,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "60 筆資料",
        "manualMinutes": 100,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.31951808,
    "status": "active"
  },
  "B01": {
    "id": "B01",
    "title": "訂單對帳與開立發票",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "匯入多來源訂單",
        "ai": "擷取各通路訂單與付款資料",
        "human": "確認資料來源與期間",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 3,
        "name": "匯入多來源訂單",
        "input": "確認資料來源與期間所需原始文件、資料及版本",
        "output": "擷取各通路訂單與付款資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "欄位映射與格式統一",
        "ai": "統一商品、稅額和交易識別碼",
        "human": "核對平台、稅務欄位映射",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "欄位映射與格式統一",
        "input": "前一階段成果及本次原始資料",
        "output": "統一商品、稅額和交易識別碼；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "去重與訂單配對",
        "ai": "比對訂單、退款與付款紀錄",
        "human": "處理退款及一對多訂單",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "去重與訂單配對",
        "input": "前一階段成果及本次原始資料",
        "output": "比對訂單、退款與付款紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "對帳與差異標記",
        "ai": "產生未對帳差異與可能原因",
        "human": "調查未配對差異",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.15,
        "exceptionRate": 0.14,
        "exceptionEffort": 0.36,
        "compute": 3,
        "name": "對帳與差異標記",
        "input": "前一階段成果及本次原始資料",
        "output": "產生未對帳差異與可能原因；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "正式寫入與開立發票確認",
        "ai": "整理正式入帳和開立發票批次草稿",
        "human": "授權寫入帳務與正式開立發票",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.18,
        "humanWorkShare": 0.8200000000000001,
        "reviewAttention": 0.72,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "正式寫入與開立發票確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理正式入帳和開立發票批次草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7516,
    "input": "確認資料來源與期間所需原始文件、資料及版本",
    "output": "整理正式入帳和開立發票批次草稿及人工覆核紀錄",
    "boundary": "只計「訂單對帳與開立發票」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "100 筆訂單",
    "profiles": [
      "analytics",
      "monitoring"
    ],
    "cloneTag": "訂單對帳與開立發票分身",
    "description": "本次工作：擷取各通路訂單與付款資料；完成：整理正式入帳和開立發票批次草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "20 筆訂單",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "100 筆訂單",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "500 筆訂單",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.35841871999999997,
    "status": "active"
  },
  "B02": {
    "id": "B02",
    "title": "競品與評論分析",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "擷取價格與商品資訊",
        "ai": "彙整公開價格、規格及時間戳記",
        "human": "確認價格來源與更新時間",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.94,
        "humanWorkShare": 0.06000000000000005,
        "reviewAttention": 0.05,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.2,
        "compute": 3,
        "name": "擷取價格與商品資訊",
        "input": "確認價格來源與更新時間所需原始文件、資料及版本",
        "output": "彙整公開價格、規格及時間戳記；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "彙整評論與來源",
        "ai": "擷取評論與來源並標示抽樣範圍",
        "human": "抽查評論抽樣偏差及來源",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "彙整評論與來源",
        "input": "前一階段成果及本次原始資料",
        "output": "擷取評論與來源並標示抽樣範圍；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "評論分類與主題聚合",
        "ai": "聚合議題、優缺點與情緒候選",
        "human": "驗證情緒與主題分類",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.09,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.26,
        "compute": 4,
        "name": "評論分類與主題聚合",
        "input": "前一階段成果及本次原始資料",
        "output": "聚合議題、優缺點與情緒候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "週報與圖表草稿",
        "ai": "製作趨勢圖及週報初稿",
        "human": "確認報表定義和圖表",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 4,
        "name": "週報與圖表草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "製作趨勢圖及週報初稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "來源偏誤與市場解讀",
        "ai": "標示資料偏差、異常評價和不確定推論",
        "human": "由人員解讀市場並決定行動",
        "ownership": "human_gate",
        "stageWorkShare": 0.12,
        "aiAssistShare": 0.18,
        "humanWorkShare": 0.8200000000000001,
        "reviewAttention": 0.72,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "來源偏誤與市場解讀",
        "input": "前一階段成果及本次原始資料",
        "output": "標示資料偏差、異常評價和不確定推論；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.8148,
    "input": "確認價格來源與更新時間所需原始文件、資料及版本",
    "output": "標示資料偏差、異常評價和不確定推論及人工覆核紀錄",
    "boundary": "只計「競品與評論分析」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 180,
    "workUnit": "10 商品、50 則評論",
    "profiles": [
      "monitoring",
      "knowledge",
      "analytics"
    ],
    "cloneTag": "競品與評論分析分身",
    "description": "本次工作：彙整公開價格、規格及時間戳記；完成：標示資料偏差、異常評價和不確定推論。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 商品／20 評論",
        "manualMinutes": 108,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 商品／50 評論",
        "manualMinutes": 180,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 商品／200 評論",
        "manualMinutes": 450,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.27127264,
    "status": "active"
  },
  "B03": {
    "id": "B03",
    "title": "跨部門報表彙整",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "匯入各部門資料",
        "ai": "依權限匯入部門報表和版本",
        "human": "確認各部門資料權限與定義",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "匯入各部門資料",
        "input": "確認各部門資料權限與定義所需原始文件、資料及版本",
        "output": "依權限匯入部門報表和版本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "統一欄位與指標定義",
        "ai": "提出欄位及 KPI 定義對照表",
        "human": "核准 KPI 定義與換算規則",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.16,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "統一欄位與指標定義",
        "input": "前一階段成果及本次原始資料",
        "output": "提出欄位及 KPI 定義對照表；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "缺漏與異常檢查",
        "ai": "檢查漏報、重複及離群數字",
        "human": "調查缺值與異常數字",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.11,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "缺漏與異常檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查漏報、重複及離群數字；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "圖表與摘要草稿",
        "ai": "生成圖表、文字摘要與差異說明",
        "human": "核對圖表和摘要是否一致",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 4,
        "name": "圖表與摘要草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成圖表、文字摘要與差異說明；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "數字與決策內容確認",
        "ai": "彙整待主管確認的數字和決策假設",
        "human": "主管確認數字及對外結論",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.76,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.28,
        "compute": 1,
        "name": "數字與決策內容確認",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整待主管確認的數字和決策假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7324,
    "input": "確認各部門資料權限與定義所需原始文件、資料及版本",
    "output": "彙整待主管確認的數字和決策假設及人工覆核紀錄",
    "boundary": "只計「跨部門報表彙整」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "3 部門、1 份報告",
    "profiles": [
      "analytics",
      "document"
    ],
    "cloneTag": "跨部門報表彙整分身",
    "description": "本次工作：依權限匯入部門報表和版本；完成：彙整待主管確認的數字和決策假設。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 個部門",
        "manualMinutes": 54,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "3 個部門",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "6 個部門",
        "manualMinutes": 225,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.38125456,
    "status": "active"
  },
  "B04": {
    "id": "B04",
    "title": "客服工單處理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "讀取與分類工單",
        "ai": "讀取工單、標籤及客戶歷史紀錄",
        "human": "確認工單與個資存取權限",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "讀取與分類工單",
        "input": "確認工單與個資存取權限所需原始文件、資料及版本",
        "output": "讀取工單、標籤及客戶歷史紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "查詢知識與歷史案例",
        "ai": "搜尋已核准知識庫及相似案例",
        "human": "核對知識庫版本及適用性",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.11,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "查詢知識與歷史案例",
        "input": "前一階段成果及本次原始資料",
        "output": "搜尋已核准知識庫及相似案例；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "產生回覆草稿",
        "ai": "生成引用正確版本的回覆候選",
        "human": "檢查回覆的承諾與語氣",
        "ownership": "assist",
        "stageWorkShare": 0.26,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.13,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "產生回覆草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成引用正確版本的回覆候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "辨識升級與風險事件",
        "ai": "標示退款、法務、資安及情緒升級訊號",
        "human": "高風險或爭議案件轉人工處理",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.2,
        "exceptionRate": 0.16,
        "exceptionEffort": 0.4,
        "compute": 3,
        "name": "辨識升級與風險事件",
        "input": "前一階段成果及本次原始資料",
        "output": "標示退款、法務、資安及情緒升級訊號；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "退款承諾與正式回覆",
        "ai": "整理尚待核准的承諾及正式答覆草稿",
        "human": "人工核准退款、責任及正式回覆",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.14,
        "humanWorkShare": 0.86,
        "reviewAttention": 0.8,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.32,
        "compute": 1,
        "name": "退款承諾與正式回覆",
        "input": "前一階段成果及本次原始資料",
        "output": "整理尚待核准的承諾及正式答覆草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7132000000000001,
    "input": "確認工單與個資存取權限所需原始文件、資料及版本",
    "output": "整理尚待核准的承諾及正式答覆草稿及人工覆核紀錄",
    "boundary": "只計「客服工單處理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "20 件工單",
    "profiles": [
      "knowledge",
      "monitoring"
    ],
    "cloneTag": "客服工單處理分身",
    "description": "本次工作：讀取工單、標籤及客戶歷史紀錄；完成：整理尚待核准的承諾及正式答覆草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "5 件工單",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "20 件工單",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "100 件工單",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.40970032,
    "status": "active"
  },
  "B05": {
    "id": "B05",
    "title": "商品上架",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "整理商品規格與素材",
        "ai": "擷取原廠規格、商品圖片及品項欄位",
        "human": "核對商品原廠規格與授權圖片",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.09,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "整理商品規格與素材",
        "input": "核對商品原廠規格與授權圖片所需原始文件、資料及版本",
        "output": "擷取原廠規格、商品圖片及品項欄位；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "商品文案與欄位草稿",
        "ai": "生成商品標題、描述與平台欄位候選",
        "human": "確認型號、價格及禁止宣稱",
        "ownership": "assist",
        "stageWorkShare": 0.24,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.26,
        "compute": 3,
        "name": "商品文案與欄位草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成商品標題、描述與平台欄位候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "圖片尺寸與版本處理",
        "ai": "批次調整圖片比例及檔名",
        "human": "檢查圖片是否扭曲商品",
        "ownership": "assist",
        "stageWorkShare": 0.26,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 5,
        "name": "圖片尺寸與版本處理",
        "input": "前一階段成果及本次原始資料",
        "output": "批次調整圖片比例及檔名；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "平台格式與上架草稿",
        "ai": "產生各平台草稿、分類和變體對照",
        "human": "預覽平台欄位及變體關係",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "平台格式與上架草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產生各平台草稿、分類和變體對照；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "規格價格與發布確認",
        "ai": "標出價格、庫存、型號及圖片不一致處",
        "human": "核准價格、庫存及正式上架",
        "ownership": "human_gate",
        "stageWorkShare": 0.12,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.76,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.26,
        "compute": 1,
        "name": "規格價格與發布確認",
        "input": "前一階段成果及本次原始資料",
        "output": "標出價格、庫存、型號及圖片不一致處；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7828,
    "input": "核對商品原廠規格與授權圖片所需原始文件、資料及版本",
    "output": "標出價格、庫存、型號及圖片不一致處及人工覆核紀錄",
    "boundary": "只計「商品上架」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "10 項商品",
    "profiles": [
      "document",
      "media"
    ],
    "cloneTag": "商品上架分身",
    "description": "本次工作：擷取原廠規格、商品圖片及品項欄位；完成：標出價格、庫存、型號及圖片不一致處。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "3 項商品",
        "manualMinutes": 54,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 項商品",
        "manualMinutes": 90,
        "baseTier": 2
      },
      "large": {
        "label": "大量",
        "description": "30 項商品",
        "manualMinutes": 225,
        "baseTier": 3
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.31513232,
    "status": "active"
  },
  "B06": {
    "id": "B06",
    "title": "合約條款比對",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "文件解析與版本對齊",
        "ai": "解析契約版本與條款位置",
        "human": "確認契約版本與當事人",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 3,
        "name": "文件解析與版本對齊",
        "input": "確認契約版本與當事人所需原始文件、資料及版本",
        "output": "解析契約版本與條款位置；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "條款差異比對",
        "ai": "逐條比對新增、刪除和變更內容",
        "human": "核對條款變更及上下文",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.11,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.32,
        "compute": 3,
        "name": "條款差異比對",
        "input": "前一階段成果及本次原始資料",
        "output": "逐條比對新增、刪除和變更內容；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "缺漏與風險項提示",
        "ai": "依已定義風險類別標記待審條款",
        "human": "由專業人員辨識法律風險",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.22,
        "exceptionRate": 0.16,
        "exceptionEffort": 0.4,
        "compute": 3,
        "name": "缺漏與風險項提示",
        "input": "前一階段成果及本次原始資料",
        "output": "依已定義風險類別標記待審條款；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "條款索引與摘要草稿",
        "ai": "生成條款摘要與原文連結",
        "human": "核對引文位置及摘要語意",
        "ownership": "assist",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.1,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 2,
        "name": "條款索引與摘要草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "生成條款摘要與原文連結；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "專業審閱與法律判斷",
        "ai": "整理專業審閱問題與版本差異",
        "human": "專業審閱並決定法律立場",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.08,
        "humanWorkShare": 0.92,
        "reviewAttention": 0.88,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.34,
        "compute": 1,
        "name": "專業審閱與法律判斷",
        "input": "前一階段成果及本次原始資料",
        "output": "整理專業審閱問題與版本差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.6892,
    "input": "確認契約版本與當事人所需原始文件、資料及版本",
    "output": "整理專業審閱問題與版本差異及人工覆核紀錄",
    "boundary": "只計「合約條款比對」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "2 個版本、10 頁",
    "profiles": [
      "knowledge",
      "document"
    ],
    "cloneTag": "合約條款比對分身",
    "description": "本次工作：解析契約版本與條款位置；完成：整理專業審閱問題與版本差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "3 頁合約",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "10 頁合約",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "30 頁合約",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.43041440000000003,
    "status": "active"
  },
  "B07": {
    "id": "B07",
    "title": "費用分攤與請款",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "匯入費用與分攤資料",
        "ai": "擷取請款金額、憑證與分攤欄位",
        "human": "確認費用、憑證及成本中心",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.92,
        "humanWorkShare": 0.07999999999999996,
        "reviewAttention": 0.06,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.2,
        "compute": 2,
        "name": "匯入費用與分攤資料",
        "input": "確認費用、憑證及成本中心所需原始文件、資料及版本",
        "output": "擷取請款金額、憑證與分攤欄位；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "套用分攤規則",
        "ai": "依核准規則計算成本中心分攤",
        "human": "核准分攤規則及適用期間",
        "ownership": "assist",
        "stageWorkShare": 0.26,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 2,
        "name": "套用分攤規則",
        "input": "前一階段成果及本次原始資料",
        "output": "依核准規則計算成本中心分攤；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "整數與尾差調整",
        "ai": "計算尾差並保持總額一致",
        "human": "確認尾差與總額一致",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.12,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.3,
        "compute": 2,
        "name": "整數與尾差調整",
        "input": "前一階段成果及本次原始資料",
        "output": "計算尾差並保持總額一致；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建立請款表單草稿",
        "ai": "套版產生請款草稿與附件清單",
        "human": "核對請款欄位及附件",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.9,
        "humanWorkShare": 0.09999999999999998,
        "reviewAttention": 0.07,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.22,
        "compute": 2,
        "name": "建立請款表單草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "套版產生請款草稿與附件清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "預算歸屬與核准",
        "ai": "標示超預算、缺憑證及待簽核項",
        "human": "預算權責人核准後送件",
        "ownership": "human_gate",
        "stageWorkShare": 0.16,
        "aiAssistShare": 0.16,
        "humanWorkShare": 0.84,
        "reviewAttention": 0.76,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.26,
        "compute": 1,
        "name": "預算歸屬與核准",
        "input": "前一階段成果及本次原始資料",
        "output": "標示超預算、缺憑證及待簽核項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.7604,
    "input": "確認費用、憑證及成本中心所需原始文件、資料及版本",
    "output": "標示超預算、缺憑證及待簽核項及人工覆核紀錄",
    "boundary": "只計「費用分攤與請款」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 30,
    "workUnit": "1 筆、8 類",
    "profiles": [
      "analytics",
      "document"
    ],
    "cloneTag": "費用分攤與請款分身",
    "description": "本次工作：擷取請款金額、憑證與分攤欄位；完成：標示超預算、缺憑證及待簽核項。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 筆、3 類",
        "manualMinutes": 18,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 筆、8 類",
        "manualMinutes": 30,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "5 筆、8 類",
        "manualMinutes": 75,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.33948416,
    "status": "active"
  },
  "B08": {
    "id": "B08",
    "title": "會議決議追蹤",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "音訊整理與轉錄",
        "ai": "轉錄會議並標記說話者及時間碼",
        "human": "確認會議錄音許可",
        "ownership": "assist",
        "stageWorkShare": 0.34,
        "aiAssistShare": 0.95,
        "humanWorkShare": 0.050000000000000044,
        "reviewAttention": 0.05,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.2,
        "compute": 4,
        "name": "音訊整理與轉錄",
        "input": "確認會議錄音許可所需原始文件、資料及版本",
        "output": "轉錄會議並標記說話者及時間碼；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "決議與議題分類",
        "ai": "分類議題、決議和未決事項",
        "human": "對照原音確認決議",
        "ownership": "assist",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.1,
        "exceptionRate": 0.1,
        "exceptionEffort": 0.28,
        "compute": 3,
        "name": "決議與議題分類",
        "input": "前一階段成果及本次原始資料",
        "output": "分類議題、決議和未決事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "負責人與期限辨識",
        "ai": "擷取可能的負責人與期限候選",
        "human": "核對責任人和截止日期",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.15,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.34,
        "compute": 3,
        "name": "負責人與期限辨識",
        "input": "前一階段成果及本次原始資料",
        "output": "擷取可能的負責人與期限候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "待辦清單與追蹤草稿",
        "ai": "產生待辦與提醒清單草稿",
        "human": "確認待辦可執行與追蹤機制",
        "ownership": "assist",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.08,
        "exceptionRate": 0.08,
        "exceptionEffort": 0.24,
        "compute": 3,
        "name": "待辦清單與追蹤草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產生待辦與提醒清單草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "權責、決議與通知確認",
        "ai": "標示未確認權責與對外通知內容",
        "human": "主持人確認權責與正式通知",
        "ownership": "human_gate",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.18,
        "humanWorkShare": 0.8200000000000001,
        "reviewAttention": 0.72,
        "exceptionRate": 0.06,
        "exceptionEffort": 0.28,
        "compute": 1,
        "name": "權責、決議與通知確認",
        "input": "前一階段成果及本次原始資料",
        "output": "標示未確認權責與對外通知內容；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [],
    "estimatedAiAssistShare": 0.8118,
    "input": "確認會議錄音許可所需原始文件、資料及版本",
    "output": "標示未確認權責與對外通知內容及人工覆核紀錄",
    "boundary": "只計「會議決議追蹤」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 60,
    "workUnit": "30 分鐘錄音",
    "profiles": [
      "media",
      "monitoring",
      "document"
    ],
    "cloneTag": "會議決議追蹤分身",
    "description": "本次工作：轉錄會議並標記說話者及時間碼；完成：標示未確認權責與對外通知內容。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "15 分鐘錄音",
        "manualMinutes": 36,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "30 分鐘錄音",
        "manualMinutes": 60,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "90 分鐘錄音",
        "manualMinutes": 150,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": true,
    "conflictsWith": [
      "S06"
    ],
    "estimatedRetainedHumanShare": 0.28729800000000005,
    "status": "active"
  },
  "S09": {
    "id": "S09",
    "title": "設計研究與使用者訪談",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "研究規劃",
        "ai": "整理研究目標、訪談題綱與招募條件草稿",
        "human": "研究者決定抽樣、同意書及個資處理",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.45,
        "humanWorkShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "研究規劃",
        "input": "研究者決定抽樣、同意書及個資處理所需原始文件、資料及版本",
        "output": "整理研究目標、訪談題綱與招募條件草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資料整理",
        "ai": "轉錄訪談、標記主題並連回原話",
        "human": "人工核對引文、脈絡與敏感資訊",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料整理",
        "input": "前一階段成果及本次原始資料",
        "output": "轉錄訪談、標記主題並連回原話；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "洞察形成",
        "ai": "彙整痛點與假設，保留反例",
        "human": "研究者判斷證據是否足以支持結論",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "洞察形成",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整痛點與假設，保留反例；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "設計決策",
        "ai": "生成旅程圖與優先順序候選",
        "human": "設計師與利害關係人核准方向",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.38,
        "humanWorkShare": 0.62,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計決策",
        "input": "前一階段成果及本次原始資料",
        "output": "生成旅程圖與優先順序候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "design",
      "research"
    ],
    "estimatedAiAssistShare": 0.5418000000000001,
    "input": "研究者決定抽樣、同意書及個資處理所需原始文件、資料及版本",
    "output": "生成旅程圖與優先順序候選及人工覆核紀錄",
    "boundary": "只計「設計研究與使用者訪談」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次設計研究與使用者訪談",
    "profiles": [
      "document"
    ],
    "cloneTag": "設計研究與使用者訪談分身",
    "description": "本次工作：整理研究目標、訪談題綱與招募條件草稿；完成：生成旅程圖與優先順序候選。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次設計研究與使用者訪談；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次設計研究與使用者訪談；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次設計研究與使用者訪談；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.6196564,
    "status": "active"
  },
  "S10": {
    "id": "S10",
    "title": "網站介面與可用性設計",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求與資訊架構",
        "ai": "整理頁面、內容及操作路徑草稿",
        "human": "設計師確認真實使用情境與無障礙需求",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求與資訊架構",
        "input": "設計師確認真實使用情境與無障礙需求所需原始文件、資料及版本",
        "output": "整理頁面、內容及操作路徑草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "線框與原型",
        "ai": "生成版型、元件與微文案候選",
        "human": "檢查品牌、互動邏輯與邊界情境",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "線框與原型",
        "input": "前一階段成果及本次原始資料",
        "output": "生成版型、元件與微文案候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "可用性檢查",
        "ai": "整理測試觀察、缺陷與修正選項",
        "human": "人員執行測試並判斷問題嚴重度",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "可用性檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "整理測試觀察、缺陷與修正選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "交付規格",
        "ai": "彙整尺寸、狀態、元件與註記",
        "human": "設計師確認交付稿與驗收標準",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "交付規格",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整尺寸、狀態、元件與註記；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "design",
      "web"
    ],
    "estimatedAiAssistShare": 0.6236,
    "input": "設計師確認真實使用情境與無障礙需求所需原始文件、資料及版本",
    "output": "彙整尺寸、狀態、元件與註記及人工覆核紀錄",
    "boundary": "只計「網站介面與可用性設計」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次網站介面與可用性設計",
    "profiles": [
      "document"
    ],
    "cloneTag": "網站介面與可用性設計分身",
    "description": "本次工作：整理頁面、內容及操作路徑草稿；完成：彙整尺寸、狀態、元件與註記。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次網站介面與可用性設計；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次網站介面與可用性設計；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次網站介面與可用性設計；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5622328000000001,
    "status": "active"
  },
  "S11": {
    "id": "S11",
    "title": "攝影選片與修圖交付",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "拍攝規劃",
        "ai": "整理鏡位、道具與時程清單",
        "human": "攝影師決定燈光、授權與拍攝方案",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.4,
        "humanWorkShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "拍攝規劃",
        "input": "攝影師決定燈光、授權與拍攝方案所需原始文件、資料及版本",
        "output": "整理鏡位、道具與時程清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "初選與標記",
        "ai": "偵測重複、失焦並協助分類",
        "human": "攝影師確認表情、構圖與客戶要求",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.73,
        "humanWorkShare": 0.27,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "初選與標記",
        "input": "前一階段成果及本次原始資料",
        "output": "偵測重複、失焦並協助分類；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "修圖",
        "ai": "提出色彩、去瑕疵與批次處理候選",
        "human": "核對人物真實性及商品色差",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "修圖",
        "input": "前一階段成果及本次原始資料",
        "output": "提出色彩、去瑕疵與批次處理候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "交付",
        "ai": "產生尺寸、檔名及交付清單",
        "human": "攝影師檢查輸出並取得客戶確認",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "交付",
        "input": "前一階段成果及本次原始資料",
        "output": "產生尺寸、檔名及交付清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "photo",
      "design"
    ],
    "estimatedAiAssistShare": 0.6248,
    "input": "攝影師決定燈光、授權與拍攝方案所需原始文件、資料及版本",
    "output": "產生尺寸、檔名及交付清單及人工覆核紀錄",
    "boundary": "只計「攝影選片與修圖交付」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次攝影選片與修圖交付",
    "profiles": [
      "document"
    ],
    "cloneTag": "攝影選片與修圖交付分身",
    "description": "本次工作：整理鏡位、道具與時程清單；完成：產生尺寸、檔名及交付清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次攝影選片與修圖交付；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次攝影選片與修圖交付；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次攝影選片與修圖交付；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5613904000000001,
    "status": "active"
  },
  "S12": {
    "id": "S12",
    "title": "3D／動態影像製作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "分鏡與資產",
        "ai": "整理腳本、分鏡和參考素材",
        "human": "創作者確認造型、版權與技術可行性",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "分鏡與資產",
        "input": "創作者確認造型、版權與技術可行性所需原始文件、資料及版本",
        "output": "整理腳本、分鏡和參考素材；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建模與動畫草稿",
        "ai": "產生材質、動作或關鍵影格候選",
        "human": "人工修正結構、透視及品牌細節",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "建模與動畫草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產生材質、動作或關鍵影格候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "渲染與後製",
        "ai": "協助批次輸出、降噪及版本比較",
        "human": "檢查畫面瑕疵、模型一致性與效能",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "渲染與後製",
        "input": "前一階段成果及本次原始資料",
        "output": "協助批次輸出、降噪及版本比較；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "定稿",
        "ai": "整理輸出規格和修改紀錄",
        "human": "創作者核准主視覺及客戶交付",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "定稿",
        "input": "前一階段成果及本次原始資料",
        "output": "整理輸出規格和修改紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "motion",
      "3d"
    ],
    "estimatedAiAssistShare": 0.6008,
    "input": "創作者確認造型、版權與技術可行性所需原始文件、資料及版本",
    "output": "整理輸出規格和修改紀錄及人工覆核紀錄",
    "boundary": "只計「3D／動態影像製作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次3D／動態影像製作",
    "profiles": [
      "document"
    ],
    "cloneTag": "3D／動態影像製作分身",
    "description": "本次工作：整理腳本、分鏡和參考素材；完成：整理輸出規格和修改紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次3D／動態影像製作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次3D／動態影像製作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次3D／動態影像製作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5782384,
    "status": "active"
  },
  "S13": {
    "id": "S13",
    "title": "搜尋優化與內容規劃",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "搜尋需求",
        "ai": "整理查詢詞、意圖與內容缺口",
        "human": "人員確認資料時效及目標受眾",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "搜尋需求",
        "input": "人員確認資料時效及目標受眾所需原始文件、資料及版本",
        "output": "整理查詢詞、意圖與內容缺口；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "內容企劃",
        "ai": "產生文章架構、標題和內部連結建議",
        "human": "編輯確認原創性與品牌主張",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "內容企劃",
        "input": "前一階段成果及本次原始資料",
        "output": "產生文章架構、標題和內部連結建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "技術檢查",
        "ai": "盤點標題、描述、網址及結構化資料",
        "human": "網站負責人檢查索引與實作結果",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "技術檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "盤點標題、描述、網址及結構化資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布與成效",
        "ai": "整理搜尋數據和改版假設",
        "human": "人員核准發布並依實際數據調整",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.67,
        "humanWorkShare": 0.32999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布與成效",
        "input": "前一階段成果及本次原始資料",
        "output": "整理搜尋數據和改版假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "marketing",
      "seo"
    ],
    "estimatedAiAssistShare": 0.7242,
    "input": "人員確認資料時效及目標受眾所需原始文件、資料及版本",
    "output": "整理搜尋數據和改版假設及人工覆核紀錄",
    "boundary": "搜尋意圖、內容規劃與內容成效；獨立技術索引檢核請使用 C05，不計入此任務。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次搜尋優化與內容規劃",
    "profiles": [
      "document"
    ],
    "cloneTag": "搜尋優化與內容規劃分身",
    "description": "本次工作：整理查詢詞、意圖與內容缺口；完成：整理搜尋數據和改版假設。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次搜尋優化與內容規劃；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次搜尋優化與內容規劃；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次搜尋優化與內容規劃；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4916116,
    "status": "active"
  },
  "S14": {
    "id": "S14",
    "title": "廣告投放規劃與優化",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "目標與預算",
        "ai": "彙整受眾、投放目標及歷史績效",
        "human": "投手決定預算上限與衡量指標",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "目標與預算",
        "input": "投手決定預算上限與衡量指標所需原始文件、資料及版本",
        "output": "彙整受眾、投放目標及歷史績效；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "素材與文案",
        "ai": "生成文案及素材變體候選",
        "human": "審核宣稱、平台政策與品牌規範",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "素材與文案",
        "input": "前一階段成果及本次原始資料",
        "output": "生成文案及素材變體候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "監測分析",
        "ai": "偵測異常、計算指標與整理假設",
        "human": "人工判讀歸因、樣本量及季節性",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "監測分析",
        "input": "前一階段成果及本次原始資料",
        "output": "偵測異常、計算指標與整理假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "調整投放",
        "ai": "提出出價和素材調整草案",
        "human": "投手核准花費與正式變更",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "調整投放",
        "input": "前一階段成果及本次原始資料",
        "output": "提出出價和素材調整草案；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "marketing",
      "ads"
    ],
    "estimatedAiAssistShare": 0.6844,
    "input": "投手決定預算上限與衡量指標所需原始文件、資料及版本",
    "output": "提出出價和素材調整草案及人工覆核紀錄",
    "boundary": "只計「廣告投放規劃與優化」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次廣告投放規劃與優化",
    "profiles": [
      "document"
    ],
    "cloneTag": "廣告投放規劃與優化分身",
    "description": "本次工作：彙整受眾、投放目標及歷史績效；完成：提出出價和素材調整草案。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次廣告投放規劃與優化；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次廣告投放規劃與優化；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次廣告投放規劃與優化；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5195512,
    "status": "active"
  },
  "S15": {
    "id": "S15",
    "title": "社群互動與社群經營",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "訊息蒐集",
        "ai": "彙整留言、私訊及常見議題",
        "human": "社群人員確認可存取資料範圍",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.85,
        "humanWorkShare": 0.15000000000000002,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "訊息蒐集",
        "input": "社群人員確認可存取資料範圍所需原始文件、資料及版本",
        "output": "彙整留言、私訊及常見議題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "分類與草稿",
        "ai": "區分詢問、抱怨及合作並提出回覆",
        "human": "核對情緒、語氣與個資",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.74,
        "humanWorkShare": 0.26,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "分類與草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "區分詢問、抱怨及合作並提出回覆；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "升級處理",
        "ai": "標記危機、爭議或產品風險",
        "human": "人工接手敏感案例並決定對外立場",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.46,
        "humanWorkShare": 0.54,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "升級處理",
        "input": "前一階段成果及本次原始資料",
        "output": "標記危機、爭議或產品風險；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布與回顧",
        "ai": "整理排程及互動數據",
        "human": "社群人員核准回覆與公開貼文",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.63,
        "humanWorkShare": 0.37,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布與回顧",
        "input": "前一階段成果及本次原始資料",
        "output": "整理排程及互動數據；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "marketing",
      "community"
    ],
    "estimatedAiAssistShare": 0.666,
    "input": "社群人員確認可存取資料範圍所需原始文件、資料及版本",
    "output": "整理排程及互動數據及人工覆核紀錄",
    "boundary": "只計「社群互動與社群經營」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次社群互動與社群經營",
    "profiles": [
      "document"
    ],
    "cloneTag": "社群互動與社群經營分身",
    "description": "本次工作：彙整留言、私訊及常見議題；完成：整理排程及互動數據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次社群互動與社群經營；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次社群互動與社群經營；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次社群互動與社群經營；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.532468,
    "status": "active"
  },
  "S16": {
    "id": "S16",
    "title": "市場與商業研究",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "研究題目",
        "ai": "將需求轉為可檢驗問題和資料清單",
        "human": "顧問界定範圍與商業假設",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "研究題目",
        "input": "顧問界定範圍與商業假設所需原始文件、資料及版本",
        "output": "將需求轉為可檢驗問題和資料清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "蒐集來源",
        "ai": "搜尋、摘要並記錄來源與日期",
        "human": "人工核對可信度、授權與缺失資料",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "蒐集來源",
        "input": "前一階段成果及本次原始資料",
        "output": "搜尋、摘要並記錄來源與日期；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "比較分析",
        "ai": "整理競品、規模及情境試算",
        "human": "顧問質疑推論、檢查偏誤與反例",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "比較分析",
        "input": "前一階段成果及本次原始資料",
        "output": "整理競品、規模及情境試算；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "建議交付",
        "ai": "產生簡報和建議草稿",
        "human": "顧問對結論及客戶承諾負責",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.64,
        "humanWorkShare": 0.36,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "建議交付",
        "input": "前一階段成果及本次原始資料",
        "output": "產生簡報和建議草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "consulting",
      "research"
    ],
    "estimatedAiAssistShare": 0.6418,
    "input": "顧問界定範圍與商業假設所需原始文件、資料及版本",
    "output": "產生簡報和建議草稿及人工覆核紀錄",
    "boundary": "只計「市場與商業研究」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次市場與商業研究",
    "profiles": [
      "document"
    ],
    "cloneTag": "市場與商業研究分身",
    "description": "本次工作：將需求轉為可檢驗問題和資料清單；完成：產生簡報和建議草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次市場與商業研究；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次市場與商業研究；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次市場與商業研究；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5494564000000001,
    "status": "active"
  },
  "S17": {
    "id": "S17",
    "title": "客戶提案與簡報",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求盤點",
        "ai": "彙整會議、招標與客戶背景",
        "human": "確認決策人、預算與可交付範圍",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求盤點",
        "input": "確認決策人、預算與可交付範圍所需原始文件、資料及版本",
        "output": "彙整會議、招標與客戶背景；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "方案架構",
        "ai": "生成提案目錄、時程與選項",
        "human": "顧問選擇可執行方案及定價",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "方案架構",
        "input": "前一階段成果及本次原始資料",
        "output": "生成提案目錄、時程與選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "簡報製作",
        "ai": "生成投影片與案例排版草稿",
        "human": "核對數據、授權與說服邏輯",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "簡報製作",
        "input": "前一階段成果及本次原始資料",
        "output": "生成投影片與案例排版草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "提案與承諾",
        "ai": "整理問答與會後追蹤",
        "human": "人員親自提案、議價及簽核",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.34,
        "humanWorkShare": 0.6599999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "提案與承諾",
        "input": "前一階段成果及本次原始資料",
        "output": "整理問答與會後追蹤；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "consulting",
      "sales"
    ],
    "estimatedAiAssistShare": 0.6492,
    "input": "確認決策人、預算與可交付範圍所需原始文件、資料及版本",
    "output": "整理問答與會後追蹤及人工覆核紀錄",
    "boundary": "只計「客戶提案與簡報」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次客戶提案與簡報",
    "profiles": [
      "document"
    ],
    "cloneTag": "客戶提案與簡報分身",
    "description": "本次工作：彙整會議、招標與客戶背景；完成：整理問答與會後追蹤。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次客戶提案與簡報；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次客戶提案與簡報；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次客戶提案與簡報；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5442616,
    "status": "active"
  },
  "S18": {
    "id": "S18",
    "title": "教練／講師服務與追蹤",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "學員需求",
        "ai": "整理目標、限制與同意資料",
        "human": "講師確認適配性及服務界線",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "學員需求",
        "input": "講師確認適配性及服務界線所需原始文件、資料及版本",
        "output": "整理目標、限制與同意資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "方案安排",
        "ai": "生成課程或練習計畫候選",
        "human": "講師依個別差異調整",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "方案安排",
        "input": "前一階段成果及本次原始資料",
        "output": "生成課程或練習計畫候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "進度紀錄",
        "ai": "整理回饋、進度與待解決問題",
        "human": "講師觀察實際表現和風險",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "進度紀錄",
        "input": "前一階段成果及本次原始資料",
        "output": "整理回饋、進度與待解決問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "回饋與調整",
        "ai": "產出摘要及下次練習建議",
        "human": "講師親自給予回饋並決定變更",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.38,
        "humanWorkShare": 0.62,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "回饋與調整",
        "input": "前一階段成果及本次原始資料",
        "output": "產出摘要及下次練習建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "teaching",
      "consulting"
    ],
    "estimatedAiAssistShare": 0.5836,
    "input": "講師確認適配性及服務界線所需原始文件、資料及版本",
    "output": "產出摘要及下次練習建議及人工覆核紀錄",
    "boundary": "只計「教練／講師服務與追蹤」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次教練／講師服務與追蹤",
    "profiles": [
      "document"
    ],
    "cloneTag": "教練／講師服務與追蹤分身",
    "description": "本次工作：整理目標、限制與同意資料；完成：產出摘要及下次練習建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次教練／講師服務與追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次教練／講師服務與追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次教練／講師服務與追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5903128,
    "status": "active"
  },
  "S19": {
    "id": "S19",
    "title": "資料儀表板與商業分析",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "指標定義",
        "ai": "盤點資料表、欄位與分析問題",
        "human": "分析師核定指標定義和權限",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.56,
        "humanWorkShare": 0.43999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "指標定義",
        "input": "分析師核定指標定義和權限所需原始文件、資料及版本",
        "output": "盤點資料表、欄位與分析問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資料整理",
        "ai": "產生查詢、清理腳本及異常標記",
        "human": "驗證抽樣、連接鍵與缺值",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料整理",
        "input": "前一階段成果及本次原始資料",
        "output": "產生查詢、清理腳本及異常標記；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "視覺化",
        "ai": "生成圖表與文字洞察候選",
        "human": "檢查尺度、歸因和不確定性",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "視覺化",
        "input": "前一階段成果及本次原始資料",
        "output": "生成圖表與文字洞察候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布維護",
        "ai": "建立更新與監測清單",
        "human": "分析師核准儀表板權限及解讀",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.56,
        "humanWorkShare": 0.43999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布維護",
        "input": "前一階段成果及本次原始資料",
        "output": "建立更新與監測清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "data",
      "analytics"
    ],
    "estimatedAiAssistShare": 0.6696000000000001,
    "input": "分析師核定指標定義和權限所需原始文件、資料及版本",
    "output": "建立更新與監測清單及人工覆核紀錄",
    "boundary": "只計「資料儀表板與商業分析」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次資料儀表板與商業分析",
    "profiles": [
      "document"
    ],
    "cloneTag": "資料儀表板與商業分析分身",
    "description": "本次工作：盤點資料表、欄位與分析問題；完成：建立更新與監測清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次資料儀表板與商業分析；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次資料儀表板與商業分析；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次資料儀表板與商業分析；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "E04",
      "A01",
      "A02",
      "A03"
    ],
    "estimatedRetainedHumanShare": 0.5299408,
    "status": "active"
  },
  "S20": {
    "id": "S20",
    "title": "API 整合與流程自動化",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "流程與權限",
        "ai": "盤點觸發、輸入輸出及 API 規格",
        "human": "工程師確認授權、資安與失敗處理",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.52,
        "humanWorkShare": 0.48,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "流程與權限",
        "input": "工程師確認授權、資安與失敗處理所需原始文件、資料及版本",
        "output": "盤點觸發、輸入輸出及 API 規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "整合草稿",
        "ai": "產生串接程式與欄位映射草稿",
        "human": "檢查密鑰管理及重試邏輯",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "整合草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產生串接程式與欄位映射草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "測試",
        "ai": "生成模擬資料、測試案例與紀錄",
        "human": "人工驗證副作用、錯誤路徑及資料一致性",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.74,
        "humanWorkShare": 0.26,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "測試",
        "input": "前一階段成果及本次原始資料",
        "output": "生成模擬資料、測試案例與紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "啟用",
        "ai": "整理部署與回復操作",
        "human": "工程師核准上線並監控實際執行",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.27,
        "humanWorkShare": 0.73,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "啟用",
        "input": "前一階段成果及本次原始資料",
        "output": "整理部署與回復操作；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "development",
      "automation"
    ],
    "estimatedAiAssistShare": 0.6006,
    "input": "工程師確認授權、資安與失敗處理所需原始文件、資料及版本",
    "output": "整理部署與回復操作及人工覆核紀錄",
    "boundary": "只計「API 整合與流程自動化」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次API 整合與流程自動化",
    "profiles": [
      "document"
    ],
    "cloneTag": "API 整合與流程自動化分身",
    "description": "本次工作：盤點觸發、輸入輸出及 API 規格；完成：整理部署與回復操作。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次API 整合與流程自動化；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次API 整合與流程自動化；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次API 整合與流程自動化；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5783788,
    "status": "active"
  },
  "S21": {
    "id": "S21",
    "title": "資訊支援與系統維護",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "報修分流",
        "ai": "分類症狀、裝置與緊急程度",
        "human": "資訊人員辨識安全事件與影響範圍",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "報修分流",
        "input": "資訊人員辨識安全事件與影響範圍所需原始文件、資料及版本",
        "output": "分類症狀、裝置與緊急程度；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "診斷",
        "ai": "查詢知識庫與分析紀錄檔",
        "human": "確認實機狀態及變更風險",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.67,
        "humanWorkShare": 0.32999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "診斷",
        "input": "前一階段成果及本次原始資料",
        "output": "查詢知識庫與分析紀錄檔；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "修復建議",
        "ai": "提出設定、腳本或回復步驟",
        "human": "人員執行有權限的變更並記錄",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "修復建議",
        "input": "前一階段成果及本次原始資料",
        "output": "提出設定、腳本或回復步驟；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "驗證結案",
        "ai": "產生驗證清單與處理紀錄",
        "human": "使用者或負責人確認服務恢復",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "驗證結案",
        "input": "前一階段成果及本次原始資料",
        "output": "產生驗證清單與處理紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "it",
      "support"
    ],
    "estimatedAiAssistShare": 0.6206,
    "input": "資訊人員辨識安全事件與影響範圍所需原始文件、資料及版本",
    "output": "產生驗證清單與處理紀錄及人工覆核紀錄",
    "boundary": "只計「資訊支援與系統維護」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次資訊支援與系統維護",
    "profiles": [
      "document"
    ],
    "cloneTag": "資訊支援與系統維護分身",
    "description": "本次工作：分類症狀、裝置與緊急程度；完成：產生驗證清單與處理紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次資訊支援與系統維護；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次資訊支援與系統維護；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次資訊支援與系統維護；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5643388,
    "status": "active"
  },
  "S22": {
    "id": "S22",
    "title": "線上商店營運與庫存",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "庫存與訂單",
        "ai": "整合品項、訂單及異常資料",
        "human": "賣家確認庫存真實數與可售狀態",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.85,
        "humanWorkShare": 0.15000000000000002,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "庫存與訂單",
        "input": "賣家確認庫存真實數與可售狀態所需原始文件、資料及版本",
        "output": "整合品項、訂單及異常資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "需求分析",
        "ai": "整理銷售趨勢與缺貨提醒",
        "human": "人工考量活動、交期和季節因素",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求分析",
        "input": "前一階段成果及本次原始資料",
        "output": "整理銷售趨勢與缺貨提醒；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "採購與促銷草案",
        "ai": "提出補貨和促銷候選",
        "human": "賣家核准成本、售價及供應商條件",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "採購與促銷草案",
        "input": "前一階段成果及本次原始資料",
        "output": "提出補貨和促銷候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "上線與追蹤",
        "ai": "更新追蹤清單並提示異常",
        "human": "人員確認實際上架及採購",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "上線與追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "更新追蹤清單並提示異常；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "commerce",
      "inventory"
    ],
    "estimatedAiAssistShare": 0.6718,
    "input": "賣家確認庫存真實數與可售狀態所需原始文件、資料及版本",
    "output": "更新追蹤清單並提示異常及人工覆核紀錄",
    "boundary": "只計「線上商店營運與庫存」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次線上商店營運與庫存",
    "profiles": [
      "document"
    ],
    "cloneTag": "線上商店營運與庫存分身",
    "description": "本次工作：整合品項、訂單及異常資料；完成：更新追蹤清單並提示異常。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次線上商店營運與庫存；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次線上商店營運與庫存；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次線上商店營運與庫存；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5283964000000001,
    "status": "legacy-unassigned"
  },
  "S23": {
    "id": "S23",
    "title": "翻譯與在地化交付",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求與術語",
        "ai": "擷取原文、術語及目標語風格",
        "human": "譯者確認讀者、文化及授權",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求與術語",
        "input": "譯者確認讀者、文化及授權所需原始文件、資料及版本",
        "output": "擷取原文、術語及目標語風格；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "初譯",
        "ai": "產生譯文與多種措辭候選",
        "human": "譯者核對原意、歧義及省略",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "初譯",
        "input": "前一階段成果及本次原始資料",
        "output": "產生譯文與多種措辭候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "校對與版面",
        "ai": "檢查一致性、數字、連結及長度",
        "human": "人工檢查專業術語和在地語感",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "校對與版面",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查一致性、數字、連結及長度；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "交付",
        "ai": "整理差異、疑問及版本",
        "human": "譯者定稿並由客戶核准關鍵內容",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.52,
        "humanWorkShare": 0.48,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "交付",
        "input": "前一階段成果及本次原始資料",
        "output": "整理差異、疑問及版本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "translation",
      "admin"
    ],
    "estimatedAiAssistShare": 0.7006,
    "input": "譯者確認讀者、文化及授權所需原始文件、資料及版本",
    "output": "整理差異、疑問及版本及人工覆核紀錄",
    "boundary": "只計「翻譯與在地化交付」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次翻譯與在地化交付",
    "profiles": [
      "document"
    ],
    "cloneTag": "翻譯與在地化交付分身",
    "description": "本次工作：擷取原文、術語及目標語風格；完成：整理差異、疑問及版本。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次翻譯與在地化交付；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次翻譯與在地化交付；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次翻譯與在地化交付；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5081788,
    "status": "active"
  },
  "E09": {
    "id": "E09",
    "title": "文獻檢索與系統性整理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "研究問題",
        "ai": "整理關鍵詞與納入排除條件草稿",
        "human": "研究者確定研究設計與檢索範圍",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "研究問題",
        "input": "研究者確定研究設計與檢索範圍所需原始文件、資料及版本",
        "output": "整理關鍵詞與納入排除條件草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "檢索與去重",
        "ai": "搜尋授權資料庫、標記重複及保存來源",
        "human": "人工檢查遺漏、版本與資料庫限制",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.83,
        "humanWorkShare": 0.17000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "檢索與去重",
        "input": "前一階段成果及本次原始資料",
        "output": "搜尋授權資料庫、標記重複及保存來源；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "篩選與擷取",
        "ai": "摘要論文並提取方法、樣本及結果",
        "human": "研究者逐篇核對原文與排除理由",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "篩選與擷取",
        "input": "前一階段成果及本次原始資料",
        "output": "摘要論文並提取方法、樣本及結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "綜整寫作",
        "ai": "製作證據表與敘述草稿",
        "human": "研究者判斷偏誤、引用和結論",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.57,
        "humanWorkShare": 0.43000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "綜整寫作",
        "input": "前一階段成果及本次原始資料",
        "output": "製作證據表與敘述草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "research",
      "literature"
    ],
    "estimatedAiAssistShare": 0.6726,
    "input": "研究者確定研究設計與檢索範圍所需原始文件、資料及版本",
    "output": "製作證據表與敘述草稿及人工覆核紀錄",
    "boundary": "只計「文獻檢索與系統性整理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次文獻檢索與系統性整理",
    "profiles": [
      "document"
    ],
    "cloneTag": "文獻檢索與系統性整理分身",
    "description": "本次工作：整理關鍵詞與納入排除條件草稿；完成：製作證據表與敘述草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次文獻檢索與系統性整理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次文獻檢索與系統性整理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次文獻檢索與系統性整理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5278348,
    "status": "active"
  },
  "E10": {
    "id": "E10",
    "title": "研究論文與計畫書寫作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "論點架構",
        "ai": "整理既有資料與章節大綱",
        "human": "作者決定原創論點及研究貢獻",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.52,
        "humanWorkShare": 0.48,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "論點架構",
        "input": "作者決定原創論點及研究貢獻所需原始文件、資料及版本",
        "output": "整理既有資料與章節大綱；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "初稿",
        "ai": "依已核對資料協助寫段落與圖說",
        "human": "作者查證數據、引文及方法",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "初稿",
        "input": "前一階段成果及本次原始資料",
        "output": "依已核對資料協助寫段落與圖說；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "修改回覆",
        "ai": "比對審查意見與稿件並列修訂選項",
        "human": "作者決定回覆立場與實際修改",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.64,
        "humanWorkShare": 0.36,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "修改回覆",
        "input": "前一階段成果及本次原始資料",
        "output": "比對審查意見與稿件並列修訂選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "提交",
        "ai": "檢查格式、附件與引文一致性",
        "human": "作者對誠信、署名及送件負責",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "提交",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查格式、附件與引文一致性；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "research",
      "writing"
    ],
    "estimatedAiAssistShare": 0.6156,
    "input": "作者決定原創論點及研究貢獻所需原始文件、資料及版本",
    "output": "檢查格式、附件與引文一致性及人工覆核紀錄",
    "boundary": "只計「研究論文與計畫書寫作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次研究論文與計畫書寫作",
    "profiles": [
      "document"
    ],
    "cloneTag": "研究論文與計畫書寫作分身",
    "description": "本次工作：整理既有資料與章節大綱；完成：檢查格式、附件與引文一致性。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次研究論文與計畫書寫作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次研究論文與計畫書寫作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次研究論文與計畫書寫作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5678488,
    "status": "active"
  },
  "E11": {
    "id": "E11",
    "title": "實驗設計與紀錄",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "實驗規劃",
        "ai": "整理變因、設備、材料及安全文件",
        "human": "研究者核准設計、倫理及安全程序",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.47,
        "humanWorkShare": 0.53,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "實驗規劃",
        "input": "研究者核准設計、倫理及安全程序所需原始文件、資料及版本",
        "output": "整理變因、設備、材料及安全文件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "執行紀錄",
        "ai": "協助格式化時間、樣本與量測紀錄",
        "human": "實驗者操作設備並確認原始數據",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.46,
        "humanWorkShare": 0.54,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "執行紀錄",
        "input": "前一階段成果及本次原始資料",
        "output": "協助格式化時間、樣本與量測紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "品管",
        "ai": "偵測缺漏、異常或儀器漂移",
        "human": "人員調查原因並決定是否重測",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "品管",
        "input": "前一階段成果及本次原始資料",
        "output": "偵測缺漏、異常或儀器漂移；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結果確認",
        "ai": "整理可重現紀錄與分析草稿",
        "human": "研究者確認原始紀錄及解釋",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.54,
        "humanWorkShare": 0.45999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結果確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理可重現紀錄與分析草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "research",
      "lab"
    ],
    "estimatedAiAssistShare": 0.5326,
    "input": "研究者核准設計、倫理及安全程序所需原始文件、資料及版本",
    "output": "整理可重現紀錄與分析草稿及人工覆核紀錄",
    "boundary": "只計「實驗設計與紀錄」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次實驗設計與紀錄",
    "profiles": [
      "document"
    ],
    "cloneTag": "實驗設計與紀錄分身",
    "description": "本次工作：整理變因、設備、材料及安全文件；完成：整理可重現紀錄與分析草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次實驗設計與紀錄；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次實驗設計與紀錄；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次實驗設計與紀錄；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.6261148,
    "status": "active"
  },
  "E12": {
    "id": "E12",
    "title": "課程筆記與學習計畫",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "資料輸入",
        "ai": "整理筆記、講義與課程目標",
        "human": "學習者確認來源及老師使用規範",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料輸入",
        "input": "學習者確認來源及老師使用規範所需原始文件、資料及版本",
        "output": "整理筆記、講義與課程目標；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "知識整理",
        "ai": "生成摘要、概念圖與待釐清問題",
        "human": "學習者檢查錯誤和漏掉的脈絡",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "知識整理",
        "input": "前一階段成果及本次原始資料",
        "output": "生成摘要、概念圖與待釐清問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "練習",
        "ai": "產生自我測驗與循序提示",
        "human": "學習者自行解題並檢驗理解",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "練習",
        "input": "前一階段成果及本次原始資料",
        "output": "產生自我測驗與循序提示；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "複習安排",
        "ai": "提出間隔複習與進度清單",
        "human": "學習者依時間與成績調整",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "複習安排",
        "input": "前一階段成果及本次原始資料",
        "output": "提出間隔複習與進度清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "student",
      "learning"
    ],
    "estimatedAiAssistShare": 0.8078000000000001,
    "input": "學習者確認來源及老師使用規範所需原始文件、資料及版本",
    "output": "提出間隔複習與進度清單及人工覆核紀錄",
    "boundary": "E12 計筆記整理與一般學習安排；E06 計錯題解析與針對錯題練習；同一份複習計畫只計一次。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次課程筆記與學習計畫",
    "profiles": [
      "document"
    ],
    "cloneTag": "課程筆記與學習計畫分身",
    "description": "本次工作：整理筆記、講義與課程目標；完成：提出間隔複習與進度清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次課程筆記與學習計畫；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次課程筆記與學習計畫；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次課程筆記與學習計畫；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4329244,
    "status": "active"
  },
  "E13": {
    "id": "E13",
    "title": "報告與簡報製作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "題目與資料",
        "ai": "整理作業要求、可信來源與大綱",
        "human": "學生確定題目與引用規範",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "題目與資料",
        "input": "學生確定題目與引用規範所需原始文件、資料及版本",
        "output": "整理作業要求、可信來源與大綱；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "撰寫與製圖",
        "ai": "提出段落、圖表與投影片草稿",
        "human": "學生自行分析資料及完成論證",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "撰寫與製圖",
        "input": "前一階段成果及本次原始資料",
        "output": "提出段落、圖表與投影片草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "校閱",
        "ai": "檢查引用、數字與結構",
        "human": "學生核對原始來源及學術誠信",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.71,
        "humanWorkShare": 0.29000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "校閱",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查引用、數字與結構；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發表",
        "ai": "協助練習時間及可能問答",
        "human": "學生親自報告並回答問題",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發表",
        "input": "前一階段成果及本次原始資料",
        "output": "協助練習時間及可能問答；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "student",
      "presentation"
    ],
    "estimatedAiAssistShare": 0.6557999999999999,
    "input": "學生確定題目與引用規範所需原始文件、資料及版本",
    "output": "協助練習時間及可能問答及人工覆核紀錄",
    "boundary": "只計「報告與簡報製作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次報告與簡報製作",
    "profiles": [
      "document"
    ],
    "cloneTag": "報告與簡報製作分身",
    "description": "本次工作：整理作業要求、可信來源與大綱；完成：協助練習時間及可能問答。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次報告與簡報製作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次報告與簡報製作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次報告與簡報製作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5396284,
    "status": "active"
  },
  "E14": {
    "id": "E14",
    "title": "語言學習與翻譯練習",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "目標設定",
        "ai": "整理程度、主題和常見錯誤",
        "human": "學習者或教師決定學習目標",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "目標設定",
        "input": "學習者或教師決定學習目標所需原始文件、資料及版本",
        "output": "整理程度、主題和常見錯誤；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "練習生成",
        "ai": "提供對話、單字與翻譯題",
        "human": "教師確認語用和難度",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.85,
        "humanWorkShare": 0.15000000000000002,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "練習生成",
        "input": "前一階段成果及本次原始資料",
        "output": "提供對話、單字與翻譯題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "回饋",
        "ai": "指出文法、發音或譯意問題",
        "human": "學習者辨識 AI 回饋錯誤並練習",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "回饋",
        "input": "前一階段成果及本次原始資料",
        "output": "指出文法、發音或譯意問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "評量",
        "ai": "整理進展及後續建議",
        "human": "教師正式評分或學習者驗證能力",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.63,
        "humanWorkShare": 0.37,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "評量",
        "input": "前一階段成果及本次原始資料",
        "output": "整理進展及後續建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "student",
      "language"
    ],
    "estimatedAiAssistShare": 0.7542,
    "input": "學習者或教師決定學習目標所需原始文件、資料及版本",
    "output": "整理進展及後續建議及人工覆核紀錄",
    "boundary": "只計「語言學習與翻譯練習」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次語言學習與翻譯練習",
    "profiles": [
      "document"
    ],
    "cloneTag": "語言學習與翻譯練習分身",
    "description": "本次工作：整理程度、主題和常見錯誤；完成：整理進展及後續建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次語言學習與翻譯練習；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次語言學習與翻譯練習；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次語言學習與翻譯練習；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4705516,
    "status": "active"
  },
  "E15": {
    "id": "E15",
    "title": "差異化教學與個別回饋",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "能力診斷",
        "ai": "彙整作答與學習進度",
        "human": "教師確認個別情境與資料權限",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "能力診斷",
        "input": "教師確認個別情境與資料權限所需原始文件、資料及版本",
        "output": "彙整作答與學習進度；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "分層教材",
        "ai": "生成不同難度例題和活動草稿",
        "human": "教師檢查正確性及公平性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "分層教材",
        "input": "前一階段成果及本次原始資料",
        "output": "生成不同難度例題和活動草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "課堂觀察",
        "ai": "整理參與、錯誤與回饋紀錄",
        "human": "教師觀察學生並調整教法",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "課堂觀察",
        "input": "前一階段成果及本次原始資料",
        "output": "整理參與、錯誤與回饋紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "個別回饋",
        "ai": "產生鼓勵與改進建議草稿",
        "human": "教師親自確認內容並與學生溝通",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "個別回饋",
        "input": "前一階段成果及本次原始資料",
        "output": "產生鼓勵與改進建議草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "teaching",
      "assessment"
    ],
    "estimatedAiAssistShare": 0.6476,
    "input": "教師確認個別情境與資料權限所需原始文件、資料及版本",
    "output": "產生鼓勵與改進建議草稿及人工覆核紀錄",
    "boundary": "只計「差異化教學與個別回饋」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次差異化教學與個別回饋",
    "profiles": [
      "document"
    ],
    "cloneTag": "差異化教學與個別回饋分身",
    "description": "本次工作：彙整作答與學習進度；完成：產生鼓勵與改進建議草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次差異化教學與個別回饋；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次差異化教學與個別回饋；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次差異化教學與個別回饋；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5453848,
    "status": "active"
  },
  "E16": {
    "id": "E16",
    "title": "班級管理與親師溝通",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "議題整理",
        "ai": "分類請假、作業及聯絡事項",
        "human": "教師確認學生個資和優先程度",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.79,
        "humanWorkShare": 0.20999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "議題整理",
        "input": "教師確認學生個資和優先程度所需原始文件、資料及版本",
        "output": "分類請假、作業及聯絡事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "訊息草稿",
        "ai": "撰寫課程通知與個別信件候選",
        "human": "教師確認語氣、事實與收件人",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.77,
        "humanWorkShare": 0.22999999999999998,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "訊息草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "撰寫課程通知與個別信件候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "例外處理",
        "ai": "標示爭議、輔導或安全相關訊號",
        "human": "教師依校規與專業流程親自處理",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.53,
        "humanWorkShare": 0.47,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "例外處理",
        "input": "前一階段成果及本次原始資料",
        "output": "標示爭議、輔導或安全相關訊號；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "正式通知",
        "ai": "整理發送紀錄及追蹤清單",
        "human": "教師核准寄送及後續行動",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "正式通知",
        "input": "前一階段成果及本次原始資料",
        "output": "整理發送紀錄及追蹤清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "teaching",
      "admin"
    ],
    "estimatedAiAssistShare": 0.673,
    "input": "教師確認學生個資和優先程度所需原始文件、資料及版本",
    "output": "整理發送紀錄及追蹤清單及人工覆核紀錄",
    "boundary": "只計「班級管理與親師溝通」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次班級管理與親師溝通",
    "profiles": [
      "document"
    ],
    "cloneTag": "班級管理與親師溝通分身",
    "description": "本次工作：分類請假、作業及聯絡事項；完成：整理發送紀錄及追蹤清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次班級管理與親師溝通；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次班級管理與親師溝通；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次班級管理與親師溝通；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5275540000000001,
    "status": "active"
  },
  "E17": {
    "id": "E17",
    "title": "課程設計與學習成效",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求分析",
        "ai": "整理受眾、能力落差及課程目標",
        "human": "教學設計師確認目標可評量",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.59,
        "humanWorkShare": 0.41000000000000003,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求分析",
        "input": "教學設計師確認目標可評量所需原始文件、資料及版本",
        "output": "整理受眾、能力落差及課程目標；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "課綱與活動",
        "ai": "產生單元、活動及練習草稿",
        "human": "專家確認內容和教學順序",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.73,
        "humanWorkShare": 0.27,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "課綱與活動",
        "input": "前一階段成果及本次原始資料",
        "output": "產生單元、活動及練習草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "教材製作",
        "ai": "生成講義、題目、腳本和字幕",
        "human": "人工核對內容、版權及無障礙",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.83,
        "humanWorkShare": 0.17000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "教材製作",
        "input": "前一階段成果及本次原始資料",
        "output": "生成講義、題目、腳本和字幕；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "成效評估",
        "ai": "彙整問卷、完成率及測驗結果",
        "human": "設計師判讀成效並決定改版",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.74,
        "humanWorkShare": 0.26,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "成效評估",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整問卷、完成率及測驗結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "instructional",
      "training"
    ],
    "estimatedAiAssistShare": 0.729,
    "input": "教學設計師確認目標可評量所需原始文件、資料及版本",
    "output": "彙整問卷、完成率及測驗結果及人工覆核紀錄",
    "boundary": "只計「課程設計與學習成效」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次課程設計與學習成效",
    "profiles": [
      "document"
    ],
    "cloneTag": "課程設計與學習成效分身",
    "description": "本次工作：整理受眾、能力落差及課程目標；完成：彙整問卷、完成率及測驗結果。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次課程設計與學習成效；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次課程設計與學習成效；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次課程設計與學習成效；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.48824200000000006,
    "status": "active"
  },
  "E18": {
    "id": "E18",
    "title": "線上課程影音製作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "腳本",
        "ai": "整理教學目標與逐段講述草稿",
        "human": "講師確認示範正確且適合學員",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "腳本",
        "input": "講師確認示範正確且適合學員所需原始文件、資料及版本",
        "output": "整理教學目標與逐段講述草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "拍攝與剪輯",
        "ai": "協助分段、去贅字和初剪",
        "human": "人員完成實拍並檢查教學節奏",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "拍攝與剪輯",
        "input": "前一階段成果及本次原始資料",
        "output": "協助分段、去贅字和初剪；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "字幕與講義",
        "ai": "轉錄字幕、製作章節與配套筆記",
        "human": "校對專有名詞和畫面對應",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "字幕與講義",
        "input": "前一階段成果及本次原始資料",
        "output": "轉錄字幕、製作章節與配套筆記；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "上架",
        "ai": "檢查格式、連結與測驗設定",
        "human": "課程負責人核准公開與授權",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.61,
        "humanWorkShare": 0.39,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "上架",
        "input": "前一階段成果及本次原始資料",
        "output": "檢查格式、連結與測驗設定；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "instructional",
      "video"
    ],
    "estimatedAiAssistShare": 0.7254,
    "input": "講師確認示範正確且適合學員所需原始文件、資料及版本",
    "output": "檢查格式、連結與測驗設定及人工覆核紀錄",
    "boundary": "只計「線上課程影音製作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次線上課程影音製作",
    "profiles": [
      "document"
    ],
    "cloneTag": "線上課程影音製作分身",
    "description": "本次工作：整理教學目標與逐段講述草稿；完成：檢查格式、連結與測驗設定。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次線上課程影音製作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次線上課程影音製作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次線上課程影音製作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4907692,
    "status": "active"
  },
  "E19": {
    "id": "E19",
    "title": "招生與學籍資料處理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "收件",
        "ai": "整理申請資料並標示缺件",
        "human": "行政人員確認合法收集及身分",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "收件",
        "input": "行政人員確認合法收集及身分所需原始文件、資料及版本",
        "output": "整理申請資料並標示缺件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資料比對",
        "ai": "核對欄位、日期和重複資料",
        "human": "人工處理不一致與特殊案件",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.85,
        "humanWorkShare": 0.15000000000000002,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料比對",
        "input": "前一階段成果及本次原始資料",
        "output": "核對欄位、日期和重複資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "通知草稿",
        "ai": "產生補件與結果通知範本",
        "human": "人員確認名單、時程和措辭",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "通知草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "產生補件與結果通知範本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "核定與發送",
        "ai": "整理稽核紀錄與寄送清單",
        "human": "有權人員核定結果並正式發送",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.32,
        "humanWorkShare": 0.6799999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "核定與發送",
        "input": "前一階段成果及本次原始資料",
        "output": "整理稽核紀錄與寄送清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "education_admin",
      "admissions"
    ],
    "estimatedAiAssistShare": 0.72,
    "input": "行政人員確認合法收集及身分所需原始文件、資料及版本",
    "output": "整理稽核紀錄與寄送清單及人工覆核紀錄",
    "boundary": "只計「招生與學籍資料處理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次招生與學籍資料處理",
    "profiles": [
      "document"
    ],
    "cloneTag": "招生與學籍資料處理分身",
    "description": "本次工作：整理申請資料並標示缺件；完成：整理稽核紀錄與寄送清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次招生與學籍資料處理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次招生與學籍資料處理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次招生與學籍資料處理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.49456,
    "status": "active"
  },
  "E20": {
    "id": "E20",
    "title": "課程排程與活動行政",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "收集限制",
        "ai": "整理師資、教室、設備和參與名單",
        "human": "承辦人確認硬性限制及隱私",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "收集限制",
        "input": "承辦人確認硬性限制及隱私所需原始文件、資料及版本",
        "output": "整理師資、教室、設備和參與名單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "方案排程",
        "ai": "產生衝突檢查及時程候選",
        "human": "人工協調資源和例外",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "方案排程",
        "input": "前一階段成果及本次原始資料",
        "output": "產生衝突檢查及時程候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "文件與通知",
        "ai": "生成報名、提醒與活動資料草稿",
        "human": "確認收件人、日期與場地",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "文件與通知",
        "input": "前一階段成果及本次原始資料",
        "output": "生成報名、提醒與活動資料草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "執行確認",
        "ai": "整理簽到及事後回饋",
        "human": "承辦人核准排程並處理現場變更",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.44,
        "humanWorkShare": 0.56,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "執行確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理簽到及事後回饋；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "education_admin",
      "scheduling"
    ],
    "estimatedAiAssistShare": 0.7532000000000001,
    "input": "承辦人確認硬性限制及隱私所需原始文件、資料及版本",
    "output": "整理簽到及事後回饋及人工覆核紀錄",
    "boundary": "只計「課程排程與活動行政」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次課程排程與活動行政",
    "profiles": [
      "document"
    ],
    "cloneTag": "課程排程與活動行政分身",
    "description": "本次工作：整理師資、教室、設備和參與名單；完成：整理簽到及事後回饋。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次課程排程與活動行政；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次課程排程與活動行政；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次課程排程與活動行政；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4712536,
    "status": "active"
  },
  "E21": {
    "id": "E21",
    "title": "實驗室設備與耗材管理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "盤點",
        "ai": "整理設備、校正和耗材清單",
        "human": "技術員實地核對數量及狀態",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "盤點",
        "input": "技術員實地核對數量及狀態所需原始文件、資料及版本",
        "output": "整理設備、校正和耗材清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "保養提醒",
        "ai": "標記到期、異常和使用趨勢",
        "human": "人工確認維修必要及安全影響",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.79,
        "humanWorkShare": 0.20999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "保養提醒",
        "input": "前一階段成果及本次原始資料",
        "output": "標記到期、異常和使用趨勢；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "操作文件",
        "ai": "草擬 SOP、紀錄表與訓練素材",
        "human": "專責人員審查危害與操作順序",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.61,
        "humanWorkShare": 0.39,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "操作文件",
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 SOP、紀錄表與訓練素材；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "採購與放行",
        "ai": "彙整採購比較及領用紀錄",
        "human": "授權人員核准採購與設備使用",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.45,
        "humanWorkShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "採購與放行",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整採購比較及領用紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "lab",
      "it"
    ],
    "estimatedAiAssistShare": 0.6718000000000001,
    "input": "技術員實地核對數量及狀態所需原始文件、資料及版本",
    "output": "彙整採購比較及領用紀錄及人工覆核紀錄",
    "boundary": "只計「實驗室設備與耗材管理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次實驗室設備與耗材管理",
    "profiles": [
      "document"
    ],
    "cloneTag": "實驗室設備與耗材管理分身",
    "description": "本次工作：整理設備、校正和耗材清單；完成：彙整採購比較及領用紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次實驗室設備與耗材管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次實驗室設備與耗材管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次實驗室設備與耗材管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5283964,
    "status": "active"
  },
  "E22": {
    "id": "E22",
    "title": "校園系統與使用者支援",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "問題受理",
        "ai": "分類帳號、網路和系統問題",
        "human": "資訊人員辨識帳號風險與優先順序",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "問題受理",
        "input": "資訊人員辨識帳號風險與優先順序所需原始文件、資料及版本",
        "output": "分類帳號、網路和系統問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "診斷",
        "ai": "比對紀錄檔與既有解法",
        "human": "驗證故障範圍及授權",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "診斷",
        "input": "前一階段成果及本次原始資料",
        "output": "比對紀錄檔與既有解法；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "處理",
        "ai": "提出操作步驟或修復腳本草稿",
        "human": "人員執行高權限作業及資安判斷",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "處理",
        "input": "前一階段成果及本次原始資料",
        "output": "提出操作步驟或修復腳本草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結案",
        "ai": "產生知識庫和通知草稿",
        "human": "負責人驗證恢復並正式結案",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.53,
        "humanWorkShare": 0.47,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結案",
        "input": "前一階段成果及本次原始資料",
        "output": "產生知識庫和通知草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "it",
      "education_admin"
    ],
    "estimatedAiAssistShare": 0.6494,
    "input": "資訊人員辨識帳號風險與優先順序所需原始文件、資料及版本",
    "output": "產生知識庫和通知草稿及人工覆核紀錄",
    "boundary": "只計「校園系統與使用者支援」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次校園系統與使用者支援",
    "profiles": [
      "document"
    ],
    "cloneTag": "校園系統與使用者支援分身",
    "description": "本次工作：分類帳號、網路和系統問題；完成：產生知識庫和通知草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次校園系統與使用者支援；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次校園系統與使用者支援；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次校園系統與使用者支援；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5441212000000001,
    "status": "active"
  },
  "E23": {
    "id": "E23",
    "title": "模型實驗與算力規劃",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "實驗設計",
        "ai": "整理資料、模型與評估指標",
        "human": "研究者核准資料權限和基準",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.54,
        "humanWorkShare": 0.45999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "實驗設計",
        "input": "研究者核准資料權限和基準所需原始文件、資料及版本",
        "output": "整理資料、模型與評估指標；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資源估算",
        "ai": "估算記憶體、運算與實驗排程",
        "human": "工程師確認實機限制和安全性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資源估算",
        "input": "前一階段成果及本次原始資料",
        "output": "估算記憶體、運算與實驗排程；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "執行監控",
        "ai": "整理紀錄、指標和失敗案例",
        "human": "人工判斷資料洩漏、偏誤和異常",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "執行監控",
        "input": "前一階段成果及本次原始資料",
        "output": "整理紀錄、指標和失敗案例；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結果驗證",
        "ai": "生成比較報表及重現步驟",
        "human": "研究者決定是否部署與發布結論",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結果驗證",
        "input": "前一階段成果及本次原始資料",
        "output": "生成比較報表及重現步驟；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "ai",
      "research"
    ],
    "estimatedAiAssistShare": 0.654,
    "input": "研究者核准資料權限和基準所需原始文件、資料及版本",
    "output": "生成比較報表及重現步驟及人工覆核紀錄",
    "boundary": "只計「模型實驗與算力規劃」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次模型實驗與算力規劃",
    "profiles": [
      "document"
    ],
    "cloneTag": "模型實驗與算力規劃分身",
    "description": "本次工作：整理資料、模型與評估指標；完成：生成比較報表及重現步驟。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次模型實驗與算力規劃；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次模型實驗與算力規劃；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次模型實驗與算力規劃；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5408919999999999,
    "status": "active"
  },
  "B09": {
    "id": "B09",
    "title": "潛在客戶開發與名單研究",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "目標客群",
        "ai": "彙整產品定位和篩選條件",
        "human": "業務確認可接洽對象及隱私規範",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.51,
        "humanWorkShare": 0.49,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "目標客群",
        "input": "業務確認可接洽對象及隱私規範所需原始文件、資料及版本",
        "output": "彙整產品定位和篩選條件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "名單研究",
        "ai": "整理公開公司資訊和聯絡線索",
        "human": "人工確認來源、正確性與適配性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "名單研究",
        "input": "前一階段成果及本次原始資料",
        "output": "整理公開公司資訊和聯絡線索；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "開發內容",
        "ai": "產生個人化開發信和問答草稿",
        "human": "業務核對承諾、語氣和送達對象",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "開發內容",
        "input": "前一階段成果及本次原始資料",
        "output": "產生個人化開發信和問答草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "接洽追蹤",
        "ai": "整理回覆與下次聯絡提醒",
        "human": "業務核准發送並親自建立關係",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.61,
        "humanWorkShare": 0.39,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "接洽追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "整理回覆與下次聯絡提醒；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "sales",
      "prospecting"
    ],
    "estimatedAiAssistShare": 0.6732,
    "input": "業務確認可接洽對象及隱私規範所需原始文件、資料及版本",
    "output": "整理回覆與下次聯絡提醒及人工覆核紀錄",
    "boundary": "只計「潛在客戶開發與名單研究」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次潛在客戶開發與名單研究",
    "profiles": [
      "document"
    ],
    "cloneTag": "潛在客戶開發與名單研究分身",
    "description": "本次工作：彙整產品定位和篩選條件；完成：整理回覆與下次聯絡提醒。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次潛在客戶開發與名單研究；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次潛在客戶開發與名單研究；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次潛在客戶開發與名單研究；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5274135999999999,
    "status": "active"
  },
  "B10": {
    "id": "B10",
    "title": "客戶關係與商機管理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "紀錄收集",
        "ai": "整理會議、來信和 CRM 紀錄",
        "human": "客戶經理確認同意與存取權",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.81,
        "humanWorkShare": 0.18999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "紀錄收集",
        "input": "客戶經理確認同意與存取權所需原始文件、資料及版本",
        "output": "整理會議、來信和 CRM 紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "商機分析",
        "ai": "標記需求、競品與下一步候選",
        "human": "人工判斷成交機率和關係脈絡",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.61,
        "humanWorkShare": 0.39,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "商機分析",
        "input": "前一階段成果及本次原始資料",
        "output": "標記需求、競品與下一步候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "提案追蹤",
        "ai": "產生會後追蹤與待辦草稿",
        "human": "確認價格、交期與對外承諾",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.77,
        "humanWorkShare": 0.22999999999999998,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "提案追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "產生會後追蹤與待辦草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "更新預測",
        "ai": "彙整商機進度及預測資料",
        "human": "主管核准重要階段及營收預測",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "更新預測",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整商機進度及預測資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "sales",
      "crm"
    ],
    "estimatedAiAssistShare": 0.6934,
    "input": "客戶經理確認同意與存取權所需原始文件、資料及版本",
    "output": "彙整商機進度及預測資料及人工覆核紀錄",
    "boundary": "只計「客戶關係與商機管理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次客戶關係與商機管理",
    "profiles": [
      "document"
    ],
    "cloneTag": "客戶關係與商機管理分身",
    "description": "本次工作：整理會議、來信和 CRM 紀錄；完成：彙整商機進度及預測資料。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次客戶關係與商機管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次客戶關係與商機管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次客戶關係與商機管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5132332,
    "status": "active"
  },
  "B11": {
    "id": "B11",
    "title": "採購與供應商比較",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求規格",
        "ai": "整理請購項目、數量與交期",
        "human": "採購確認必要條件與預算",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求規格",
        "input": "採購確認必要條件與預算所需原始文件、資料及版本",
        "output": "整理請購項目、數量與交期；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "詢比議價準備",
        "ai": "標準化報價和條款差異",
        "human": "人工查證供應商資格和稅額",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "詢比議價準備",
        "input": "前一階段成果及本次原始資料",
        "output": "標準化報價和條款差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "風險比較",
        "ai": "標記交期、保固與付款條件差異",
        "human": "人員判斷供應風險並實際議價",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "風險比較",
        "input": "前一階段成果及本次原始資料",
        "output": "標記交期、保固與付款條件差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "採購核准",
        "ai": "產生簽呈與採購單草稿",
        "human": "有權者核准採購與正式下單",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.45,
        "humanWorkShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "採購核准",
        "input": "前一階段成果及本次原始資料",
        "output": "產生簽呈與採購單草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "operations",
      "procurement"
    ],
    "estimatedAiAssistShare": 0.6904,
    "input": "採購確認必要條件與預算所需原始文件、資料及版本",
    "output": "產生簽呈與採購單草稿及人工覆核紀錄",
    "boundary": "只計「採購與供應商比較」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次採購與供應商比較",
    "profiles": [
      "document"
    ],
    "cloneTag": "採購與供應商比較分身",
    "description": "本次工作：整理請購項目、數量與交期；完成：產生簽呈與採購單草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次採購與供應商比較；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次採購與供應商比較；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次採購與供應商比較；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5153392,
    "status": "active"
  },
  "B12": {
    "id": "B12",
    "title": "標準作業流程與品質管理",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "現況訪談",
        "ai": "整理既有文件和操作紀錄",
        "human": "流程負責人確認現場真實作法",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "現況訪談",
        "input": "流程負責人確認現場真實作法所需原始文件、資料及版本",
        "output": "整理既有文件和操作紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "流程草稿",
        "ai": "繪製步驟、責任與例外清單",
        "human": "人工辨識安全、法遵與關鍵控制點",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "流程草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "繪製步驟、責任與例外清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "試行檢查",
        "ai": "收集缺陷、耗時及改進建議",
        "human": "人員實際測試並處理跨部門衝突",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "試行檢查",
        "input": "前一階段成果及本次原始資料",
        "output": "收集缺陷、耗時及改進建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布與維護",
        "ai": "整理版本及訓練資料",
        "human": "主管核准 SOP 並指定維護人",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布與維護",
        "input": "前一階段成果及本次原始資料",
        "output": "整理版本及訓練資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "operations",
      "sop"
    ],
    "estimatedAiAssistShare": 0.6838000000000001,
    "input": "流程負責人確認現場真實作法所需原始文件、資料及版本",
    "output": "整理版本及訓練資料及人工覆核紀錄",
    "boundary": "只計「標準作業流程與品質管理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次標準作業流程與品質管理",
    "profiles": [
      "document"
    ],
    "cloneTag": "標準作業流程與品質管理分身",
    "description": "本次工作：整理既有文件和操作紀錄；完成：整理版本及訓練資料。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次標準作業流程與品質管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次標準作業流程與品質管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次標準作業流程與品質管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5199724000000001,
    "status": "active"
  },
  "B13": {
    "id": "B13",
    "title": "庫存補貨與供應鏈追蹤",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "資料整併",
        "ai": "整理庫存、銷售及到貨資料",
        "human": "倉儲人員確認實際盤點",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料整併",
        "input": "倉儲人員確認實際盤點所需原始文件、資料及版本",
        "output": "整理庫存、銷售及到貨資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "需求預測",
        "ai": "產生安全庫存和補貨候選",
        "human": "人員判斷活動、斷料與季節性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.75,
        "humanWorkShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求預測",
        "input": "前一階段成果及本次原始資料",
        "output": "產生安全庫存和補貨候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "異常處理",
        "ai": "標記缺貨、延遲與超量庫存",
        "human": "人工聯絡供應商並決定替代方案",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.74,
        "humanWorkShare": 0.26,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "異常處理",
        "input": "前一階段成果及本次原始資料",
        "output": "標記缺貨、延遲與超量庫存；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "下單與回報",
        "ai": "產生訂單草稿和追蹤表",
        "human": "授權者核准採購和交期承諾",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "下單與回報",
        "input": "前一階段成果及本次原始資料",
        "output": "產生訂單草稿和追蹤表；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "operations",
      "inventory"
    ],
    "estimatedAiAssistShare": 0.7184,
    "input": "倉儲人員確認實際盤點所需原始文件、資料及版本",
    "output": "產生訂單草稿和追蹤表及人工覆核紀錄",
    "boundary": "只計「庫存補貨與供應鏈追蹤」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次庫存補貨與供應鏈追蹤",
    "profiles": [
      "document"
    ],
    "cloneTag": "庫存補貨與供應鏈追蹤分身",
    "description": "本次工作：整理庫存、銷售及到貨資料；完成：產生訂單草稿和追蹤表。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次庫存補貨與供應鏈追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次庫存補貨與供應鏈追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次庫存補貨與供應鏈追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4956832,
    "status": "active"
  },
  "B14": {
    "id": "B14",
    "title": "預算與預實差異分析",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "資料匯入",
        "ai": "彙整預算、實際與費用科目",
        "human": "財務人員核對會計期間與定義",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.91,
        "humanWorkShare": 0.08999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料匯入",
        "input": "財務人員核對會計期間與定義所需原始文件、資料及版本",
        "output": "彙整預算、實際與費用科目；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "差異計算",
        "ai": "計算偏差並標記異常",
        "human": "人工查證憑證、重分類與一次性事件",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.88,
        "humanWorkShare": 0.12,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "差異計算",
        "input": "前一階段成果及本次原始資料",
        "output": "計算偏差並標記異常；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "原因分析",
        "ai": "整理部門說明和情境",
        "human": "財務與主管確認真正成因",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "原因分析",
        "input": "前一階段成果及本次原始資料",
        "output": "整理部門說明和情境；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "報告核准",
        "ai": "製作報告和調整方案草稿",
        "human": "財務主管核准預測與正式報告",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "報告核准",
        "input": "前一階段成果及本次原始資料",
        "output": "製作報告和調整方案草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "finance",
      "budget"
    ],
    "estimatedAiAssistShare": 0.7782,
    "input": "財務人員核對會計期間與定義所需原始文件、資料及版本",
    "output": "製作報告和調整方案草稿及人工覆核紀錄",
    "boundary": "只計「預算與預實差異分析」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次預算與預實差異分析",
    "profiles": [
      "document"
    ],
    "cloneTag": "預算與預實差異分析分身",
    "description": "本次工作：彙整預算、實際與費用科目；完成：製作報告和調整方案草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次預算與預實差異分析；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次預算與預實差異分析；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次預算與預實差異分析；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.45370360000000004,
    "status": "active"
  },
  "B15": {
    "id": "B15",
    "title": "現金流與應收應付追蹤",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "款項整理",
        "ai": "彙總發票、到期日及收付款狀態",
        "human": "財務核對帳款和銀行資料",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.91,
        "humanWorkShare": 0.08999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "款項整理",
        "input": "財務核對帳款和銀行資料所需原始文件、資料及版本",
        "output": "彙總發票、到期日及收付款狀態；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "預測",
        "ai": "製作短期收支情境及逾期提醒",
        "human": "人員確認大額支出與不確定收入",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.77,
        "humanWorkShare": 0.22999999999999998,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "預測",
        "input": "前一階段成果及本次原始資料",
        "output": "製作短期收支情境及逾期提醒；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "催收與付款準備",
        "ai": "產生提醒及付款批次草稿",
        "human": "人工檢查收款對象和資金安排",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "催收與付款準備",
        "input": "前一階段成果及本次原始資料",
        "output": "產生提醒及付款批次草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "付款與確認",
        "ai": "整理授權和對帳清單",
        "human": "有權者核准付款及正式對帳",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.34,
        "humanWorkShare": 0.6599999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "付款與確認",
        "input": "前一階段成果及本次原始資料",
        "output": "整理授權和對帳清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "finance",
      "cashflow"
    ],
    "estimatedAiAssistShare": 0.7038,
    "input": "財務核對帳款和銀行資料所需原始文件、資料及版本",
    "output": "整理授權和對帳清單及人工覆核紀錄",
    "boundary": "只計「現金流與應收應付追蹤」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次現金流與應收應付追蹤",
    "profiles": [
      "document"
    ],
    "cloneTag": "現金流與應收應付追蹤分身",
    "description": "本次工作：彙總發票、到期日及收付款狀態；完成：整理授權和對帳清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次現金流與應收應付追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次現金流與應收應付追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次現金流與應收應付追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5059324000000001,
    "status": "active"
  },
  "B16": {
    "id": "B16",
    "title": "招募與面試協作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "職缺定義",
        "ai": "草擬職務說明及技能條件",
        "human": "主管確認真實需求與合法條件",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "職缺定義",
        "input": "主管確認真實需求與合法條件所需原始文件、資料及版本",
        "output": "草擬職務說明及技能條件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資料整理",
        "ai": "依公開且相關的資格摘要履歷",
        "human": "招募者查核資訊並避免偏見",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料整理",
        "input": "前一階段成果及本次原始資料",
        "output": "依公開且相關的資格摘要履歷；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "面試準備",
        "ai": "產生一致的問題和紀錄範本",
        "human": "面試官親自評估能力與互動",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.69,
        "humanWorkShare": 0.31000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "面試準備",
        "input": "前一階段成果及本次原始資料",
        "output": "產生一致的問題和紀錄範本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "決策與通知",
        "ai": "整理紀錄及候選人溝通草稿",
        "human": "人員決定錄用並核准正式通知",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.32,
        "humanWorkShare": 0.6799999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "決策與通知",
        "input": "前一階段成果及本次原始資料",
        "output": "整理紀錄及候選人溝通草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "hr",
      "recruitment"
    ],
    "estimatedAiAssistShare": 0.6176,
    "input": "主管確認真實需求與合法條件所需原始文件、資料及版本",
    "output": "整理紀錄及候選人溝通草稿及人工覆核紀錄",
    "boundary": "只計「招募與面試協作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次招募與面試協作",
    "profiles": [
      "document"
    ],
    "cloneTag": "招募與面試協作分身",
    "description": "本次工作：草擬職務說明及技能條件；完成：整理紀錄及候選人溝通草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次招募與面試協作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次招募與面試協作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次招募與面試協作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5664448000000001,
    "status": "active"
  },
  "B17": {
    "id": "B17",
    "title": "新人到職與人事文件",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "文件準備",
        "ai": "整理清單、權限與新進資料",
        "human": "人資核對身分及必要個資",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.84,
        "humanWorkShare": 0.16000000000000003,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "文件準備",
        "input": "人資核對身分及必要個資所需原始文件、資料及版本",
        "output": "整理清單、權限與新進資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "流程安排",
        "ai": "建立訓練、帳號與設備待辦",
        "human": "主管確認職務需求與權限最小化",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "流程安排",
        "input": "前一階段成果及本次原始資料",
        "output": "建立訓練、帳號與設備待辦；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "常見問答",
        "ai": "提供制度說明草稿與文件索引",
        "human": "人資確認現行政策及個別例外",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.8,
        "humanWorkShare": 0.19999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "常見問答",
        "input": "前一階段成果及本次原始資料",
        "output": "提供制度說明草稿與文件索引；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "完成確認",
        "ai": "提示未完成項與收件狀態",
        "human": "人資核准到職資料和權限",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "完成確認",
        "input": "前一階段成果及本次原始資料",
        "output": "提示未完成項與收件狀態；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "hr",
      "onboarding"
    ],
    "estimatedAiAssistShare": 0.7612,
    "input": "人資核對身分及必要個資所需原始文件、資料及版本",
    "output": "提示未完成項與收件狀態及人工覆核紀錄",
    "boundary": "只計「新人到職與人事文件」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次新人到職與人事文件",
    "profiles": [
      "document"
    ],
    "cloneTag": "新人到職與人事文件分身",
    "description": "本次工作：整理清單、權限與新進資料；完成：提示未完成項與收件狀態。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次新人到職與人事文件；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次新人到職與人事文件；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次新人到職與人事文件；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4656376,
    "status": "active"
  },
  "B18": {
    "id": "B18",
    "title": "員工訓練與意見調查",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求分析",
        "ai": "整理技能落差與問卷主題",
        "human": "人資決定訓練目標及匿名規則",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求分析",
        "input": "人資決定訓練目標及匿名規則所需原始文件、資料及版本",
        "output": "整理技能落差與問卷主題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "內容製作",
        "ai": "生成教材、測驗與邀請草稿",
        "human": "專家確認內容正確及包容性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.79,
        "humanWorkShare": 0.20999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "內容製作",
        "input": "前一階段成果及本次原始資料",
        "output": "生成教材、測驗與邀請草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "資料分析",
        "ai": "彙整回饋與學習表現",
        "human": "人工避免以小樣本識別個人",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "資料分析",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整回饋與學習表現；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "改善行動",
        "ai": "提出課程改版和追蹤建議",
        "human": "主管核准人事措施與正式溝通",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "改善行動",
        "input": "前一階段成果及本次原始資料",
        "output": "提出課程改版和追蹤建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "hr",
      "training"
    ],
    "estimatedAiAssistShare": 0.7244,
    "input": "人資決定訓練目標及匿名規則所需原始文件、資料及版本",
    "output": "提出課程改版和追蹤建議及人工覆核紀錄",
    "boundary": "只計「員工訓練與意見調查」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次員工訓練與意見調查",
    "profiles": [
      "document"
    ],
    "cloneTag": "員工訓練與意見調查分身",
    "description": "本次工作：整理技能落差與問卷主題；完成：提出課程改版和追蹤建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次員工訓練與意見調查；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次員工訓練與意見調查；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次員工訓練與意見調查；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4914712,
    "status": "active"
  },
  "B19": {
    "id": "B19",
    "title": "企業資訊服務與資安事件",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "監測與分流",
        "ai": "彙整警示、工單和紀錄檔",
        "human": "資訊人員判定事件等級與授權",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.85,
        "humanWorkShare": 0.15000000000000002,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "監測與分流",
        "input": "資訊人員判定事件等級與授權所需原始文件、資料及版本",
        "output": "彙整警示、工單和紀錄檔；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "初步分析",
        "ai": "關聯時間線、受影響資產和模式",
        "human": "人工確認誤報及證據保存",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "初步分析",
        "input": "前一階段成果及本次原始資料",
        "output": "關聯時間線、受影響資產和模式；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "應變方案",
        "ai": "整理隔離、修復和復原選項",
        "human": "資安負責人核准高權限變更",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "應變方案",
        "input": "前一階段成果及本次原始資料",
        "output": "整理隔離、修復和復原選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結案",
        "ai": "產生事故報告與改善清單",
        "human": "人員驗證修復並核准對外通知",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結案",
        "input": "前一階段成果及本次原始資料",
        "output": "產生事故報告與改善清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "it",
      "security"
    ],
    "estimatedAiAssistShare": 0.6354,
    "input": "資訊人員判定事件等級與授權所需原始文件、資料及版本",
    "output": "產生事故報告與改善清單及人工覆核紀錄",
    "boundary": "只計「企業資訊服務與資安事件」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次企業資訊服務與資安事件",
    "profiles": [
      "document"
    ],
    "cloneTag": "企業資訊服務與資安事件分身",
    "description": "本次工作：彙整警示、工單和紀錄檔；完成：產生事故報告與改善清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次企業資訊服務與資安事件；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次企業資訊服務與資安事件；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次企業資訊服務與資安事件；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5539492,
    "status": "active"
  },
  "B20": {
    "id": "B20",
    "title": "經營檢討與策略規劃",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "營運資料",
        "ai": "彙整營收、成本、客戶與市場數據",
        "human": "主管核對定義及決策期限",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.83,
        "humanWorkShare": 0.17000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "營運資料",
        "input": "主管核對定義及決策期限所需原始文件、資料及版本",
        "output": "彙整營收、成本、客戶與市場數據；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "問題分析",
        "ai": "提出異常、驅動因素和反例",
        "human": "管理者查證因果及現場限制",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.58,
        "humanWorkShare": 0.42000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "問題分析",
        "input": "前一階段成果及本次原始資料",
        "output": "提出異常、驅動因素和反例；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "情境規劃",
        "ai": "建立方案、資源和風險試算",
        "human": "主管決定可承擔風險與取捨",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "情境規劃",
        "input": "前一階段成果及本次原始資料",
        "output": "建立方案、資源和風險試算；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "決議追蹤",
        "ai": "整理策略備忘錄及執行清單",
        "human": "管理者核准投資與人員分工",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.51,
        "humanWorkShare": 0.49,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "決議追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "整理策略備忘錄及執行清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "management",
      "strategy"
    ],
    "estimatedAiAssistShare": 0.6504,
    "input": "主管核對定義及決策期限所需原始文件、資料及版本",
    "output": "整理策略備忘錄及執行清單及人工覆核紀錄",
    "boundary": "只計「經營檢討與策略規劃」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次經營檢討與策略規劃",
    "profiles": [
      "document"
    ],
    "cloneTag": "經營檢討與策略規劃分身",
    "description": "本次工作：彙整營收、成本、客戶與市場數據；完成：整理策略備忘錄及執行清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次經營檢討與策略規劃；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次經營檢討與策略規劃；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次經營檢討與策略規劃；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5434192,
    "status": "active"
  },
  "B21": {
    "id": "B21",
    "title": "門市營運與排班",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求資料",
        "ai": "整理來客量、工時與假日資訊",
        "human": "店長確認法規、技能和員工意願",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.82,
        "humanWorkShare": 0.18000000000000005,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求資料",
        "input": "店長確認法規、技能和員工意願所需原始文件、資料及版本",
        "output": "整理來客量、工時與假日資訊；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "排班候選",
        "ai": "生成班表、缺口和衝突提醒",
        "human": "人工處理公平性、臨時請假與服務需求",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "排班候選",
        "input": "前一階段成果及本次原始資料",
        "output": "生成班表、缺口和衝突提醒；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "現場回報",
        "ai": "彙整銷售、缺貨與客訴",
        "human": "店長檢查現場真實狀況",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "現場回報",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整銷售、缺貨與客訴；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布調整",
        "ai": "產生通知和交接清單",
        "human": "店長核准班表及服務決策",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.46,
        "humanWorkShare": 0.54,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布調整",
        "input": "前一階段成果及本次原始資料",
        "output": "產生通知和交接清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "retail",
      "operations"
    ],
    "estimatedAiAssistShare": 0.712,
    "input": "店長確認法規、技能和員工意願所需原始文件、資料及版本",
    "output": "產生通知和交接清單及人工覆核紀錄",
    "boundary": "只計「門市營運與排班」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次門市營運與排班",
    "profiles": [
      "document"
    ],
    "cloneTag": "門市營運與排班分身",
    "description": "本次工作：整理來客量、工時與假日資訊；完成：產生通知和交接清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次門市營運與排班；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次門市營運與排班；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次門市營運與排班；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.500176,
    "status": "active"
  },
  "B22": {
    "id": "B22",
    "title": "電商促銷與定價",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "市場資料",
        "ai": "整理歷史銷售、競品和成本",
        "human": "商品人員核對資料時效與毛利",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.86,
        "humanWorkShare": 0.14,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "市場資料",
        "input": "商品人員核對資料時效與毛利所需原始文件、資料及版本",
        "output": "整理歷史銷售、競品和成本；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "方案設計",
        "ai": "產生折扣、組合和曝光候選",
        "human": "人工確認庫存、預算與品牌影響",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "方案設計",
        "input": "前一階段成果及本次原始資料",
        "output": "產生折扣、組合和曝光候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "頁面製作",
        "ai": "草擬文案、價格欄位和活動規則",
        "human": "檢查標價、條件及法規",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.78,
        "humanWorkShare": 0.21999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "頁面製作",
        "input": "前一階段成果及本次原始資料",
        "output": "草擬文案、價格欄位和活動規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "發布監控",
        "ai": "整理成效與異常提示",
        "human": "有權者核准售價及正式上架",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.46,
        "humanWorkShare": 0.54,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "發布監控",
        "input": "前一階段成果及本次原始資料",
        "output": "整理成效與異常提示；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "commerce",
      "promotion"
    ],
    "estimatedAiAssistShare": 0.7144,
    "input": "商品人員核對資料時效與毛利所需原始文件、資料及版本",
    "output": "整理成效與異常提示及人工覆核紀錄",
    "boundary": "只計「電商促銷與定價」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次電商促銷與定價",
    "profiles": [
      "document"
    ],
    "cloneTag": "電商促銷與定價分身",
    "description": "本次工作：整理歷史銷售、競品和成本；完成：整理成效與異常提示。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次電商促銷與定價；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次電商促銷與定價；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次電商促銷與定價；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.4984912,
    "status": "active"
  },
  "B23": {
    "id": "B23",
    "title": "客戶成功與續約",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "客戶使用狀況",
        "ai": "彙整服務紀錄、回饋及到期日",
        "human": "客戶經理確認資料解讀與隱私",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.81,
        "humanWorkShare": 0.18999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "客戶使用狀況",
        "input": "客戶經理確認資料解讀與隱私所需原始文件、資料及版本",
        "output": "彙整服務紀錄、回饋及到期日；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "風險訊號",
        "ai": "標記使用下降和未解決問題",
        "human": "人員實際訪談與判斷流失原因",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.68,
        "humanWorkShare": 0.31999999999999995,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "風險訊號",
        "input": "前一階段成果及本次原始資料",
        "output": "標記使用下降和未解決問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "改善方案",
        "ai": "產生教學、升級或續約提案草稿",
        "human": "核對服務能力、價格與承諾",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "改善方案",
        "input": "前一階段成果及本次原始資料",
        "output": "產生教學、升級或續約提案草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "關係經營",
        "ai": "整理追蹤紀錄與提醒",
        "human": "客戶經理親自協商及核准條款",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.33,
        "humanWorkShare": 0.6699999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "關係經營",
        "input": "前一階段成果及本次原始資料",
        "output": "整理追蹤紀錄與提醒；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "customer_success",
      "sales"
    ],
    "estimatedAiAssistShare": 0.6568,
    "input": "客戶經理確認資料解讀與隱私所需原始文件、資料及版本",
    "output": "整理追蹤紀錄與提醒及人工覆核紀錄",
    "boundary": "只計「客戶成功與續約」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次客戶成功與續約",
    "profiles": [
      "document"
    ],
    "cloneTag": "客戶成功與續約分身",
    "description": "本次工作：彙整服務紀錄、回饋及到期日；完成：整理追蹤紀錄與提醒。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次客戶成功與續約；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次客戶成功與續約；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次客戶成功與續約；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5389264,
    "status": "active"
  },
  "B24": {
    "id": "B24",
    "title": "開發專案全流程管理（舊版）",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求與範圍確認",
        "ai": "彙整需求、交付物、驗收條件與範圍差異",
        "human": "專案負責人確認需求、預算、期限及交付邊界",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.64,
        "humanWorkShare": 0.36,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求與範圍確認",
        "input": "專案負責人確認需求、預算、期限及交付邊界所需原始文件、資料及版本",
        "output": "彙整需求、交付物、驗收條件與範圍差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "工作拆解與排程",
        "ai": "草擬 WBS、任務相依、里程碑、資源與風險清單；依軟體或硬體專案選用適用項目",
        "human": "團隊核對工時、產能、採購交期與排程可行性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.72,
        "humanWorkShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "工作拆解與排程",
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 WBS、任務相依、里程碑、資源與風險清單；依軟體或硬體專案選用適用項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "進度、變更與風險追蹤",
        "ai": "彙整進度、阻塞、變更影響與待決策事項，生成週報草稿",
        "human": "專案經理協調衝突、決定取捨並核准變更",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "進度、變更與風險追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整進度、阻塞、變更影響與待決策事項，生成週報草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "驗收與交付準備",
        "ai": "整理驗收證據、未結事項、版本與交接清單",
        "human": "權責人驗證成果並核准交付、上線或階段放行",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.32,
        "humanWorkShare": 0.6799999999999999,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "驗收與交付準備",
        "input": "前一階段成果及本次原始資料",
        "output": "整理驗收證據、未結事項、版本與交接清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "project",
      "development"
    ],
    "estimatedAiAssistShare": 0.6108,
    "input": "專案負責人確認需求、預算、期限及交付邊界所需原始文件、資料及版本",
    "output": "整理驗收證據、未結事項、版本與交接清單及人工覆核紀錄",
    "boundary": "只計「開發專案規劃與進度追蹤」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次開發專案規劃與進度追蹤",
    "profiles": [
      "document"
    ],
    "cloneTag": "開發專案全流程管理（舊版）分身",
    "description": "本次工作：彙整需求、交付物、驗收條件與範圍差異；完成：整理驗收證據、未結事項、版本與交接清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次開發專案規劃與進度追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次開發專案規劃與進度追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次開發專案規劃與進度追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "P01",
      "P02",
      "P03",
      "P04",
      "PS01",
      "PS02",
      "PS03",
      "PS04",
      "PH01",
      "PH02",
      "PH03",
      "PH04"
    ],
    "estimatedRetainedHumanShare": 0.5712184,
    "status": "legacy-unassigned"
  },
  "B25": {
    "id": "B25",
    "title": "產品開發全流程協作（舊版）",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "產品問題與需求",
        "ai": "整理訪談、回饋與競品資料，區分使用者問題、解法與待驗證假設",
        "human": "產品負責人確認目標使用者、需求證據及商業價值",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "產品問題與需求",
        "input": "產品負責人確認目標使用者、需求證據及商業價值所需原始文件、資料及版本",
        "output": "整理訪談、回饋與競品資料，區分使用者問題、解法與待驗證假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "規格與驗收條件",
        "ai": "草擬 PRD、使用情境、功能與非功能需求及驗收條件；按產品類型整理軟體或硬體限制",
        "human": "產品與工程團隊核准規格、可行性、成本及需求取捨",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "規格與驗收條件",
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 PRD、使用情境、功能與非功能需求及驗收條件；按產品類型整理軟體或硬體限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "優先順序與變更",
        "ai": "比對需求版本、依賴與變更影響，整理開發待辦及決策紀錄",
        "human": "產品負責人決定優先順序，工程團隊確認開發代價",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "優先順序與變更",
        "input": "前一階段成果及本次原始資料",
        "output": "比對需求版本、依賴與變更影響，整理開發待辦及決策紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "需求驗證與規格定版",
        "ai": "建立需求到測試證據的對照，標記未達成與未驗證項",
        "human": "產品與工程權責人確認需求達成並核准規格基準",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.3,
        "humanWorkShare": 0.7,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求驗證與規格定版",
        "input": "前一階段成果及本次原始資料",
        "output": "建立需求到測試證據的對照，標記未達成與未驗證項；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "product",
      "requirements"
    ],
    "estimatedAiAssistShare": 0.5414,
    "input": "產品負責人確認目標使用者、需求證據及商業價值所需原始文件、資料及版本",
    "output": "建立需求到測試證據的對照，標記未達成與未驗證項及人工覆核紀錄",
    "boundary": "只計「產品需求與開發規格整理」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次產品需求與開發規格整理",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品開發全流程協作（舊版）分身",
    "description": "本次工作：整理訪談、回饋與競品資料，區分使用者問題、解法與待驗證假設；完成：建立需求到測試證據的對照，標記未達成與未驗證項。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次產品需求與開發規格整理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次產品需求與開發規格整理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次產品需求與開發規格整理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "PR01",
      "PR02",
      "PR03",
      "PR04"
    ],
    "estimatedRetainedHumanShare": 0.6199372000000001,
    "status": "legacy-unassigned"
  },
  "B26": {
    "id": "B26",
    "title": "硬體設計文件與 BOM 檢核",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "設計輸入與限制",
        "ai": "整理功能、電源、尺寸、介面與元件規格並附來源",
        "human": "工程師決定電路架構、設計限制與性能目標",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.55,
        "humanWorkShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計輸入與限制",
        "input": "工程師決定電路架構、設計限制與性能目標所需原始文件、資料及版本",
        "output": "整理功能、電源、尺寸、介面與元件規格並附來源；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "元件與設計文件比較",
        "ai": "比對資料表、BOM、電路圖清單與版本差異，提示料號或規格不一致",
        "human": "工程師查核元件適配、電路與佈局，不以文件比對代替設計驗證",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "元件與設計文件比較",
        "input": "前一階段成果及本次原始資料",
        "output": "比對資料表、BOM、電路圖清單與版本差異，提示料號或規格不一致；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "設計審查準備",
        "ai": "整理電源、訊號、熱、料件交期與替代料的待查清單",
        "human": "工程師執行設計審查、必要模擬與實際量測",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.38,
        "humanWorkShare": 0.62,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計審查準備",
        "input": "前一階段成果及本次原始資料",
        "output": "整理電源、訊號、熱、料件交期與替代料的待查清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "設計修訂與核准",
        "ai": "彙整修改原因、量測證據與版本紀錄",
        "human": "工程權責人核准電路、PCB、BOM 與設計放行",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.25,
        "humanWorkShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計修訂與核准",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整修改原因、量測證據與版本紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "hardware",
      "design"
    ],
    "estimatedAiAssistShare": 0.46440000000000003,
    "input": "工程師決定電路架構、設計限制與性能目標所需原始文件、資料及版本",
    "output": "彙整修改原因、量測證據與版本紀錄及人工覆核紀錄",
    "boundary": "只計「硬體設計文件與 BOM 檢核」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次硬體設計文件與 BOM 檢核",
    "profiles": [
      "document"
    ],
    "cloneTag": "硬體設計文件與 BOM 檢核分身",
    "description": "本次工作：整理功能、電源、尺寸、介面與元件規格並附來源；完成：彙整修改原因、量測證據與版本紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次硬體設計文件與 BOM 檢核；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次硬體設計文件與 BOM 檢核；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次硬體設計文件與 BOM 檢核；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.6739912,
    "status": "legacy-unassigned"
  },
  "B27": {
    "id": "B27",
    "title": "韌體與裝置介面開發協作",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "裝置需求與介面",
        "ai": "整理協定、暫存器、時序、狀態機與韌體需求",
        "human": "工程師確認晶片、硬體限制、啟動與安全要求",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.52,
        "humanWorkShare": 0.48,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "裝置需求與介面",
        "input": "工程師確認晶片、硬體限制、啟動與安全要求所需原始文件、資料及版本",
        "output": "整理協定、暫存器、時序、狀態機與韌體需求；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "程式與測試草稿",
        "ai": "依核准介面產生驅動、狀態機與測試程式草稿",
        "human": "工程師審查記憶體、時序、並行與錯誤處理",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.66,
        "humanWorkShare": 0.33999999999999997,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "程式與測試草稿",
        "input": "前一階段成果及本次原始資料",
        "output": "依核准介面產生驅動、狀態機與測試程式草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "紀錄檔分析與除錯",
        "ai": "關聯紀錄檔、錯誤碼與版本，提出重現及修正候選",
        "human": "工程師在目標板測試，量測即時性並驗證根因",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "紀錄檔分析與除錯",
        "input": "前一階段成果及本次原始資料",
        "output": "關聯紀錄檔、錯誤碼與版本，提出重現及修正候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "實機回歸與版本交付",
        "ai": "整理回歸結果、相容性矩陣與發布紀錄",
        "human": "工程師完成燒錄、實機與復原驗證後核准版本",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.24,
        "humanWorkShare": 0.76,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "實機回歸與版本交付",
        "input": "前一階段成果及本次原始資料",
        "output": "整理回歸結果、相容性矩陣與發布紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "firmware",
      "embedded"
    ],
    "estimatedAiAssistShare": 0.5032000000000001,
    "input": "工程師確認晶片、硬體限制、啟動與安全要求所需原始文件、資料及版本",
    "output": "整理回歸結果、相容性矩陣與發布紀錄及人工覆核紀錄",
    "boundary": "只計「韌體與裝置介面開發協作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次韌體與裝置介面開發協作",
    "profiles": [
      "document"
    ],
    "cloneTag": "韌體與裝置介面開發協作分身",
    "description": "本次工作：整理協定、暫存器、時序、狀態機與韌體需求；完成：整理回歸結果、相容性矩陣與發布紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次韌體與裝置介面開發協作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次韌體與裝置介面開發協作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次韌體與裝置介面開發協作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.6467536,
    "status": "legacy-unassigned"
  },
  "B28": {
    "id": "B28",
    "title": "測試規劃與缺陷分析",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "需求與風險分析",
        "ai": "整理需求、適用環境與失效情境，建立測試對照",
        "human": "測試人員決定測試策略、範圍與通過標準",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.62,
        "humanWorkShare": 0.38,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "需求與風險分析",
        "input": "測試人員決定測試策略、範圍與通過標準所需原始文件、資料及版本",
        "output": "整理需求、適用環境與失效情境，建立測試對照；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "案例與自動化腳本",
        "ai": "草擬正常、邊界、相容性與回歸案例，生成腳本候選",
        "human": "測試人員核對覆蓋率、設備條件與腳本正確性",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.76,
        "humanWorkShare": 0.24,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "案例與自動化腳本",
        "input": "前一階段成果及本次原始資料",
        "output": "草擬正常、邊界、相容性與回歸案例，生成腳本候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結果與缺陷整理",
        "ai": "彙整既有測試輸出，分類缺陷、重複問題與重現線索",
        "human": "測試人員實際執行測試、重現缺陷並確認影響",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結果與缺陷整理",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整既有測試輸出，分類缺陷、重複問題與重現線索；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "回歸與品質報告",
        "ai": "整理修復驗證、殘留風險與品質報告",
        "human": "品質權責人確認回歸證據並決定是否放行",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.3,
        "humanWorkShare": 0.7,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "回歸與品質報告",
        "input": "前一階段成果及本次原始資料",
        "output": "整理修復驗證、殘留風險與品質報告；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "qa",
      "verification"
    ],
    "estimatedAiAssistShare": 0.6016,
    "input": "測試人員決定測試策略、範圍與通過標準所需原始文件、資料及版本",
    "output": "整理修復驗證、殘留風險與品質報告及人工覆核紀錄",
    "boundary": "只計「測試規劃與缺陷分析」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次測試規劃與缺陷分析",
    "profiles": [
      "document"
    ],
    "cloneTag": "測試規劃與缺陷分析分身",
    "description": "本次工作：整理需求、適用環境與失效情境，建立測試對照；完成：整理修復驗證、殘留風險與品質報告。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次測試規劃與缺陷分析；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次測試規劃與缺陷分析；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次測試規劃與缺陷分析；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5776768,
    "status": "legacy-unassigned"
  },
  "B29": {
    "id": "B29",
    "title": "產品研究與概念驗證",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "研究問題與市場資料",
        "ai": "彙整使用者、競品、價格與回饋來源，草擬研究問題",
        "human": "研究或產品人員決定樣本、訪談方式與待驗證假設",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "研究問題與市場資料",
        "input": "研究或產品人員決定樣本、訪談方式與待驗證假設所需原始文件、資料及版本",
        "output": "彙整使用者、競品、價格與回饋來源，草擬研究問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "研究紀錄與洞察",
        "ai": "整理訪談逐字稿、痛點、需求模式與反例，保留來源",
        "human": "人員親自訪談或觀察，查核偏差並判斷洞察",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.7,
        "humanWorkShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "研究紀錄與洞察",
        "input": "前一階段成果及本次原始資料",
        "output": "整理訪談逐字稿、痛點、需求模式與反例，保留來源；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "概念方案與驗證計畫",
        "ai": "整理概念比較、使用情境、成本假設與驗證方案",
        "human": "團隊決定價值主張，製作必要原型並執行驗證",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "概念方案與驗證計畫",
        "input": "前一階段成果及本次原始資料",
        "output": "整理概念比較、使用情境、成本假設與驗證方案；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "結果與產品建議",
        "ai": "彙整驗證結果、證據強度與下一步建議",
        "human": "產品負責人決定是否投入開發及產品方向",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.35,
        "humanWorkShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "結果與產品建議",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整驗證結果、證據強度與下一步建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "product",
      "research"
    ],
    "estimatedAiAssistShare": 0.5700000000000001,
    "input": "研究或產品人員決定樣本、訪談方式與待驗證假設所需原始文件、資料及版本",
    "output": "彙整驗證結果、證據強度與下一步建議及人工覆核紀錄",
    "boundary": "只計「產品研究與概念驗證」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次產品研究與概念驗證",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品研究與概念驗證分身",
    "description": "本次工作：彙整使用者、競品、價格與回饋來源，草擬研究問題；完成：彙整驗證結果、證據強度與下一步建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次產品研究與概念驗證；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次產品研究與概念驗證；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次產品研究與概念驗證；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedRetainedHumanShare": 0.5998600000000001,
    "status": "legacy-unassigned"
  },
  "B30": {
    "id": "B30",
    "title": "機構與工業設計全流程（舊版）",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "設計需求與使用情境",
        "ai": "整理尺寸、外觀、人體工學、材料與裝配要求",
        "human": "設計師確認造型方向、結構目標及使用限制",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.48,
        "humanWorkShare": 0.52,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計需求與使用情境",
        "input": "設計師確認造型方向、結構目標及使用限制所需原始文件、資料及版本",
        "output": "整理尺寸、外觀、人體工學、材料與裝配要求；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "設計方案與文件",
        "ai": "整理概念方案、CAD 文件差異、材料與公差檢查清單",
        "human": "設計師完成造型或結構設計，工程師核准關鍵尺寸與公差",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.4,
        "humanWorkShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計方案與文件",
        "input": "前一階段成果及本次原始資料",
        "output": "整理概念方案、CAD 文件差異、材料與公差檢查清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "樣品與可製造性檢討",
        "ai": "彙整樣品回饋、裝配缺陷、模具與製程問題",
        "human": "人員實際檢查樣品、驗證強度及裝配，與製造端協調",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.28,
        "humanWorkShare": 0.72,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "樣品與可製造性檢討",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整樣品回饋、裝配缺陷、模具與製程問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "設計修訂與交付",
        "ai": "整理圖面版本、修改紀錄與驗證證據",
        "human": "設計及工程權責人核准圖面、材料、模具及設計交付",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.22,
        "humanWorkShare": 0.78,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "設計修訂與交付",
        "input": "前一階段成果及本次原始資料",
        "output": "整理圖面版本、修改紀錄與驗證證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "product",
      "mechanical",
      "industrial_design"
    ],
    "estimatedAiAssistShare": 0.3516,
    "input": "設計師確認造型方向、結構目標及使用限制所需原始文件、資料及版本",
    "output": "整理圖面版本、修改紀錄與驗證證據及人工覆核紀錄",
    "boundary": "只計「機構與工業設計開發協作」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次機構與工業設計開發協作",
    "profiles": [
      "document"
    ],
    "cloneTag": "機構與工業設計全流程（舊版）分身",
    "description": "本次工作：整理尺寸、外觀、人體工學、材料與裝配要求；完成：整理圖面版本、修改紀錄與驗證證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次機構與工業設計開發協作；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次機構與工業設計開發協作；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次機構與工業設計開發協作；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "ME01",
      "ME02",
      "ME03",
      "ME04",
      "ID01",
      "ID02",
      "ID03",
      "ID04"
    ],
    "estimatedRetainedHumanShare": 0.7531768,
    "status": "legacy-unassigned"
  },
  "B31": {
    "id": "B31",
    "title": "產品驗證與導入全流程（舊版）",
    "version": "2.0",
    "evidence": "expert-model-estimate",
    "stages": [
      {
        "phase": "驗證與交付計畫",
        "ai": "整理產品規格、驗證項目、試產或軟體發布條件及責任分工",
        "human": "產品、工程與品質團隊核准適用的驗證及放行標準",
        "ownership": "assist",
        "stageWorkShare": 0.22,
        "aiAssistShare": 0.6,
        "humanWorkShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "驗證與交付計畫",
        "input": "產品、工程與品質團隊核准適用的驗證及放行標準所需原始文件、資料及版本",
        "output": "整理產品規格、驗證項目、試產或軟體發布條件及責任分工；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "驗證結果與問題追蹤",
        "ai": "彙整性能、可靠度、相容性或回歸結果，追蹤缺陷與修正",
        "human": "人員執行實機測試或軟體驗證，查核結果並確認修正",
        "ownership": "assist",
        "stageWorkShare": 0.32,
        "aiAssistShare": 0.65,
        "humanWorkShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "驗證結果與問題追蹤",
        "input": "前一階段成果及本次原始資料",
        "output": "彙整性能、可靠度、相容性或回歸結果，追蹤缺陷與修正；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "試產或發布準備",
        "ai": "硬體彙整試產、良率與製程紀錄；軟體彙整版本、部署與回復計畫；整理支援文件",
        "human": "負責人確認實際製造或部署可行性、品質與必要法遵證據",
        "ownership": "assist",
        "stageWorkShare": 0.28,
        "aiAssistShare": 0.5,
        "humanWorkShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "試產或發布準備",
        "input": "前一階段成果及本次原始資料",
        "output": "硬體彙整試產、良率與製程紀錄；軟體彙整版本、部署與回復計畫；整理支援文件；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      },
      {
        "phase": "上市放行與改善",
        "ai": "整理放行清單、已知問題、售後或使用回饋",
        "human": "權責人核准上市或發布，承擔品質、服務與後續改善決策",
        "ownership": "human_gate",
        "stageWorkShare": 0.18,
        "aiAssistShare": 0.28,
        "humanWorkShare": 0.72,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "name": "上市放行與改善",
        "input": "前一階段成果及本次原始資料",
        "output": "整理放行清單、已知問題、售後或使用回饋；保留人工處置紀錄",
        "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
        "completion": "本階段產出經人工確認，異常已記錄與處置"
      }
    ],
    "tags": [
      "product",
      "npi",
      "release"
    ],
    "estimatedAiAssistShare": 0.5304,
    "input": "產品、工程與品質團隊核准適用的驗證及放行標準所需原始文件、資料及版本",
    "output": "整理放行清單、已知問題、售後或使用回饋及人工覆核紀錄",
    "boundary": "只計「產品驗證、試產與上市準備」本次執行；原始資料蒐集、會議、實作與成果如已計入其他任務，不再次計入。",
    "completion": "各階段成果經人工確認，例外已處理或列為未結事項並由權責人接受。",
    "exception": "缺資料、矛盾、驗證失敗或敏感事項交由人工查證、補件與記錄；實體操作由人員執行。",
    "manualMinutes": 90,
    "workUnit": "1 次產品驗證、試產與上市準備",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品驗證與導入全流程（舊版）分身",
    "description": "本次工作：整理產品規格、驗證項目、試產或軟體發布條件及責任分工；完成：整理放行清單、已知問題、售後或使用回饋。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次產品驗證、試產與上市準備；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次產品驗證、試產與上市準備；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次產品驗證、試產與上市準備；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "NP01",
      "NP02",
      "NP03",
      "NP04"
    ],
    "estimatedRetainedHumanShare": 0.6276592000000001,
    "status": "legacy-unassigned"
  },
  "C01": {
    "id": "C01",
    "title": "主視覺概念與版面設計",
    "input": "設計師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "交付核准的主視覺與版面原稿及人工覆核紀錄",
    "boundary": "不含 S05 尺寸延伸與輸出",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「主視覺概念與版面設計」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理品牌 brief、版型與授權素材",
        "human": "設計師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "設計師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理品牌 brief、版型與授權素材；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "草擬構圖、字級階層與版面候選",
        "human": "設計師實作與核准構圖、品牌及產品真實性",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬構圖、字級階層與版面候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對核准主視覺與版面原稿，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "設計師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對核准主視覺與版面原稿，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "交付核准的主視覺與版面原稿",
        "human": "設計師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "交付核准的主視覺與版面原稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "主視覺概念與版面設計分身",
    "description": "本次工作：依品牌 brief 與授權素材發想主視覺方向、排出版型；完成：交付核准的主視覺與版面原稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「主視覺概念與版面設計」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「主視覺概念與版面設計」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「主視覺概念與版面設計」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "C02": {
    "id": "C02",
    "title": "現場拍攝與素材紀錄",
    "input": "攝影師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "歸檔原始影像並附上鏡位紀錄及人工覆核紀錄",
    "boundary": "不含 S11 選片修圖",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「現場拍攝與素材紀錄」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整拍攝需求、場地、器材與授權",
        "human": "攝影師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "攝影師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整拍攝需求、場地、器材與授權；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理鏡位、燈光與拍攝清單",
        "human": "攝影師布光、操作相機、引導及現場安全",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.15,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理鏡位、燈光與拍攝清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.85
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對原始影像及鏡位紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "攝影師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對原始影像及鏡位紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "完成與交付確認",
        "ai": "歸檔原始影像並附上鏡位紀錄",
        "human": "攝影師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "歸檔原始影像並附上鏡位紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "現場拍攝與素材紀錄分身",
    "description": "本次工作：彙整拍攝需求、場地與器材，排定鏡位並確認授權；完成：歸檔原始影像並附上鏡位紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「現場拍攝與素材紀錄」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「現場拍攝與素材紀錄」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「現場拍攝與素材紀錄」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.1825,
    "estimatedRetainedHumanShare": 0.871885,
    "status": "active"
  },
  "C03": {
    "id": "C03",
    "title": "插畫與作品原稿製作",
    "input": "創作者先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "提交可供審核的插畫原稿及人工覆核紀錄",
    "boundary": "不含 S05 版本延伸",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「插畫與作品原稿製作」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理創作 brief、構圖與授權參考",
        "human": "創作者先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "創作者先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理創作 brief、構圖與授權參考；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "專業執行與候選產出",
        "ai": "提出構圖、配色與草圖候選",
        "human": "創作者完成繪製、原創性及風格把關",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出構圖、配色與草圖候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查可審核原稿，標出缺乏依據或前後矛盾之處",
        "human": "創作者回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查可審核原稿，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "完成與交付確認",
        "ai": "提交可供審核的插畫原稿",
        "human": "創作者確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提交可供審核的插畫原稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "插畫與作品原稿製作分身",
    "description": "本次工作：依創作 brief 與參考資料草擬構圖與線稿方向；完成：提交可供審核的插畫原稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「插畫與作品原稿製作」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「插畫與作品原稿製作」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「插畫與作品原稿製作」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3625,
    "estimatedRetainedHumanShare": 0.7455250000000001,
    "status": "active"
  },
  "C04": {
    "id": "C04",
    "title": "內容演出與原始素材拍攝",
    "input": "演出者確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "整理錄製素材並補上拍攝紀錄及人工覆核紀錄",
    "boundary": "不含 S04 文案、S02 剪輯與 S15 互動",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「內容演出與原始素材拍攝」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點已核准腳本與拍攝計畫",
        "human": "演出者確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.27,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "演出者確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點已核准腳本與拍攝計畫；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.73
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理分鏡、台詞提示及素材清單",
        "human": "本人演出、錄製、授權與現場處理",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.12,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理分鏡、台詞提示及素材清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.88
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對錄製素材及拍攝紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "演出者針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.22,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對錄製素材及拍攝紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.78
      },
      {
        "name": "完成與交付確認",
        "ai": "整理錄製素材並補上拍攝紀錄",
        "human": "演出者核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理錄製素材並補上拍攝紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "內容演出與原始素材拍攝分身",
    "description": "本次工作：對照已核准腳本拆解場次與拍攝順序；完成：整理錄製素材並補上拍攝紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「內容演出與原始素材拍攝」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「內容演出與原始素材拍攝」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「內容演出與原始素材拍攝」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.1555,
    "estimatedRetainedHumanShare": 0.890839,
    "status": "active"
  },
  "C05": {
    "id": "C05",
    "title": "網站搜尋技術檢核",
    "input": "工程人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "列出技術缺陷並驗證修正結果及人工覆核紀錄",
    "boundary": "不含 S13 內容企劃",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「網站搜尋技術檢核」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理網站爬取、索引紀錄與網址清單",
        "human": "工程人員核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "工程人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理網站爬取、索引紀錄與網址清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "檢查索引、canonical、結構化資料及錯誤連結",
        "human": "工程人員驗證改動與正式發布",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "檢查索引、canonical、結構化資料及錯誤連結；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對技術缺陷與修正驗證清單與原始資料，標示待釐清與不一致的地方",
        "human": "工程人員查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對技術缺陷與修正驗證清單與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "列出技術缺陷並驗證修正結果",
        "human": "工程人員做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "列出技術缺陷並驗證修正結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "網站搜尋技術檢核分身",
    "description": "本次工作：檢視網站爬取與索引紀錄，找出收錄與網址問題；完成：列出技術缺陷並驗證修正結果。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「網站搜尋技術檢核」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「網站搜尋技術檢核」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「網站搜尋技術檢核」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5525,
    "estimatedRetainedHumanShare": 0.612145,
    "status": "active"
  },
  "C06": {
    "id": "C06",
    "title": "品牌定位與活動企劃",
    "input": "企劃先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "提出定位與活動方案供企劃決策及人工覆核紀錄",
    "boundary": "不含 S04 文案、S14 實際投放",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「品牌定位與活動企劃」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整品牌目標、受眾與市場證據",
        "human": "企劃先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "企劃先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整品牌目標、受眾與市場證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比較主張、草擬活動機制與資源方案",
        "human": "企劃決定定位、預算與活動責任",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比較主張、草擬活動機制與資源方案；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查定位與活動方案，標出缺乏依據或前後矛盾之處",
        "human": "企劃回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查定位與活動方案，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "提出定位與活動方案供企劃決策",
        "human": "企劃確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出定位與活動方案供企劃決策；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "品牌定位與活動企劃分身",
    "description": "本次工作：歸納品牌目標、受眾與市場證據，比較定位主張；完成：提出定位與活動方案供企劃決策。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「品牌定位與活動企劃」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「品牌定位與活動企劃」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「品牌定位與活動企劃」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "C07": {
    "id": "C07",
    "title": "行政排程與文件送件",
    "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "確認排程並留下送件紀錄及人工覆核紀錄",
    "boundary": "不含 B08 會議紀錄與 B07 請款",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 45.0,
    "workUnit": "1 次「行政排程與文件送件」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理行事曆需求、收件規則與文件",
        "human": "承辦人員確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "蒐集並整理行事曆需求、收件規則與文件；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對空檔、整理附件及提醒草稿",
        "human": "人員協商排程、保密與正式送件",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對空檔、整理附件及提醒草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對確認排程與送件紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "承辦人員針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對確認排程與送件紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "確認排程並留下送件紀錄",
        "human": "承辦人員核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確認排程並留下送件紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "行政排程與文件送件分身",
    "description": "本次工作：比對行事曆、收件規則與待送文件，排出送件時程；完成：確認排程並留下送件紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「行政排程與文件送件」；少量",
        "manualMinutes": 27.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「行政排程與文件送件」；參考量",
        "manualMinutes": 45.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「行政排程與文件送件」；大量",
        "manualMinutes": 112.5,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "C08": {
    "id": "C08",
    "title": "授課互動與正式學習評量",
    "input": "教師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "彙整授課紀錄與正式回饋或成績及人工覆核紀錄",
    "boundary": "不含 E02 備課、E03 格式檢核、E15 個別回饋準備",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「授課互動與正式學習評量」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點教案、學習表現與評量規準",
        "human": "教師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.32999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "教師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "盤點教案、學習表現與評量規準；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.67
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理課堂提問候選與評量證據",
        "human": "教師親自授課、觀察、輔導及核定評量",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.18,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理課堂提問候選與評量證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8200000000000001
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對授課紀錄及正式回饋或成績與原始資料，標示待釐清與不一致的地方",
        "human": "教師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.28,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對授課紀錄及正式回饋或成績與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.72
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整授課紀錄與正式回饋或成績",
        "human": "教師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整授課紀錄與正式回饋或成績；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "授課互動與正式學習評量分身",
    "description": "本次工作：依教案與評量規準記錄課堂表現、草擬回饋；完成：彙整授課紀錄與正式回饋或成績。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「授課互動與正式學習評量」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「授課互動與正式學習評量」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「授課互動與正式學習評量」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.20950000000000002,
    "estimatedRetainedHumanShare": 0.8529310000000001,
    "status": "active"
  },
  "C09": {
    "id": "C09",
    "title": "設備操作與安全示範",
    "input": "技術人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "記錄實作過程與安全檢查結果及人工覆核紀錄",
    "boundary": "不含 E21 庫存管理、E11 研究設計",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「設備操作與安全示範」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理設備手冊、安全規範與操作目的",
        "human": "技術人員先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "技術人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "整理設備手冊、安全規範與操作目的；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "專業執行與候選產出",
        "ai": "生成操作與危害檢查清單",
        "human": "技術人員實際操作、示範、排除危險及停機決策",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.15,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "生成操作與危害檢查清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.85
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查實作及安全檢查紀錄，標出缺乏依據或前後矛盾之處",
        "human": "技術人員回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查實作及安全檢查紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "完成與交付確認",
        "ai": "記錄實作過程與安全檢查結果",
        "human": "技術人員確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "記錄實作過程與安全檢查結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "設備操作與安全示範分身",
    "description": "本次工作：依設備手冊與安全規範準備示範步驟與檢查點；完成：記錄實作過程與安全檢查結果。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「設備操作與安全示範」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「設備操作與安全示範」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「設備操作與安全示範」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.1825,
    "estimatedRetainedHumanShare": 0.871885,
    "status": "active"
  },
  "C10": {
    "id": "C10",
    "title": "招生宣傳與諮詢整理",
    "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "整理宣傳草稿與諮詢回覆紀錄及人工覆核紀錄",
    "boundary": "不含 E19 學籍資料登錄",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 60.0,
    "workUnit": "1 次「招生宣傳與諮詢整理」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整核准招生簡章、詢問與管道",
        "human": "承辦人員確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "彙整核准招生簡章、詢問與管道；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "草擬宣傳、比對資格及整理 FAQ",
        "human": "人員核對公平性、回覆及正式資格核定",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬宣傳、比對資格及整理 FAQ；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對宣傳草稿及諮詢紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "承辦人員針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對宣傳草稿及諮詢紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "整理宣傳草稿與諮詢回覆紀錄",
        "human": "承辦人員核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理宣傳草稿與諮詢回覆紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "招生宣傳與諮詢整理分身",
    "description": "本次工作：依核准簡章草擬宣傳內容，分類各管道的詢問；完成：整理宣傳草稿與諮詢回覆紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「招生宣傳與諮詢整理」；少量",
        "manualMinutes": 36.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「招生宣傳與諮詢整理」；參考量",
        "manualMinutes": 60.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「招生宣傳與諮詢整理」；大量",
        "manualMinutes": 150.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5525,
    "estimatedRetainedHumanShare": 0.612145,
    "status": "active"
  },
  "C11": {
    "id": "C11",
    "title": "學生支持與輔導案件追蹤",
    "input": "輔導人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "更新經人工確認的輔導與轉介紀錄及人工覆核紀錄",
    "boundary": "不含 E20 活動行政",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「學生支持與輔導案件追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理授權個案、服務紀錄與校內規範",
        "human": "輔導人員核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "輔導人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "蒐集並整理授權個案、服務紀錄與校內規範；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理時間線、提醒及資源索引",
        "human": "專業人員面談、危機處置、轉介及個資保護",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理時間線、提醒及資源索引；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對人工確認的支持與轉介紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "輔導人員查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對人工確認的支持與轉介紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "完成與交付確認",
        "ai": "更新經人工確認的輔導與轉介紀錄",
        "human": "輔導人員做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新經人工確認的輔導與轉介紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "學生支持與輔導案件追蹤分身",
    "description": "本次工作：在授權範圍內彙整個案與服務紀錄，對照校內規範；完成：更新經人工確認的輔導與轉介紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「學生支持與輔導案件追蹤」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「學生支持與輔導案件追蹤」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「學生支持與輔導案件追蹤」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.22750000000000004,
    "estimatedRetainedHumanShare": 0.8402950000000001,
    "status": "active"
  },
  "R01": {
    "id": "R01",
    "title": "研究計畫與經費進度管理",
    "input": "計畫主持人先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "產出進度與經費差異報告及人工覆核紀錄",
    "boundary": "不含 E10 撰寫、E11 實驗工時",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「研究計畫與經費進度管理」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准研究計畫、經費與里程碑",
        "human": "計畫主持人先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "計畫主持人先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "盤點核准研究計畫、經費與里程碑；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "對照里程碑與支出、標示延誤與缺件",
        "human": "主持人負責研究方向、倫理、經費及人員決策",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照里程碑與支出、標示延誤與缺件；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查研究進度及經費差異報告，標出缺乏依據或前後矛盾之處",
        "human": "計畫主持人回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查研究進度及經費差異報告，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "產出進度與經費差異報告",
        "human": "計畫主持人確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產出進度與經費差異報告；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "研究計畫與經費進度管理分身",
    "description": "本次工作：對照核准計畫追蹤里程碑與經費動支；完成：產出進度與經費差異報告。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「研究計畫與經費進度管理」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「研究計畫與經費進度管理」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「研究計畫與經費進度管理」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "A01": {
    "id": "A01",
    "title": "資料清理與品質檢核",
    "input": "分析師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "交付可追溯的清理資料與品質報告及人工覆核紀錄",
    "boundary": "不含 A02 分析與 A03 儀表板",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「資料清理與品質檢核」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理資料集、欄位字典與規則",
        "human": "分析師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "分析師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理資料集、欄位字典與規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "檢查缺值、重複與型態、生成轉換草稿",
        "human": "分析師核准處理規則並驗證資料",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.7,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "檢查缺值、重複與型態、生成轉換草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.30000000000000004
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對可追溯清理資料與品質報告，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "分析師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對可追溯清理資料與品質報告，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "交付可追溯的清理資料與品質報告",
        "human": "分析師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "交付可追溯的清理資料與品質報告；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "資料清理與品質檢核分身",
    "description": "本次工作：依欄位字典與規則檢查資料集的缺漏、重複與異常；完成：交付可追溯的清理資料與品質報告。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「資料清理與品質檢核」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「資料清理與品質檢核」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「資料清理與品質檢核」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S19"
    ],
    "estimatedAiAssistShare": 0.6075,
    "estimatedRetainedHumanShare": 0.573535,
    "status": "active"
  },
  "A02": {
    "id": "A02",
    "title": "統計分析與洞察解讀",
    "input": "分析師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "說明分析發現並標明假設與限制及人工覆核紀錄",
    "boundary": "不含 A01 清理與 A03 持續報表",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「統計分析與洞察解讀」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整已清理資料與分析問題",
        "human": "分析師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "分析師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整已清理資料與分析問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "執行指定分析、整理反例與敏感度結果",
        "human": "分析師選方法、判斷因果及結論",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "執行指定分析、整理反例與敏感度結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對分析結果與假設限制與原始資料，標示待釐清與不一致的地方",
        "human": "分析師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對分析結果與假設限制與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "說明分析發現並標明假設與限制",
        "human": "分析師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "說明分析發現並標明假設與限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "統計分析與洞察解讀分身",
    "description": "本次工作：針對分析問題選擇方法、跑出統計結果；完成：說明分析發現並標明假設與限制。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「統計分析與洞察解讀」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「統計分析與洞察解讀」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「統計分析與洞察解讀」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S19"
    ],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "A03": {
    "id": "A03",
    "title": "儀表板與指標報表維護",
    "input": "分析師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "發布驗證後的儀表板與更新紀錄及人工覆核紀錄",
    "boundary": "不含 A02 探索分析",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「儀表板與指標報表維護」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理核准指標、資料來源與圖表規格",
        "human": "分析師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "分析師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理核准指標、資料來源與圖表規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "草擬查詢、圖表與資料更新檢查",
        "human": "分析師核對指標定義、權限及發布",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬查詢、圖表與資料更新檢查；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查驗證後儀表板及更新紀錄，標出缺乏依據或前後矛盾之處",
        "human": "分析師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查驗證後儀表板及更新紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "發布驗證後的儀表板與更新紀錄",
        "human": "分析師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "發布驗證後的儀表板與更新紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "儀表板與指標報表維護分身",
    "description": "本次工作：依核准指標與資料來源更新圖表並檢查數字；完成：發布驗證後的儀表板與更新紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「儀表板與指標報表維護」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「儀表板與指標報表維護」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「儀表板與指標報表維護」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S19"
    ],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "D01": {
    "id": "D01",
    "title": "軟體架構與介面設計",
    "input": "工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "定出架構、介面契約與決策紀錄及人工覆核紀錄",
    "boundary": "不含 D02 寫碼、D03 測試",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「軟體架構與介面設計」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准需求、既有系統與非功能限制",
        "human": "工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點核准需求、既有系統與非功能限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比較架構、提示相依及風險、草擬介面",
        "human": "工程師決定架構、安全、成本及效能取捨",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比較架構、提示相依及風險、草擬介面；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對架構方案、介面契約及決策紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對架構方案、介面契約及決策紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "定出架構、介面契約與決策紀錄",
        "human": "工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "定出架構、介面契約與決策紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "軟體架構與介面設計分身",
    "description": "本次工作：分析需求、既有系統與非功能限制，比較架構方案；完成：定出架構、介面契約與決策紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「軟體架構與介面設計」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「軟體架構與介面設計」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「軟體架構與介面設計」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S08"
    ],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "D02": {
    "id": "D02",
    "title": "軟體功能程式開發",
    "input": "工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "提交可供審查的程式差異及人工覆核紀錄",
    "boundary": "不含 D03 除錯測試、D04 部署",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「軟體功能程式開發」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理已確認介面與驗收規格",
        "human": "工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理已確認介面與驗收規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "產生功能程式、註解及局部重構草稿",
        "human": "工程師實作、審查安全與程式正確性",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產生功能程式、註解及局部重構草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對可審查程式差異與原始資料，標示待釐清與不一致的地方",
        "human": "工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對可審查程式差異與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "提交可供審查的程式差異",
        "human": "工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提交可供審查的程式差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "軟體功能程式開發分身",
    "description": "本次工作：依確認的介面與驗收規格撰寫功能程式；完成：提交可供審查的程式差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「軟體功能程式開發」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「軟體功能程式開發」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「軟體功能程式開發」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S08"
    ],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "D03": {
    "id": "D03",
    "title": "軟體除錯與測試",
    "input": "工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "附上修正、測試與回歸證據及人工覆核紀錄",
    "boundary": "不含 D02 新功能開發、QA 獨立驗證工時",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「軟體除錯與測試」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整程式版本、失敗案例與測試規格",
        "human": "工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整程式版本、失敗案例與測試規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "生成案例、分析堆疊、提出修正候選",
        "human": "工程師重現問題、執行測試與確認根因",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "生成案例、分析堆疊、提出修正候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查缺陷修正、測試與回歸證據，標出缺乏依據或前後矛盾之處",
        "human": "工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查缺陷修正、測試與回歸證據，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "附上修正、測試與回歸證據",
        "human": "工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "附上修正、測試與回歸證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "軟體除錯與測試分身",
    "description": "本次工作：從失敗案例與測試規格追查錯誤、提出修正；完成：附上修正、測試與回歸證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「軟體除錯與測試」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「軟體除錯與測試」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「軟體除錯與測試」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S08"
    ],
    "estimatedAiAssistShare": 0.5525,
    "estimatedRetainedHumanShare": 0.612145,
    "status": "active"
  },
  "D04": {
    "id": "D04",
    "title": "軟體版本與部署交付",
    "input": "發布負責人確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "完成版本紀錄與部署交接證據及人工覆核紀錄",
    "boundary": "不含 P04 專案驗收文件",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「軟體版本與部署交付」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理已驗證版本、環境與回復規則",
        "human": "發布負責人確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "發布負責人確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "蒐集並整理已驗證版本、環境與回復規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理版本差異、部署與回復清單",
        "human": "人員核准發布、操作環境與處理事故",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理版本差異、部署與回復清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對版本紀錄及部署交接證據，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "發布負責人針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對版本紀錄及部署交接證據，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "完成版本紀錄與部署交接證據",
        "human": "發布負責人核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "完成版本紀錄與部署交接證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "軟體版本與部署交付分身",
    "description": "本次工作：核對已驗證版本、環境設定與回復規則；完成：完成版本紀錄與部署交接證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「軟體版本與部署交付」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「軟體版本與部署交付」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「軟體版本與部署交付」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "S08"
    ],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "FW01": {
    "id": "FW01",
    "title": "韌體介面與驅動設計",
    "input": "韌體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "寫出介面契約與驅動設計文件及人工覆核紀錄",
    "boundary": "不含 FW02 控制邏輯實作",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「韌體介面與驅動設計」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點晶片手冊、腳位、匯流排與目標板規格",
        "human": "韌體工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "韌體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "盤點晶片手冊、腳位、匯流排與目標板規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "查對暫存器、整理介面及驅動草稿",
        "human": "工程師確認電氣、時序、DMA 與中斷限制",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "查對暫存器、整理介面及驅動草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對介面契約及驅動設計與原始資料，標示待釐清與不一致的地方",
        "human": "韌體工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對介面契約及驅動設計與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "寫出介面契約與驅動設計文件",
        "human": "韌體工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "寫出介面契約與驅動設計文件；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "韌體介面與驅動設計分身",
    "description": "本次工作：研讀晶片手冊、腳位與匯流排規格，規劃驅動介面；完成：寫出介面契約與驅動設計文件。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「韌體介面與驅動設計」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「韌體介面與驅動設計」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「韌體介面與驅動設計」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "FW02": {
    "id": "FW02",
    "title": "韌體控制邏輯開發",
    "input": "韌體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "交付韌體程式與狀態轉移紀錄及人工覆核紀錄",
    "boundary": "不含 FW03 板上除錯",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「韌體控制邏輯開發」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理核准狀態機、驅動與控制規格",
        "human": "韌體工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "韌體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "整理核准狀態機、驅動與控制規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "草擬狀態機、控制邏輯與邊界檢查",
        "human": "工程師確認即時性、記憶體與安全行為",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬狀態機、控制邏輯與邊界檢查；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查韌體程式及狀態轉移紀錄，標出缺乏依據或前後矛盾之處",
        "human": "韌體工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查韌體程式及狀態轉移紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "交付韌體程式與狀態轉移紀錄",
        "human": "韌體工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "交付韌體程式與狀態轉移紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "韌體控制邏輯開發分身",
    "description": "本次工作：依核准的狀態機與控制規格實作韌體邏輯；完成：交付韌體程式與狀態轉移紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「韌體控制邏輯開發」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「韌體控制邏輯開發」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「韌體控制邏輯開發」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "FW03": {
    "id": "FW03",
    "title": "目標板除錯與量測",
    "input": "韌體工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "記錄量測結果並寫下根因分析及人工覆核紀錄",
    "boundary": "不含 FW04 已修正版回歸",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 150.0,
    "workUnit": "1 次「目標板除錯與量測」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整電路板、韌體版本與故障症狀",
        "human": "韌體工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "韌體工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "彙整電路板、韌體版本與故障症狀；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "專業執行與候選產出",
        "ai": "分析 trace、log 與量測資料、提出驗證假設",
        "human": "工程師接線、燒錄、示波量測與判定根因",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "分析 trace、log 與量測資料、提出驗證假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對量測、追蹤及根因紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "韌體工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對量測、追蹤及根因紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "完成與交付確認",
        "ai": "記錄量測結果並寫下根因分析",
        "human": "韌體工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "記錄量測結果並寫下根因分析；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "目標板除錯與量測分身",
    "description": "本次工作：依電路板、韌體版本與故障症狀安排量測與追蹤；完成：記錄量測結果並寫下根因分析。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「目標板除錯與量測」；少量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「目標板除錯與量測」；參考量",
        "manualMinutes": 150.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「目標板除錯與量測」；大量",
        "manualMinutes": 375.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.2725,
    "estimatedRetainedHumanShare": 0.808705,
    "status": "active"
  },
  "FW04": {
    "id": "FW04",
    "title": "韌體實機回歸與交付",
    "input": "韌體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "彙整實機回歸結果與燒錄交付紀錄及人工覆核紀錄",
    "boundary": "不含 FW03 根因調查",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「韌體實機回歸與交付」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理修正版本、硬體矩陣與測試清單",
        "human": "韌體工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "韌體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "蒐集並整理修正版本、硬體矩陣與測試清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "專業執行與候選產出",
        "ai": "生成回歸矩陣、彙整測試與版本差異",
        "human": "工程師實際回歸、確認裝置安全與放行",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "生成回歸矩陣、彙整測試與版本差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對實機回歸與燒錄交付紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "韌體工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對實機回歸與燒錄交付紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整實機回歸結果與燒錄交付紀錄",
        "human": "韌體工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整實機回歸結果與燒錄交付紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "韌體實機回歸與交付分身",
    "description": "本次工作：用修正版本跑過硬體矩陣與測試清單；完成：彙整實機回歸結果與燒錄交付紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「韌體實機回歸與交付」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「韌體實機回歸與交付」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「韌體實機回歸與交付」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3175,
    "estimatedRetainedHumanShare": 0.7771149999999999,
    "status": "active"
  },
  "HW01": {
    "id": "HW01",
    "title": "電路設計與設計檢核",
    "input": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "產出電路圖與設計檢核紀錄及人工覆核紀錄",
    "boundary": "不含 HW02 元件 BOM 整理",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「電路設計與設計檢核」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點電氣規格、元件手冊與設計限制",
        "human": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "盤點電氣規格、元件手冊與設計限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對額定值、提示連線與設計規則疑點",
        "human": "工程師設計電路、PCB 與安全放行",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對額定值、提示連線與設計規則疑點；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查電路圖與設計檢核紀錄，標出缺乏依據或前後矛盾之處",
        "human": "硬體工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查電路圖與設計檢核紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "完成與交付確認",
        "ai": "產出電路圖與設計檢核紀錄",
        "human": "硬體工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產出電路圖與設計檢核紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "電路設計與設計檢核分身",
    "description": "本次工作：依電氣規格與元件手冊繪製並檢查電路；完成：產出電路圖與設計檢核紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「電路設計與設計檢核」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「電路設計與設計檢核」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「電路設計與設計檢核」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3175,
    "estimatedRetainedHumanShare": 0.7771149999999999,
    "status": "active"
  },
  "HW02": {
    "id": "HW02",
    "title": "元件選用與 BOM 維護",
    "input": "硬體工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "更新 BOM 版本並附上選用比較及人工覆核紀錄",
    "boundary": "不含 B11 商務採購、HW01 電路",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「元件選用與 BOM 維護」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理核准電路、料件規格與替代料",
        "human": "硬體工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "硬體工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理核准電路、料件規格與替代料；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對封裝、參數、生命周期與 BOM 差異",
        "human": "工程師確認料件相容性及實體驗證需求",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對封裝、參數、生命周期與 BOM 差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對BOM 版本及選用比較，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "硬體工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對BOM 版本及選用比較，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "更新 BOM 版本並附上選用比較",
        "human": "硬體工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新 BOM 版本並附上選用比較；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "元件選用與 BOM 維護分身",
    "description": "本次工作：比對料件規格、供貨狀況與替代料；完成：更新 BOM 版本並附上選用比較。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「元件選用與 BOM 維護」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「元件選用與 BOM 維護」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「元件選用與 BOM 維護」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "HW03": {
    "id": "HW03",
    "title": "硬體打樣與樣品問題追蹤",
    "input": "硬體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "列出打樣問題與對應的修正紀錄及人工覆核紀錄",
    "boundary": "不含 HW04 量測驗證、NP01 試產",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「硬體打樣與樣品問題追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整設計版次、打樣訂單與樣品",
        "human": "硬體工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "硬體工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整設計版次、打樣訂單與樣品；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理版次、樣品追溯與問題相依",
        "human": "工程師檢查樣品、安排重工與決定修正",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理版次、樣品追溯與問題相依；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對打樣問題清單及修正紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "硬體工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對打樣問題清單及修正紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "完成與交付確認",
        "ai": "列出打樣問題與對應的修正紀錄",
        "human": "硬體工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "列出打樣問題與對應的修正紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "硬體打樣與樣品問題追蹤分身",
    "description": "本次工作：追蹤設計版次、打樣訂單與樣品狀態；完成：列出打樣問題與對應的修正紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「硬體打樣與樣品問題追蹤」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「硬體打樣與樣品問題追蹤」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「硬體打樣與樣品問題追蹤」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.2725,
    "estimatedRetainedHumanShare": 0.808705,
    "status": "active"
  },
  "HW04": {
    "id": "HW04",
    "title": "硬體量測與設計驗證",
    "input": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "彙整性能、安全與可靠度的量測證據及人工覆核紀錄",
    "boundary": "不含 HW03 樣品組裝與追蹤",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「硬體量測與設計驗證」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理樣品、量測規範與設備",
        "human": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "硬體工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理樣品、量測規範與設備；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理測試清單、分析波形與數據異常",
        "human": "工程師接線、操作儀器、查證與核准設計",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理測試清單、分析波形與數據異常；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查性能、安全與可靠度量測證據，標出缺乏依據或前後矛盾之處",
        "human": "硬體工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查性能、安全與可靠度量測證據，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整性能、安全與可靠度的量測證據",
        "human": "硬體工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整性能、安全與可靠度的量測證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "硬體量測與設計驗證分身",
    "description": "本次工作：依量測規範安排樣品測試與設備；完成：彙整性能、安全與可靠度的量測證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「硬體量測與設計驗證」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「硬體量測與設計驗證」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「硬體量測與設計驗證」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.22750000000000004,
    "estimatedRetainedHumanShare": 0.8402950000000001,
    "status": "active"
  },
  "PR01": {
    "id": "PR01",
    "title": "產品價值與問題定義",
    "input": "產品經理確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "寫出問題陳述、價值假設與成功指標及人工覆核紀錄",
    "boundary": "不含 PP01 定位提案或 S09 訪談執行",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「產品價值與問題定義」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點使用者證據、商業目標與限制",
        "human": "產品經理確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品經理確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點使用者證據、商業目標與限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "聚合回饋、找反例與草擬指標",
        "human": "產品經理選擇問題、判斷價值及商業方向",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "聚合回饋、找反例與草擬指標；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對問題陳述、價值假設及成功指標，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "產品經理針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對問題陳述、價值假設及成功指標，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "寫出問題陳述、價值假設與成功指標",
        "human": "產品經理核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "寫出問題陳述、價值假設與成功指標；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品價值與問題定義分身",
    "description": "本次工作：從使用者證據與商業目標釐清要解決的問題；完成：寫出問題陳述、價值假設與成功指標。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品價值與問題定義」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品價值與問題定義」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品價值與問題定義」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B25"
    ],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "PR02": {
    "id": "PR02",
    "title": "產品需求取捨與路線圖",
    "input": "產品經理核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "排出需求順序、路線圖並記錄取捨理由及人工覆核紀錄",
    "boundary": "不含 P02 排程與 PR03 協調會議",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「產品需求取捨與路線圖」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理已定義問題、需求清單與資源限制",
        "human": "產品經理核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品經理核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理已定義問題、需求清單與資源限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比較價值成本、標示相依與草擬情境",
        "human": "產品經理決定優先順序、範圍與路線圖",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比較價值成本、標示相依與草擬情境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對排序需求、路線圖與取捨紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "產品經理查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對排序需求、路線圖與取捨紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "排出需求順序、路線圖並記錄取捨理由",
        "human": "產品經理做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "排出需求順序、路線圖並記錄取捨理由；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品需求取捨與路線圖分身",
    "description": "本次工作：權衡需求清單、資源限制與優先順序；完成：排出需求順序、路線圖並記錄取捨理由。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品需求取捨與路線圖」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品需求取捨與路線圖」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品需求取捨與路線圖」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B25"
    ],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "PR03": {
    "id": "PR03",
    "title": "產品開發協調與需求澄清",
    "input": "產品經理先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "整理澄清決議、驗收準則與待辦事項及人工覆核紀錄",
    "boundary": "只計產品澄清工作，不重算 P03 同場會議",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「產品開發協調與需求澄清」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整核准需求、工程問題與設計稿",
        "human": "產品經理先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品經理先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整核准需求、工程問題與設計稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對需求版本、彙整疑問與決策事項",
        "human": "產品經理與工程、設計協商並確認取捨",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對需求版本、彙整疑問與決策事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查澄清決議、產品驗收準則及待辦，標出缺乏依據或前後矛盾之處",
        "human": "產品經理回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查澄清決議、產品驗收準則及待辦，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "整理澄清決議、驗收準則與待辦事項",
        "human": "產品經理確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理澄清決議、驗收準則與待辦事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品開發協調與需求澄清分身",
    "description": "本次工作：彙整工程提問與設計稿，釐清需求細節；完成：整理澄清決議、驗收準則與待辦事項。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品開發協調與需求澄清」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品開發協調與需求澄清」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品開發協調與需求澄清」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B25"
    ],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "PR04": {
    "id": "PR04",
    "title": "產品成效追蹤與迭代",
    "input": "產品經理確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "提出成效評估與下一輪迭代建議及人工覆核紀錄",
    "boundary": "不含 PR02 下次路線圖規劃",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「產品成效追蹤與迭代」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理發布後指標、使用回饋與目標",
        "human": "產品經理確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品經理確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "蒐集並整理發布後指標、使用回饋與目標；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "彙整指標、分類回饋與提示偏差",
        "human": "產品經理判斷迭代方向與實驗限制",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整指標、分類回饋與提示偏差；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對成效評估與迭代建議，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "產品經理針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對成效評估與迭代建議，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "提出成效評估與下一輪迭代建議",
        "human": "產品經理核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出成效評估與下一輪迭代建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品成效追蹤與迭代分身",
    "description": "本次工作：追蹤發布後指標與使用回饋，對照原定目標；完成：提出成效評估與下一輪迭代建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品成效追蹤與迭代」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品成效追蹤與迭代」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品成效追蹤與迭代」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B25"
    ],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "PP01": {
    "id": "PP01",
    "title": "產品定位與規格組合企劃",
    "input": "產品企劃核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "提出產品定位與規格組合方案及人工覆核紀錄",
    "boundary": "不含 S16 市場蒐集",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「產品定位與規格組合企劃」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點市場證據、受眾與產品限制",
        "human": "產品企劃核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品企劃核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "盤點市場證據、受眾與產品限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比較定位、規格與成本情境",
        "human": "企劃選定位、規格及可行性假設",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比較定位、規格與成本情境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對定位與規格組合方案與原始資料，標示待釐清與不一致的地方",
        "human": "產品企劃查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對定位與規格組合方案與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "提出產品定位與規格組合方案",
        "human": "產品企劃做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出產品定位與規格組合方案；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品定位與規格組合企劃分身",
    "description": "本次工作：依市場證據、受眾與產品限制比較規格組合；完成：提出產品定位與規格組合方案。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品定位與規格組合企劃」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品定位與規格組合企劃」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品定位與規格組合企劃」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4975,
    "estimatedRetainedHumanShare": 0.6507550000000001,
    "status": "active"
  },
  "PP02": {
    "id": "PP02",
    "title": "產品提案與商業可行性整理",
    "input": "產品企劃先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "完成產品提案與假設表及人工覆核紀錄",
    "boundary": "不含 PP01 定位、PR02 路線圖決策",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「產品提案與商業可行性整理」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理定位方案、估算成本與銷售假設",
        "human": "產品企劃先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品企劃先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "整理定位方案、估算成本與銷售假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "產生提案、情境試算與待查證項",
        "human": "企劃查證假設並負責提案結論",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產生提案、情境試算與待查證項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查產品提案與假設表，標出缺乏依據或前後矛盾之處",
        "human": "產品企劃回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查產品提案與假設表，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "完成產品提案與假設表",
        "human": "產品企劃確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "完成產品提案與假設表；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品提案與商業可行性整理分身",
    "description": "本次工作：估算成本與銷售假設，檢視商業可行性；完成：完成產品提案與假設表。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品提案與商業可行性整理」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品提案與商業可行性整理」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品提案與商業可行性整理」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "PP03": {
    "id": "PP03",
    "title": "產品規格與提案版本維護",
    "input": "產品企劃確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "更新規格表並記錄差異與一致性及人工覆核紀錄",
    "boundary": "不含工程實作與 PR03 會議",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 60.0,
    "workUnit": "1 次「產品規格與提案版本維護」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整核准提案、規格變更與相關文件",
        "human": "產品企劃確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "產品企劃確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "彙整核准提案、規格變更與相關文件；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對規格及提案版本、提示矛盾",
        "human": "企劃確認規格定義及正式版本",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對規格及提案版本、提示矛盾；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對規格表、差異與一致性紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "產品企劃針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對規格表、差異與一致性紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "更新規格表並記錄差異與一致性",
        "human": "產品企劃核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新規格表並記錄差異與一致性；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品規格與提案版本維護分身",
    "description": "本次工作：追蹤核准提案與規格變更，同步相關文件；完成：更新規格表並記錄差異與一致性。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品規格與提案版本維護」；少量",
        "manualMinutes": 36.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品規格與提案版本維護」；參考量",
        "manualMinutes": 60.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品規格與提案版本維護」；大量",
        "manualMinutes": 150.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "ID01": {
    "id": "ID01",
    "title": "產品造型與使用體驗設計",
    "input": "設計師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "提出造型與使用體驗方案及人工覆核紀錄",
    "boundary": "不含 ID02 CMF、ME01 結構",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「產品造型與使用體驗設計」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理設計 brief、使用情境與限制",
        "human": "設計師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "設計師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "蒐集並整理設計 brief、使用情境與限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "專業執行與候選產出",
        "ai": "產生形態候選、分析情境與操作風險",
        "human": "設計師創作、評估人體工學與造型方向",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產生形態候選、分析情境與操作風險；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對造型及使用體驗方案與原始資料，標示待釐清與不一致的地方",
        "human": "設計師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對造型及使用體驗方案與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "完成與交付確認",
        "ai": "提出造型與使用體驗方案",
        "human": "設計師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出造型與使用體驗方案；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "產品造型與使用體驗設計分身",
    "description": "本次工作：依設計 brief 與使用情境發想造型與操作體驗；完成：提出造型與使用體驗方案。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「產品造型與使用體驗設計」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「產品造型與使用體驗設計」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「產品造型與使用體驗設計」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.3625,
    "estimatedRetainedHumanShare": 0.7455250000000001,
    "status": "active"
  },
  "ID02": {
    "id": "ID02",
    "title": "CMF 與材料表面方案",
    "input": "設計師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "定出 CMF 規格並附上實體樣本評估及人工覆核紀錄",
    "boundary": "不含 ID01 造型、ME02 強度材料",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「CMF 與材料表面方案」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准造型、色材規範與製程限制",
        "human": "設計師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "設計師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "盤點核准造型、色材規範與製程限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比較色彩、材料與表面處理候選",
        "human": "設計師比對實體樣本、色差及耐用性",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比較色彩、材料與表面處理候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查CMF 規格及實體樣本評估，標出缺乏依據或前後矛盾之處",
        "human": "設計師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查CMF 規格及實體樣本評估，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "完成與交付確認",
        "ai": "定出 CMF 規格並附上實體樣本評估",
        "human": "設計師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "定出 CMF 規格並附上實體樣本評估；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "CMF 與材料表面方案分身",
    "description": "本次工作：比較色彩、材質與表面處理在製程限制下的選項；完成：定出 CMF 規格並附上實體樣本評估。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「CMF 與材料表面方案」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「CMF 與材料表面方案」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「CMF 與材料表面方案」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.3175,
    "estimatedRetainedHumanShare": 0.7771149999999999,
    "status": "active"
  },
  "ID03": {
    "id": "ID03",
    "title": "工業設計原型與體驗驗證",
    "input": "設計師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "彙整觀察結果與設計修正依據及人工覆核紀錄",
    "boundary": "不含 ME04 結構強度驗證",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 150.0,
    "workUnit": "1 次「工業設計原型與體驗驗證」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理造型版本、原型與測試情境",
        "human": "設計師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "設計師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理造型版本、原型與測試情境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理觀察、尺寸與體驗問題",
        "human": "設計師操作原型、觀察使用與判斷修正",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理觀察、尺寸與體驗問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對原型觀察及設計修正證據，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "設計師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對原型觀察及設計修正證據，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整觀察結果與設計修正依據",
        "human": "設計師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整觀察結果與設計修正依據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "工業設計原型與體驗驗證分身",
    "description": "本次工作：用原型在測試情境中觀察實際使用狀況；完成：彙整觀察結果與設計修正依據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「工業設計原型與體驗驗證」；少量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「工業設計原型與體驗驗證」；參考量",
        "manualMinutes": 150.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「工業設計原型與體驗驗證」；大量",
        "manualMinutes": 375.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.22750000000000004,
    "estimatedRetainedHumanShare": 0.8402950000000001,
    "status": "active"
  },
  "ID04": {
    "id": "ID04",
    "title": "工業設計規格與工程協調",
    "input": "設計師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "確立設計規格並記錄協調決議及人工覆核紀錄",
    "boundary": "同場工程會議只計一次",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「工業設計規格與工程協調」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整核准造型、CMF 與工程回饋",
        "human": "設計師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "設計師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整核准造型、CMF 與工程回饋；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對造型、CMF 與工程限制、整理差異",
        "human": "設計師與工程協商並核准設計變更",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對造型、CMF 與工程限制、整理差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對設計規格及協調決議與原始資料，標示待釐清與不一致的地方",
        "human": "設計師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對設計規格及協調決議與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "確立設計規格並記錄協調決議",
        "human": "設計師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確立設計規格並記錄協調決議；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "工業設計規格與工程協調分身",
    "description": "本次工作：彙整造型、CMF 與工程回饋，協調設計與工程的落差；完成：確立設計規格並記錄協調決議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「工業設計規格與工程協調」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「工業設計規格與工程協調」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「工業設計規格與工程協調」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "ME01": {
    "id": "ME01",
    "title": "結構與 CAD 設計",
    "input": "機構工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "交付 3D CAD 與結構圖及人工覆核紀錄",
    "boundary": "不含 ME02 公差與材料檢核",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「結構與 CAD 設計」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理功能規格、外觀及空間限制",
        "human": "機構工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "機構工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理功能規格、外觀及空間限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "專業執行與候選產出",
        "ai": "提出結構候選、干涉與裝配檢查",
        "human": "工程師實際建模、確認負載與結構安全",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出結構候選、干涉與裝配檢查；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查3D CAD 與結構圖，標出缺乏依據或前後矛盾之處",
        "human": "機構工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查3D CAD 與結構圖，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "完成與交付確認",
        "ai": "交付 3D CAD 與結構圖",
        "human": "機構工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "交付 3D CAD 與結構圖；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "結構與 CAD 設計分身",
    "description": "本次工作：依功能規格、外觀與空間限制建立結構模型；完成：交付 3D CAD 與結構圖。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「結構與 CAD 設計」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「結構與 CAD 設計」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「結構與 CAD 設計」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.2725,
    "estimatedRetainedHumanShare": 0.808705,
    "status": "active"
  },
  "ME02": {
    "id": "ME02",
    "title": "尺寸公差與材料檢核",
    "input": "機構工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "完成公差鏈、材料與設計檢核表及人工覆核紀錄",
    "boundary": "不含 ME01 建模、ID02 CMF",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「尺寸公差與材料檢核」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點CAD、配合尺寸與材料規格",
        "human": "機構工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "機構工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點CAD、配合尺寸與材料規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "計算公差情境、比對材料及製程限制",
        "human": "工程師核准公差、材料與製造可行性",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "計算公差情境、比對材料及製程限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對公差鏈、材料與設計檢核表，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "機構工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對公差鏈、材料與設計檢核表，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "完成公差鏈、材料與設計檢核表",
        "human": "機構工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "完成公差鏈、材料與設計檢核表；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "尺寸公差與材料檢核分身",
    "description": "本次工作：檢查配合尺寸、公差累積與材料規格；完成：完成公差鏈、材料與設計檢核表。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「尺寸公差與材料檢核」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「尺寸公差與材料檢核」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「尺寸公差與材料檢核」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "ME03": {
    "id": "ME03",
    "title": "裝配與樣品問題分析",
    "input": "機構工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "歸納裝配問題並提出修正方案及人工覆核紀錄",
    "boundary": "不含 ME04 可靠度測試",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 150.0,
    "workUnit": "1 次「裝配與樣品問題分析」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理樣品、裝配順序與問題照片",
        "human": "機構工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "機構工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理樣品、裝配順序與問題照片；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理問題、比對尺寸與修正候選",
        "human": "工程師實際裝配、確認干涉與修正",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理問題、比對尺寸與修正候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對裝配問題與修正方案與原始資料，標示待釐清與不一致的地方",
        "human": "機構工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對裝配問題與修正方案與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "完成與交付確認",
        "ai": "歸納裝配問題並提出修正方案",
        "human": "機構工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "歸納裝配問題並提出修正方案；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "裝配與樣品問題分析分身",
    "description": "本次工作：依樣品、裝配順序與問題照片分析裝配異常；完成：歸納裝配問題並提出修正方案。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「裝配與樣品問題分析」；少量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「裝配與樣品問題分析」；參考量",
        "manualMinutes": 150.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「裝配與樣品問題分析」；大量",
        "manualMinutes": 375.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.22750000000000004,
    "estimatedRetainedHumanShare": 0.8402950000000001,
    "status": "active"
  },
  "ME04": {
    "id": "ME04",
    "title": "機構實體驗證",
    "input": "機構工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "彙整強度、配合與可靠度證據及人工覆核紀錄",
    "boundary": "不含 ME03 裝配除錯",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「機構實體驗證」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整樣品、負載與可靠度規範",
        "human": "機構工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "機構工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整樣品、負載與可靠度規範；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理驗證矩陣、分析實測異常",
        "human": "工程師操作治具、測試並核准結構",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.15,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理驗證矩陣、分析實測異常；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.85
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查強度、配合與可靠度證據，標出缺乏依據或前後矛盾之處",
        "human": "機構工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查強度、配合與可靠度證據，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整強度、配合與可靠度證據",
        "human": "機構工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整強度、配合與可靠度證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "機構實體驗證分身",
    "description": "本次工作：依負載與可靠度規範安排樣品實測；完成：彙整強度、配合與可靠度證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「機構實體驗證」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「機構實體驗證」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「機構實體驗證」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B30"
    ],
    "estimatedAiAssistShare": 0.1825,
    "estimatedRetainedHumanShare": 0.871885,
    "status": "active"
  },
  "QA01": {
    "id": "QA01",
    "title": "測試範圍與驗證計畫",
    "input": "測試工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "訂出測試範圍與資源計畫及人工覆核紀錄",
    "boundary": "不含 QA02 案例撰寫",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「測試範圍與驗證計畫」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理需求、風險與測試環境",
        "human": "測試工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "測試工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "蒐集並整理需求、風險與測試環境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "對照需求、提出覆蓋與風險清單",
        "human": "測試工程師決定策略、設備與測試範圍",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照需求、提出覆蓋與風險清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對測試範圍與資源計畫，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "測試工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對測試範圍與資源計畫，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "訂出測試範圍與資源計畫",
        "human": "測試工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "訂出測試範圍與資源計畫；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "測試範圍與驗證計畫分身",
    "description": "本次工作：依需求、風險與環境界定要測什麼、怎麼測；完成：訂出測試範圍與資源計畫。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「測試範圍與驗證計畫」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「測試範圍與驗證計畫」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「測試範圍與驗證計畫」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "QA02": {
    "id": "QA02",
    "title": "測試案例與資料準備",
    "input": "測試工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "建立可追溯的案例與測試資料及人工覆核紀錄",
    "boundary": "不含 QA03 測試執行",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「測試案例與資料準備」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准計畫、邊界及規格",
        "human": "測試工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "測試工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "盤點核准計畫、邊界及規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "草擬正常、邊界與失敗案例",
        "human": "工程師審核期待結果與真實情境",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬正常、邊界與失敗案例；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對可追溯案例與測試資料與原始資料，標示待釐清與不一致的地方",
        "human": "測試工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對可追溯案例與測試資料與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "建立可追溯的案例與測試資料",
        "human": "測試工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "建立可追溯的案例與測試資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "測試案例與資料準備分身",
    "description": "本次工作：依核准計畫與規格邊界設計測試案例、準備資料；完成：建立可追溯的案例與測試資料。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「測試案例與資料準備」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「測試案例與資料準備」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「測試案例與資料準備」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "QA03": {
    "id": "QA03",
    "title": "測試執行與證據紀錄",
    "input": "測試工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "記錄實際結果、log 與測試證據及人工覆核紀錄",
    "boundary": "不含 QA04 根因調查與 QA05 回歸",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「測試執行與證據紀錄」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理案例、版本、樣品與環境",
        "human": "測試工程師先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "測試工程師先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "整理案例、版本、樣品與環境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理自動測試腳本與結果、提示缺證",
        "human": "工程師執行實機與人工操作、確認結果",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理自動測試腳本與結果、提示缺證；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查實際結果、log 與測試證據，標出缺乏依據或前後矛盾之處",
        "human": "測試工程師回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查實際結果、log 與測試證據，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "完成與交付確認",
        "ai": "記錄實際結果、log 與測試證據",
        "human": "測試工程師確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "記錄實際結果、log 與測試證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "測試執行與證據紀錄分身",
    "description": "本次工作：依案例在指定版本與環境執行測試；完成：記錄實際結果、log 與測試證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「測試執行與證據紀錄」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「測試執行與證據紀錄」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「測試執行與證據紀錄」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3175,
    "estimatedRetainedHumanShare": 0.7771149999999999,
    "status": "active"
  },
  "QA04": {
    "id": "QA04",
    "title": "缺陷重現與原因分析",
    "input": "測試工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "寫出缺陷報告與根因假設及人工覆核紀錄",
    "boundary": "不含開發者修碼工時與 QA03 執行",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「缺陷重現與原因分析」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整失敗證據、版本與環境",
        "human": "測試工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "測試工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "彙整失敗證據、版本與環境；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "聚合 log、提出重現與可能原因",
        "human": "工程師重現、查證根因並判斷嚴重度",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "聚合 log、提出重現與可能原因；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對缺陷報告及根因假設，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "測試工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對缺陷報告及根因假設，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "寫出缺陷報告與根因假設",
        "human": "測試工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "寫出缺陷報告與根因假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "缺陷重現與原因分析分身",
    "description": "本次工作：依失敗證據、版本與環境重現問題並縮小範圍；完成：寫出缺陷報告與根因假設。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「缺陷重現與原因分析」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「缺陷重現與原因分析」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「缺陷重現與原因分析」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "QA05": {
    "id": "QA05",
    "title": "回歸驗證與品質報告",
    "input": "測試工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "彙整回歸證據並提出品質建議及人工覆核紀錄",
    "boundary": "不含 QA04 缺陷分析",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「回歸驗證與品質報告」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理已修正版本、影響範圍與驗收規則",
        "human": "測試工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "測試工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "蒐集並整理已修正版本、影響範圍與驗收規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "專業執行與候選產出",
        "ai": "生成影響矩陣與品質報告",
        "human": "工程師執行回歸，權責人決定品質放行",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "生成影響矩陣與品質報告；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對回歸證據與品質建議與原始資料，標示待釐清與不一致的地方",
        "human": "測試工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對回歸證據與品質建議與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "完成與交付確認",
        "ai": "彙整回歸證據並提出品質建議",
        "human": "測試工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整回歸證據並提出品質建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "回歸驗證與品質報告分身",
    "description": "本次工作：針對已修正版本與影響範圍重新驗證；完成：彙整回歸證據並提出品質建議。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「回歸驗證與品質報告」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「回歸驗證與品質報告」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「回歸驗證與品質報告」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3625,
    "estimatedRetainedHumanShare": 0.7455250000000001,
    "status": "active"
  },
  "NP01": {
    "id": "NP01",
    "title": "試產規劃與現場問題追蹤",
    "input": "NPI 人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "整理試產紀錄與問題清單及人工覆核紀錄",
    "boundary": "不含 HW03 研發打樣",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 180.0,
    "workUnit": "1 次「試產規劃與現場問題追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准設計、產線與試產計畫",
        "human": "NPI 人員先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "NPI 人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "盤點核准設計、產線與試產計畫；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理工站、物料及試產追蹤表",
        "human": "NPI 人員安排試產、現場操作與問題處置",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理工站、物料及試產追蹤表；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查試產紀錄與問題清單，標出缺乏依據或前後矛盾之處",
        "human": "NPI 人員回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查試產紀錄與問題清單，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "完成與交付確認",
        "ai": "整理試產紀錄與問題清單",
        "human": "NPI 人員確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理試產紀錄與問題清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "試產規劃與現場問題追蹤分身",
    "description": "本次工作：依核准設計與產線條件安排試產，記錄現場狀況；完成：整理試產紀錄與問題清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「試產規劃與現場問題追蹤」；少量",
        "manualMinutes": 108.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「試產規劃與現場問題追蹤」；參考量",
        "manualMinutes": 180.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「試產規劃與現場問題追蹤」；大量",
        "manualMinutes": 450.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B31"
    ],
    "estimatedAiAssistShare": 0.2725,
    "estimatedRetainedHumanShare": 0.808705,
    "status": "active"
  },
  "NP02": {
    "id": "NP02",
    "title": "製程文件與作業指導準備",
    "input": "製程工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "備妥製程文件、作業指導與控制計畫及人工覆核紀錄",
    "boundary": "不含 B12 辦公流程 SOP",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「製程文件與作業指導準備」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理已驗證製程、工站與品質要求",
        "human": "製程工程師確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "製程工程師確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理已驗證製程、工站與品質要求；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "套版流程、查漏與比對版本",
        "human": "工程師現場驗證作業與核准文件",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "套版流程、查漏與比對版本；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對製程文件、作業指導與控制計畫，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "製程工程師針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對製程文件、作業指導與控制計畫，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "備妥製程文件、作業指導與控制計畫",
        "human": "製程工程師核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "備妥製程文件、作業指導與控制計畫；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "製程文件與作業指導準備分身",
    "description": "本次工作：依已驗證製程與品質要求編寫各工站文件；完成：備妥製程文件、作業指導與控制計畫。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「製程文件與作業指導準備」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「製程文件與作業指導準備」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「製程文件與作業指導準備」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B31"
    ],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "NP03": {
    "id": "NP03",
    "title": "試產良率與異常改善分析",
    "input": "製程工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "提出良率分析並驗證改善成效及人工覆核紀錄",
    "boundary": "不含 NP01 現場紀錄原始工時",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「試產良率與異常改善分析」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整試產批次、不良與工站數據",
        "human": "製程工程師核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "製程工程師核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整試產批次、不良與工站數據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "計算良率、聚合缺陷與改善假設",
        "human": "工程師查證根因、現場改善與驗證",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "計算良率、聚合缺陷與改善假設；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對良率分析與改善驗證紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "製程工程師查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對良率分析與改善驗證紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "提出良率分析並驗證改善成效",
        "human": "製程工程師做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出良率分析並驗證改善成效；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "試產良率與異常改善分析分身",
    "description": "本次工作：分析試產批次的不良現象與工站數據；完成：提出良率分析並驗證改善成效。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「試產良率與異常改善分析」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「試產良率與異常改善分析」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「試產良率與異常改善分析」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B31"
    ],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "NP04": {
    "id": "NP04",
    "title": "工程交接與量產準備",
    "input": "權責主管先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "完成量產準備與工程交接清單及人工覆核紀錄",
    "boundary": "不含 P04 專案文件彙整",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「工程交接與量產準備」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理已確認良率、文件及未結問題",
        "human": "權責主管先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "權責主管先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理已確認良率、文件及未結問題；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對準備門檻、整理未結事項與交接",
        "human": "權責人核准量產、資源與風險接受",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對準備門檻、整理未結事項與交接；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查量產準備與工程交接清單，標出缺乏依據或前後矛盾之處",
        "human": "權責主管回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查量產準備與工程交接清單，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "完成量產準備與工程交接清單",
        "human": "權責主管確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "完成量產準備與工程交接清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "工程交接與量產準備分身",
    "description": "本次工作：盤點良率、文件與未結問題是否達到量產條件；完成：完成量產準備與工程交接清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「工程交接與量產準備」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「工程交接與量產準備」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「工程交接與量產準備」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B31"
    ],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "IT01": {
    "id": "IT01",
    "title": "系統監測與資源維護",
    "input": "系統管理員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "更新維護與容量紀錄及人工覆核紀錄",
    "boundary": "不含 IT02 事故、IT03 變更",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「系統監測與資源維護」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點監測、組態、容量與備份規則",
        "human": "系統管理員確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "系統管理員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點監測、組態、容量與備份規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "彙整警示、檢查備份及提出容量建議",
        "human": "管理員操作系統、還原測試與核准資源",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整警示、檢查備份及提出容量建議；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對維護與容量紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "系統管理員針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對維護與容量紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "更新維護與容量紀錄",
        "human": "系統管理員核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新維護與容量紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "系統監測與資源維護分身",
    "description": "本次工作：檢視監測、組態、容量與備份狀態；完成：更新維護與容量紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「系統監測與資源維護」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「系統監測與資源維護」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「系統監測與資源維護」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4975,
    "estimatedRetainedHumanShare": 0.6507550000000001,
    "status": "active"
  },
  "IT02": {
    "id": "IT02",
    "title": "系統故障與事故應變",
    "input": "系統管理員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "整理事故時間線、復原過程與檢討及人工覆核紀錄",
    "boundary": "不含 IT01 日常監測",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「系統故障與事故應變」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理警示、log、影響及應變規則",
        "human": "系統管理員核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "系統管理員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理警示、log、影響及應變規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "專業執行與候選產出",
        "ai": "聚合 log、提供診斷與應變檢查表",
        "human": "管理員判斷事故、實際復原及對外溝通",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "聚合 log、提供診斷與應變檢查表；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對事故時間線、復原與檢討與原始資料，標示待釐清與不一致的地方",
        "human": "系統管理員查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對事故時間線、復原與檢討與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "完成與交付確認",
        "ai": "整理事故時間線、復原過程與檢討",
        "human": "系統管理員做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理事故時間線、復原過程與檢討；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "系統故障與事故應變分身",
    "description": "本次工作：彙整警示、log 與影響範圍，依應變規則排序處置；完成：整理事故時間線、復原過程與檢討。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「系統故障與事故應變」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「系統故障與事故應變」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「系統故障與事故應變」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3625,
    "estimatedRetainedHumanShare": 0.7455250000000001,
    "status": "active"
  },
  "IT03": {
    "id": "IT03",
    "title": "權限與系統變更管理",
    "input": "系統管理員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "留下權限審查與變更證據及人工覆核紀錄",
    "boundary": "不含 IT02 緊急復原",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「權限與系統變更管理」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整授權申請、變更與回復規則",
        "human": "系統管理員先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "系統管理員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整授權申請、變更與回復規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對權限、生成變更與回復清單",
        "human": "管理員核准權限、執行變更及驗證",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對權限、生成變更與回復清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查權限審查與變更證據，標出缺乏依據或前後矛盾之處",
        "human": "系統管理員回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查權限審查與變更證據，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "留下權限審查與變更證據",
        "human": "系統管理員確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "留下權限審查與變更證據；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "權限與系統變更管理分身",
    "description": "本次工作：審查授權申請與變更內容，確認回復做法；完成：留下權限審查與變更證據。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「權限與系統變更管理」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「權限與系統變更管理」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「權限與系統變更管理」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "O01": {
    "id": "O01",
    "title": "營運異常與履約追蹤",
    "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "列出異常清單與協調結果及人工覆核紀錄",
    "boundary": "不含 B03 報表與 B13 補貨",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「營運異常與履約追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理訂單狀態、服務承諾與現場異常",
        "human": "承辦人員確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "承辦人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "蒐集並整理訂單狀態、服務承諾與現場異常；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對延遲、整理阻塞與處置候選",
        "human": "人員協調現場、客戶與履約承諾",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對延遲、整理阻塞與處置候選；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對異常清單與協調結果，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "承辦人員針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對異常清單與協調結果，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "列出異常清單與協調結果",
        "human": "承辦人員核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "列出異常清單與協調結果；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "營運異常與履約追蹤分身",
    "description": "本次工作：追蹤訂單狀態與服務承諾，標出現場異常；完成：列出異常清單與協調結果。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「營運異常與履約追蹤」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「營運異常與履約追蹤」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「營運異常與履約追蹤」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "O02": {
    "id": "O02",
    "title": "採購訂單與收貨驗收追蹤",
    "input": "採購人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "記錄收貨、驗收結果與訂單差異及人工覆核紀錄",
    "boundary": "不含 B11 選商與 B07 請款",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「採購訂單與收貨驗收追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點核准採購、訂單與交貨規格",
        "human": "採購人員核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "採購人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "盤點核准採購、訂單與交貨規格；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對訂單與收貨、提示逾期及缺件",
        "human": "人員下單、驗收、議價與異常協調",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對訂單與收貨、提示逾期及缺件；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對收貨、驗收及訂單差異與原始資料，標示待釐清與不一致的地方",
        "human": "採購人員查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對收貨、驗收及訂單差異與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "記錄收貨、驗收結果與訂單差異",
        "human": "採購人員做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "記錄收貨、驗收結果與訂單差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "採購訂單與收貨驗收追蹤分身",
    "description": "本次工作：比對採購單、訂單與到貨規格；完成：記錄收貨、驗收結果與訂單差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「採購訂單與收貨驗收追蹤」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「採購訂單與收貨驗收追蹤」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「採購訂單與收貨驗收追蹤」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "O03": {
    "id": "O03",
    "title": "物流與供應異常協調",
    "input": "物流窗口先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "整理物流異常與協調紀錄及人工覆核紀錄",
    "boundary": "不含 B13 補貨計算",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「物流與供應異常協調」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理運單、供應計畫與交期",
        "human": "物流窗口先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "物流窗口先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "整理運單、供應計畫與交期；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "專業執行與候選產出",
        "ai": "追蹤貨態、整理缺料與延誤選項",
        "human": "人員聯絡貨運業者、供應商與交期承諾",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "追蹤貨態、整理缺料與延誤選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查物流異常及協調紀錄，標出缺乏依據或前後矛盾之處",
        "human": "物流窗口回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查物流異常及協調紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "完成與交付確認",
        "ai": "整理物流異常與協調紀錄",
        "human": "物流窗口確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理物流異常與協調紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "物流與供應異常協調分身",
    "description": "本次工作：追蹤運單、供應計畫與交期變動；完成：整理物流異常與協調紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「物流與供應異常協調」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「物流與供應異常協調」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「物流與供應異常協調」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.40750000000000003,
    "estimatedRetainedHumanShare": 0.713935,
    "status": "active"
  },
  "F01": {
    "id": "F01",
    "title": "會計分錄與總帳核對",
    "input": "會計確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "產出分錄、試算表與差異紀錄及人工覆核紀錄",
    "boundary": "不含 S01 票據辨識、F02 銀行核對",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「會計分錄與總帳核對」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整憑證、科目與會計政策",
        "human": "會計確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "會計確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "彙整憑證、科目與會計政策；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "提出分錄候選、核對借貸與科目",
        "human": "會計確認政策、正式入帳與更正",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出分錄候選、核對借貸與科目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對分錄、試算表及差異紀錄，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "會計針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對分錄、試算表及差異紀錄，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "產出分錄、試算表與差異紀錄",
        "human": "會計核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "產出分錄、試算表與差異紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "會計分錄與總帳核對分身",
    "description": "本次工作：依憑證、科目與會計政策編製分錄並核對總帳；完成：產出分錄、試算表與差異紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「會計分錄與總帳核對」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「會計分錄與總帳核對」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「會計分錄與總帳核對」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5525,
    "estimatedRetainedHumanShare": 0.612145,
    "status": "active"
  },
  "F02": {
    "id": "F02",
    "title": "銀行收付款與帳務核對",
    "input": "財務人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "完成核對表與待核付款清單及人工覆核紀錄",
    "boundary": "不含 B01 通路訂單、B15 預測",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 60.0,
    "workUnit": "1 次「銀行收付款與帳務核對」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理銀行交易明細、帳款與授權",
        "human": "財務人員核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "財務人員核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "蒐集並整理銀行交易明細、帳款與授權；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "配對交易明細、帳款與差異",
        "human": "人員確認款項、銀行授權及正式付款",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "配對交易明細、帳款與差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對核對表及付款待核清單與原始資料，標示待釐清與不一致的地方",
        "human": "財務人員查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對核對表及付款待核清單與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "完成核對表與待核付款清單",
        "human": "財務人員做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "完成核對表與待核付款清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "銀行收付款與帳務核對分身",
    "description": "本次工作：比對銀行交易明細、帳款與付款授權；完成：完成核對表與待核付款清單。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「銀行收付款與帳務核對」；少量",
        "manualMinutes": 36.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「銀行收付款與帳務核對」；參考量",
        "manualMinutes": 60.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「銀行收付款與帳務核對」；大量",
        "manualMinutes": 150.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5800000000000001,
    "estimatedRetainedHumanShare": 0.59284,
    "status": "active"
  },
  "F03": {
    "id": "F03",
    "title": "結帳與財稅文件準備",
    "input": "會計先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "備妥結帳檢核表與財稅文件草稿及人工覆核紀錄",
    "boundary": "不含 F01 日常分錄",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「結帳與財稅文件準備」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點已核對總帳、準則與申報資料",
        "human": "會計先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "會計先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "盤點已核對總帳、準則與申報資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "專業執行與候選產出",
        "ai": "檢查勾稽、整理申報及調整清單",
        "human": "會計決定政策、調整、申報與財報簽核",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.45,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "檢查勾稽、整理申報及調整清單；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查結帳檢核及財稅草稿，標出缺乏依據或前後矛盾之處",
        "human": "會計回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查結帳檢核及財稅草稿，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "完成與交付確認",
        "ai": "備妥結帳檢核表與財稅文件草稿",
        "human": "會計確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "備妥結帳檢核表與財稅文件草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "結帳與財稅文件準備分身",
    "description": "本次工作：依已核對總帳與申報資料檢查結帳項目；完成：備妥結帳檢核表與財稅文件草稿。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「結帳與財稅文件準備」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「結帳與財稅文件準備」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「結帳與財稅文件準備」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.4525,
    "estimatedRetainedHumanShare": 0.6823450000000001,
    "status": "active"
  },
  "L01": {
    "id": "L01",
    "title": "法律案件分析與意見草稿",
    "input": "法律專業人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "提出附來源的法律分析與待查證事項及人工覆核紀錄",
    "boundary": "不含 B06 條款差異與正式代理出庭",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 120.0,
    "workUnit": "1 次「法律案件分析與意見草稿」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理授權事實、法源及當事人資料",
        "human": "法律專業人員確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.5,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "法律專業人員確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "整理授權事實、法源及當事人資料；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.5
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理時間線、法源及論證草稿",
        "human": "專業人員查證現行法、法律判斷與客戶溝通",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理時間線、法源及論證草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對有來源法律分析與待查證項，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "法律專業人員針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對有來源法律分析與待查證項，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "完成與交付確認",
        "ai": "提出附來源的法律分析與待查證事項",
        "human": "法律專業人員核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "提出附來源的法律分析與待查證事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "法律案件分析與意見草稿分身",
    "description": "本次工作：在授權範圍內整理事實、法源與當事人資料；完成：提出附來源的法律分析與待查證事項。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「法律案件分析與意見草稿」；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「法律案件分析與意見草稿」；參考量",
        "manualMinutes": 120.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「法律案件分析與意見草稿」；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3625,
    "estimatedRetainedHumanShare": 0.7455250000000001,
    "status": "active"
  },
  "H01": {
    "id": "H01",
    "title": "員工關係與人事案件追蹤",
    "input": "人資核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "更新人事處理與後續追蹤紀錄及人工覆核紀錄",
    "boundary": "不含 B17 到職、H03 薪勤",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「員工關係與人事案件追蹤」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整授權個案、人事規範與紀錄",
        "human": "人資核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "人資核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "彙整授權個案、人事規範與紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理事實、程序與待查證項",
        "human": "人資面談、判斷法規、處理衝突與保密",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.25,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理事實、程序與待查證項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.75
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對人事處理及追蹤紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "人資查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對人事處理及追蹤紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "完成與交付確認",
        "ai": "更新人事處理與後續追蹤紀錄",
        "human": "人資做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新人事處理與後續追蹤紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "員工關係與人事案件追蹤分身",
    "description": "本次工作：在授權範圍內彙整個案紀錄並對照人事規範；完成：更新人事處理與後續追蹤紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「員工關係與人事案件追蹤」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「員工關係與人事案件追蹤」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「員工關係與人事案件追蹤」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.2725,
    "estimatedRetainedHumanShare": 0.808705,
    "status": "active"
  },
  "H02": {
    "id": "H02",
    "title": "招募排程與甄選紀錄",
    "input": "招募人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "排定面試並留下可追溯的甄選紀錄及人工覆核紀錄",
    "boundary": "不含 B16 履歷初篩工時",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 60.0,
    "workUnit": "1 次「招募排程與甄選紀錄」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "蒐集並整理面試時段、候選人與甄選規則",
        "human": "招募人員先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "招募人員先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "蒐集並整理面試時段、候選人與甄選規則；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對空檔、整理評量及通知草稿",
        "human": "招募人員安排面談、控制偏見與確認錄用",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.55,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對空檔、整理評量及通知草稿；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.44999999999999996
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查排程及可追溯甄選紀錄，標出缺乏依據或前後矛盾之處",
        "human": "招募人員回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查排程及可追溯甄選紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "排定面試並留下可追溯的甄選紀錄",
        "human": "招募人員確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "排定面試並留下可追溯的甄選紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "招募排程與甄選紀錄分身",
    "description": "本次工作：協調面試時段、候選人與甄選規則；完成：排定面試並留下可追溯的甄選紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「招募排程與甄選紀錄」；少量",
        "manualMinutes": 36.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「招募排程與甄選紀錄」；參考量",
        "manualMinutes": 60.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「招募排程與甄選紀錄」；大量",
        "manualMinutes": 150.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.525,
    "estimatedRetainedHumanShare": 0.63145,
    "status": "active"
  },
  "H03": {
    "id": "H03",
    "title": "薪資與出勤資料檢核",
    "input": "人資確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
    "output": "列出薪資與出勤的核對結果及差異及人工覆核紀錄",
    "boundary": "不含 B17 到職文件、B07 請款",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「薪資與出勤資料檢核」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "盤點出勤、核准薪資規則與異動",
        "human": "人資確認資料來源、授權與這次的處理範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "人資確認資料來源、授權與這次的處理範圍所需原始文件、資料及版本",
        "output": "盤點出勤、核准薪資規則與異動；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "專業執行與候選產出",
        "ai": "比對出勤、規則與計算差異",
        "human": "人資確認例外、薪資、權限及正式付款",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "比對出勤、規則與計算差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "覆核與例外處理",
        "ai": "逐項核對薪勤核對及差異清單，列出沒有佐證、互相矛盾或未通過的項目",
        "human": "人資針對標出的問題逐一查證，需要時重新實作或測試",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.6,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "逐項核對薪勤核對及差異清單，列出沒有佐證、互相矛盾或未通過的項目；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.4
      },
      {
        "name": "完成與交付確認",
        "ai": "列出薪資與出勤的核對結果及差異",
        "human": "人資核定最終成果，並決定未結事項的處理方式",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "列出薪資與出勤的核對結果及差異；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "薪資與出勤資料檢核分身",
    "description": "本次工作：核對出勤、薪資規則與人事異動；完成：列出薪資與出勤的核對結果及差異。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「薪資與出勤資料檢核」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「薪資與出勤資料檢核」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「薪資與出勤資料檢核」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.5525,
    "estimatedRetainedHumanShare": 0.612145,
    "status": "active"
  },
  "M01": {
    "id": "M01",
    "title": "團隊資源與工作分派",
    "input": "主管核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
    "output": "確定分工與資源配置並記錄決策及人工覆核紀錄",
    "boundary": "不含 P02 專案排程",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「團隊資源與工作分派」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "整理目標、人力、工作量與限制",
        "human": "主管核對可用資料的版本與授權，界定工作範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.44999999999999996,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "主管核對可用資料的版本與授權，界定工作範圍所需原始文件、資料及版本",
        "output": "整理目標、人力、工作量與限制；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.55
      },
      {
        "name": "專業執行與候選產出",
        "ai": "彙整負載、提示阻塞與資源選項",
        "human": "主管決定分工、預算與利益衝突",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.3,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整負載、提示阻塞與資源選項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "覆核與例外處理",
        "ai": "回頭比對分工、資源與決策紀錄與原始資料，標示待釐清與不一致的地方",
        "human": "主管查證有疑問的項目並處理例外，必要時重做",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.4,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "回頭比對分工、資源與決策紀錄與原始資料，標示待釐清與不一致的地方；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.6
      },
      {
        "name": "完成與交付確認",
        "ai": "確定分工與資源配置並記錄決策",
        "human": "主管做最後確認，未結事項須處理完畢或正式同意保留",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確定分工與資源配置並記錄決策；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "團隊資源與工作分派分身",
    "description": "本次工作：依目標、人力與工作量評估分工方式；完成：確定分工與資源配置並記錄決策。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「團隊資源與工作分派」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「團隊資源與工作分派」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「團隊資源與工作分派」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.3175,
    "estimatedRetainedHumanShare": 0.7771149999999999,
    "status": "active"
  },
  "M02": {
    "id": "M02",
    "title": "績效回饋與團隊溝通",
    "input": "主管先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
    "output": "整理經主管確認的績效與發展紀錄及人工覆核紀錄",
    "boundary": "不含 B18 訓練執行",
    "completion": "產出完成、證據可追溯，經權責人覆核；例外已處理或正式接受",
    "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
    "manualMinutes": 90.0,
    "workUnit": "1 次「績效回饋與團隊溝通」",
    "stages": [
      {
        "name": "輸入與工作邊界確認",
        "ai": "彙整工作證據、目標與員工回饋",
        "human": "主管先確認授權與資料版本，講定這次要處理的範圍",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.35,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "主管先確認授權與資料版本，講定這次要處理的範圍所需原始文件、資料及版本",
        "output": "彙整工作證據、目標與員工回饋；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.65
      },
      {
        "name": "專業執行與候選產出",
        "ai": "整理證據、對話提綱與追蹤事項",
        "human": "主管親自回饋、輔導及人事決策",
        "stageWorkShare": 0.55,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理證據、對話提綱與追蹤事項；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "覆核與例外處理",
        "ai": "對照輸入資料檢查人工確認的績效與發展紀錄，標出缺乏依據或前後矛盾之處",
        "human": "主管回到原始資料查證，例外狀況由人工處理或重新執行",
        "stageWorkShare": 0.2,
        "aiAssistShare": 0.30000000000000004,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "對照輸入資料檢查人工確認的績效與發展紀錄，標出缺乏依據或前後矛盾之處；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.7
      },
      {
        "name": "完成與交付確認",
        "ai": "整理經主管確認的績效與發展紀錄",
        "human": "主管確認成果與佐證齊全後才算完成，未結事項需有人負責",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.05,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理經主管確認的績效與發展紀錄；保留人工處置紀錄",
        "exception": "缺資料、矛盾或驗證失敗時交人工查證、補件、重做實作並記錄處置",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.95
      }
    ],
    "evidence": "expert-model-estimate",
    "profiles": [
      "document"
    ],
    "cloneTag": "績效回饋與團隊溝通分身",
    "description": "本次工作：彙整工作成果、目標達成狀況與員工回饋；完成：整理經主管確認的績效與發展紀錄。",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次「績效回饋與團隊溝通」；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次「績效回饋與團隊溝通」；參考量",
        "manualMinutes": 90.0,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次「績效回饋與團隊溝通」；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [],
    "estimatedAiAssistShare": 0.22750000000000004,
    "estimatedRetainedHumanShare": 0.8402950000000001,
    "status": "active"
  },
  "P01": {
    "id": "P01",
    "title": "需求整理與範圍管理",
    "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確立需求基準、驗收條件與變更影響表及人工覆核紀錄",
    "description": "本次工作：彙整需求版本與變更申請，依軟硬體交付範疇評估影響；完成：確立需求基準、驗收條件與變更影響表。",
    "boundary": "只計需求定義與變更內容；不計會議、排程或驗收準備",
    "completion": "需求基準、驗收條件與變更影響表經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次需求整理與範圍管理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求與版本、變更申請，依軟硬體交付範疇挑選佐證",
        "human": "核對需求來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求與版本、變更申請，依軟硬體交付範疇挑選佐證；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響",
        "human": "權責人確認需求、範圍、預算與變更核准",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出需求之間的缺漏、矛盾與尚未決定的事項",
        "human": "缺少依據或需求衝突時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出需求之間的缺漏、矛盾與尚未決定的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確立需求基準、驗收條件與變更影響表",
        "human": "權責人核定需求基準，確認每項變更都可追溯",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確立需求基準、驗收條件與變更影響表；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "需求整理與範圍管理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次需求整理與範圍管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次需求整理與範圍管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次需求整理與範圍管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "P02": {
    "id": "P02",
    "title": "專案排程與進度追蹤",
    "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
    "output": "更新 WBS、里程碑並說明進度差異及人工覆核紀錄",
    "description": "本次工作：依需求基準、估時與資源更新排程，對照實際執行狀態；完成：更新 WBS、里程碑並說明進度差異。",
    "boundary": "只計排程與執行狀態；不重算需求撰寫或協調會議",
    "completion": "WBS、里程碑及進度差異經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次專案排程與進度追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求基準、工作估時、資源與執行狀態，依軟硬體交付範疇挑選佐證",
        "human": "核對排程依據、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求基準、工作估時、資源與執行狀態，依軟硬體交付範疇挑選佐證；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞",
        "human": "專案經理確認資源、估時與交期承諾",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出排程缺口、資源衝突與尚未確認的交期",
        "human": "進度延誤或資源衝突時，由專案經理協調並調整承諾",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出排程缺口、資源衝突與尚未確認的交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "更新 WBS、里程碑並說明進度差異",
        "human": "專案經理核定排程版本，確認進度差異都有說明",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新 WBS、里程碑並說明進度差異；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "專案排程與進度追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次專案排程與進度追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次專案排程與進度追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次專案排程與進度追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "P03": {
    "id": "P03",
    "title": "跨部門協調與風險追蹤",
    "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確認決議、負責人、期限與風險紀錄及人工覆核紀錄",
    "description": "本次工作：彙整會議紀錄、待解問題與風險，追蹤各部門回覆；完成：確認決議、負責人、期限與風險紀錄。",
    "boundary": "同一場會議全程只計在此項；其他任務僅計會後獨立產出",
    "completion": "核對決議、責任人、期限與風險紀錄經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 120,
    "workUnit": "1 次跨部門協調與風險追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整授權會議紀錄、問題與風險清單，依軟硬體交付範疇挑選佐證",
        "human": "核對會議紀錄的來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整授權會議紀錄、問題與風險清單，依軟硬體交付範疇挑選佐證；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "整理決議、責任人、期限、風險清單與待決策事項",
        "human": "專案經理親自協調利益衝突、確認權責與接受風險",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理決議、責任人、期限、風險清單與待決策事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出沒有負責人、期限衝突或尚未決議的事項",
        "human": "出現利益衝突或無人負責時，由專案經理出面協調",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出沒有負責人、期限衝突或尚未決議的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確認決議、負責人、期限與風險紀錄",
        "human": "專案經理確認每項決議都有負責人與期限",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確認決議、負責人、期限與風險紀錄；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "跨部門協調與風險追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次跨部門協調與風險追蹤；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次跨部門協調與風險追蹤；參考量",
        "manualMinutes": 120,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次跨部門協調與風險追蹤；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "P04": {
    "id": "P04",
    "title": "驗收與交付文件整理",
    "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "備妥驗收比對表、交付與交接清單及人工覆核紀錄",
    "description": "本次工作：比對已完成成果、測試證據與驗收條件；完成：備妥驗收比對表、交付與交接清單。",
    "boundary": "只計驗收文件與交付準備；不計工程實作與測試執行",
    "completion": "驗收比對、交付與交接清單經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次驗收與交付文件整理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整已完成成果、測試證據與驗收條件，依軟硬體交付範疇挑選佐證",
        "human": "核對成果來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整已完成成果、測試證據與驗收條件，依軟硬體交付範疇挑選佐證；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "彙整證據、比對驗收條件、產生交付與交接清單",
        "human": "工程人員完成驗證，權責人決定驗收放行與交付",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整證據、比對驗收條件、產生交付與交接清單；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出缺少證據、與驗收條件不符或尚未完成的項目",
        "human": "證據不足或驗收有爭議時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出缺少證據、與驗收條件不符或尚未完成的項目；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "備妥驗收比對表、交付與交接清單",
        "human": "權責人決定是否驗收放行，確認交付文件齊全",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "備妥驗收比對表、交付與交接清單；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "驗收與交付文件整理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次驗收與交付文件整理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次驗收與交付文件整理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次驗收與交付文件整理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PS01": {
    "id": "PS01",
    "title": "需求整理與範圍管理",
    "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確立軟體需求基準、驗收條件與變更影響表及人工覆核紀錄",
    "description": "本次工作：彙整軟體需求版本與變更申請，檢查對相依套件與部署環境的影響；完成：確立軟體需求基準、驗收條件與變更影響表。",
    "boundary": "只計需求定義與變更內容；不計會議、排程或驗收準備",
    "completion": "需求基準、驗收條件與變更影響表經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次需求整理與範圍管理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求與版本、變更申請，並檢查軟體版本、相依套件與部署環境",
        "human": "核對需求來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求與版本、變更申請，並檢查軟體版本、相依套件與部署環境；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響，並對照部署環境與版本發布狀態",
        "human": "權責人確認需求、範圍、預算與變更核准",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響，並對照部署環境與版本發布狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出需求之間的缺漏、矛盾與尚未決定的事項",
        "human": "缺少依據或需求衝突時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出需求之間的缺漏、矛盾與尚未決定的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確立軟體需求基準、驗收條件與變更影響表",
        "human": "權責人核定需求基準，確認每項變更都可追溯",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確立軟體需求基準、驗收條件與變更影響表；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "需求整理與範圍管理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次需求整理與範圍管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次需求整理與範圍管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次需求整理與範圍管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PS02": {
    "id": "PS02",
    "title": "專案排程與進度追蹤",
    "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
    "output": "更新軟體專案的 WBS、里程碑與進度差異及人工覆核紀錄",
    "description": "本次工作：依需求基準與估時安排開發與版本發布時程，追蹤部署進度；完成：更新軟體專案的 WBS、里程碑與進度差異。",
    "boundary": "只計排程與執行狀態；不重算需求撰寫或協調會議",
    "completion": "WBS、里程碑及進度差異經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次專案排程與進度追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求基準、工作估時、資源與執行狀態，並檢查軟體版本、相依套件與部署環境",
        "human": "核對排程依據、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求基準、工作估時、資源與執行狀態，並檢查軟體版本、相依套件與部署環境；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞，並對照部署環境與版本發布狀態",
        "human": "專案經理確認資源、估時與交期承諾",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞，並對照部署環境與版本發布狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出排程缺口、資源衝突與尚未確認的交期",
        "human": "進度延誤或資源衝突時，由專案經理協調並調整承諾",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出排程缺口、資源衝突與尚未確認的交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "更新軟體專案的 WBS、里程碑與進度差異",
        "human": "專案經理核定排程版本，確認進度差異都有說明",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新軟體專案的 WBS、里程碑與進度差異；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "專案排程與進度追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次專案排程與進度追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次專案排程與進度追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次專案排程與進度追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PS03": {
    "id": "PS03",
    "title": "跨部門協調與風險追蹤",
    "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確認軟體專案的決議、負責人與期限及人工覆核紀錄",
    "description": "本次工作：彙整會議紀錄與風險，追蹤相依套件、環境與版本回復等議題；完成：確認軟體專案的決議、負責人與期限。",
    "boundary": "同一場會議全程只計在此項；其他任務僅計會後獨立產出",
    "completion": "核對決議、責任人、期限與風險紀錄經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 120,
    "workUnit": "1 次跨部門協調與風險追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整授權會議紀錄、問題與風險清單，並檢查軟體版本、相依套件與部署環境",
        "human": "核對會議紀錄的來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整授權會議紀錄、問題與風險清單，並檢查軟體版本、相依套件與部署環境；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "整理決議、責任人、期限、風險清單與待決策事項，並對照部署環境與版本發布狀態",
        "human": "專案經理親自協調利益衝突、確認權責與接受風險",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理決議、責任人、期限、風險清單與待決策事項，並對照部署環境與版本發布狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出沒有負責人、期限衝突或尚未決議的事項",
        "human": "出現利益衝突或無人負責時，由專案經理出面協調",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出沒有負責人、期限衝突或尚未決議的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確認軟體專案的決議、負責人與期限",
        "human": "專案經理確認每項決議都有負責人與期限",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確認軟體專案的決議、負責人與期限；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "跨部門協調與風險追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次跨部門協調與風險追蹤；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次跨部門協調與風險追蹤；參考量",
        "manualMinutes": 120,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次跨部門協調與風險追蹤；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PS04": {
    "id": "PS04",
    "title": "驗收與交付文件整理",
    "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "備妥軟體驗收比對表與交接清單及人工覆核紀錄",
    "description": "本次工作：比對軟體成果、測試證據與驗收條件，確認部署與版本發布狀態；完成：備妥軟體驗收比對表與交接清單。",
    "boundary": "只計驗收文件與交付準備；不計工程實作與測試執行",
    "completion": "驗收比對、交付與交接清單經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次驗收與交付文件整理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整已完成成果、測試證據與驗收條件，並檢查軟體版本、相依套件與部署環境",
        "human": "核對成果來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整已完成成果、測試證據與驗收條件，並檢查軟體版本、相依套件與部署環境；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "彙整證據、比對驗收條件、產生交付與交接清單，並對照部署環境與版本發布狀態",
        "human": "工程人員完成驗證，權責人決定驗收放行與交付",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整證據、比對驗收條件、產生交付與交接清單，並對照部署環境與版本發布狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出缺少證據、與驗收條件不符或尚未完成的項目",
        "human": "證據不足或驗收有爭議時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出缺少證據、與驗收條件不符或尚未完成的項目；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "備妥軟體驗收比對表與交接清單",
        "human": "權責人決定是否驗收放行，確認交付文件齊全",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "備妥軟體驗收比對表與交接清單；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "驗收與交付文件整理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次驗收與交付文件整理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次驗收與交付文件整理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次驗收與交付文件整理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PH01": {
    "id": "PH01",
    "title": "需求整理與範圍管理",
    "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確立硬體需求基準、驗收條件與變更影響表及人工覆核紀錄",
    "description": "本次工作：彙整硬體需求版本與變更申請，檢查對料件、打樣版次與交期的影響；完成：確立硬體需求基準、驗收條件與變更影響表。",
    "boundary": "只計需求定義與變更內容；不計會議、排程或驗收準備",
    "completion": "需求基準、驗收條件與變更影響表經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次需求整理與範圍管理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求與版本、變更申請，並檢查料件、打樣版次與交期",
        "human": "核對需求來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對需求來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求與版本、變更申請，並檢查料件、打樣版次與交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響，並對照打樣、量測與試產狀態",
        "human": "權責人確認需求、範圍、預算與變更核准",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "擷取需求、提示缺漏與矛盾、比對版本、整理變更影響，並對照打樣、量測與試產狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出需求之間的缺漏、矛盾與尚未決定的事項",
        "human": "缺少依據或需求衝突時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出需求之間的缺漏、矛盾與尚未決定的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確立硬體需求基準、驗收條件與變更影響表",
        "human": "權責人核定需求基準，確認每項變更都可追溯",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確立硬體需求基準、驗收條件與變更影響表；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "需求整理與範圍管理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次需求整理與範圍管理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次需求整理與範圍管理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次需求整理與範圍管理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PH02": {
    "id": "PH02",
    "title": "專案排程與進度追蹤",
    "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
    "output": "更新硬體專案的 WBS、里程碑與進度差異及人工覆核紀錄",
    "description": "本次工作：依需求基準與估時安排打樣、量測與試產時程，追蹤料件交期；完成：更新硬體專案的 WBS、里程碑與進度差異。",
    "boundary": "只計排程與執行狀態；不重算需求撰寫或協調會議",
    "completion": "WBS、里程碑及進度差異經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次專案排程與進度追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整需求基準、工作估時、資源與執行狀態，並檢查料件、打樣版次與交期",
        "human": "核對排程依據、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對排程依據、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整需求基準、工作估時、資源與執行狀態，並檢查料件、打樣版次與交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞，並對照打樣、量測與試產狀態",
        "human": "專案經理確認資源、估時與交期承諾",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "草擬 WBS 與排程、彙整狀態、提示延遲與阻塞，並對照打樣、量測與試產狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出排程缺口、資源衝突與尚未確認的交期",
        "human": "進度延誤或資源衝突時，由專案經理協調並調整承諾",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出排程缺口、資源衝突與尚未確認的交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "更新硬體專案的 WBS、里程碑與進度差異",
        "human": "專案經理核定排程版本，確認進度差異都有說明",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "更新硬體專案的 WBS、里程碑與進度差異；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "專案排程與進度追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次專案排程與進度追蹤；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次專案排程與進度追蹤；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次專案排程與進度追蹤；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PH03": {
    "id": "PH03",
    "title": "跨部門協調與風險追蹤",
    "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "確認硬體專案的決議、負責人與期限及人工覆核紀錄",
    "description": "本次工作：彙整會議紀錄與風險，追蹤料件、打樣、量測與試產等議題；完成：確認硬體專案的決議、負責人與期限。",
    "boundary": "同一場會議全程只計在此項；其他任務僅計會後獨立產出",
    "completion": "核對決議、責任人、期限與風險紀錄經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 120,
    "workUnit": "1 次跨部門協調與風險追蹤",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整授權會議紀錄、問題與風險清單，並檢查料件、打樣版次與交期",
        "human": "核對會議紀錄的來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對會議紀錄的來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整授權會議紀錄、問題與風險清單，並檢查料件、打樣版次與交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "整理決議、責任人、期限、風險清單與待決策事項，並對照打樣、量測與試產狀態",
        "human": "專案經理親自協調利益衝突、確認權責與接受風險",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "整理決議、責任人、期限、風險清單與待決策事項，並對照打樣、量測與試產狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出沒有負責人、期限衝突或尚未決議的事項",
        "human": "出現利益衝突或無人負責時，由專案經理出面協調",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出沒有負責人、期限衝突或尚未決議的事項；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "確認硬體專案的決議、負責人與期限",
        "human": "專案經理確認每項決議都有負責人與期限",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "確認硬體專案的決議、負責人與期限；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "跨部門協調與風險追蹤分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次跨部門協調與風險追蹤；少量",
        "manualMinutes": 72.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次跨部門協調與風險追蹤；參考量",
        "manualMinutes": 120,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次跨部門協調與風險追蹤；大量",
        "manualMinutes": 300.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  },
  "PH04": {
    "id": "PH04",
    "title": "驗收與交付文件整理",
    "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
    "output": "備妥硬體驗收比對表與交接清單及人工覆核紀錄",
    "description": "本次工作：比對硬體成果、量測與試產證據及驗收條件；完成：備妥硬體驗收比對表與交接清單。",
    "boundary": "只計驗收文件與交付準備；不計工程實作與測試執行",
    "completion": "驗收比對、交付與交接清單經權責人確認，所有未結事項有負責人與後續處置",
    "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
    "manualMinutes": 90,
    "workUnit": "1 次驗收與交付文件整理",
    "stages": [
      {
        "name": "輸入與基準確認",
        "ai": "彙整已完成成果、測試證據與驗收條件，並檢查料件、打樣版次與交期",
        "human": "核對成果來源、授權與交付範疇",
        "stageWorkShare": 0.15,
        "aiAssistShare": 0.65,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "核對成果來源、授權與交付範疇所需原始文件、資料及版本",
        "output": "彙整已完成成果、測試證據與驗收條件，並檢查料件、打樣版次與交期；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.35
      },
      {
        "name": "整理與候選分析",
        "ai": "彙整證據、比對驗收條件、產生交付與交接清單，並對照打樣、量測與試產狀態",
        "human": "工程人員完成驗證，權責人決定驗收放行與交付",
        "stageWorkShare": 0.4,
        "aiAssistShare": 0.75,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "彙整證據、比對驗收條件、產生交付與交接清單，並對照打樣、量測與試產狀態；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.25
      },
      {
        "name": "人工協調、覆核及例外",
        "ai": "標出缺少證據、與驗收條件不符或尚未完成的項目",
        "human": "證據不足或驗收有爭議時，由權責人補件與協商",
        "stageWorkShare": 0.35,
        "aiAssistShare": 0.2,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "標出缺少證據、與驗收條件不符或尚未完成的項目；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.8
      },
      {
        "name": "完成與交付檢查",
        "ai": "備妥硬體驗收比對表與交接清單",
        "human": "權責人決定是否驗收放行，確認交付文件齊全",
        "stageWorkShare": 0.1,
        "aiAssistShare": 0.1,
        "reviewAttention": 0.25,
        "exceptionRate": 0.12,
        "exceptionEffort": 0.4,
        "compute": 2,
        "input": "前一階段成果及本次原始資料",
        "output": "備妥硬體驗收比對表與交接清單；保留人工處置紀錄",
        "exception": "缺證、相依衝突、交期或範圍異動時由人員查證、協商並保留決策紀錄",
        "completion": "本階段產出經人工確認，異常已記錄與處置",
        "humanWorkShare": 0.9
      }
    ],
    "profiles": [
      "document",
      "monitoring"
    ],
    "evidence": "expert-model-estimate",
    "cloneTag": "驗收與交付文件整理分身",
    "referenceScales": {
      "small": {
        "label": "少量",
        "description": "1 次驗收與交付文件整理；少量",
        "manualMinutes": 54.0,
        "baseTier": 1
      },
      "standard": {
        "label": "參考量",
        "description": "1 次驗收與交付文件整理；參考量",
        "manualMinutes": 90,
        "baseTier": 1
      },
      "large": {
        "label": "大量",
        "description": "1 次驗收與交付文件整理；大量",
        "manualMinutes": 225.0,
        "baseTier": 2
      }
    },
    "hasExistingAvatar": false,
    "conflictsWith": [
      "B24"
    ],
    "estimatedAiAssistShare": 0.47750000000000004,
    "estimatedRetainedHumanShare": 0.664795,
    "status": "active"
  }
};
const roles = {
  "soho.設計與創作.平面設計師": {
    "id": "soho.設計與創作.平面設計師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "平面設計師",
    "description": "主視覺概念與版面設計；視覺素材延伸",
    "responsibilities": [
      "主視覺概念與版面設計",
      "視覺素材延伸"
    ],
    "representativeTasks": [
      {
        "workflowId": "C01",
        "title": "主視覺概念與版面設計",
        "kind": "core"
      },
      {
        "workflowId": "S05",
        "title": "視覺素材延伸",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C01",
      "S05"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.UI／UX 設計師": {
    "id": "soho.設計與創作.UI／UX 設計師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "UI／UX 設計師",
    "description": "設計研究與使用者訪談；網站介面與可用性設計",
    "responsibilities": [
      "設計研究與使用者訪談",
      "網站介面與可用性設計"
    ],
    "representativeTasks": [
      {
        "workflowId": "S09",
        "title": "設計研究與使用者訪談",
        "kind": "core"
      },
      {
        "workflowId": "S10",
        "title": "網站介面與可用性設計",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S09",
      "S10"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.網頁設計師": {
    "id": "soho.設計與創作.網頁設計師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "網頁設計師",
    "description": "網站介面與可用性設計；視覺素材延伸",
    "responsibilities": [
      "網站介面與可用性設計",
      "視覺素材延伸"
    ],
    "representativeTasks": [
      {
        "workflowId": "S10",
        "title": "網站介面與可用性設計",
        "kind": "core"
      },
      {
        "workflowId": "S05",
        "title": "視覺素材延伸",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S10",
      "S05"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09",
      "S13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.影片剪輯師": {
    "id": "soho.設計與創作.影片剪輯師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "影片剪輯師",
    "description": "短影音剪輯",
    "responsibilities": [
      "短影音剪輯"
    ],
    "representativeTasks": [
      {
        "workflowId": "S02",
        "title": "短影音剪輯",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S12",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.攝影師": {
    "id": "soho.設計與創作.攝影師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "攝影師",
    "description": "現場拍攝與素材紀錄；攝影選片與修圖交付",
    "responsibilities": [
      "現場拍攝與素材紀錄",
      "攝影選片與修圖交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "C02",
        "title": "現場拍攝與素材紀錄",
        "kind": "core"
      },
      {
        "workflowId": "S11",
        "title": "攝影選片與修圖交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C02",
      "S11"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S05",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.動態影像／3D 設計師": {
    "id": "soho.設計與創作.動態影像／3D 設計師",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "動態影像／3D 設計師",
    "description": "3D／動態影像製作",
    "responsibilities": [
      "3D／動態影像製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "S12",
        "title": "3D／動態影像製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S12"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "S05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.設計與創作.插畫家": {
    "id": "soho.設計與創作.插畫家",
    "persona": "soho",
    "functionName": "設計與創作",
    "title": "插畫家",
    "description": "插畫與作品原稿製作；視覺素材延伸",
    "responsibilities": [
      "插畫與作品原稿製作",
      "視覺素材延伸"
    ],
    "representativeTasks": [
      {
        "workflowId": "C03",
        "title": "插畫與作品原稿製作",
        "kind": "core"
      },
      {
        "workflowId": "S05",
        "title": "視覺素材延伸",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C03",
      "S05"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.社群經營者": {
    "id": "soho.行銷與內容.社群經營者",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "社群經營者",
    "description": "文案與貼文撰寫；社群互動與社群經營",
    "responsibilities": [
      "文案與貼文撰寫",
      "社群互動與社群經營"
    ],
    "representativeTasks": [
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      },
      {
        "workflowId": "S15",
        "title": "社群互動與社群經營",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S04",
      "S15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "B02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.內容創作者": {
    "id": "soho.行銷與內容.內容創作者",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "內容創作者",
    "description": "文案與貼文撰寫；內容演出與原始素材拍攝",
    "responsibilities": [
      "文案與貼文撰寫",
      "內容演出與原始素材拍攝"
    ],
    "representativeTasks": [
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      },
      {
        "workflowId": "C04",
        "title": "內容演出與原始素材拍攝",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S04",
      "C04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "S13",
      "S15"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.文案企劃": {
    "id": "soho.行銷與內容.文案企劃",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "文案企劃",
    "description": "文案與貼文撰寫",
    "responsibilities": [
      "文案與貼文撰寫"
    ],
    "representativeTasks": [
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S13",
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.SEO 專員": {
    "id": "soho.行銷與內容.SEO 專員",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "SEO 專員",
    "description": "網站搜尋技術檢核；搜尋優化與內容規劃",
    "responsibilities": [
      "網站搜尋技術檢核",
      "搜尋優化與內容規劃"
    ],
    "representativeTasks": [
      {
        "workflowId": "C05",
        "title": "網站搜尋技術檢核",
        "kind": "core"
      },
      {
        "workflowId": "S13",
        "title": "搜尋優化與內容規劃",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C05",
      "S13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S19"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.數位廣告投手": {
    "id": "soho.行銷與內容.數位廣告投手",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "數位廣告投手",
    "description": "廣告投放規劃與優化",
    "responsibilities": [
      "廣告投放規劃與優化"
    ],
    "representativeTasks": [
      {
        "workflowId": "S14",
        "title": "廣告投放規劃與優化",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S14"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S19",
      "B02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.KOL／網紅": {
    "id": "soho.行銷與內容.KOL／網紅",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "KOL／網紅",
    "description": "內容演出與原始素材拍攝；社群互動與社群經營",
    "responsibilities": [
      "內容演出與原始素材拍攝",
      "社群互動與社群經營"
    ],
    "representativeTasks": [
      {
        "workflowId": "C04",
        "title": "內容演出與原始素材拍攝",
        "kind": "core"
      },
      {
        "workflowId": "S15",
        "title": "社群互動與社群經營",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C04",
      "S15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "S17"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行銷與內容.品牌行銷企劃": {
    "id": "soho.行銷與內容.品牌行銷企劃",
    "persona": "soho",
    "functionName": "行銷與內容",
    "title": "品牌行銷企劃",
    "description": "品牌定位與活動企劃；文案與貼文撰寫",
    "responsibilities": [
      "品牌定位與活動企劃",
      "文案與貼文撰寫"
    ],
    "representativeTasks": [
      {
        "workflowId": "C06",
        "title": "品牌定位與活動企劃",
        "kind": "core"
      },
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C06",
      "S04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "S17",
      "S05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.顧問": {
    "id": "soho.商務與顧問.顧問",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "顧問",
    "description": "市場與商業研究；客戶提案與簡報",
    "responsibilities": [
      "市場與商業研究",
      "客戶提案與簡報"
    ],
    "representativeTasks": [
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      },
      {
        "workflowId": "S17",
        "title": "客戶提案與簡報",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S16",
      "S17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.78,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S03",
      "P01",
      "P03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.21999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.企業顧問": {
    "id": "soho.商務與顧問.企業顧問",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "企業顧問",
    "description": "市場與商業研究；經營檢討與策略規劃；客戶提案與簡報",
    "responsibilities": [
      "市場與商業研究",
      "經營檢討與策略規劃",
      "客戶提案與簡報"
    ],
    "representativeTasks": [
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      },
      {
        "workflowId": "B20",
        "title": "經營檢討與策略規劃",
        "kind": "core"
      },
      {
        "workflowId": "S17",
        "title": "客戶提案與簡報",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S16",
      "B20",
      "S17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.79,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.20999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.接案業務": {
    "id": "soho.商務與顧問.接案業務",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "接案業務",
    "description": "潛在客戶開發與名單研究；客戶關係與商機管理；報價單製作",
    "responsibilities": [
      "潛在客戶開發與名單研究",
      "客戶關係與商機管理",
      "報價單製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "B09",
        "title": "潛在客戶開發與名單研究",
        "kind": "core"
      },
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "S03",
        "title": "報價單製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B09",
      "B10",
      "S03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S17"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.專案經理": {
    "id": "soho.商務與顧問.專案經理",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "P01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "P02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "P01",
      "P02",
      "P03",
      "P04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.客戶經理": {
    "id": "soho.商務與顧問.客戶經理",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "客戶經理",
    "description": "客戶關係與商機管理；客戶成功與續約",
    "responsibilities": [
      "客戶關係與商機管理",
      "客戶成功與續約"
    ],
    "representativeTasks": [
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "B23",
        "title": "客戶成功與續約",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B10",
      "B23"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S03",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.商務開發": {
    "id": "soho.商務與顧問.商務開發",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "商務開發",
    "description": "潛在客戶開發與名單研究；客戶關係與商機管理；客戶提案與簡報",
    "responsibilities": [
      "潛在客戶開發與名單研究",
      "客戶關係與商機管理",
      "客戶提案與簡報"
    ],
    "representativeTasks": [
      {
        "workflowId": "B09",
        "title": "潛在客戶開發與名單研究",
        "kind": "core"
      },
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "S17",
        "title": "客戶提案與簡報",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B09",
      "B10",
      "S17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.82,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "B06"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18000000000000005,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.商務與顧問.教練／講師": {
    "id": "soho.商務與顧問.教練／講師",
    "persona": "soho",
    "functionName": "商務與顧問",
    "title": "教練／講師",
    "description": "教練／講師服務與追蹤",
    "responsibilities": [
      "教練／講師服務與追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "S18",
        "title": "教練／講師服務與追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S18"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.83,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E17",
      "E15"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.17000000000000004,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.軟體工程師": {
    "id": "soho.技術與開發.軟體工程師",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "軟體工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.網站工程師": {
    "id": "soho.技術與開發.網站工程師",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "網站工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S10",
      "C05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.App 工程師": {
    "id": "soho.技術與開發.App 工程師",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "App 工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S19"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.資料分析師": {
    "id": "soho.技術與開發.資料分析師",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "資料分析師",
    "description": "資料清理與品質檢核；統計分析與洞察解讀；儀表板與指標報表維護",
    "responsibilities": [
      "資料清理與品質檢核",
      "統計分析與洞察解讀",
      "儀表板與指標報表維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "A01",
        "title": "資料清理與品質檢核",
        "kind": "core"
      },
      {
        "workflowId": "A02",
        "title": "統計分析與洞察解讀",
        "kind": "core"
      },
      {
        "workflowId": "A03",
        "title": "儀表板與指標報表維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "A01",
      "A02",
      "A03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.AI 開發者": {
    "id": "soho.技術與開發.AI 開發者",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "AI 開發者",
    "description": "模型實驗與算力規劃；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "模型實驗與算力規劃",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "E23",
        "title": "模型實驗與算力規劃",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E23",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.86,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "A01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.14,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.自動化工程師": {
    "id": "soho.技術與開發.自動化工程師",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "自動化工程師",
    "description": "API 整合與流程自動化；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "API 整合與流程自動化",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "S20",
        "title": "API 整合與流程自動化",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S20",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S21"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.技術與開發.接案資訊人員": {
    "id": "soho.技術與開發.接案資訊人員",
    "persona": "soho",
    "functionName": "技術與開發",
    "title": "接案資訊人員",
    "description": "資訊支援與系統維護",
    "responsibilities": [
      "資訊支援與系統維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "S21",
        "title": "資訊支援與系統維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S21"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.84,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B19",
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.16000000000000003,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.電商與營運.電商賣家": {
    "id": "soho.電商與營運.電商賣家",
    "persona": "soho",
    "functionName": "電商與營運",
    "title": "電商賣家",
    "description": "商品上架；訂單對帳與開立發票；庫存補貨與供應鏈追蹤",
    "responsibilities": [
      "商品上架",
      "訂單對帳與開立發票",
      "庫存補貨與供應鏈追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B05",
        "title": "商品上架",
        "kind": "core"
      },
      {
        "workflowId": "B01",
        "title": "訂單對帳與開立發票",
        "kind": "core"
      },
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B05",
      "B01",
      "B13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B22",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.電商與營運.網路商店經營者": {
    "id": "soho.電商與營運.網路商店經營者",
    "persona": "soho",
    "functionName": "電商與營運",
    "title": "網路商店經營者",
    "description": "商品上架；客服工單處理；庫存補貨與供應鏈追蹤",
    "responsibilities": [
      "商品上架",
      "客服工單處理",
      "庫存補貨與供應鏈追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B05",
        "title": "商品上架",
        "kind": "core"
      },
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      },
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B05",
      "B04",
      "B13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B22"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.電商與營運.平台賣家": {
    "id": "soho.電商與營運.平台賣家",
    "persona": "soho",
    "functionName": "電商與營運",
    "title": "平台賣家",
    "description": "商品上架；訂單對帳與開立發票；客服工單處理",
    "responsibilities": [
      "商品上架",
      "訂單對帳與開立發票",
      "客服工單處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "B05",
        "title": "商品上架",
        "kind": "core"
      },
      {
        "workflowId": "B01",
        "title": "訂單對帳與開立發票",
        "kind": "core"
      },
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B05",
      "B01",
      "B04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B02",
      "B22"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.電商與營運.小型品牌主理人": {
    "id": "soho.電商與營運.小型品牌主理人",
    "persona": "soho",
    "functionName": "電商與營運",
    "title": "小型品牌主理人",
    "description": "品牌定位與活動企劃；商品上架；庫存補貨與供應鏈追蹤",
    "responsibilities": [
      "品牌定位與活動企劃",
      "商品上架",
      "庫存補貨與供應鏈追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "C06",
        "title": "品牌定位與活動企劃",
        "kind": "core"
      },
      {
        "workflowId": "B05",
        "title": "商品上架",
        "kind": "core"
      },
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C06",
      "B05",
      "B13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.78,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S04",
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.21999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.電商與營運.經銷商": {
    "id": "soho.電商與營運.經銷商",
    "persona": "soho",
    "functionName": "電商與營運",
    "title": "經銷商",
    "description": "客戶關係與商機管理；訂單對帳與開立發票；庫存補貨與供應鏈追蹤",
    "responsibilities": [
      "客戶關係與商機管理",
      "訂單對帳與開立發票",
      "庫存補貨與供應鏈追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "B01",
        "title": "訂單對帳與開立發票",
        "kind": "core"
      },
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B10",
      "B01",
      "B13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.83,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B22"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.17000000000000004,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.遠端行政助理": {
    "id": "soho.行政與專業服務.遠端行政助理",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "遠端行政助理",
    "description": "行政排程與文件送件；會議決議追蹤",
    "responsibilities": [
      "行政排程與文件送件",
      "會議決議追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "C07",
        "title": "行政排程與文件送件",
        "kind": "core"
      },
      {
        "workflowId": "B08",
        "title": "會議決議追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C07",
      "B08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "S06"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.記帳人員": {
    "id": "soho.行政與專業服務.記帳人員",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "記帳人員",
    "description": "票據整理與記帳；會計分錄與總帳核對；銀行收付款與帳務核對",
    "responsibilities": [
      "票據整理與記帳",
      "會計分錄與總帳核對",
      "銀行收付款與帳務核對"
    ],
    "representativeTasks": [
      {
        "workflowId": "S01",
        "title": "票據整理與記帳",
        "kind": "core"
      },
      {
        "workflowId": "F01",
        "title": "會計分錄與總帳核對",
        "kind": "core"
      },
      {
        "workflowId": "F02",
        "title": "銀行收付款與帳務核對",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S01",
      "F01",
      "F02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "B01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.譯者": {
    "id": "soho.行政與專業服務.譯者",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "譯者",
    "description": "翻譯與在地化交付",
    "responsibilities": [
      "翻譯與在地化交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "S23",
        "title": "翻譯與在地化交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S23"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S06",
      "B06"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.法律服務接案者": {
    "id": "soho.行政與專業服務.法律服務接案者",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "法律服務接案者",
    "description": "法律案件分析與意見草稿；合約條款比對",
    "responsibilities": [
      "法律案件分析與意見草稿",
      "合約條款比對"
    ],
    "representativeTasks": [
      {
        "workflowId": "L01",
        "title": "法律案件分析與意見草稿",
        "kind": "core"
      },
      {
        "workflowId": "B06",
        "title": "合約條款比對",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "L01",
      "B06"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.81,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S23",
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.研究助理": {
    "id": "soho.行政與專業服務.研究助理",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "研究助理",
    "description": "文獻檢索與系統性整理；實驗設計與紀錄；研究資料分析",
    "responsibilities": [
      "文獻檢索與系統性整理",
      "實驗設計與紀錄",
      "研究資料分析"
    ],
    "representativeTasks": [
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E09",
      "E11",
      "E04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.行政與專業服務.行政接案者": {
    "id": "soho.行政與專業服務.行政接案者",
    "persona": "soho",
    "functionName": "行政與專業服務",
    "title": "行政接案者",
    "description": "行政排程與文件送件；校務表單與通知",
    "responsibilities": [
      "行政排程與文件送件",
      "校務表單與通知"
    ],
    "representativeTasks": [
      {
        "workflowId": "C07",
        "title": "行政排程與文件送件",
        "kind": "core"
      },
      {
        "workflowId": "E08",
        "title": "校務表單與通知",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C07",
      "E08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "S01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.開發專案經理": {
    "id": "soho.軟硬體專案開發.開發專案經理",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "開發專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "P01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "P02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "P01",
      "P02",
      "P03",
      "P04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.軟體專案經理": {
    "id": "soho.軟硬體專案開發.軟體專案經理",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "軟體專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "PS01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "PS02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PS03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PS04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PS01",
      "PS02",
      "PS03",
      "PS04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.硬體專案經理": {
    "id": "soho.軟硬體專案開發.硬體專案經理",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "硬體專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "PH01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "PH02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PH03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PH04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PH01",
      "PH02",
      "PH03",
      "PH04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.軟體開發工程師": {
    "id": "soho.軟硬體專案開發.軟體開發工程師",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "軟體開發工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.韌體／嵌入式工程師": {
    "id": "soho.軟硬體專案開發.韌體／嵌入式工程師",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "韌體／嵌入式工程師",
    "description": "韌體介面與驅動設計；韌體控制邏輯開發；目標板除錯與量測；韌體實機回歸與交付",
    "responsibilities": [
      "韌體介面與驅動設計",
      "韌體控制邏輯開發",
      "目標板除錯與量測",
      "韌體實機回歸與交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "FW01",
        "title": "韌體介面與驅動設計",
        "kind": "core"
      },
      {
        "workflowId": "FW02",
        "title": "韌體控制邏輯開發",
        "kind": "core"
      },
      {
        "workflowId": "FW03",
        "title": "目標板除錯與量測",
        "kind": "core"
      },
      {
        "workflowId": "FW04",
        "title": "韌體實機回歸與交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "FW01",
      "FW02",
      "FW03",
      "FW04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "D04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.軟硬體專案開發.硬體研發工程師": {
    "id": "soho.軟硬體專案開發.硬體研發工程師",
    "persona": "soho",
    "functionName": "軟硬體專案開發",
    "title": "硬體研發工程師",
    "description": "電路設計與設計檢核；元件選用與 BOM 維護；硬體打樣與樣品問題追蹤；硬體量測與設計驗證",
    "responsibilities": [
      "電路設計與設計檢核",
      "元件選用與 BOM 維護",
      "硬體打樣與樣品問題追蹤",
      "硬體量測與設計驗證"
    ],
    "representativeTasks": [
      {
        "workflowId": "HW01",
        "title": "電路設計與設計檢核",
        "kind": "core"
      },
      {
        "workflowId": "HW02",
        "title": "元件選用與 BOM 維護",
        "kind": "core"
      },
      {
        "workflowId": "HW03",
        "title": "硬體打樣與樣品問題追蹤",
        "kind": "core"
      },
      {
        "workflowId": "HW04",
        "title": "硬體量測與設計驗證",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "HW01",
      "HW02",
      "HW03",
      "HW04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.產品開發.產品開發顧問": {
    "id": "soho.產品開發.產品開發顧問",
    "persona": "soho",
    "functionName": "產品開發",
    "title": "產品開發顧問",
    "description": "市場與商業研究；產品價值與問題定義；產品需求取捨與路線圖；客戶提案與簡報",
    "responsibilities": [
      "市場與商業研究",
      "產品價值與問題定義",
      "產品需求取捨與路線圖",
      "客戶提案與簡報"
    ],
    "representativeTasks": [
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      },
      {
        "workflowId": "PR01",
        "title": "產品價值與問題定義",
        "kind": "core"
      },
      {
        "workflowId": "PR02",
        "title": "產品需求取捨與路線圖",
        "kind": "core"
      },
      {
        "workflowId": "S17",
        "title": "客戶提案與簡報",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S16",
      "PR01",
      "PR02",
      "S17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.8,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "PR03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.19999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.產品開發.產品經理": {
    "id": "soho.產品開發.產品經理",
    "persona": "soho",
    "functionName": "產品開發",
    "title": "產品經理",
    "description": "產品價值與問題定義；產品需求取捨與路線圖；產品開發協調與需求澄清；產品成效追蹤與迭代",
    "responsibilities": [
      "產品價值與問題定義",
      "產品需求取捨與路線圖",
      "產品開發協調與需求澄清",
      "產品成效追蹤與迭代"
    ],
    "representativeTasks": [
      {
        "workflowId": "PR01",
        "title": "產品價值與問題定義",
        "kind": "core"
      },
      {
        "workflowId": "PR02",
        "title": "產品需求取捨與路線圖",
        "kind": "core"
      },
      {
        "workflowId": "PR03",
        "title": "產品開發協調與需求澄清",
        "kind": "core"
      },
      {
        "workflowId": "PR04",
        "title": "產品成效追蹤與迭代",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PR01",
      "PR02",
      "PR03",
      "PR04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.產品開發.產品企劃": {
    "id": "soho.產品開發.產品企劃",
    "persona": "soho",
    "functionName": "產品開發",
    "title": "產品企劃",
    "description": "市場與商業研究；產品定位與規格組合企劃；產品提案與商業可行性整理；產品規格與提案版本維護",
    "responsibilities": [
      "市場與商業研究",
      "產品定位與規格組合企劃",
      "產品提案與商業可行性整理",
      "產品規格與提案版本維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      },
      {
        "workflowId": "PP01",
        "title": "產品定位與規格組合企劃",
        "kind": "core"
      },
      {
        "workflowId": "PP02",
        "title": "產品提案與商業可行性整理",
        "kind": "core"
      },
      {
        "workflowId": "PP03",
        "title": "產品規格與提案版本維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S16",
      "PP01",
      "PP02",
      "PP03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S17"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.產品開發.工業設計師": {
    "id": "soho.產品開發.工業設計師",
    "persona": "soho",
    "functionName": "產品開發",
    "title": "工業設計師",
    "description": "產品造型與使用體驗設計；CMF 與材料表面方案；工業設計原型與體驗驗證；工業設計規格與工程協調",
    "responsibilities": [
      "產品造型與使用體驗設計",
      "CMF 與材料表面方案",
      "工業設計原型與體驗驗證",
      "工業設計規格與工程協調"
    ],
    "representativeTasks": [
      {
        "workflowId": "ID01",
        "title": "產品造型與使用體驗設計",
        "kind": "core"
      },
      {
        "workflowId": "ID02",
        "title": "CMF 與材料表面方案",
        "kind": "core"
      },
      {
        "workflowId": "ID03",
        "title": "工業設計原型與體驗驗證",
        "kind": "core"
      },
      {
        "workflowId": "ID04",
        "title": "工業設計規格與工程協調",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "ID01",
      "ID02",
      "ID03",
      "ID04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "soho.產品開發.機構設計工程師": {
    "id": "soho.產品開發.機構設計工程師",
    "persona": "soho",
    "functionName": "產品開發",
    "title": "機構設計工程師",
    "description": "結構與 CAD 設計；尺寸公差與材料檢核；裝配與樣品問題分析；機構實體驗證",
    "responsibilities": [
      "結構與 CAD 設計",
      "尺寸公差與材料檢核",
      "裝配與樣品問題分析",
      "機構實體驗證"
    ],
    "representativeTasks": [
      {
        "workflowId": "ME01",
        "title": "結構與 CAD 設計",
        "kind": "core"
      },
      {
        "workflowId": "ME02",
        "title": "尺寸公差與材料檢核",
        "kind": "core"
      },
      {
        "workflowId": "ME03",
        "title": "裝配與樣品問題分析",
        "kind": "core"
      },
      {
        "workflowId": "ME04",
        "title": "機構實體驗證",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "ME01",
      "ME02",
      "ME03",
      "ME04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.93,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "HW02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.大學生": {
    "id": "education.學生.大學生",
    "persona": "education",
    "functionName": "學生",
    "title": "大學生",
    "description": "課程筆記與學習計畫；報告與簡報製作；錯題解析與複習",
    "responsibilities": [
      "課程筆記與學習計畫",
      "報告與簡報製作",
      "錯題解析與複習"
    ],
    "representativeTasks": [
      {
        "workflowId": "E12",
        "title": "課程筆記與學習計畫",
        "kind": "core"
      },
      {
        "workflowId": "E13",
        "title": "報告與簡報製作",
        "kind": "core"
      },
      {
        "workflowId": "E06",
        "title": "錯題解析與複習",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E12",
      "E13",
      "E06"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.76,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.24,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.研究生": {
    "id": "education.學生.研究生",
    "persona": "education",
    "functionName": "學生",
    "title": "研究生",
    "description": "文獻檢索與系統性整理；研究論文與計畫書寫作；研究資料分析",
    "responsibilities": [
      "文獻檢索與系統性整理",
      "研究論文與計畫書寫作",
      "研究資料分析"
    ],
    "representativeTasks": [
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E10",
        "title": "研究論文與計畫書寫作",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E09",
      "E10",
      "E04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.84,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E11",
      "E13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.16000000000000003,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.理工科學生": {
    "id": "education.學生.理工科學生",
    "persona": "education",
    "functionName": "學生",
    "title": "理工科學生",
    "description": "課程筆記與學習計畫；程式測試與審查；實驗設計與紀錄",
    "responsibilities": [
      "課程筆記與學習計畫",
      "程式測試與審查",
      "實驗設計與紀錄"
    ],
    "representativeTasks": [
      {
        "workflowId": "E12",
        "title": "課程筆記與學習計畫",
        "kind": "core"
      },
      {
        "workflowId": "E07",
        "title": "程式測試與審查",
        "kind": "core"
      },
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E12",
      "E07",
      "E11"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.82,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E04",
      "E13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18000000000000005,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.商管／社科學生": {
    "id": "education.學生.商管／社科學生",
    "persona": "education",
    "functionName": "學生",
    "title": "商管／社科學生",
    "description": "課程筆記與學習計畫；報告與簡報製作",
    "responsibilities": [
      "課程筆記與學習計畫",
      "報告與簡報製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "E12",
        "title": "課程筆記與學習計畫",
        "kind": "core"
      },
      {
        "workflowId": "E13",
        "title": "報告與簡報製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E12",
      "E13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.78,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E09",
      "E04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.21999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.設計／藝術學生": {
    "id": "education.學生.設計／藝術學生",
    "persona": "education",
    "functionName": "學生",
    "title": "設計／藝術學生",
    "description": "插畫與作品原稿製作；視覺素材延伸；報告與簡報製作",
    "responsibilities": [
      "插畫與作品原稿製作",
      "視覺素材延伸",
      "報告與簡報製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "C03",
        "title": "插畫與作品原稿製作",
        "kind": "core"
      },
      {
        "workflowId": "S05",
        "title": "視覺素材延伸",
        "kind": "core"
      },
      {
        "workflowId": "E13",
        "title": "報告與簡報製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C03",
      "S05",
      "E13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.83,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09",
      "E12"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.17000000000000004,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學生.人文／語言學生": {
    "id": "education.學生.人文／語言學生",
    "persona": "education",
    "functionName": "學生",
    "title": "人文／語言學生",
    "description": "文獻檢索與系統性整理；報告與簡報製作；語言學習與翻譯練習",
    "responsibilities": [
      "文獻檢索與系統性整理",
      "報告與簡報製作",
      "語言學習與翻譯練習"
    ],
    "representativeTasks": [
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E13",
        "title": "報告與簡報製作",
        "kind": "core"
      },
      {
        "workflowId": "E14",
        "title": "語言學習與翻譯練習",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E09",
      "E13",
      "E14"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.81,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E12"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.國中小／高中職教師": {
    "id": "education.教師與教學人員.國中小／高中職教師",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "國中小／高中職教師",
    "description": "教案與教材製作；差異化教學與個別回饋；班級管理與親師溝通；授課互動與正式學習評量",
    "responsibilities": [
      "教案與教材製作",
      "差異化教學與個別回饋",
      "班級管理與親師溝通",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E02",
        "title": "教案與教材製作",
        "kind": "core"
      },
      {
        "workflowId": "E15",
        "title": "差異化教學與個別回饋",
        "kind": "core"
      },
      {
        "workflowId": "E16",
        "title": "班級管理與親師溝通",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E02",
      "E15",
      "E16",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E01",
      "E03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.大學講師": {
    "id": "education.教師與教學人員.大學講師",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "大學講師",
    "description": "教案與教材製作；差異化教學與個別回饋；授課互動與正式學習評量",
    "responsibilities": [
      "教案與教材製作",
      "差異化教學與個別回饋",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E02",
        "title": "教案與教材製作",
        "kind": "core"
      },
      {
        "workflowId": "E15",
        "title": "差異化教學與個別回饋",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E02",
      "E15",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E01",
      "E03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.大學教師": {
    "id": "education.教師與教學人員.大學教師",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "大學教師",
    "description": "教案與教材製作；文獻檢索與系統性整理；研究論文與計畫書寫作；授課互動與正式學習評量",
    "responsibilities": [
      "教案與教材製作",
      "文獻檢索與系統性整理",
      "研究論文與計畫書寫作",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E02",
        "title": "教案與教材製作",
        "kind": "core"
      },
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E10",
        "title": "研究論文與計畫書寫作",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E02",
      "E09",
      "E10",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E03",
      "E15"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.家教": {
    "id": "education.教師與教學人員.家教",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "家教",
    "description": "差異化教學與個別回饋；錯題解析與複習；授課互動與正式學習評量",
    "responsibilities": [
      "差異化教學與個別回饋",
      "錯題解析與複習",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E15",
        "title": "差異化教學與個別回饋",
        "kind": "core"
      },
      {
        "workflowId": "E06",
        "title": "錯題解析與複習",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E15",
      "E06",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.93,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.語言教師": {
    "id": "education.教師與教學人員.語言教師",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "語言教師",
    "description": "差異化教學與個別回饋；授課互動與正式學習評量",
    "responsibilities": [
      "差異化教學與個別回饋",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E15",
        "title": "差異化教學與個別回饋",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E15",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.93,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E14",
      "E02",
      "E01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教師與教學人員.技職培訓講師": {
    "id": "education.教師與教學人員.技職培訓講師",
    "persona": "education",
    "functionName": "教師與教學人員",
    "title": "技職培訓講師",
    "description": "課程設計與學習成效；設備操作與安全示範；授課互動與正式學習評量",
    "responsibilities": [
      "課程設計與學習成效",
      "設備操作與安全示範",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      },
      {
        "workflowId": "C09",
        "title": "設備操作與安全示範",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E17",
      "C09",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E15",
      "E02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學術研究.計畫主持人": {
    "id": "education.學術研究.計畫主持人",
    "persona": "education",
    "functionName": "學術研究",
    "title": "計畫主持人",
    "description": "研究論文與計畫書寫作；研究計畫與經費進度管理；實驗設計與紀錄",
    "responsibilities": [
      "研究論文與計畫書寫作",
      "研究計畫與經費進度管理",
      "實驗設計與紀錄"
    ],
    "representativeTasks": [
      {
        "workflowId": "E10",
        "title": "研究論文與計畫書寫作",
        "kind": "core"
      },
      {
        "workflowId": "R01",
        "title": "研究計畫與經費進度管理",
        "kind": "core"
      },
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E10",
      "R01",
      "E11"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.83,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E09",
      "E23"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.17000000000000004,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學術研究.博士生": {
    "id": "education.學術研究.博士生",
    "persona": "education",
    "functionName": "學術研究",
    "title": "博士生",
    "description": "文獻檢索與系統性整理；研究論文與計畫書寫作；實驗設計與紀錄；研究資料分析",
    "responsibilities": [
      "文獻檢索與系統性整理",
      "研究論文與計畫書寫作",
      "實驗設計與紀錄",
      "研究資料分析"
    ],
    "representativeTasks": [
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E10",
        "title": "研究論文與計畫書寫作",
        "kind": "core"
      },
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E09",
      "E10",
      "E11",
      "E04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "R01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學術研究.研究員": {
    "id": "education.學術研究.研究員",
    "persona": "education",
    "functionName": "學術研究",
    "title": "研究員",
    "description": "實驗設計與紀錄；研究資料分析；文獻檢索與系統性整理；研究論文與計畫書寫作",
    "responsibilities": [
      "實驗設計與紀錄",
      "研究資料分析",
      "文獻檢索與系統性整理",
      "研究論文與計畫書寫作"
    ],
    "representativeTasks": [
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      },
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E10",
        "title": "研究論文與計畫書寫作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E11",
      "E04",
      "E09",
      "E10"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "R01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學術研究.研究助理": {
    "id": "education.學術研究.研究助理",
    "persona": "education",
    "functionName": "學術研究",
    "title": "研究助理",
    "description": "文獻檢索與系統性整理；實驗設計與紀錄；研究資料分析",
    "responsibilities": [
      "文獻檢索與系統性整理",
      "實驗設計與紀錄",
      "研究資料分析"
    ],
    "representativeTasks": [
      {
        "workflowId": "E09",
        "title": "文獻檢索與系統性整理",
        "kind": "core"
      },
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E09",
      "E11",
      "E04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.學術研究.實驗室成員": {
    "id": "education.學術研究.實驗室成員",
    "persona": "education",
    "functionName": "學術研究",
    "title": "實驗室成員",
    "description": "實驗設計與紀錄；研究資料分析",
    "responsibilities": [
      "實驗設計與紀錄",
      "研究資料分析"
    ],
    "representativeTasks": [
      {
        "workflowId": "E11",
        "title": "實驗設計與紀錄",
        "kind": "core"
      },
      {
        "workflowId": "E04",
        "title": "研究資料分析",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E11",
      "E04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.84,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E21",
      "E23"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.16000000000000003,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.學校行政人員": {
    "id": "education.教育行政.學校行政人員",
    "persona": "education",
    "functionName": "教育行政",
    "title": "學校行政人員",
    "description": "校務表單與通知；課程排程與活動行政",
    "responsibilities": [
      "校務表單與通知",
      "課程排程與活動行政"
    ],
    "representativeTasks": [
      {
        "workflowId": "E08",
        "title": "校務表單與通知",
        "kind": "core"
      },
      {
        "workflowId": "E20",
        "title": "課程排程與活動行政",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E08",
      "E20"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E19",
      "B08"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.系所行政": {
    "id": "education.教育行政.系所行政",
    "persona": "education",
    "functionName": "教育行政",
    "title": "系所行政",
    "description": "課程排程與活動行政；校務表單與通知",
    "responsibilities": [
      "課程排程與活動行政",
      "校務表單與通知"
    ],
    "representativeTasks": [
      {
        "workflowId": "E20",
        "title": "課程排程與活動行政",
        "kind": "core"
      },
      {
        "workflowId": "E08",
        "title": "校務表單與通知",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E20",
      "E08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E19",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.教務人員": {
    "id": "education.教育行政.教務人員",
    "persona": "education",
    "functionName": "教育行政",
    "title": "教務人員",
    "description": "招生與學籍資料處理；課程排程與活動行政",
    "responsibilities": [
      "招生與學籍資料處理",
      "課程排程與活動行政"
    ],
    "representativeTasks": [
      {
        "workflowId": "E19",
        "title": "招生與學籍資料處理",
        "kind": "core"
      },
      {
        "workflowId": "E20",
        "title": "課程排程與活動行政",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E19",
      "E20"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08",
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.招生人員": {
    "id": "education.教育行政.招生人員",
    "persona": "education",
    "functionName": "教育行政",
    "title": "招生人員",
    "description": "招生宣傳與諮詢整理；招生與學籍資料處理",
    "responsibilities": [
      "招生宣傳與諮詢整理",
      "招生與學籍資料處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "C10",
        "title": "招生宣傳與諮詢整理",
        "kind": "core"
      },
      {
        "workflowId": "E19",
        "title": "招生與學籍資料處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C10",
      "E19"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.學務人員": {
    "id": "education.教育行政.學務人員",
    "persona": "education",
    "functionName": "教育行政",
    "title": "學務人員",
    "description": "學生支持與輔導案件追蹤；課程排程與活動行政",
    "responsibilities": [
      "學生支持與輔導案件追蹤",
      "課程排程與活動行政"
    ],
    "representativeTasks": [
      {
        "workflowId": "C11",
        "title": "學生支持與輔導案件追蹤",
        "kind": "core"
      },
      {
        "workflowId": "E20",
        "title": "課程排程與活動行政",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C11",
      "E20"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教育行政.專案承辦人": {
    "id": "education.教育行政.專案承辦人",
    "persona": "education",
    "functionName": "教育行政",
    "title": "專案承辦人",
    "description": "專案排程與進度追蹤；跨部門協調與風險追蹤；課程排程與活動行政",
    "responsibilities": [
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "課程排程與活動行政"
    ],
    "representativeTasks": [
      {
        "workflowId": "P02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "E20",
        "title": "課程排程與活動行政",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "P02",
      "P03",
      "E20"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E08",
      "B07",
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教材與培訓內容.教學設計師": {
    "id": "education.教材與培訓內容.教學設計師",
    "persona": "education",
    "functionName": "教材與培訓內容",
    "title": "教學設計師",
    "description": "課程設計與學習成效；教案與教材製作",
    "responsibilities": [
      "課程設計與學習成效",
      "教案與教材製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      },
      {
        "workflowId": "E02",
        "title": "教案與教材製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E17",
      "E02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E01",
      "S10"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教材與培訓內容.企業內訓講師": {
    "id": "education.教材與培訓內容.企業內訓講師",
    "persona": "education",
    "functionName": "教材與培訓內容",
    "title": "企業內訓講師",
    "description": "課程設計與學習成效；授課互動與正式學習評量",
    "responsibilities": [
      "課程設計與學習成效",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E17",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E18",
      "E15"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教材與培訓內容.課程創作者": {
    "id": "education.教材與培訓內容.課程創作者",
    "persona": "education",
    "functionName": "教材與培訓內容",
    "title": "課程創作者",
    "description": "課程設計與學習成效；線上課程影音製作",
    "responsibilities": [
      "課程設計與學習成效",
      "線上課程影音製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      },
      {
        "workflowId": "E18",
        "title": "線上課程影音製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E17",
      "E18"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E01",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教材與培訓內容.線上教師": {
    "id": "education.教材與培訓內容.線上教師",
    "persona": "education",
    "functionName": "教材與培訓內容",
    "title": "線上教師",
    "description": "差異化教學與個別回饋；授課互動與正式學習評量",
    "responsibilities": [
      "差異化教學與個別回饋",
      "授課互動與正式學習評量"
    ],
    "representativeTasks": [
      {
        "workflowId": "E15",
        "title": "差異化教學與個別回饋",
        "kind": "core"
      },
      {
        "workflowId": "C08",
        "title": "授課互動與正式學習評量",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E15",
      "C08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E18",
      "E06"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.教材與培訓內容.教育科技內容企劃": {
    "id": "education.教材與培訓內容.教育科技內容企劃",
    "persona": "education",
    "functionName": "教材與培訓內容",
    "title": "教育科技內容企劃",
    "description": "課程設計與學習成效；線上課程影音製作",
    "responsibilities": [
      "課程設計與學習成效",
      "線上課程影音製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      },
      {
        "workflowId": "E18",
        "title": "線上課程影音製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E17",
      "E18"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E01",
      "S10"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.校園資訊與實驗室支援.校園資訊人員": {
    "id": "education.校園資訊與實驗室支援.校園資訊人員",
    "persona": "education",
    "functionName": "校園資訊與實驗室支援",
    "title": "校園資訊人員",
    "description": "校園系統與使用者支援",
    "responsibilities": [
      "校園系統與使用者支援"
    ],
    "representativeTasks": [
      {
        "workflowId": "E22",
        "title": "校園系統與使用者支援",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E22"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.86,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B19",
      "E08"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.14,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.校園資訊與實驗室支援.實驗室技術員": {
    "id": "education.校園資訊與實驗室支援.實驗室技術員",
    "persona": "education",
    "functionName": "校園資訊與實驗室支援",
    "title": "實驗室技術員",
    "description": "實驗室設備與耗材管理；設備操作與安全示範",
    "responsibilities": [
      "實驗室設備與耗材管理",
      "設備操作與安全示範"
    ],
    "representativeTasks": [
      {
        "workflowId": "E21",
        "title": "實驗室設備與耗材管理",
        "kind": "core"
      },
      {
        "workflowId": "C09",
        "title": "設備操作與安全示範",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E21",
      "C09"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E11",
      "E22",
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.校園資訊與實驗室支援.系統管理員": {
    "id": "education.校園資訊與實驗室支援.系統管理員",
    "persona": "education",
    "functionName": "校園資訊與實驗室支援",
    "title": "系統管理員",
    "description": "系統監測與資源維護；系統故障與事故應變；權限與系統變更管理",
    "responsibilities": [
      "系統監測與資源維護",
      "系統故障與事故應變",
      "權限與系統變更管理"
    ],
    "representativeTasks": [
      {
        "workflowId": "IT01",
        "title": "系統監測與資源維護",
        "kind": "core"
      },
      {
        "workflowId": "IT02",
        "title": "系統故障與事故應變",
        "kind": "core"
      },
      {
        "workflowId": "IT03",
        "title": "權限與系統變更管理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "IT01",
      "IT02",
      "IT03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.校園資訊與實驗室支援.AI 實驗室工程師": {
    "id": "education.校園資訊與實驗室支援.AI 實驗室工程師",
    "persona": "education",
    "functionName": "校園資訊與實驗室支援",
    "title": "AI 實驗室工程師",
    "description": "模型實驗與算力規劃；系統監測與資源維護",
    "responsibilities": [
      "模型實驗與算力規劃",
      "系統監測與資源維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "E23",
        "title": "模型實驗與算力規劃",
        "kind": "core"
      },
      {
        "workflowId": "IT01",
        "title": "系統監測與資源維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E23",
      "IT01"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.84,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E21",
      "E04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.16000000000000003,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "education.校園資訊與實驗室支援.計算中心人員": {
    "id": "education.校園資訊與實驗室支援.計算中心人員",
    "persona": "education",
    "functionName": "校園資訊與實驗室支援",
    "title": "計算中心人員",
    "description": "系統監測與資源維護；系統故障與事故應變；模型實驗與算力規劃",
    "responsibilities": [
      "系統監測與資源維護",
      "系統故障與事故應變",
      "模型實驗與算力規劃"
    ],
    "representativeTasks": [
      {
        "workflowId": "IT01",
        "title": "系統監測與資源維護",
        "kind": "core"
      },
      {
        "workflowId": "IT02",
        "title": "系統故障與事故應變",
        "kind": "core"
      },
      {
        "workflowId": "E23",
        "title": "模型實驗與算力規劃",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "IT01",
      "IT02",
      "E23"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E21",
      "B19"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.行銷.行銷經理": {
    "id": "smb.行銷.行銷經理",
    "persona": "smb",
    "functionName": "行銷",
    "title": "行銷經理",
    "description": "品牌定位與活動企劃；廣告投放規劃與優化；跨部門報表彙整",
    "responsibilities": [
      "品牌定位與活動企劃",
      "廣告投放規劃與優化",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "C06",
        "title": "品牌定位與活動企劃",
        "kind": "core"
      },
      {
        "workflowId": "S14",
        "title": "廣告投放規劃與優化",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C06",
      "S14",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.84,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.16000000000000003,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.行銷.數位行銷專員": {
    "id": "smb.行銷.數位行銷專員",
    "persona": "smb",
    "functionName": "行銷",
    "title": "數位行銷專員",
    "description": "廣告投放規劃與優化；搜尋優化與內容規劃",
    "responsibilities": [
      "廣告投放規劃與優化",
      "搜尋優化與內容規劃"
    ],
    "representativeTasks": [
      {
        "workflowId": "S14",
        "title": "廣告投放規劃與優化",
        "kind": "core"
      },
      {
        "workflowId": "S13",
        "title": "搜尋優化與內容規劃",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S14",
      "S13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S19",
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.行銷.社群經營者": {
    "id": "smb.行銷.社群經營者",
    "persona": "smb",
    "functionName": "行銷",
    "title": "社群經營者",
    "description": "文案與貼文撰寫；社群互動與社群經營",
    "responsibilities": [
      "文案與貼文撰寫",
      "社群互動與社群經營"
    ],
    "representativeTasks": [
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      },
      {
        "workflowId": "S15",
        "title": "社群互動與社群經營",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S04",
      "S15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "B02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.行銷.內容行銷專員": {
    "id": "smb.行銷.內容行銷專員",
    "persona": "smb",
    "functionName": "行銷",
    "title": "內容行銷專員",
    "description": "文案與貼文撰寫；搜尋優化與內容規劃",
    "responsibilities": [
      "文案與貼文撰寫",
      "搜尋優化與內容規劃"
    ],
    "representativeTasks": [
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      },
      {
        "workflowId": "S13",
        "title": "搜尋優化與內容規劃",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S04",
      "S13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S02",
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.行銷.品牌行銷企劃": {
    "id": "smb.行銷.品牌行銷企劃",
    "persona": "smb",
    "functionName": "行銷",
    "title": "品牌行銷企劃",
    "description": "品牌定位與活動企劃；文案與貼文撰寫",
    "responsibilities": [
      "品牌定位與活動企劃",
      "文案與貼文撰寫"
    ],
    "representativeTasks": [
      {
        "workflowId": "C06",
        "title": "品牌定位與活動企劃",
        "kind": "core"
      },
      {
        "workflowId": "S04",
        "title": "文案與貼文撰寫",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C06",
      "S04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "S17",
      "S05"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.業務與商務開發.業務人員": {
    "id": "smb.業務與商務開發.業務人員",
    "persona": "smb",
    "functionName": "業務與商務開發",
    "title": "業務人員",
    "description": "潛在客戶開發與名單研究；客戶關係與商機管理；報價單製作",
    "responsibilities": [
      "潛在客戶開發與名單研究",
      "客戶關係與商機管理",
      "報價單製作"
    ],
    "representativeTasks": [
      {
        "workflowId": "B09",
        "title": "潛在客戶開發與名單研究",
        "kind": "core"
      },
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "S03",
        "title": "報價單製作",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B09",
      "B10",
      "S03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B23"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.業務與商務開發.商務開發": {
    "id": "smb.業務與商務開發.商務開發",
    "persona": "smb",
    "functionName": "業務與商務開發",
    "title": "商務開發",
    "description": "潛在客戶開發與名單研究；客戶關係與商機管理；客戶提案與簡報",
    "responsibilities": [
      "潛在客戶開發與名單研究",
      "客戶關係與商機管理",
      "客戶提案與簡報"
    ],
    "representativeTasks": [
      {
        "workflowId": "B09",
        "title": "潛在客戶開發與名單研究",
        "kind": "core"
      },
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "S17",
        "title": "客戶提案與簡報",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B09",
      "B10",
      "S17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.82,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "B06"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18000000000000005,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.業務與商務開發.客戶經理": {
    "id": "smb.業務與商務開發.客戶經理",
    "persona": "smb",
    "functionName": "業務與商務開發",
    "title": "客戶經理",
    "description": "客戶關係與商機管理；客戶成功與續約",
    "responsibilities": [
      "客戶關係與商機管理",
      "客戶成功與續約"
    ],
    "representativeTasks": [
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "B23",
        "title": "客戶成功與續約",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B10",
      "B23"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S03",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.業務與商務開發.業務營運人員": {
    "id": "smb.業務與商務開發.業務營運人員",
    "persona": "smb",
    "functionName": "業務與商務開發",
    "title": "業務營運人員",
    "description": "客戶關係與商機管理；跨部門報表彙整",
    "responsibilities": [
      "客戶關係與商機管理",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "B10",
        "title": "客戶關係與商機管理",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B10",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S03",
      "B09"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.客服與客戶成功.客服專員": {
    "id": "smb.客服與客戶成功.客服專員",
    "persona": "smb",
    "functionName": "客服與客戶成功",
    "title": "客服專員",
    "description": "客服工單處理",
    "responsibilities": [
      "客服工單處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B23"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.客服與客戶成功.客戶成功專員": {
    "id": "smb.客服與客戶成功.客戶成功專員",
    "persona": "smb",
    "functionName": "客服與客戶成功",
    "title": "客戶成功專員",
    "description": "客戶成功與續約",
    "responsibilities": [
      "客戶成功與續約"
    ],
    "representativeTasks": [
      {
        "workflowId": "B23",
        "title": "客戶成功與續約",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B23"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.86,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B10",
      "B04",
      "S18"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.14,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.客服與客戶成功.服務台人員": {
    "id": "smb.客服與客戶成功.服務台人員",
    "persona": "smb",
    "functionName": "客服與客戶成功",
    "title": "服務台人員",
    "description": "資訊支援與系統維護",
    "responsibilities": [
      "資訊支援與系統維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "S21",
        "title": "資訊支援與系統維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S21"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B19",
      "B04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.客服與客戶成功.社群客服": {
    "id": "smb.客服與客戶成功.社群客服",
    "persona": "smb",
    "functionName": "客服與客戶成功",
    "title": "社群客服",
    "description": "社群互動與社群經營；客服工單處理",
    "responsibilities": [
      "社群互動與社群經營",
      "客服工單處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "S15",
        "title": "社群互動與社群經營",
        "kind": "core"
      },
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S15",
      "B04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.營運與採購.營運經理": {
    "id": "smb.營運與採購.營運經理",
    "persona": "smb",
    "functionName": "營運與採購",
    "title": "營運經理",
    "description": "跨部門報表彙整；營運異常與履約追蹤",
    "responsibilities": [
      "跨部門報表彙整",
      "營運異常與履約追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      },
      {
        "workflowId": "O01",
        "title": "營運異常與履約追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B03",
      "O01"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.81,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B12",
      "B11",
      "B13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.18999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.營運與採購.營運專員": {
    "id": "smb.營運與採購.營運專員",
    "persona": "smb",
    "functionName": "營運與採購",
    "title": "營運專員",
    "description": "營運異常與履約追蹤；跨部門報表彙整",
    "responsibilities": [
      "營運異常與履約追蹤",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "O01",
        "title": "營運異常與履約追蹤",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "O01",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B12",
      "B13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.營運與採購.採購人員": {
    "id": "smb.營運與採購.採購人員",
    "persona": "smb",
    "functionName": "營運與採購",
    "title": "採購人員",
    "description": "採購與供應商比較；採購訂單與收貨驗收追蹤",
    "responsibilities": [
      "採購與供應商比較",
      "採購訂單與收貨驗收追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B11",
        "title": "採購與供應商比較",
        "kind": "core"
      },
      {
        "workflowId": "O02",
        "title": "採購訂單與收貨驗收追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B11",
      "O02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B06",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.營運與採購.供應鏈人員": {
    "id": "smb.營運與採購.供應鏈人員",
    "persona": "smb",
    "functionName": "營運與採購",
    "title": "供應鏈人員",
    "description": "庫存補貨與供應鏈追蹤；物流與供應異常協調",
    "responsibilities": [
      "庫存補貨與供應鏈追蹤",
      "物流與供應異常協調"
    ],
    "representativeTasks": [
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      },
      {
        "workflowId": "O03",
        "title": "物流與供應異常協調",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B13",
      "O03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.87,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.13,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.營運與採購.辦公室行政": {
    "id": "smb.營運與採購.辦公室行政",
    "persona": "smb",
    "functionName": "營運與採購",
    "title": "辦公室行政",
    "description": "行政排程與文件送件；會議決議追蹤",
    "responsibilities": [
      "行政排程與文件送件",
      "會議決議追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "C07",
        "title": "行政排程與文件送件",
        "kind": "core"
      },
      {
        "workflowId": "B08",
        "title": "會議決議追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "C07",
      "B08"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.財務與會計.會計人員": {
    "id": "smb.財務與會計.會計人員",
    "persona": "smb",
    "functionName": "財務與會計",
    "title": "會計人員",
    "description": "會計分錄與總帳核對；銀行收付款與帳務核對；結帳與財稅文件準備",
    "responsibilities": [
      "會計分錄與總帳核對",
      "銀行收付款與帳務核對",
      "結帳與財稅文件準備"
    ],
    "representativeTasks": [
      {
        "workflowId": "F01",
        "title": "會計分錄與總帳核對",
        "kind": "core"
      },
      {
        "workflowId": "F02",
        "title": "銀行收付款與帳務核對",
        "kind": "core"
      },
      {
        "workflowId": "F03",
        "title": "結帳與財稅文件準備",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "F01",
      "F02",
      "F03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B01",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.財務與會計.財務人員": {
    "id": "smb.財務與會計.財務人員",
    "persona": "smb",
    "functionName": "財務與會計",
    "title": "財務人員",
    "description": "預算與預實差異分析；現金流與應收應付追蹤",
    "responsibilities": [
      "預算與預實差異分析",
      "現金流與應收應付追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B14",
        "title": "預算與預實差異分析",
        "kind": "core"
      },
      {
        "workflowId": "B15",
        "title": "現金流與應收應付追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B14",
      "B15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.財務與會計.記帳人員": {
    "id": "smb.財務與會計.記帳人員",
    "persona": "smb",
    "functionName": "財務與會計",
    "title": "記帳人員",
    "description": "票據整理與記帳；會計分錄與總帳核對；銀行收付款與帳務核對",
    "responsibilities": [
      "票據整理與記帳",
      "會計分錄與總帳核對",
      "銀行收付款與帳務核對"
    ],
    "representativeTasks": [
      {
        "workflowId": "S01",
        "title": "票據整理與記帳",
        "kind": "core"
      },
      {
        "workflowId": "F01",
        "title": "會計分錄與總帳核對",
        "kind": "core"
      },
      {
        "workflowId": "F02",
        "title": "銀行收付款與帳務核對",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S01",
      "F01",
      "F02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "B01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.財務與會計.財務規劃與分析人員": {
    "id": "smb.財務與會計.財務規劃與分析人員",
    "persona": "smb",
    "functionName": "財務與會計",
    "title": "財務規劃與分析人員",
    "description": "預算與預實差異分析；跨部門報表彙整",
    "responsibilities": [
      "預算與預實差異分析",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "B14",
        "title": "預算與預實差異分析",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B14",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B15",
      "B20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.財務與會計.財務營運人員": {
    "id": "smb.財務與會計.財務營運人員",
    "persona": "smb",
    "functionName": "財務與會計",
    "title": "財務營運人員",
    "description": "現金流與應收應付追蹤；銀行收付款與帳務核對",
    "responsibilities": [
      "現金流與應收應付追蹤",
      "銀行收付款與帳務核對"
    ],
    "representativeTasks": [
      {
        "workflowId": "B15",
        "title": "現金流與應收應付追蹤",
        "kind": "core"
      },
      {
        "workflowId": "F02",
        "title": "銀行收付款與帳務核對",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B15",
      "F02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "B01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.人資與人才發展.人資專員": {
    "id": "smb.人資與人才發展.人資專員",
    "persona": "smb",
    "functionName": "人資與人才發展",
    "title": "人資專員",
    "description": "新人到職與人事文件；員工關係與人事案件追蹤",
    "responsibilities": [
      "新人到職與人事文件",
      "員工關係與人事案件追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B17",
        "title": "新人到職與人事文件",
        "kind": "core"
      },
      {
        "workflowId": "H01",
        "title": "員工關係與人事案件追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B17",
      "H01"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B16",
      "B18"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.人資與人才發展.招募人員": {
    "id": "smb.人資與人才發展.招募人員",
    "persona": "smb",
    "functionName": "人資與人才發展",
    "title": "招募人員",
    "description": "招募與面試協作；招募排程與甄選紀錄",
    "responsibilities": [
      "招募與面試協作",
      "招募排程與甄選紀錄"
    ],
    "representativeTasks": [
      {
        "workflowId": "B16",
        "title": "招募與面試協作",
        "kind": "core"
      },
      {
        "workflowId": "H02",
        "title": "招募排程與甄選紀錄",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B16",
      "H02"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B17"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.人資與人才發展.人資營運人員": {
    "id": "smb.人資與人才發展.人資營運人員",
    "persona": "smb",
    "functionName": "人資與人才發展",
    "title": "人資營運人員",
    "description": "新人到職與人事文件；薪資與出勤資料檢核",
    "responsibilities": [
      "新人到職與人事文件",
      "薪資與出勤資料檢核"
    ],
    "representativeTasks": [
      {
        "workflowId": "B17",
        "title": "新人到職與人事文件",
        "kind": "core"
      },
      {
        "workflowId": "H03",
        "title": "薪資與出勤資料檢核",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B17",
      "H03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B07",
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.人資與人才發展.教育訓練人員": {
    "id": "smb.人資與人才發展.教育訓練人員",
    "persona": "smb",
    "functionName": "人資與人才發展",
    "title": "教育訓練人員",
    "description": "員工訓練與意見調查；課程設計與學習成效",
    "responsibilities": [
      "員工訓練與意見調查",
      "課程設計與學習成效"
    ],
    "representativeTasks": [
      {
        "workflowId": "B18",
        "title": "員工訓練與意見調查",
        "kind": "core"
      },
      {
        "workflowId": "E17",
        "title": "課程設計與學習成效",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B18",
      "E17"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.89,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "E18"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.10999999999999999,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.人資與人才發展.部門主管": {
    "id": "smb.人資與人才發展.部門主管",
    "persona": "smb",
    "functionName": "人資與人才發展",
    "title": "部門主管",
    "description": "團隊資源與工作分派；績效回饋與團隊溝通；跨部門報表彙整",
    "responsibilities": [
      "團隊資源與工作分派",
      "績效回饋與團隊溝通",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "M01",
        "title": "團隊資源與工作分派",
        "kind": "core"
      },
      {
        "workflowId": "M02",
        "title": "績效回饋與團隊溝通",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "M01",
      "M02",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.8,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B16",
      "B18",
      "B12"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.19999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.資訊與開發.系統管理員": {
    "id": "smb.資訊與開發.系統管理員",
    "persona": "smb",
    "functionName": "資訊與開發",
    "title": "系統管理員",
    "description": "系統監測與資源維護；系統故障與事故應變；權限與系統變更管理",
    "responsibilities": [
      "系統監測與資源維護",
      "系統故障與事故應變",
      "權限與系統變更管理"
    ],
    "representativeTasks": [
      {
        "workflowId": "IT01",
        "title": "系統監測與資源維護",
        "kind": "core"
      },
      {
        "workflowId": "IT02",
        "title": "系統故障與事故應變",
        "kind": "core"
      },
      {
        "workflowId": "IT03",
        "title": "權限與系統變更管理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "IT01",
      "IT02",
      "IT03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.資訊與開發.開發工程師": {
    "id": "smb.資訊與開發.開發工程師",
    "persona": "smb",
    "functionName": "資訊與開發",
    "title": "開發工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.資訊與開發.資料分析師": {
    "id": "smb.資訊與開發.資料分析師",
    "persona": "smb",
    "functionName": "資訊與開發",
    "title": "資料分析師",
    "description": "資料清理與品質檢核；統計分析與洞察解讀；儀表板與指標報表維護",
    "responsibilities": [
      "資料清理與品質檢核",
      "統計分析與洞察解讀",
      "儀表板與指標報表維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "A01",
        "title": "資料清理與品質檢核",
        "kind": "core"
      },
      {
        "workflowId": "A02",
        "title": "統計分析與洞察解讀",
        "kind": "core"
      },
      {
        "workflowId": "A03",
        "title": "儀表板與指標報表維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "A01",
      "A02",
      "A03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.資訊與開發.AI 工程師": {
    "id": "smb.資訊與開發.AI 工程師",
    "persona": "smb",
    "functionName": "資訊與開發",
    "title": "AI 工程師",
    "description": "模型實驗與算力規劃；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "模型實驗與算力規劃",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "E23",
        "title": "模型實驗與算力規劃",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "E23",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.86,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "A01"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.14,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.資訊與開發.維運工程師": {
    "id": "smb.資訊與開發.維運工程師",
    "persona": "smb",
    "functionName": "資訊與開發",
    "title": "維運工程師",
    "description": "系統監測與資源維護；系統故障與事故應變；權限與系統變更管理",
    "responsibilities": [
      "系統監測與資源維護",
      "系統故障與事故應變",
      "權限與系統變更管理"
    ],
    "representativeTasks": [
      {
        "workflowId": "IT01",
        "title": "系統監測與資源維護",
        "kind": "core"
      },
      {
        "workflowId": "IT02",
        "title": "系統故障與事故應變",
        "kind": "core"
      },
      {
        "workflowId": "IT03",
        "title": "權限與系統變更管理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "IT01",
      "IT02",
      "IT03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.管理與策略.創辦人": {
    "id": "smb.管理與策略.創辦人",
    "persona": "smb",
    "functionName": "管理與策略",
    "title": "創辦人",
    "description": "經營檢討與策略規劃；團隊資源與工作分派；現金流與應收應付追蹤",
    "responsibilities": [
      "經營檢討與策略規劃",
      "團隊資源與工作分派",
      "現金流與應收應付追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B20",
        "title": "經營檢討與策略規劃",
        "kind": "core"
      },
      {
        "workflowId": "M01",
        "title": "團隊資源與工作分派",
        "kind": "core"
      },
      {
        "workflowId": "B15",
        "title": "現金流與應收應付追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B20",
      "M01",
      "B15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.73,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16",
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.27,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.管理與策略.企業主": {
    "id": "smb.管理與策略.企業主",
    "persona": "smb",
    "functionName": "管理與策略",
    "title": "企業主",
    "description": "經營檢討與策略規劃；團隊資源與工作分派；現金流與應收應付追蹤",
    "responsibilities": [
      "經營檢討與策略規劃",
      "團隊資源與工作分派",
      "現金流與應收應付追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B20",
        "title": "經營檢討與策略規劃",
        "kind": "core"
      },
      {
        "workflowId": "M01",
        "title": "團隊資源與工作分派",
        "kind": "core"
      },
      {
        "workflowId": "B15",
        "title": "現金流與應收應付追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B20",
      "M01",
      "B15"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.75,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.25,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.管理與策略.總經理": {
    "id": "smb.管理與策略.總經理",
    "persona": "smb",
    "functionName": "管理與策略",
    "title": "總經理",
    "description": "經營檢討與策略規劃；團隊資源與工作分派；跨部門報表彙整",
    "responsibilities": [
      "經營檢討與策略規劃",
      "團隊資源與工作分派",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "B20",
        "title": "經營檢討與策略規劃",
        "kind": "core"
      },
      {
        "workflowId": "M01",
        "title": "團隊資源與工作分派",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B20",
      "M01",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.8,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B14"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.19999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.管理與策略.部門主管": {
    "id": "smb.管理與策略.部門主管",
    "persona": "smb",
    "functionName": "管理與策略",
    "title": "部門主管",
    "description": "團隊資源與工作分派；績效回饋與團隊溝通；跨部門報表彙整",
    "responsibilities": [
      "團隊資源與工作分派",
      "績效回饋與團隊溝通",
      "跨部門報表彙整"
    ],
    "representativeTasks": [
      {
        "workflowId": "M01",
        "title": "團隊資源與工作分派",
        "kind": "core"
      },
      {
        "workflowId": "M02",
        "title": "績效回饋與團隊溝通",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "M01",
      "M02",
      "B03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.8,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B16",
      "B18",
      "B12"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.19999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.管理與策略.策略企劃": {
    "id": "smb.管理與策略.策略企劃",
    "persona": "smb",
    "functionName": "管理與策略",
    "title": "策略企劃",
    "description": "經營檢討與策略規劃；市場與商業研究",
    "responsibilities": [
      "經營檢討與策略規劃",
      "市場與商業研究"
    ],
    "representativeTasks": [
      {
        "workflowId": "B20",
        "title": "經營檢討與策略規劃",
        "kind": "core"
      },
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B20",
      "S16"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B03",
      "B14"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.零售與電商.電商經理": {
    "id": "smb.零售與電商.電商經理",
    "persona": "smb",
    "functionName": "零售與電商",
    "title": "電商經理",
    "description": "電商促銷與定價；跨部門報表彙整；庫存補貨與供應鏈追蹤",
    "responsibilities": [
      "電商促銷與定價",
      "跨部門報表彙整",
      "庫存補貨與供應鏈追蹤"
    ],
    "representativeTasks": [
      {
        "workflowId": "B22",
        "title": "電商促銷與定價",
        "kind": "core"
      },
      {
        "workflowId": "B03",
        "title": "跨部門報表彙整",
        "kind": "core"
      },
      {
        "workflowId": "B13",
        "title": "庫存補貨與供應鏈追蹤",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B22",
      "B03",
      "B13"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.85,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B05",
      "B02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.15000000000000002,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.零售與電商.門市主管": {
    "id": "smb.零售與電商.門市主管",
    "persona": "smb",
    "functionName": "零售與電商",
    "title": "門市主管",
    "description": "門市營運與排班；客服工單處理",
    "responsibilities": [
      "門市營運與排班",
      "客服工單處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "B21",
        "title": "門市營運與排班",
        "kind": "core"
      },
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B21",
      "B04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.86,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B13",
      "B03"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.14,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.零售與電商.商品企劃": {
    "id": "smb.零售與電商.商品企劃",
    "persona": "smb",
    "functionName": "零售與電商",
    "title": "商品企劃",
    "description": "競品與評論分析；電商促銷與定價",
    "responsibilities": [
      "競品與評論分析",
      "電商促銷與定價"
    ],
    "representativeTasks": [
      {
        "workflowId": "B02",
        "title": "競品與評論分析",
        "kind": "core"
      },
      {
        "workflowId": "B22",
        "title": "電商促銷與定價",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B02",
      "B22"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.88,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B05",
      "B13"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.12,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.零售與電商.電商平台營運人員": {
    "id": "smb.零售與電商.電商平台營運人員",
    "persona": "smb",
    "functionName": "零售與電商",
    "title": "電商平台營運人員",
    "description": "商品上架；訂單對帳與開立發票；客服工單處理",
    "responsibilities": [
      "商品上架",
      "訂單對帳與開立發票",
      "客服工單處理"
    ],
    "representativeTasks": [
      {
        "workflowId": "B05",
        "title": "商品上架",
        "kind": "core"
      },
      {
        "workflowId": "B01",
        "title": "訂單對帳與開立發票",
        "kind": "core"
      },
      {
        "workflowId": "B04",
        "title": "客服工單處理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "B05",
      "B01",
      "B04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B22"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.開發專案經理": {
    "id": "smb.軟硬體專案開發.開發專案經理",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "開發專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "P01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "P02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "P04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "P01",
      "P02",
      "P03",
      "P04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.軟體專案經理": {
    "id": "smb.軟硬體專案開發.軟體專案經理",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "軟體專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "PS01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "PS02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PS03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PS04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PS01",
      "PS02",
      "PS03",
      "PS04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.硬體專案經理": {
    "id": "smb.軟硬體專案開發.硬體專案經理",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "硬體專案經理",
    "description": "需求整理與範圍管理；專案排程與進度追蹤；跨部門協調與風險追蹤；驗收與交付文件整理",
    "responsibilities": [
      "需求整理與範圍管理",
      "專案排程與進度追蹤",
      "跨部門協調與風險追蹤",
      "驗收與交付文件整理"
    ],
    "representativeTasks": [
      {
        "workflowId": "PH01",
        "title": "需求整理與範圍管理",
        "kind": "core"
      },
      {
        "workflowId": "PH02",
        "title": "專案排程與進度追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PH03",
        "title": "跨部門協調與風險追蹤",
        "kind": "core"
      },
      {
        "workflowId": "PH04",
        "title": "驗收與交付文件整理",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PH01",
      "PH02",
      "PH03",
      "PH04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11",
      "B07"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.軟體開發工程師": {
    "id": "smb.軟硬體專案開發.軟體開發工程師",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "軟體開發工程師",
    "description": "軟體架構與介面設計；軟體功能程式開發；軟體除錯與測試；軟體版本與部署交付",
    "responsibilities": [
      "軟體架構與介面設計",
      "軟體功能程式開發",
      "軟體除錯與測試",
      "軟體版本與部署交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "D01",
        "title": "軟體架構與介面設計",
        "kind": "core"
      },
      {
        "workflowId": "D02",
        "title": "軟體功能程式開發",
        "kind": "core"
      },
      {
        "workflowId": "D03",
        "title": "軟體除錯與測試",
        "kind": "core"
      },
      {
        "workflowId": "D04",
        "title": "軟體版本與部署交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "D01",
      "D02",
      "D03",
      "D04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.92,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S20"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.07999999999999996,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.韌體／嵌入式工程師": {
    "id": "smb.軟硬體專案開發.韌體／嵌入式工程師",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "韌體／嵌入式工程師",
    "description": "韌體介面與驅動設計；韌體控制邏輯開發；目標板除錯與量測；韌體實機回歸與交付",
    "responsibilities": [
      "韌體介面與驅動設計",
      "韌體控制邏輯開發",
      "目標板除錯與量測",
      "韌體實機回歸與交付"
    ],
    "representativeTasks": [
      {
        "workflowId": "FW01",
        "title": "韌體介面與驅動設計",
        "kind": "core"
      },
      {
        "workflowId": "FW02",
        "title": "韌體控制邏輯開發",
        "kind": "core"
      },
      {
        "workflowId": "FW03",
        "title": "目標板除錯與量測",
        "kind": "core"
      },
      {
        "workflowId": "FW04",
        "title": "韌體實機回歸與交付",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "FW01",
      "FW02",
      "FW03",
      "FW04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "D04"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.硬體研發工程師": {
    "id": "smb.軟硬體專案開發.硬體研發工程師",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "硬體研發工程師",
    "description": "電路設計與設計檢核；元件選用與 BOM 維護；硬體打樣與樣品問題追蹤；硬體量測與設計驗證",
    "responsibilities": [
      "電路設計與設計檢核",
      "元件選用與 BOM 維護",
      "硬體打樣與樣品問題追蹤",
      "硬體量測與設計驗證"
    ],
    "representativeTasks": [
      {
        "workflowId": "HW01",
        "title": "電路設計與設計檢核",
        "kind": "core"
      },
      {
        "workflowId": "HW02",
        "title": "元件選用與 BOM 維護",
        "kind": "core"
      },
      {
        "workflowId": "HW03",
        "title": "硬體打樣與樣品問題追蹤",
        "kind": "core"
      },
      {
        "workflowId": "HW04",
        "title": "硬體量測與設計驗證",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "HW01",
      "HW02",
      "HW03",
      "HW04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.軟硬體專案開發.測試／品質驗證工程師": {
    "id": "smb.軟硬體專案開發.測試／品質驗證工程師",
    "persona": "smb",
    "functionName": "軟硬體專案開發",
    "title": "測試／品質驗證工程師",
    "description": "測試範圍與驗證計畫；測試案例與資料準備；測試執行與證據紀錄；缺陷重現與原因分析；回歸驗證與品質報告",
    "responsibilities": [
      "測試範圍與驗證計畫",
      "測試案例與資料準備",
      "測試執行與證據紀錄",
      "缺陷重現與原因分析",
      "回歸驗證與品質報告"
    ],
    "representativeTasks": [
      {
        "workflowId": "QA01",
        "title": "測試範圍與驗證計畫",
        "kind": "core"
      },
      {
        "workflowId": "QA02",
        "title": "測試案例與資料準備",
        "kind": "core"
      },
      {
        "workflowId": "QA03",
        "title": "測試執行與證據紀錄",
        "kind": "core"
      },
      {
        "workflowId": "QA04",
        "title": "缺陷重現與原因分析",
        "kind": "core"
      },
      {
        "workflowId": "QA05",
        "title": "回歸驗證與品質報告",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "QA01",
      "QA02",
      "QA03",
      "QA04",
      "QA05"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.94,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B12"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06000000000000005,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.產品經理": {
    "id": "smb.產品開發.產品經理",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "產品經理",
    "description": "產品價值與問題定義；產品需求取捨與路線圖；產品開發協調與需求澄清；產品成效追蹤與迭代",
    "responsibilities": [
      "產品價值與問題定義",
      "產品需求取捨與路線圖",
      "產品開發協調與需求澄清",
      "產品成效追蹤與迭代"
    ],
    "representativeTasks": [
      {
        "workflowId": "PR01",
        "title": "產品價值與問題定義",
        "kind": "core"
      },
      {
        "workflowId": "PR02",
        "title": "產品需求取捨與路線圖",
        "kind": "core"
      },
      {
        "workflowId": "PR03",
        "title": "產品開發協調與需求澄清",
        "kind": "core"
      },
      {
        "workflowId": "PR04",
        "title": "產品成效追蹤與迭代",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "PR01",
      "PR02",
      "PR03",
      "PR04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.產品企劃": {
    "id": "smb.產品開發.產品企劃",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "產品企劃",
    "description": "市場與商業研究；產品定位與規格組合企劃；產品提案與商業可行性整理；產品規格與提案版本維護",
    "responsibilities": [
      "市場與商業研究",
      "產品定位與規格組合企劃",
      "產品提案與商業可行性整理",
      "產品規格與提案版本維護"
    ],
    "representativeTasks": [
      {
        "workflowId": "S16",
        "title": "市場與商業研究",
        "kind": "core"
      },
      {
        "workflowId": "PP01",
        "title": "產品定位與規格組合企劃",
        "kind": "core"
      },
      {
        "workflowId": "PP02",
        "title": "產品提案與商業可行性整理",
        "kind": "core"
      },
      {
        "workflowId": "PP03",
        "title": "產品規格與提案版本維護",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S16",
      "PP01",
      "PP02",
      "PP03"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S17"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.產品研究／使用者研究員": {
    "id": "smb.產品開發.產品研究／使用者研究員",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "產品研究／使用者研究員",
    "description": "設計研究與使用者訪談；統計分析與洞察解讀；產品價值與問題定義",
    "responsibilities": [
      "設計研究與使用者訪談",
      "統計分析與洞察解讀",
      "產品價值與問題定義"
    ],
    "representativeTasks": [
      {
        "workflowId": "S09",
        "title": "設計研究與使用者訪談",
        "kind": "core"
      },
      {
        "workflowId": "A02",
        "title": "統計分析與洞察解讀",
        "kind": "core"
      },
      {
        "workflowId": "PR01",
        "title": "產品價值與問題定義",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "S09",
      "A02",
      "PR01"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.9,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S16"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.09999999999999998,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.工業設計師": {
    "id": "smb.產品開發.工業設計師",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "工業設計師",
    "description": "產品造型與使用體驗設計；CMF 與材料表面方案；工業設計原型與體驗驗證；工業設計規格與工程協調",
    "responsibilities": [
      "產品造型與使用體驗設計",
      "CMF 與材料表面方案",
      "工業設計原型與體驗驗證",
      "工業設計規格與工程協調"
    ],
    "representativeTasks": [
      {
        "workflowId": "ID01",
        "title": "產品造型與使用體驗設計",
        "kind": "core"
      },
      {
        "workflowId": "ID02",
        "title": "CMF 與材料表面方案",
        "kind": "core"
      },
      {
        "workflowId": "ID03",
        "title": "工業設計原型與體驗驗證",
        "kind": "core"
      },
      {
        "workflowId": "ID04",
        "title": "工業設計規格與工程協調",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "ID01",
      "ID02",
      "ID03",
      "ID04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.91,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "S09"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.08999999999999997,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.機構設計工程師": {
    "id": "smb.產品開發.機構設計工程師",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "機構設計工程師",
    "description": "結構與 CAD 設計；尺寸公差與材料檢核；裝配與樣品問題分析；機構實體驗證",
    "responsibilities": [
      "結構與 CAD 設計",
      "尺寸公差與材料檢核",
      "裝配與樣品問題分析",
      "機構實體驗證"
    ],
    "representativeTasks": [
      {
        "workflowId": "ME01",
        "title": "結構與 CAD 設計",
        "kind": "core"
      },
      {
        "workflowId": "ME02",
        "title": "尺寸公差與材料檢核",
        "kind": "core"
      },
      {
        "workflowId": "ME03",
        "title": "裝配與樣品問題分析",
        "kind": "core"
      },
      {
        "workflowId": "ME04",
        "title": "機構實體驗證",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "ME01",
      "ME02",
      "ME03",
      "ME04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.93,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "HW02"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  },
  "smb.產品開發.新產品導入／NPI 工程師": {
    "id": "smb.產品開發.新產品導入／NPI 工程師",
    "persona": "smb",
    "functionName": "產品開發",
    "title": "新產品導入／NPI 工程師",
    "description": "試產規劃與現場問題追蹤；製程文件與作業指導準備；試產良率與異常改善分析；工程交接與量產準備",
    "responsibilities": [
      "試產規劃與現場問題追蹤",
      "製程文件與作業指導準備",
      "試產良率與異常改善分析",
      "工程交接與量產準備"
    ],
    "representativeTasks": [
      {
        "workflowId": "NP01",
        "title": "試產規劃與現場問題追蹤",
        "kind": "core"
      },
      {
        "workflowId": "NP02",
        "title": "製程文件與作業指導準備",
        "kind": "core"
      },
      {
        "workflowId": "NP03",
        "title": "試產良率與異常改善分析",
        "kind": "core"
      },
      {
        "workflowId": "NP04",
        "title": "工程交接與量產準備",
        "kind": "core"
      }
    ],
    "workflowIds": [
      "NP01",
      "NP02",
      "NP03",
      "NP04"
    ],
    "workflowWeights": null,
    "modeledWorkShare": 0.93,
    "evidence": "expert-model-estimate",
    "extensionWorkflowIds": [
      "B11"
    ],
    "weightBasis": "actual-user-entered-baseline-minutes",
    "unmodeledWorkShare": 0.06999999999999995,
    "coverageScope": "本職業核心及適用延伸任務對日常工作的模型估計；不代表使用者已勾選工作或人工占比",
    "unmodeledWorkDescription": "未列出的特殊專案、突發支援與職務情境工作，應另行盤點；不以涵蓋率放大已選任務工時。"
  }
};
const migrationChoices = {
  "smb.產品管理與研發.產品經理／產品企劃": [
    "smb.產品開發.產品經理",
    "smb.產品開發.產品企劃"
  ],
  "smb.產品管理與研發.產品開發工程師（軟硬體）": [
    "smb.軟硬體專案開發.軟體開發工程師",
    "smb.軟硬體專案開發.韌體／嵌入式工程師",
    "smb.軟硬體專案開發.硬體研發工程師",
    "smb.產品開發.機構設計工程師"
  ],
  "soho.商務與顧問.軟硬體整合專案經理": [
    "soho.軟硬體專案開發.開發專案經理",
    "soho.軟硬體專案開發.軟體專案經理",
    "soho.軟硬體專案開發.硬體專案經理"
  ],
  "smb.產品管理與研發.專案經理（軟硬體整合）": [
    "smb.軟硬體專案開發.開發專案經理",
    "smb.軟硬體專案開發.軟體專案經理",
    "smb.軟硬體專案開發.硬體專案經理"
  ]
};

function deepFreeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(deepFreeze); Object.freeze(value); } return value; }
function metrics(id) {
 const t=tasks[id]; if(!t) throw Error('Unknown task: '+id);
 let retained=0, assist=0,compute=0;
 for(const s of t.stages) { const d=s.aiAssistShare,w=s.stageWorkShare; retained+=w*((1-d)+d*s.reviewAttention+d*s.exceptionRate*s.exceptionEffort);assist+=w*d;compute+=w*s.compute; }
 return {retainedHumanRatio:retained,coverageRate:assist*100,autonomyRate:assist ? t.stages.reduce((a,s)=>a+s.stageWorkShare*s.aiAssistShare*(1-s.reviewAttention),0)/assist*100:0,computeIntensity:compute,stepCount:t.stages.length,modelVersion:'3.0',evidence:'expert-model-estimate'};
}
function calculateTime(entries) {
 let baseline=0,human=0;const ids=new Set();
 for(const e of entries) { if(ids.has(e.id)) throw Error('Duplicate task: '+e.id); ids.add(e.id); }
 for(const e of entries) {const t=tasks[e.id];if(!t)throw Error('Unknown task');if(t.conflictsWith.some(id=>ids.has(id)))throw Error('Overlapping task: '+e.id);
 const b=Number(e.baselineMinutes),h=e.humanMinutes==null?b*metrics(e.id).retainedHumanRatio:Number(e.humanMinutes),f=e.frequency==null?1:Number(e.frequency);
 if(![b,h,f].every(Number.isFinite)||b<=0||h<0||f<=0)throw Error('Invalid time');baseline+=b*f;human+=h*f;}
 return {baselineMinutes:baseline,humanMinutes:human,sci:baseline>0?(1-human/baseline)*100:0,scope:'selected-tasks',evidence:'expert-model-estimate'};
}
function migrate(saved) {
 if(!saved || saved.schemaVersion!=='3.0')return {status:'reselect',reason:'資料模型已更新，請重新選擇職業及確認任務與工時；舊資料保留供對照。',previous:saved,choices:migrationChoices[saved?.roleId]||[]};
 const role=roles[saved.roleId];if(!role)return {status:'reselect',previous:saved,choices:migrationChoices[saved.roleId]||[]};
 const allowed=new Set([...role.workflowIds,...role.extensionWorkflowIds]);
 if((saved.selectedRecipeIds||[]).some(id=>!allowed.has(id)))return {status:'reselect',previous:saved,choices:[]};
 return {status:'valid',value:saved};
}
function validate() {
 for(const [id,t] of Object.entries(tasks)) {if(t.id!==id||!t.input||!t.output||!t.boundary||!t.cloneTag)throw Error('Invalid task '+id);if(Math.abs(t.stages.reduce((a,s)=>a+s.stageWorkShare,0)-1)>1e-6)throw Error('Invalid stage shares '+id); for(const s of t.stages) {if(!s.ai||!s.human||!s.input||!s.output||!s.exception||!s.completion)throw Error('Missing stage contract '+id);for(const x of [s.stageWorkShare,s.aiAssistShare,s.reviewAttention,s.exceptionRate,s.exceptionEffort])if(!Number.isFinite(x)||x<0||x>1)throw Error('Invalid ratio '+id);} }
 for(const r of Object.values(roles)) {const ids=[...r.workflowIds,...r.extensionWorkflowIds];if(new Set(ids).size!==ids.length||!r.workflowIds.length||ids.some(id=>!tasks[id]))throw Error('Invalid role '+r.id);}
 for(const choices of Object.values(migrationChoices))if(choices.some(id=>!roles[id]))throw Error('Invalid migration');
 return {roleCount:Object.keys(roles).length,uniqueTitleCount:new Set(Object.values(roles).map(r=>r.title)).size,workflowCount:Object.keys(tasks).length,referencedWorkflowCount:new Set(Object.values(roles).flatMap(r=>[...r.workflowIds,...r.extensionWorkflowIds])).size};
}
return deepFreeze({schemaVersion:'3.0',roles,workflowIds:Object.keys(tasks),getWorkflow:id=>tasks[id]||null,getRole:id=>roles[id]||null,getRolesForPersona:persona=>Object.values(roles).filter(r=>r.persona===persona),metrics,calculateTime,migrate,roleMigrationChoices:migrationChoices,getRoleMigrationChoices:id=>(migrationChoices[id]||[]).map(id=>roles[id]),validation:validate()});
})();
if(typeof globalThis!=='undefined')globalThis.SCIWorkflowV2=SCIWorkflowV2;
if(typeof module!=='undefined'&&module.exports)module.exports=SCIWorkflowV2;
