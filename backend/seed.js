
const db = require('./db');

const recipes = [
    {
        title: 'Vegetable Fried Rice',
        category: 'Main Course',
        description: 'A simple rice dish with mixed vegetables',
        ingredients: 'Rice, carrots, peas, onion, cooking oil, salt',
        instructions: 'Cook rice. Fry vegetables in oil. Add rice and seasoning, then mix well.',
        prep_time: 15, cook_time: 20, servings: 4
    },
    {
        title: 'Pancakes',
        category: 'Breakfast',
        description: 'Soft homemade pancakes',
        ingredients: 'Flour, eggs, milk, sugar, baking powder',
        instructions: 'Mix ingredients into batter. Pour into a hot pan and cook both sides.',
        prep_time: 10, cook_time: 15, servings: 4
    },
    {
        title: 'Tomato Pasta',
        category: 'Main Course',
        description: 'Pasta served with tomato sauce',
        ingredients: 'Pasta, tomatoes, onion, garlic, oil, salt',
        instructions: 'Boil pasta. Cook tomatoes with onion and garlic. Mix with pasta.',
        prep_time: 10, cook_time: 25, servings: 3
    },
    {
        title: 'Fruit Salad',
        category: 'Dessert',
        description: 'A refreshing mix of fresh fruits',
        ingredients: 'Bananas, apples, oranges, watermelon',
        instructions: 'Wash and cut fruits into small pieces. Mix and serve.',
        prep_time: 15, cook_time: 0, servings: 4
    },
    {
        title: 'Chicken Stew',
        category: 'Main Course',
        description: 'Chicken cooked in a tomato sauce',
        ingredients: 'Chicken, tomatoes, onion, oil, salt, spices',
        instructions: 'Brown chicken. Add onions and tomatoes. Add water and simmer until cooked.',
        prep_time: 15, cook_time: 40, servings: 4
    },
    {
        title: 'Boiled Eggs',
        category: 'Breakfast',
        description: 'A quick and simple egg dish',
        ingredients: 'Eggs, water, salt',
        instructions: 'Place eggs in water, bring to a boil, and cook until the desired firmness.',
        prep_time: 2, cook_time: 10, servings: 2
    },
    {
        title: 'Bean Soup',
        category: 'Soup',
        description: 'A warm soup made with beans',
        ingredients: 'Beans, onion, tomatoes, water, salt',
        instructions: 'Cook beans until tender. Add vegetables and simmer until flavours combine.',
        prep_time: 10, cook_time: 45, servings: 4
    },
    {
        title: 'Banana Smoothie',
        category: 'Drink',
        description: 'A creamy banana drink',
        ingredients: 'Bananas, milk, yoghurt, honey',
        instructions: 'Blend all ingredients until smooth and serve.',
        prep_time: 5, cook_time: 0, servings: 2
    },
    {
        title: 'Vegetable Omelette',
        category: 'Breakfast',
        description: 'Eggs cooked with vegetables',
        ingredients: 'Eggs, tomatoes, onion, green pepper, oil',
        instructions: 'Beat eggs. Add chopped vegetables. Cook in a lightly oiled pan.',
        prep_time: 10, cook_time: 10, servings: 2
    },
    {
        title: 'Homemade Scones',
        category: 'Snack',
        description: 'Simple homemade baked scones',
        ingredients: 'Flour, butter, sugar, milk, baking powder',
        instructions: 'Mix ingredients into dough. Shape and bake until cooked.',
        prep_time: 15, cook_time: 25, servings: 6
    }
];

const insertRecipe = db.prepare(`
    INSERT INTO recipes (
        title, category, description, ingredients, instructions,
        prep_time, cook_time, servings
    )
    VALUES (
        @title, @category, @description, @ingredients, @instructions,
        @prep_time, @cook_time, @servings
    )
`);

const seedRecipes = db.transaction(() => {
    const existing = db.prepare(
        'SELECT COUNT(*) AS total FROM recipes'
    ).get();

    // Avoid inserting duplicates when the seed script is run again.
    if (existing.total > 0) {
        console.log('Recipes already exist. No sample recipes were added.');
        return;
    }

    for (const recipe of recipes) {
        insertRecipe.run(recipe);
    }

    console.log('Successfully added 10 sample recipes.');
});

seedRecipes();
db.close();
