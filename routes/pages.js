const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const https = require('https');

const authInit = require('../config/auth-config');

const userController = require('../controllers/userController');
const authStatusController = require('../controllers/authStatusController');
const carsController = require('../controllers/carsController');

const UserModel = require('../models/user');


let userIsAuthenticated = false;
let signupError = null;
let userUsedLink = false;
let generatedURL = null;
let courses;
let courseContents;

let userCourses = [];
let currentUser;
const app = express.Router();

app.use(flash());
app.use(session({
    secret: 'secrete',
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const getUserByEmail = async (userEmail) => {
    const user = await UserModel.findOne({ email: userEmail });
    try {
        if (user) {
            console.log('user exists');
            userCourses = user.courses;
            currentUser = user;
            return user;
        } else {
            console.log('no user');
            return null;
        }
    } catch (er) {
        console.log(er);
        return null;
    }
};

authInit(passport, async email => await getUserByEmail(email));

// Sign up
app.get('/Signup', (req, res, next) => {
    userIsAuthenticated = authStatusController.checkNotAuthenticated(req, res, next);
    next();
}, (req, res) => {
    res.render('signup', { title: 'Absolute Campus | Sign Up' });
});

app.post('/signup', (req, res, next) => {
    userIsAuthenticated = authStatusController.checkNotAuthenticated(req, res, next);
    next();
}, async (req, res) => {
    signupError = await userController.addUser(req, res);
});

// Login
app.get('/Login', (req, res, next) => {
    userIsAuthenticated = authStatusController.checkNotAuthenticated(req, res, next);
    next();
}, (req, res) => {
    res.render('login', { title: 'Absolute Campus | Log In' });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/login'
}));

// Home
app.get('/', (req, res, next) => {
    authStatusController.checkAuthenticated(req, res, next);
},
    async (req, res) => {
        let cars = await carsController.getAllCars();
        res.render('home', {
            title: 'Flex Drive',
            page: 'home',
            cars: cars
        });
    });

//book
app.get('/book', (req, res, next) => {
    authStatusController.checkAuthenticated(req, res, next);
},
    (req, res) => {
        res.render('book', { title: 'Flex Drive | book', page: 'book' });
    });

//book
app.get('/settings', (req, res, next) => {
    authStatusController.checkAuthenticated(req, res, next);
},
    (req, res) => {
        res.render('book', { title: 'Flex Drive | settings', page: 'settings' });
    });

//profile
app.get('/profile', (req, res, next) => {
    authStatusController.checkAuthenticated(req, res, next);
},
    (req, res) => {
        res.render('book', { title: 'Flex Drive | profile', page: 'profile' });
    });


//brand
app.get('/brand', (req, res, next) => {
    authStatusController.checkAuthenticated(req, res, next);
},
    async (req, res) => {
        let cars = await carsController.getByBrandName(req.query.brandName.toLocaleLowerCase());

        res.render('brand', {
            title: `Flex Drive | All ${req.query.brandName} Cars`,
            page: 'home',
            cars: cars
        });
    });

//logout
app.delete('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

// Route to handle Paystack callback and verify payment

app.get('/verify-payment', (req, res) => {
    const reference = req.query.reference;

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
            Authorization: 'Bearer sk_live_ea027ce1765ba29636ed04adbbfe6085f7147ffa'
        }
    };

    const verifyReq = https.request(options, verifyRes => {
        let data = '';

        verifyRes.on('data', chunk => {
            data += chunk;
        });
        verifyRes.on('end', async () => {
            const parsedData = JSON.parse(data);
            if (parsedData.status && parsedData.data.status === 'success') {
                // Payment was successful
                const email = parsedData.data.customer.email;
                const courseName = req.query.courseName;

                // Update user's courses
                const result = await UserModel.findOneAndUpdate(
                    { email: email },
                    { $set: { courses: userCourses.push(courseName) } },
                    { new: true }
                );
                console.log('result: ', result);
                if (result) {
                    userCourses = result.courses
                } else {
                    // Handle the case where the user is not found
                    console.log('User not found');
                }

                res.redirect(`/course-details?courseName=${courseName}`);
            } else {
                // Payment failed
                console.log('Payment verification failed. Please try again.');
                res.send('Payment verification failed. Please try again.');
            }
        });
    }).on('error', error => {
        console.error(error);
        // res.send('An error occurred while verifying the payment. Please try again.');
        res.send('An error occurred while verifying the payment. Please try again.');
    });

    verifyReq.end();
});


//change password

let userExists = false;
let canChangePassword = false;
let errorMessage = null;
let userEmail = null;
app.get('/change-password', (req, res,) => {
    res.render('forgot-password', {
        title: 'Absolute Campus | forgot password',
        canChangePassword: canChangePassword,
        userExists: userExists,
        userEmail: userEmail,
        errorMessage: errorMessage
    });
})

app.post('/change-password', async (req, res) => {
    try {
        if (!req.body.newPass) {
            const user = await UserModel.findOne({ email: req.body.email }); // await keyword to handle the promise

            if (user) { // user object check
                console.log('user exists');
                userExists = true;
                canChangePassword = true;
                errorMessage = null;
                userEmail = req.body.email;
                res.redirect('change-password');
            } else {
                userExists = false;
                canChangePassword = false;
                errorMessage = "User with specified email does not exist";
                res.redirect('change-password');
                console.log('User not found');
            }
        } else {
            const result = await UserModel.findOneAndUpdate(
                { email: req.body.email },
                { $set: { password: req.body.newPass } },
                { new: true }
            );

            if (result) {
                userExists = false;
                canChangePassword = false;
                errorMessage = null;
                userEmail = null;
                res.redirect('login');
            } else {
                errorMessage = "Password update failed";
                res.redirect('change-password');
            }
        }
    } catch (error) {
        console.error('Error: ', error);
        errorMessage = "An error occurred during the process";
        res.redirect('change-password');
    }
});

module.exports = app;
