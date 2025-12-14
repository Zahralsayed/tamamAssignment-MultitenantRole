import { db } from '../lib/firebase.js';

const ORDERS_COLLECTION = 'orders';


export const getOrderAndCheckTenant = async (orderId, tenantId) => {
    const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
        const error = new Error('Order not found.');
        error.statusCode = 404;
        throw error;
    }

    if (orderDoc.data().tenantId !== tenantId) {
        const error = new Error('Order does not belong to your tenant.');
        error.statusCode = 403;
        throw error;
    }

    return { ref: orderRef, data: { id: orderDoc.id, ...orderDoc.data() } };
};