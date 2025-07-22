// PayOS Configuration for Vercel + Render setup
const PAYOS_CONFIG = {
    // Development (local)
    development: {
        serverUrl: 'http://localhost:3000'
    },
    
    // Production (Vercel + Render)
    production: {
        serverUrl: 'https://digisin-payos-server.onrender.com' // Render server URL
    }
};

// Auto-detect environment
const currentEnv = (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
) ? 'development' : 'production';

const CONFIG = PAYOS_CONFIG[currentEnv];

console.log(`🌍 Environment: ${currentEnv}`);
console.log(`🔗 PayOS Server: ${CONFIG.serverUrl}`);

// Export configuration
window.PAYOS_CONFIG = CONFIG;

// PayOS API functions
class PayOSClient {
    constructor() {
        this.serverUrl = CONFIG.serverUrl;
    }

    async createPaymentLink(paymentData) {
        try {
            console.log('🔄 Creating payment link...', paymentData);
            
            const response = await fetch(`${this.serverUrl}/create-payment-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Payment link created:', result);
            return result;

        } catch (error) {
            console.error('❌ Payment creation failed:', error);
            throw error;
        }
    }

    async getPaymentInfo(orderId) {
        try {
            const response = await fetch(`${this.serverUrl}/get-payment-info/${orderId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Get payment info failed:', error);
            throw error;
        }
    }

    async cancelPayment(orderCode, reason = 'Cancelled by user') {
        try {
            const response = await fetch(`${this.serverUrl}/cancel-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderCode,
                    cancellationReason: reason
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Cancel payment failed:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/test`);
            const result = await response.json();
            console.log('🧪 Server test:', result);
            return result;
        } catch (error) {
            console.error('❌ Server connection failed:', error);
            throw error;
        }
    }
}

// Create global PayOS client instance
window.payOSClient = new PayOSClient();

// Example usage for your restaurant orders
async function createRestaurantPayment(order) {
    try {
        const paymentData = {
            orderCode: order.id || Date.now(),
            amount: order.total || order.totalAmount,
            description: `Thanh toán đơn hàng ${order.id || 'mới'} - ${order.table || 'Takeaway'}`,
            items: order.items?.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })) || [{
                name: 'Đơn hàng nhà hàng',
                quantity: 1,
                price: order.total || order.totalAmount
            }],
            returnUrl: `${window.location.origin}/payment/success?orderId=${order.id}`,
            cancelUrl: `${window.location.origin}/payment/cancel?orderId=${order.id}`,
            buyerName: order.customerName,
            buyerPhone: order.customerPhone,
            buyerEmail: order.customerEmail
        };

        const result = await window.payOSClient.createPaymentLink(paymentData);
        
        if (result.success && result.data) {
            // Redirect to payment page
            window.open(result.data.checkoutUrl, '_blank');
            return result;
        } else {
            throw new Error('Invalid payment response');
        }

    } catch (error) {
        console.error('Payment creation failed:', error);
        alert('Không thể tạo link thanh toán. Vui lòng thử lại!');
        throw error;
    }
}

// Make it globally available
window.createRestaurantPayment = createRestaurantPayment;

// Test connection on load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.payOSClient.testConnection();
        console.log('✅ PayOS server connected successfully');
    } catch (error) {
        console.warn('⚠️ PayOS server connection failed:', error);
    }
});
