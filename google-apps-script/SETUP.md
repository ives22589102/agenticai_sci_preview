# SCI 匿名評估資料收集建置

這套流程會把：

- 每位瀏覽器使用者的隨機匿名 ID
- 使用者於 Step 1–3 填寫的全部答案
- SCI、工時、成本、Token、影分身與設備推薦結果
- 最終完整報表 PNG

寫入 Google Sheet／Google Drive。PNG 與完整 JSON 會放在私人 Drive 資料夾，Sheet 會保留可分析欄位與兩個附件連結。

## 1. 建立 Apps Script

1. 使用管理資料的 Google 帳號開啟 <https://script.google.com/>。
2. 建立新專案，例如命名為「ASUS SCI 匿名評估資料庫」。
3. 刪除預設 `Code.gs`，貼上本資料夾的 `Code.gs` 全文。
4. 儲存。
5. 上方函式選單選擇 `setup`，按「執行」。
6. 第一次執行時完成 Google 授權。程式需要試算表與雲端硬碟權限。
7. 執行紀錄會顯示自動建立的試算表與附件資料夾網址。

如果你希望使用既有資源，可把 `SPREADSHEET_ID`、`DRIVE_FOLDER_ID` 填入 `Code.gs`。留空時程式會自動建立，並把 ID 存在 Apps Script 的「指令碼屬性」。

## 2. 部署成網頁應用程式

1. 右上角選「部署」→「新增部署作業」。
2. 類型選「網頁應用程式」。
3. 「以下列身分執行」選「我」。
4. 「誰可以存取」選「所有人」。
5. 部署並複製 `/exec` 結尾的網址。
6. 用無痕視窗打開該網址；看到 `OK - ASUS SCI anonymous collection endpoint` 即表示端點可用。

## 3. 把端點貼回網站

在根目錄與 `version-2/app.js` 搜尋：

```js
const DATA_COLLECTION_CONFIG = Object.freeze({
    endpoint: '',
```

將網址貼入：

```js
endpoint: 'https://script.google.com/macros/s/你的部署ID/exec',
```

兩份 `app.js` 必須填入相同網址。

## 4. 實際流程

1. 使用者第一次開啟頁面時，瀏覽器會產生 `SCI-U-...` 匿名 ID，並存入 `localStorage`。
2. Step 3 的「查看我的影分身效益」按鈕下方會顯示常駐備註，說明按下後會匿名提供填寫內容與計算結果，並提供「了解蒐集內容」連結開啟詳細說明。
3. 使用者按下按鈕後，報告立即顯示，資料在背景送出，不阻斷畫面。
4. 不想提供資料的使用者，就是不要按下該按鈕（詳細說明視窗內也明寫這點）。
5. 背景送出失敗不會打擾使用者；狀態記錄在 `assessmentState.collectionStatus`，並發出 `sci:analytics` 事件 `anonymous_data_submitted` 或 `anonymous_data_failed`，可在 console 或既有分析管道觀察。
6. Apps Script 把分析欄位寫入 Sheet，並把 PNG／完整 JSON 存入 Drive。
7. 使用者退回 Step 3 修改答案後再前進，系統會重算報告並**再送出一筆新紀錄**（新的評估 ID），不覆蓋先前資料。答案沒有變動時不會重複送出。

> 因為修改答案會產生新紀錄，同一位匿名 ID 在 Sheet 中可能有多列。分析時若只要最終版本，請依「匿名 ID」分組後取「收到時間」最新的一列。

## 5. 資料與隱私注意事項

- 前端不主動收集姓名、Email、電話或 IP。
- **目前採推定同意**：按下按鈕即視為同意，而非勾選式明示同意（opt-in）。這種設計在 PDPA／GDPR 類規範下效力較弱。按鈕旁的常駐備註與「了解蒐集內容」說明是支撐這個設計的必要條件，請勿移除或縮小到難以察覺。若日後需要較強的法律依據，應改回明示勾選或加入可退出選項。
- 隨機 ID 只能降低直接識別性，不能在法律上保證所有資料都「絕對匿名」。工作內容、成本或任務組合仍可能形成間接識別資訊，因此同意文字會明確列出蒐集範圍。
- Drive 資料夾預設為私人。需要同事查看時，請只邀請指定帳號，不要開放為「知道連結的任何人」。
- Apps Script 網頁端點是公開的，仍可能被惡意呼叫。程式已加入每小時總量限制、評估 ID 去重與輸入驗證；正式大量投放前可再加 Cloudflare Turnstile 或 reCAPTCHA。
- Apps Script 更新 `doPost` 後，必須到「部署 → 管理部署作業 → 編輯 → 新版本 → 部署」。只有按儲存不會更新正式端點。

## 6. 上線前檢查

- `setup()` 能建立並開啟 Sheet／Drive 資料夾。
- `/exec` 網址在無痕視窗顯示 OK。
- 根目錄與 `version-2/app.js` 都已貼入同一個端點。
- 同意後 Sheet 新增一列，Drive 同時新增 `.png` 與 `.json`。
- 未按下「查看我的影分身效益」時，Sheet 不新增任何資料。
- 退回 Step 3 改答案再前進，Sheet 會多一列新的評估 ID。
- 答案未變動時按上一步再下一步，不會重複送出。
- 報表上傳失敗時，畫面提供重試與直接查看報告。

目前專案中的 `endpoint` 維持空白，因此本機版本不會真的傳送資料，也尚未推送 GitHub。
