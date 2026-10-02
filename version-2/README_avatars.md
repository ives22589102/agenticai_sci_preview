# SCI 分身頭貼（24 款）

- `avatars/S01.webp` 至 `avatars/B08.webp`：256 × 256 px、透明背景，適合網頁以 40–80 px 顯示。
- `avatars.json`：`recipeCatalog` 的 ID、分身名稱與圖檔對照。
- `preview.png`：24 款總覽。

將 `avatars/` 放在網站可讀取的目錄。例如放在網站根目錄的 `assets/avatars/`，便可用 `'/assets/avatars/' + recipe.id + '.webp'` 取得圖檔。請依網站部署路徑調整前綴。

```html
<img class="agent-avatar" src="assets/avatars/S01.webp" alt="票據整理分身" width="56" height="56">
```

```css
.agent-avatar { width: 56px; height: 56px; object-fit: contain; border-radius: 14px; background: #18283b; }
```
