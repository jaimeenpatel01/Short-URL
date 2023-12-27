const { getUser } = require('../service/auth');

async function restrictToUserLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) return res.redirect('/login');

    const user = await getUser(userUid); // Use await here
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = await getUser(userUid);
    req.user = user;

    next();
}

module.exports = {
    restrictToUserLoggedInUserOnly,
    checkAuth,
};
