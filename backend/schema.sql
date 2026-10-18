USE campus_crud;

CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time INT NOT NULL,
    cook_time INT NOT NULL,
    servings INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO recipes
(title, category, description, ingredients, instructions,
 prep_time, cook_time, servings)
VALUES
(
 'Vegetable Fried Rice', 'Main Course',
 'A simple rice dish with mixed vegetables',
 'Rice, carrots, peas, onion, cooking oil, salt',
 'Cook rice. Fry vegetables in oil. Add rice and seasoning, then mix well.',
 15, 20, 4
),
(
 'Pancakes', 'Breakfast',
 'Soft homemade pancakes',
 'Flour, eggs, milk, sugar, baking powder',
 'Mix ingredients into batter. Pour into a hot pan and cook both sides.',
 10, 15, 4
),
(
 'Tomato Pasta', 'Main Course',
 'Pasta served with tomato sauce',
 'Pasta, tomatoes, onion, garlic, oil, salt',
 'Boil pasta. Cook tomatoes with onion and garlic. Mix with pasta.',
 10, 25, 3
),
(
 'Fruit Salad', 'Dessert',
 'A refreshing mix of fresh fruits',
 'Bananas, apples, oranges, watermelon',
 'Wash and cut fruits into small pieces. Mix and serve.',
 15, 0, 4
),
(
 'Chicken Stew', 'Main Course',
 'Chicken cooked in a tomato sauce',
 'Chicken, tomatoes, onion, oil, salt, spices',
 'Brown chicken. Add onions and tomatoes. Add water and simmer until cooked.',
 15, 40, 4
),
(
 'Boiled Eggs', 'Breakfast',
 'A quick and simple egg dish',
 'Eggs, water, salt',
 'Place eggs in water, bring to a boil, and cook until the desired firmness.',
 2, 10, 2
),
(
 'Bean Soup', 'Soup',
 'A warm soup made with beans',
 'Beans, onion, tomatoes, water, salt',
 'Cook beans until tender. Add vegetables and simmer until flavours combine.',
 10, 45, 4
),
(
 'Banana Smoothie', 'Drink',
 'A creamy banana drink',
 'Bananas, milk, yoghurt, honey',
 'Blend all ingredients until smooth and serve.',
 5, 0, 2
),
(
 'Vegetable Omelette', 'Breakfast',
 'Eggs cooked with vegetables',
 'Eggs, tomatoes, onion, green pepper, oil',
 'Beat eggs. Add chopped vegetables. Cook in a lightly oiled pan.',
 10, 10, 2
),
(
 'Homemade Scones', 'Snack',
 'Simple homemade baked scones',
 'Flour, butter, sugar, milk, baking powder',
 'Mix ingredients into dough. Shape and bake until cooked.',
 15, 25, 6
);