# 專案入口

`version-2/` 是唯一的測驗網站版本。開啟此目錄的 `index.html`，或從專案根目錄的 `index.html` 自動轉入。

- `index.html`：測驗頁面與資源載入。
- `styles.css`：原有元件基礎樣式。
- `redesign.css`：新版色彩、排版、卡片、動效與響應式樣式。
- `app.js`：測驗互動、計算與報告。
- `workflow-data.js`：題目與工作流程資料。
- `img/`、`avatars/`：網站圖片。
- `docs/`：既有規格與改版紀錄；專案根目錄的 `備份/` 保留舊版素材。

改版僅調整樣式；測驗文案、互動、資料收集端點與題庫維持原樣。若外部程式恢復舊測驗資料，使用 `globalThis.restoreSciAssessment(saved)`。
