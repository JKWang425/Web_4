這是一份為你的作業需求量身打造的「CITY CAFE 價格觀測站」專案規格與技術文件大綱。這份規格書不僅涵蓋了你提供的作業檢查清單（A、B、C、D區塊），也整理了後續開發與撰寫技術說明文件時的結構，你可以直接將這份內容複製到 HackMD 或 Notion 中作為你的期末文件基礎。

# ---

**CITY CAFE 價格觀測站 \- 專案規格與技術說明文件**

## **1\. 專案概述**

本專案為一個簡易的網頁應用程式，旨在追蹤與記錄 7-11 CITY CAFE 的商品價格變化。使用者可以透過前端介面手動輸入咖啡品項、價格與日期，系統會將這些資料永久儲存於資料庫中，並以表格方式列出歷史紀錄，方便觀察物價的波動趨勢。

## **2\. 商品介紹與選擇理由 (對應 Spec D2)**

* **商品介紹**：CITY CAFE 是 7-ELEVEN 推出的現煮咖啡品牌，品項包含美式咖啡、拿鐵、燕麥奶拿鐵等，是台灣便利商店中最具代表性的飲品之一。  
* **選擇理由**：平時熬夜寫程式、趕專題時，常常需要靠超商咖啡來提神，CITY CAFE 幾乎是每天必備的日常消費。因為購買頻率極高，即使是 5 元的價格調漲，對每個月的生活費也會產生有感影響。選擇這個主題，不僅能將技術應用在貼近自身日常的情境中，也能最直觀地觀察到通膨對學生族群三餐與飲食開銷的實際影響。

## **3\. 系統架構與技術選型 (對應 Spec B1, B2, B3)**

* **前端 (Frontend)**：HTML5 / CSS3 / Vanilla JavaScript (純原生 JS，不依賴任何框架)  
* **後端 (Backend)**：Node.js 搭配 Express.js 框架  
* **資料庫 (Database)**：SQLite  
* **通訊方式**：前端透過原生的 fetch API 向後端發送 HTTP 請求 (RESTful API) 進行資料的讀寫。

## **4\. 網站功能設計 (對應 Spec A1\~A6)**

* **自訂標題 (A2)**：網頁主視覺標題為「CITY CAFE 價格觀測站」。  
* **資料輸入區 (A3)**：提供三個必填輸入框：  
  1. 日期 (Date input)  
  2. 商品名稱 (Text input，例如：大杯美式、中杯拿鐵)  
  3. 商品價格 (Number input)  
* **資料呈現區 (A5)**：在輸入區下方，使用 HTML \<table class="history-table"\> 呈現所有寫入的歷史紀錄。欄位包含「紀錄日期」、「品項名稱」與「價格」。  
* **持久化儲存 (A4)**：使用者點擊「新增紀錄」後，資料將透過 API 寫入 SQLite。重新整理頁面時，前端會發送 GET 請求撈取資料庫數據並重新渲染表格，確保資料不遺失。  
* **測試資料 (A6)**：系統初始化時，資料庫中將預先寫入至少 3 筆不同時期的價格紀錄（如：2024年的大杯美式、2025年的大杯美式等），以利展示物價變化。  
* **啟動機制 (A1)**：專案確保可透過 npm install 安裝相依套件，並以 npm start 在 localhost:3000 成功運行，終端機無報錯。

## **5\. API 路由設計與資料庫 Schema**

### **資料庫結構 (price\_history 表格)**

| 欄位名稱 | 資料型態 | 屬性 |
| :---- | :---- | :---- |
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| record\_date | TEXT | NOT NULL |
| item\_name | TEXT | NOT NULL |
| price | INTEGER | NOT NULL |

### **後端 API 規格**

1. **取得所有紀錄**  
   * GET /api/prices  
   * 回傳格式：JSON Array  
2. **新增一筆紀錄**  
   * POST /api/prices  
   * 接收格式：JSON Object { "date": "...", "item\_name": "...", "price": ... }

## **6\. 程式碼繳交規範 (對應 Spec C1\~C4)**

* 建立公開的 GitHub Repository。  
* 根目錄下必須包含 .gitignore 檔案，確保 node\_modules/ 與 \*.sqlite (視情況) 不被推送到儲存庫中。  
* 準備完整的 package.json：

JSON

{  
  "name": "city-cafe-price-tracker",  
  "version": "1.0.0",  
  "main": "server.js",  
  "scripts": {  
    "start": "node server.js"  
  },  
  "dependencies": {  
    "express": "^4.18.2",  
    "sqlite3": "^5.1.6",  
    "cors": "^2.8.5"  
  }  
}

## **7\. 技術說明文件撰寫重點 (對應 Spec D1, D3, D4, D5)**

*(這部分是你開發完畢後要截圖補上的內容)*

* **執行流程截圖 (至少 3 張)**：  
  1. 終端機執行 npm start 成功畫面與瀏覽器進入 localhost:3000 的首頁截圖。  
  2. 在輸入框打上資料並按下送出按鈕的畫面截圖。  
  3. 網頁下方表格成功顯示剛剛新增資料的截圖。  
* **關鍵程式碼片段與教學說明**：  
  * **前端發送請求**：

JavaScript

fetch('/api/prices', {  
    method: 'POST',  
    headers: {  
        'Content-Type': 'application/json'  
    },  
    body: JSON.stringify({  
        record\_date: document.getElementById('date').value,  
        item\_name: document.getElementById('name').value,  
        price: document.getElementById('price').value  
    })  
})  
.then(res \=\> res.json())  
.then(data \=\> {  
    loadPrices();  
})  
.catch(err \=\> console.error(err));

*(文件內記得補充說明：這段程式碼負責將前端畫面輸入的值打包成 JSON，並透過 POST 方法送到後端。)*

---

**下一步建議：**

你可以先按照這個規格把基礎的資料夾結構建出來（public/ 放 HTML/CSS/JS，根目錄放 server.js 跟 package.json）。如果有哪一個部分的程式碼（例如前端的版面，或是 Express \+ SQLite 的連線設置）需要幫忙起個頭，隨時可以告訴我！