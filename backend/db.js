
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'recipes.db');
const db = new Database(dbPath);

// Create the recipes table
db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS update_recipe_timestamp
    AFTER UPDATE ON recipes
    FOR EACH ROW
    BEGIN
        UPDATE recipes
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END;
`);

module.exports = db;
