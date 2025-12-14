const can = (role, action) => {
    if (role === 'admin') return true;

    if (role === 'staff') {
        return action === 'view' || action === 'update_status';
    }
    return false;
};

export const checkPermission = (action) => (req, res, next) => {
    if (!req.session) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    if (can(req.session.role, action)) {
        next();
    } else {
        return res.status(403).json({ error: `Permission Denied: Role '${req.session.role}' cannot perform '${action}'.` });
    }
};

export const checkStatusChangePermission = (req, res, next) => {
    const { role } = req.session;
    const { currentStatus, newStatus } = req.body;

    if (role === 'admin') return next();

    if (role === 'staff') {
        if (currentStatus === 'pending' && newStatus === 'in_progress') {
            return next();
        } else {
            return res.status(403).json({
                error: `Permission Denied: Staff can only change status from 'pending' to 'in_progress'.`
            });
        }
    }
    next();
};