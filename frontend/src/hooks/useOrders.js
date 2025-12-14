import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiServices';

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'];

const useOrders = () => {
    const { session } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        setError('');
        try {
            const response = await api.getOrders(session);

            if (response.status === 403) {
                const errorData = await response.json();
                setError(`API Denied: ${errorData.error}`);
                setOrders([]);
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch orders.');

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders from API.');
        } finally {
            setLoading(false);
        }
    }, [session]);

    const handleAction = useCallback(async (actionType, order, newStatus) => {
        setError('');
        let response;
        let orderId = order.id;

        try {
            if (actionType === 'status') {
                response = await api.updateOrderStatus(session, orderId, order.status, newStatus);
            } else if (actionType === 'delete') {
                if (!window.confirm(`Are you sure you want to delete order ${orderId.substring(0, 8)}?`)) return;
                response = await api.deleteOrder(session, orderId);
            }

            if (response.status === 403) {
                const errorData = await response.json();
                setError(`Permission Denied: ${errorData.error}`);
                return;
            }
            if (!response.ok) throw new Error(`Failed to perform ${actionType}.`);

            if (actionType === 'status') {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else if (actionType === 'delete') {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            }

        } catch (e) {
            setError(`API Error: Could not reach the server or process request.`);
        }
    }, [session]);

    return { orders, loading, error, fetchOrders, handleAction, STATUS_OPTIONS };
};

export default useOrders;