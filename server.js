const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// File to save food data
const dataFile = path.join(__dirname, 'data/food.json');

// Load and save food data
const loadFoodData = () => (fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : []);
const saveFoodData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Add food
app.post('/add-food', upload.single('photo'), (req, res) => {
    const { name, contact, location } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'فشل تحميل الصورة!' });
    }

    const newFood = {
        id: Date.now(),
        name,
        contact,
        location,
        photo: `/uploads/${req.file.filename}`
    };

    const foodData = loadFoodData();
    foodData.push(newFood);
    saveFoodData(foodData);

    res.status(201).json({ message: 'تم إضافة الطعام بنجاح!' });
});

// Get food data
app.get('/get-food', (req, res) => {
    res.json(loadFoodData());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
