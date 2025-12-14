const mockAuthMiddleware = (req, res, next) => {
    const mockSessionHeader = req.header('mock-Session');

    if (mockSessionHeader) {
        const [tenantId, role] = mockSessionHeader.split(',');

        if (tenantId && role) {
            req.session = { tenantId, role };
            return next();
        }
    }

    req.session = null;
    next();
};

export default mockAuthMiddleware;