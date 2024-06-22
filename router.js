const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const { registerValidationRules, registerUser, loginUser, getUserByUsername, updateUserNames, updateUser, updateValidationRules } = require('./controller');

const IMAGES_DIR = path.join(__dirname, 'images');


router.use(cookieParser());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.post('/register', upload.single('image'), registerValidationRules, registerUser);

router.post('/login', loginUser);

router.get('/users/:username', getUserByUsername);

router.put('/users/:username', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.params;
    const { firstName, lastName } = req.body;

    try {
        const userUpdated = updateUserNames(username, firstName, lastName);

        if (userUpdated) {
            const updatedUser = await getUserByUsername(req, res); 
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/users/:username/edit', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.params;
    const { email } = req.body;

    const updatedUser = updateUser(username, { email });

    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/events/submit', upload.single('image'), (req, res) => {
    
    const eventData = req.body;
    if (req.file) {
      eventData.image = req.file.filename;
    }
  
    const filePath = './eventForms.json';
    let eventForms = [];
  
    try {
      
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        eventForms = JSON.parse(fileData);
      }
  
      eventForms.push(eventData);
  
      
      fs.writeFileSync(filePath, JSON.stringify(eventForms, null, 2));
  
      res.status(200).json({ message: 'Event form submitted successfully' });
    } catch (error) {
      console.error('Error saving event form:', error);
      res.status(500).json({ message: 'Failed to save event form' });
    }
  });
  
 
  router.get('/events/all', (req, res) => {
    const filePath = './eventForms.json';
  
    try {
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const eventForms = JSON.parse(fileData);
        res.json(eventForms);
        console.log('inside if')
      } else {
        res.json({array:[]});
        console.log('inside else')
      }
    } catch (error) {
      console.error('Error retrieving event forms:', error);
      res.status(500).json({ message: 'Failed to retrieve event forms' });
    }
  });

module.exports = router;


