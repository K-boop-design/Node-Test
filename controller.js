const fs = require('fs');
const path = require('path');
const { validationResult, body } = require('express-validator');

const USERS_FILE = path.join(__dirname, 'users.json');

const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, '[]');
        }
        const usersData = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const registerValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
];

const registerUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;
    const image = req.file ? req.file.filename : null;

    let users = readUsers();

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = { username, password, email, image };
    users.push(newUser);
    writeUsers(users);

    res.json({ ok: true, message: 'Registration successful' });
};

const loginUser = (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    req.session.user = user;
    res.cookie('username', username);
    res.json({ ok: true });
};

const getUserByUsername = (req, res) => {
    const { username } = req.params;
    console.log(req.session);
    const users = readUsers();
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
};


const updateUser = (username, newData) => {
    try {
        let usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const userIndex = usersData.findIndex(user => user.username === username);

        if (userIndex === -1) {
            return null; 
        }

       
        usersData[userIndex] = { ...usersData[userIndex], ...newData };

      
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));

        return usersData[userIndex]; 
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

const updateUserNames = (username, firstName, lastName) => {
    let users = readUsers();
    const index = users.findIndex(user => user.username === username);
    if (index !== -1) {
        users[index].firstName = firstName;
        users[index].lastName = lastName;
        writeUsers(users);
        return true;
    }
    return false;
};

const updateValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
];

module.exports = {
    registerValidationRules,
    registerUser,
    updateUser,
    loginUser,
    getUserByUsername,
    updateUserNames
};

