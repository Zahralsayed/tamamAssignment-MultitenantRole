import express from 'express';
import { db } from '../lib/firebase.js';
import { checkPermission, checkStatusChangePermission } from '../middleware/rbac.js';
import { getOrderAndCheckTenant } from '../services/orderService.js';

const router = express.Router();

const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', checkPermission('view'), asyncWrapper(async (req, res) => {

    const { tenantId } = req.session;

    const q = db.collection('orders').where('tenantId', '==', tenantId);
    const snapshot = await q.get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
}));

router.put('/:id/status', checkPermission('update_status'), checkStatusChangePermission, asyncWrapper(async (req, res) => {
    const { tenantId } = req.session;
    const { newStatus } = req.body;
    const orderId = req.params.id;

    const { ref: orderRef } = await getOrderAndCheckTenant(orderId, tenantId);

    await orderRef.update({ status: newStatus });
    res.json({ message: 'Status updated successfully!', newStatus });
}));

router.delete('/:id', checkPermission('delete'), asyncWrapper(async (req, res) => {
    const { tenantId } = req.session;
    const orderId = req.params.id;

    const { ref: orderRef } = await getOrderAndCheckTenant(orderId, tenantId);

    await orderRef.delete();
    res.json({ message: 'Order deleted successfully' });
}));

router.use((err, req, res, next) => {
    if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.error("Internal Server Error:", err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

export default router;