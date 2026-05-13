# ☕ CITY CAFE 價格觀測站 - 實作紀錄與教學

> **基本資料**
> 姓名：[王浩閔]
> 班級：[資訊二丙]
> 網站標題：CITY CAFE 價格觀測站

---

## 壹、提案與商品介紹 (Proposal)

### 為什麼選擇「7-11 CITY CAFE」？
咖啡是許多學生與上班族每天不可或缺的精神糧食。作為台灣超商咖啡的龍頭，7-11 CITY CAFE 的價格變動（例如：特選美式、精品拿鐵等品項的定價策略）往往能真實反映出民生物價與通膨（CPI）的波動。因此，我選擇開發這個「CITY CAFE 價格觀測站」，希望透過持續記錄不同品項的價格，來觀察長期的物價趨勢。

---

## 貳、規格定義 (Specification)

本專案採用前後端分離架構開發，以下為系統規格表：

| 功能模組 | 規格說明 (Spec) |
| -------- | -------------- |
| **前端介面** | 使用 HTML5 + Bootstrap 5 打造咖啡色系主題。具備 RWD 響應式設計。 |
| **資料輸入** | 提供表單輸入【紀錄日期】(預設為今日)、【商品名稱】(支援下拉選單與手動輸入)、【價格】。 |
| **資料查詢** | 提供即時模糊搜尋功能，可輸入品項或日期過濾歷史紀錄，並以表格呈現。 |
| **資料刪除** | 提供單筆紀錄刪除功能，並搭配 Bootstrap Toast 顯示操作成功/失敗提示。 |
| **後端 API** | 使用 Node.js + Express.js 開發 RESTful API (`GET`, `POST`, `DELETE`)。 |
| **資料庫** | 採用 SQLite 關聯式資料庫，確保伺服器重啟後資料持久化保存。 |

---

## 參、執行流程與畫面 (Flow & Screenshots)

以下為本機端 (localhost) 的完整執行流程與畫面操作教學：

### 1. 啟動伺服器
在終端機輸入 `npm install` 安裝相依套件後，輸入 `npm start` 啟動伺服器。
此時系統會自動建立 `database.db` 並寫入預設測試資料。
*(請在此處貼上終端機顯示 `Server running on port 3000` 的截圖)*
!啟動伺服器截圖

### 2. 新增價格紀錄
打開瀏覽器進入 `http://localhost:3000`，在左側表單選擇「特選拿鐵大杯」、輸入價格「65」，點擊儲存。右下角會彈出「新增成功」的綠色提示，且表格會立即更新。
*(請在此處貼上網頁畫面，並捕捉到右下角綠色 Toast 提示的截圖)*
!新增紀錄截圖

### 3. 模糊搜尋與刪除功能
在歷史紀錄右上角的搜尋框輸入「精品」，表格會即時過濾出所有精品咖啡的紀錄。點擊右側的垃圾桶圖示，確認後即可刪除該筆資料。
*(請在此處貼上正在搜尋「精品」的網頁畫面截圖)*
!搜尋與刪除截圖

---

## 肆、核心程式碼設計解析 (Design)

為了讓大家能跟著這份文件學習，以下挑選出本網站的三大核心程式碼進行解析：

### 1. 前端：發送 POST 請求與錯誤處理 (Vanilla JS)
在 `public/index.html` 中，我們透過原生 `fetch` API 將表單資料送往後端，並加入嚴謹的 JSON 格式檢查，避免伺服器發生未預期錯誤時前端崩潰：

```javascript
// 將表單轉為 JSON 送到後端
const response = await fetch('/api/prices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});

if (response.ok) {
    showToast('success', '新增成功', '價格紀錄已成功加入資料庫！');
    loadPrices(searchInput.value); // 重新載入表格
} else {
    // 檢查回傳格式，安全處理錯誤
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const errData = await response.json();
        throw new Error(errData.error);
    } else {
        throw new Error(`伺服器回傳了錯誤 (HTTP ${response.status})`);
    }
}
```

### 2. 後端：動態 Port 設定與 DELETE 路由 (Express.js)
...
### 3. 資料庫：模糊搜尋查詢 (SQLite)
...

> **結語**：透過這份專案，不僅學習了 Node.js 與 SQLite 的整合，更了解了如何透過 SDD (規格驅動開發) 先擬定好需求再進行實作，大幅減少了開發過程中的盲點！