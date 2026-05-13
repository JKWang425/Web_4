document.addEventListener('DOMContentLoaded', async () => {
    const priceForm = document.getElementById('priceForm');
    const priceHistoryBody = document.getElementById('priceHistoryBody');

    // 載入所有價格紀錄並渲染表格
    await loadPrices();

    // 設定日期輸入框為今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // 表單提交事件
    priceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const record_date = document.getElementById('date').value;
        const item_name = document.getElementById('name').value;
        const price = parseInt(document.getElementById('price').value);

        try {
            const response = await fetch('/api/prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    record_date: record_date,
                    item_name: item_name,
                    price: price
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert('新增紀錄成功！');
                priceForm.reset();
                document.getElementById('date').value = today; // 重置為今天
                loadPrices(); // 重新載入所有價格
            } else {
                alert('新增失敗：' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('發生錯誤，請稍後再試');
        }
    });

    async function loadPrices() {
        try {
            const response = await fetch('/api/prices');
            const prices = await response.json();
            
            if (prices.length === 0) {
                priceHistoryBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">還沒有價格紀錄</td></tr>';
                return;
            }

            priceHistoryBody.innerHTML = prices.map(price => `
                <tr>
                    <td>${price.record_date}</td>
                    <td>${price.item_name}</td>
                    <td>$${price.price}元</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Failed to load prices:', error);
            priceHistoryBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">載入價格紀錄失敗</td></tr>';
        }
    }
});