exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect('/login')
    }
}

exports.checkAuthForHome = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('user is authenticated on home');
        next();
    } else {
        console.log('user is not authenticated');
    }
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
}
