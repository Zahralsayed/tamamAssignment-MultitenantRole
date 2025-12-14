//const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = '/api';

const getHeaders = (tenantId, role) => ({
    'Content-Type': 'application/json',
    'mock-Session': `${tenantId},${role}`,
});

export const api = {


//login: async (tenantId, role, userName) => {
//    const response = await fetch(`${API_BASE_URL}/login`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json', // <-- CRITICAL: Must be set!
//        },
//        body: JSON.stringify({ tenantId, role, userName }),
//    });
//},

    getOrders: (session) => {
        return fetch(`${API_BASE_URL}/orders`, {
            headers: getHeaders(session.tenantId, session.role),
        });
    },

    updateOrderStatus: (session, orderId, currentStatus, newStatus) => {
        return fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getHeaders(session.tenantId, session.role),
            body: JSON.stringify({ currentStatus, newStatus }),
        });
    },

    deleteOrder: (session, orderId) => {
        return fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: getHeaders(session.tenantId, session.role),
        });
    },
};