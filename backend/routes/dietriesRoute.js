import express from 'express';
import multer from 'multer';
import Food from '../models/Food.model.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create', verifyAdmin, upload.single('image'), async (req, res) => {
    const { name, description, price, nutritional_value, ingredients, dietary_restrictions, type } = req.body;
    const image = req.file.path;

    try {
        const food = new Food({ name, image, description, price, nutritional_value, ingredients, dietary_restrictions, type });
        await food.save();
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getDietries', async (req, res) => {
    try {
        const foods = await Food.find();

        // Initialize the response object
        const categorizedDietries = {};

        // Iterate over all foods
        foods.forEach(food => {
            const restriction = food.dietary_restrictions;
            const mealType = food.type;

            // Ensure the restriction category exists
            if (!categorizedDietries[restriction]) {
                categorizedDietries[restriction] = { breakfast: [], lunch: [], supper: [], snack: [] };
            }

            // Add the food item to the appropriate meal type
            categorizedDietries[restriction][mealType].push({
                name: food.name,
                description: food.description,
                price: food.price,
                image: food.image
            });
        });

        res.status(200).json(categorizedDietries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/adminDietries', verifyAdmin, async (req, res) => {
    try {
        const dietries = await Food.find();
        res.status(200).json(dietries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
