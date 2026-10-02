'use strict';

function workflowStep(name, share, delegation, review, exceptionRate, exceptionEffort, compute) {
    return Object.freeze({ name, share, delegation, review, exceptionRate, exceptionEffort, compute });
}

function workflowModel(id, steps) {
    return Object.freeze({
        id,
        version: '1.0',
        evidence: 'modeled',
        steps: Object.freeze(steps)
    });
}

const workflowProcessCatalog = Object.freeze({
    S01: workflowModel('S01', [
        workflowStep('收集與辨識票據', .24, .95, .04, .04, .18, 2),
        workflowStep('欄位標準化', .20, .92, .06, .05, .20, 2),
        workflowStep('分類與稅別建議', .22, .82, .12, .08, .28, 2),
        workflowStep('重複與異常檢查', .18, .78, .16, .10, .30, 2),
        workflowStep('確認並匯入帳務', .16, .35, .52, .06, .24, 1)
    ]),
    S02: workflowModel('S02', [
        workflowStep('素材盤點與片段偵測', .18, .90, .06, .06, .20, 4),
        workflowStep('候選剪輯與節奏編排', .30, .82, .10, .10, .28, 5),
        workflowStep('字幕與文字校正', .18, .90, .08, .08, .22, 4),
        workflowStep('平台尺寸與文案版本', .20, .88, .08, .06, .20, 4),
        workflowStep('版權確認與發布', .14, .28, .58, .05, .22, 2)
    ]),
    S03: workflowModel('S03', [
        workflowStep('彙整客戶需求', .22, .82, .10, .08, .24, 2),
        workflowStep('套用服務與價格規則', .24, .78, .12, .08, .28, 2),
        workflowStep('估算時程與資源', .20, .68, .18, .10, .30, 2),
        workflowStep('產生報價文件草稿', .20, .90, .06, .05, .18, 2),
        workflowStep('商業判斷與寄送確認', .14, .22, .65, .04, .18, 1)
    ]),
    S04: workflowModel('S04', [
        workflowStep('整理主題與溝通目標', .18, .72, .15, .08, .24, 2),
        workflowStep('內容架構與初稿', .28, .82, .12, .10, .28, 3),
        workflowStep('平台版本改寫', .24, .90, .08, .07, .22, 3),
        workflowStep('品牌與事實檢核', .18, .56, .26, .10, .30, 2),
        workflowStep('核准與排程發布', .12, .22, .68, .05, .20, 1)
    ]),
    S05: workflowModel('S05', [
        workflowStep('整理主視覺與素材', .18, .76, .12, .08, .22, 3),
        workflowStep('套用尺寸與版型', .26, .92, .06, .06, .18, 4),
        workflowStep('候選修圖與延伸版本', .28, .78, .14, .12, .30, 5),
        workflowStep('輸出格式與檔名整理', .14, .94, .05, .04, .16, 3),
        workflowStep('視覺品質與品牌確認', .14, .18, .72, .05, .20, 2)
    ]),
    S06: workflowModel('S06', [
        workflowStep('音訊前處理', .10, .92, .05, .05, .18, 3),
        workflowStep('語音轉錄與分段', .42, .96, .04, .08, .20, 4),
        workflowStep('人名數字與專有名詞校對', .18, .68, .22, .12, .32, 2),
        workflowStep('摘要重點與待辦整理', .20, .88, .08, .08, .24, 3),
        workflowStep('原意與引用確認', .10, .24, .62, .06, .24, 1)
    ]),
    S07: workflowModel('S07', [
        workflowStep('收集訊息與需求', .20, .86, .08, .08, .22, 2),
        workflowStep('需求分類與缺漏提示', .22, .82, .12, .10, .28, 2),
        workflowStep('建立待辦與負責人草稿', .22, .84, .10, .08, .24, 2),
        workflowStep('進度彙整與提醒', .20, .90, .06, .06, .20, 2),
        workflowStep('承諾與優先順序確認', .16, .20, .68, .06, .24, 1)
    ]),
    S08: workflowModel('S08', [
        workflowStep('理解需求與既有程式', .20, .58, .22, .12, .32, 3),
        workflowStep('產生修改方案與程式草稿', .30, .76, .16, .14, .36, 4),
        workflowStep('建立基本測試', .18, .74, .16, .12, .32, 4),
        workflowStep('除錯與修正建議', .18, .60, .24, .18, .42, 4),
        workflowStep('審查合併與發布', .14, .12, .80, .06, .28, 2)
    ]),
    E01: workflowModel('E01', [
        workflowStep('文件解析與來源定位', .20, .90, .07, .08, .22, 3),
        workflowStep('摘要與概念分類', .28, .82, .12, .10, .28, 3),
        workflowStep('題目與選項草稿', .24, .76, .16, .12, .32, 3),
        workflowStep('答案與解析草稿', .16, .68, .22, .12, .34, 3),
        workflowStep('引用與學術判斷', .12, .14, .78, .06, .26, 1)
    ]),
    E02: workflowModel('E02', [
        workflowStep('整理教學目標與資料', .16, .70, .16, .08, .24, 2),
        workflowStep('教案與課程結構草稿', .22, .78, .14, .10, .28, 3),
        workflowStep('簡報與講義內容生成', .34, .88, .09, .10, .26, 4),
        workflowStep('LMS 內容與作業格式準備', .16, .90, .07, .07, .22, 3),
        workflowStep('正確性與教學適切性審核', .12, .16, .74, .06, .24, 1)
    ]),
    E03: workflowModel('E03', [
        workflowStep('讀取作業與格式規則', .16, .86, .09, .07, .22, 2),
        workflowStep('格式與缺漏比對', .24, .92, .06, .08, .22, 2),
        workflowStep('相似內容與異常提示', .24, .76, .16, .14, .36, 3),
        workflowStep('建立逐案檢核清單', .18, .84, .10, .08, .26, 2),
        workflowStep('查證與正式評分', .18, .10, .86, .06, .28, 1)
    ]),
    E04: workflowModel('E04', [
        workflowStep('資料格式與欄位檢查', .18, .90, .07, .08, .22, 3),
        workflowStep('缺值與異常資料處理', .24, .78, .14, .14, .36, 3),
        workflowStep('描述統計與轉換', .22, .88, .08, .10, .28, 4),
        workflowStep('圖表與結果摘要草稿', .22, .82, .12, .10, .28, 4),
        workflowStep('方法與結論判斷', .14, .16, .76, .08, .30, 2)
    ]),
    E05: workflowModel('E05', [
        workflowStep('音訊整理與降噪', .08, .98, .02, .03, .10, 3),
        workflowStep('轉錄與說話者分段', .52, .99, .01, .03, .12, 4),
        workflowStep('章節與重點整理', .16, .95, .03, .04, .15, 3),
        workflowStep('待辦與複習摘要', .18, .95, .03, .04, .15, 3),
        workflowStep('內容與決議抽查', .06, .35, .40, .05, .20, 1)
    ]),
    E06: workflowModel('E06', [
        workflowStep('匯入題目與作答紀錄', .14, .88, .08, .06, .20, 2),
        workflowStep('錯題類型分類', .24, .82, .12, .10, .28, 2),
        workflowStep('解題提示與解析草稿', .28, .72, .18, .14, .36, 3),
        workflowStep('複習計畫與提醒安排', .20, .86, .10, .08, .24, 2),
        workflowStep('解法驗證與理解確認', .14, .16, .76, .08, .30, 1)
    ]),
    E07: workflowModel('E07', [
        workflowStep('理解規格與既有程式', .18, .56, .24, .12, .34, 3),
        workflowStep('產生程式與註解草稿', .28, .76, .16, .14, .36, 4),
        workflowStep('測試案例與執行檢查', .20, .78, .14, .12, .34, 4),
        workflowStep('除錯與修正建議', .20, .62, .22, .18, .42, 4),
        workflowStep('正確性與可重現性確認', .14, .12, .80, .08, .32, 2)
    ]),
    E08: workflowModel('E08', [
        workflowStep('匯入與辨識行政資料', .20, .92, .06, .06, .20, 2),
        workflowStep('欄位標準化與名單整理', .24, .90, .07, .08, .22, 2),
        workflowStep('缺漏與衝突提示', .20, .84, .10, .10, .28, 2),
        workflowStep('通知與表單草稿', .20, .88, .08, .08, .24, 2),
        workflowStep('個資、名單與寄送確認', .16, .18, .72, .06, .26, 1)
    ]),
    B01: workflowModel('B01', [
        workflowStep('匯入多來源訂單', .18, .92, .06, .06, .20, 3),
        workflowStep('欄位映射與格式統一', .22, .90, .07, .08, .22, 3),
        workflowStep('去重與訂單配對', .20, .86, .10, .10, .28, 3),
        workflowStep('對帳與差異標記', .24, .78, .15, .14, .36, 3),
        workflowStep('正式寫入與開票確認', .16, .18, .72, .06, .28, 2)
    ]),
    B02: workflowModel('B02', [
        workflowStep('擷取價格與商品資訊', .24, .94, .05, .08, .20, 3),
        workflowStep('彙整評論與來源', .22, .92, .06, .08, .22, 3),
        workflowStep('評論分類與主題聚合', .22, .86, .09, .10, .26, 4),
        workflowStep('週報與圖表草稿', .20, .88, .08, .08, .24, 4),
        workflowStep('來源偏誤與市場解讀', .12, .18, .72, .08, .30, 2)
    ]),
    B03: workflowModel('B03', [
        workflowStep('匯入各部門資料', .18, .90, .07, .08, .22, 3),
        workflowStep('統一欄位與指標口徑', .24, .76, .16, .12, .32, 3),
        workflowStep('缺漏與異常檢查', .18, .84, .11, .12, .32, 3),
        workflowStep('圖表與摘要草稿', .24, .88, .08, .08, .24, 4),
        workflowStep('數字與決策內容確認', .16, .16, .76, .06, .28, 1)
    ]),
    B04: workflowModel('B04', [
        workflowStep('讀取與分類工單', .20, .92, .06, .08, .22, 2),
        workflowStep('查找知識與歷史案例', .22, .84, .11, .10, .28, 3),
        workflowStep('產生回覆草稿', .26, .82, .13, .12, .32, 3),
        workflowStep('辨識升級與風險事件', .16, .68, .20, .16, .40, 3),
        workflowStep('退款承諾與正式回覆', .16, .14, .80, .08, .32, 1)
    ]),
    B05: workflowModel('B05', [
        workflowStep('整理商品規格與素材', .20, .86, .09, .08, .22, 3),
        workflowStep('商品文案與欄位草稿', .24, .88, .08, .10, .26, 3),
        workflowStep('圖片尺寸與版本處理', .26, .84, .10, .10, .28, 5),
        workflowStep('平台格式與上架草稿', .18, .90, .07, .08, .22, 3),
        workflowStep('規格價格與發布確認', .12, .16, .76, .06, .26, 1)
    ]),
    B06: workflowModel('B06', [
        workflowStep('文件解析與版本對齊', .18, .88, .08, .08, .22, 3),
        workflowStep('條款差異比對', .28, .84, .11, .12, .32, 3),
        workflowStep('缺漏與風險項提示', .22, .66, .22, .16, .40, 3),
        workflowStep('條款索引與摘要草稿', .16, .86, .10, .08, .24, 2),
        workflowStep('專業審閱與法律判斷', .16, .08, .88, .08, .34, 1)
    ]),
    B07: workflowModel('B07', [
        workflowStep('匯入費用與分攤資料', .18, .92, .06, .06, .20, 2),
        workflowStep('套用分攤規則', .26, .86, .10, .10, .28, 2),
        workflowStep('整數與尾差調整', .18, .82, .12, .10, .30, 2),
        workflowStep('建立請款表單草稿', .22, .90, .07, .08, .22, 2),
        workflowStep('預算歸屬與核准', .16, .16, .76, .06, .26, 1)
    ]),
    B08: workflowModel('B08', [
        workflowStep('音訊整理與轉錄', .34, .95, .05, .08, .20, 4),
        workflowStep('決議與議題分類', .20, .86, .10, .10, .28, 3),
        workflowStep('負責人與期限辨識', .18, .78, .15, .12, .34, 3),
        workflowStep('待辦清單與追蹤草稿', .18, .88, .08, .08, .24, 3),
        workflowStep('權責、決議與通知確認', .10, .18, .72, .06, .28, 1)
    ])
});
