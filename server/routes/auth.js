const router = require('express').Router();
// import the schemas
const userSchemas = require('../Schemas/User');
const movieListSchemas = require('../Schemas/Movies');
// importing the hashing library
const bcrypt = require('bcryptjs');
// ijmporting the jwt token
const jwt = require('jsonwebtoken');
// import the verification for making sure they cant skip login/register
const verify = require('./verifyToken')

// Input validation for server-side
const emailRegex = /[A-Za-z0-9]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;
const passwordSizeRegex = /.{6,}/;
const passwordSpecialCharactersRegex = /[^A-Za-z0-9]+/;

// Register below
router.post('/register', async (req, res) => {
    // Extract email and password from request body
    // Added genre as after thought. Check with teacher.
    const { email, password, genre } = req.body;

    // Validate email format
    const emailTest = emailRegex.test(email);

    // Validate password format
    const passwordTest = passwordSizeRegex.test(password) && passwordSpecialCharactersRegex.test(password);

    // Check if email and password are in valid format
    // Added genre as after thought. Check with teacher.
    if (!emailTest || !passwordTest || !genre) {
        return res.status(400).send('Invalid email or password format');
    }

    // Check if email already exists
    const emailExist = await userSchemas.findOne({ email });
    if (emailExist) {
        return res.status(400).send('Email is already in use. Try Again please.');
    }

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        // Added genre as after thought. Check with teacher.
        const user = new userSchemas({
            email: email,
            password: hashPassword,
            genre: genre
        });

        // Save the user to the database
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// login below
router.post('/login', async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate email format
    const emailTest = emailRegex.test(email);

    // Validate password format
    const passwordTest = passwordSizeRegex.test(password) && passwordSpecialCharactersRegex.test(password);

    // Check if email and password are in valid format
    if (!emailTest || !passwordTest) {
        return res.status(400).send('Invalid email or password format');
    }

    // Check if user exists in the database
    const user = await userSchemas.findOne({ email });
    if (!user) {
        return res.status(400).send('Email or password is wrong');
    }

    try {
        // Compare password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Email or password is wrong');
        }
        // create and assign token.
        // function: when u login, u get the token, which system will detect that you are logged in
        console.log("JEW Secret:", process.env.JEW_SECRET);
        const token = await jwt.sign({ _id: user._id, genre: user.genre }, process.env.JEW_SECRET);
        res.header('auth-header', token).status(200).send(token);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});


router.get('/movies', verify, async (req, res) => {
    try {
        // Get the user's favorite genre from the token
        const { genre } = req.user;
        console.log('req.user: ', req.user);
        console.log('User genre:', genre); // Log the user's favorite genre
        
        // Query the movieListSchemas collection for movies with genres that include the user's favorite genre
        const movies = await movieListSchemas.find({ genres: { $in: [genre] } }).limit(25);
        console.log(movieListSchemas.collection.name);
        console.log('Retrieved movies:', movies); // Log the retrieved movies
        
        // Send the retrieved movies as the response
        res.status(200).json(movies);
    } catch (error) {
        // Handle errors
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).send('Token missing.');
        } else {
            res.status(500).send(error.message);
        }
    }
});

module.exports = router;
