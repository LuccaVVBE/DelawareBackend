
const authorization = async (req, res, info) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    let resId;
    const data = info.items ? info.items[0] : info;
    if (data.company) {
        resId = data.company.id;
    }
    if (data.companyId) {
        resId = data.companyId;
    }
    if (data.name) { //this one is for /companies/:id 
        resId = data.id;
    }
    if (companyId && resId && resId !== companyId) {
        return res.status(403).json({
            "error": "Unauthorized",
            "message": 'You are not authorized to access this resource'
        });
    }
    return res.status(200).send(info);
}

const getCompanyId = async (auth, token) => {
    if (!token || !token.startsWith('Bearer ')) {
        return null;
    }
    if (auth.companyId) {
        return auth.companyId;
    } else {
        const response = await fetch('https://sdp2-g15.eu.auth0.com/userinfo', {
            headers: {
                'Authorization': token
            }
        });
        if (!response.ok) {
            const error = await response.text();
            console.error(error);
            throw new Error({"error": "Unauthorized", "message": "You are not authorized to access this resource", "status": 403});
        }
        const userinfo = await response.json();
        const companyId = userinfo['companyId'];
        return companyId;
    }
}

module.exports = { authorization, getCompanyId }