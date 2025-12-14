import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useOrders from '../hooks/useOrders';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { session, logout } = useAuth();
    const { orders, loading, error, fetchOrders, handleAction, STATUS_OPTIONS } = useOrders();

    useEffect(() => {
        if (!session) {
            navigate('/');
        } else {
            fetchOrders();
        }
    }, [session, navigate, fetchOrders]);

    if (loading) return <div>Loading Orders...</div>;
    if (!session) return null;

    const canDelete = session.role === 'admin';

    return (
        <div style={{ padding: 20 }}>
            <h1>Orders Dashboard</h1>
            <p>
                **Logged in as: {session.userName} ({session.role})** in Tenant: **{session.tenantId}**
                <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
            </p>

            {error && <div style={{ color: 'red', border: '1px solid red', padding: 10, marginBottom: 15 }}>{error}</div>}

            <h2>{session.tenantId} Orders ({orders.length})</h2>

            <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id.substring(0, 8)}...</td>
                            <td>{order.customerName}</td>
                            <td>{order.status}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleAction('status', order, e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                {canDelete && (
                                    <button
                                        onClick={() => handleAction('delete', order)}
                                        style={{ marginLeft: 10, background: 'red', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;