const UserModel = require('../models/user');

let getUser = (req, res) => {
    // Function body
};

let logoutUser = (req, res) => {
    // Function body
};

let getUserInfo = (req, res) => {
    // Function body
};

exports.addUser = async (req, res) => {
    try {
        console.log(req.url);
        const newUser = new UserModel({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password
        });
        console.log(req.body.password);

        const user = await UserModel.findOne({ email: newUser.email });
        if (user) {
            signupError = 'Sorry a user with the same email already exists';
            console.log('Sorry user already exists in db');
            res.redirect('/signup');
        } else {
            await newUser.save();
            console.log('User created successfully');
            signupError = null;
            res.redirect('/login');
        }
    } catch (err) {
        signupError = 'An error occurred while creating your account. Please try again later.';
        console.log('Error:', err);
        res.redirect('/signup');
    }
};
