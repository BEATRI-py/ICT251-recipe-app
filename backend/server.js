
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Validate a recipe ID
function validId(id) {
    return /^\d+$/.test(id) && Number(id) > 0;
}

// Validate recipe input
function validateRecipe(body) {
    const {
        title, category, ingredients, instructions,
        prep_time, cook_time, servings
    } = body;

    if (
        typeof title !== 'string' || !title.trim() ||
        title.trim().length > 150 ||
        typeof category !== 'string' || !category.trim() ||
        category.trim().length > 80 ||
        (body.description != null &&
            (typeof body.description !== 'string' ||
             body.description.length > 255)) ||
        typeof ingredients !== 'string' || !ingredients.trim() ||
        typeof instructions !== 'string' || !instructions.trim() ||
        !Number.isInteger(prep_time) || prep_time < 0 ||
        !Number.isInteger(cook_time) || cook_time < 0 ||
        !Number.isInteger(servings) || servings < 1
    ) {
        return 'Enter a title (max 150 characters), category (max 80), optional description (max 255), ingredients, instructions, non-negative preparation/cooking times, and servings of at least 1.';
    }

    return null;
}

// Health check
app.get('/api/health', (req, res) => {
    try {
        db.prepare('SELECT 1').get();
        res.json({
            status: 'OK',
            message: 'Recipe API and SQLite database are working'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ error: 'Database health check failed' });
    }
});

// GET: Display all recipes
app.get('/api/recipes', (req, res) => {
    try {
        const recipes = db.prepare(
            'SELECT * FROM recipes ORDER BY id'
        ).all();

        res.json(recipes);
    } catch (error) {
        console.error('GET recipes failed:', error);
        res.status(500).json({
            error: 'Failed to fetch recipes',
            details: error.message
        });
    }
});

// GET: Display one recipe
app.get('/api/recipes/:id', (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    try {
        const recipe = db.prepare(
            'SELECT * FROM recipes WHERE id = ?'
        ).get(Number(req.params.id));

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('GET recipe failed:', error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

// POST: Create a recipe
app.post('/api/recipes', (req, res) => {
    const validationError = validateRecipe(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const {
            title, category, description, ingredients,
            instructions, prep_time, cook_time, servings
        } = req.body;

        const result = db.prepare(`
            INSERT INTO recipes (
                title, category, description, ingredients,
                instructions, prep_time, cook_time, servings
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            title.trim(),
            category.trim(),
            typeof description === 'string' && description.trim()
                ? description.trim()
                : null,
            ingredients.trim(),
            instructions.trim(),
            prep_time,
            cook_time,
            servings
        );

        const recipe = db.prepare(
            'SELECT * FROM recipes WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(recipe);
    } catch (error) {
        console.error('POST recipe failed:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// PUT: Update a recipe
app.put('/api/recipes/:id', (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    const validationError = validateRecipe(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const {
            title, category, description, ingredients,
            instructions, prep_time, cook_time, servings
        } = req.body;

        const result = db.prepare(`
            UPDATE recipes SET
                title = ?,
                category = ?,
                description = ?,
                ingredients = ?,
                instructions = ?,
                prep_time = ?,
                cook_time = ?,
                servings = ?
            WHERE id = ?
        `).run(
            title.trim(),
            category.trim(),
            typeof description === 'string' && description.trim()
                ? description.trim()
                : null,
            ingredients.trim(),
            instructions.trim(),
            prep_time,
            cook_time,
            servings,
            Number(req.params.id)
        );

        if (result.changes === 0) {
            const existing = db.prepare(
                'SELECT * FROM recipes WHERE id = ?'
            ).get(Number(req.params.id));

            if (!existing) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
        }

        const recipe = db.prepare(
            'SELECT * FROM recipes WHERE id = ?'
        ).get(Number(req.params.id));

        res.json(recipe);
    } catch (error) {
        console.error('PUT recipe failed:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
});

// DELETE: Delete a recipe
app.delete('/api/recipes/:id', (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    try {
        const result = db.prepare(
            'DELETE FROM recipes WHERE id = ?'
        ).run(Number(req.params.id));

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('DELETE recipe failed:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

// Handle invalid JSON
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 &&
        'body' in error) {
        return res.status(400).json({ error: 'Invalid JSON request body' });
    }

    console.error('Unexpected server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Recipe API running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Recipes: http://localhost:${PORT}/api/recipes`);
});

// Close database connection gracefully
function shutdown() {
    server.close(() => {
        db.close();
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
