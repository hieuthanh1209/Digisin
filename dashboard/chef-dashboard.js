document.addEventListener('DOMContentLoaded', function() {
    // Mock data for orders
    const mockOrders = [
        {
            id: '001',
            table: '5',
            items: [
                { name: 'Phở bò', quantity: 2 },
                { name: 'Cơm rang', quantity: 1 }
            ],
            status: 'pending'
        }
    ];

    const ordersList = document.querySelector('.orders-list');

    function renderOrders() {
        ordersList.innerHTML = mockOrders
            .filter(order => order.status === 'pending')
            .map(order => `
                <div class="card" style="width: 100%; margin-bottom: 1rem;">
                    <div class="card-header">
                        <h3>Đơn hàng #${order.id}</h3>
                        <span class="text-gray-500">Bàn số ${order.table}</span>
                    </div>
                    <div class="card-content">
                        <ul style="list-style: none;">
                            ${order.items.map(item => `
                                <li style="margin-bottom: 0.5rem;">${item.quantity}x ${item.name}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button class="button" onclick="completeOrder('${order.id}')">Hoàn thành</button>
                    </div>
                </div>
            `).join('');
    }

    // Initialize with mock data
    renderOrders();

    // Make completeOrder function global so it can be called from HTML
    window.completeOrder = function(orderId) {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'completed';
            renderOrders();
        }
    };
}); 