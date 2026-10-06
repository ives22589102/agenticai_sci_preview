# ASUS Agent Computer｜影分身戰力解鎖（SCI 工作效益評估）

開啟根目錄的 `index.html` 即為測驗網站。純靜態網頁，不需要建置。本機預覽可執行 `python -m http.server 8765` 後開啟 http://localhost:8765/ 。

## 檔案

- `index.html`：測驗頁面與資源載入。
- `css/styles.css`：全站樣式。
- `js/app.js`：測驗互動、計算、推薦邏輯與報告。
- `js/workflow-data.js`：職務、任務與工作流程資料。
- `img/`：網站圖片。
  - `img/banner/`：首頁 banner 的背景與圖層。
  - `img/avatars/`：七張影分身分類頭貼（`agent-*.webp`）。
  - `img/devices/`：推薦設備的產品圖。
- `google-apps-script/`：匿名資料收集的後端腳本與設定說明。
- `docs/`：規則與對照文件，見下方。

## 文件

- `docs/SCI網站說明文件.xlsx`：整個網站的總說明，含用途、流程、計算公式、指標、推薦邏輯、職務與 155 個任務的人機協作比例。
- `docs/推薦邏輯.md`：設備等級與情境怎麼判定。
- `docs/影分身分類.md`：七大分類與頭貼對應，以及新增任務時要填的欄位。
- `docs/外部連結清單.md`：網站上所有外部連結與圖片來源。

## 修改後記得

`index.html` 載入 CSS 和 JS 時帶有版本號（例如 `css/styles.css?v=6.17.2`）。改了檔案內容要把對應的版本號加大，使用者的瀏覽器才會抓到新版。

## 備份

專案根目錄的 `備份/` 保留舊版與未使用的素材，不納入版本控制：

- `備份/舊版程式/`：改版前的程式與樣式。
- `備份/文件/`：規格文件與影分身分類表。
- `備份/圖片/`：舊版圖片與原本的 24 張頭像。
- `備份/version-2-未使用/`：V2 改版時沒有用到的文件與圖片。

若外部程式要恢復舊測驗資料，使用 `globalThis.restoreSciAssessment(saved)`。
