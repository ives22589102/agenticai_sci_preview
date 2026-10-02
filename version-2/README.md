# SCI 工作效益評估 Version 2

這個目錄是依 `SCI_UIUX_Review.md` 建立的獨立 V2 套件，不會載入或覆寫根目錄的原版檔案。

## 檔案

- `index.html`：V2 四步評估與報告結構
- `styles.css`：V2 完整視覺、響應式及動態偏好樣式
- `app.js`：V2 狀態、計算、互動、報告及設備推薦
- `workflow-data.js`：24 項任務流程資料快照

## 預覽

使用任一靜態伺服器開啟本目錄即可，例如從專案根目錄執行：

```powershell
python -m http.server 8000
```

然後前往 `http://127.0.0.1:8000/version-2/`。

## 版本隔離

V2 所有資源都以相對路徑載入本目錄檔案。根目錄的 `index.html`、`styles.css`、`app.js` 與 `workflow-data.js` 保持不變。

## 雲端方案估算

V2.1 先區分「未使用 AI／使用免費 AI／訂閱 AI」；只有選擇訂閱時，才展開 ChatGPT、Gemini 與 Claude 的付費方案。同一品牌只能選擇一個方案，不同品牌可同時選用，另保留「其他 AI／雲端工具支出」欄位。前台只顯示台幣月費；維護者可在 `app.js` 的 `USD_TWD_RATE` 與 `CLOUD_PLAN_CATALOG` 更新換算資料。

報告中的 Token 依 `1 Token = NT$0.00016` 換算，因此 `NT$1 = 6,250 Token`。
