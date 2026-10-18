const API_URL = 'http://localhost:3000/api/recipes';

const form = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const message = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

let editingId = null;

// Display a message to the user
function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#b83232' : '#176b45';
}

// Safely create a table cell
function addCell(row, value) {
    const cell = document.createElement('td');

    cell.textContent =
        value === null || value === undefined ? '' : String(value);

    row.appendChild(cell);
}

// Make a button
function makeButton(text, className, action) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', action);

    return button;
}

// Load and display all recipes
async function loadRecipes() {
    recipeList.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 12;
    loadingCell.className = 'empty-message';
    loadingCell.textContent = 'Loading recipes...';

    loadingRow.appendChild(loadingCell);
    recipeList.appendChild(loadingRow);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Could not load recipes.');
        }

        const recipes = await response.json();

        recipeList.replaceChildren();

        if (recipes.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 12;
            cell.className = 'empty-message';
            cell.textContent = 'No recipes have been added yet.';

            row.appendChild(cell);
            recipeList.appendChild(row);
            return;
        }

        recipes.forEach(recipe => {
            const row = document.createElement('tr');

            addCell(row, recipe.id);
            addCell(row, recipe.title);
            addCell(row, recipe.category);
            addCell(row, recipe.description);
            addCell(row, recipe.ingredients);
            addCell(row, recipe.instructions);
            addCell(row, recipe.prep_time);
            addCell(row, recipe.cook_time);
            addCell(row, recipe.servings);
            addCell(row, recipe.created_at);
            addCell(row, recipe.updated_at);

            const actionsCell = document.createElement('td');

            const editButton = makeButton(
                'Edit',
                'edit-button',
                () => editRecipe(recipe)
            );

            const deleteButton = makeButton(
                'Delete',
                'delete-button',
                () => deleteRecipe(recipe.id)
            );

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            recipeList.appendChild(row);
        });
    } catch (error) {
        console.error(error);

        recipeList.replaceChildren();

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 12;
        cell.className = 'empty-message';
        cell.textContent =
            'Could not load recipes. Check that the backend and database are running.';

        row.appendChild(cell);
        recipeList.appendChild(row);

        showMessage(error.message, true);
    }
}

// Read the form values
function getFormData() {
    return {
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value.trim(),
        description: document.getElementById('description').value.trim(),
        ingredients: document.getElementById('ingredients').value.trim(),
        instructions: document.getElementById('instructions').value.trim(),
        prep_time: Number(document.getElementById('prep_time').value),
        cook_time: Number(document.getElementById('cook_time').value),
        servings: Number(document.getElementById('servings').value)
    };
}

// Save a new recipe or update an existing recipe
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const recipe = getFormData();

    if (
        !recipe.title ||
        !recipe.category ||
        !recipe.ingredients ||
        !recipe.instructions
    ) {
        showMessage('Please complete all required fields.', true);
        return;
    }

    if (
        !Number.isInteger(recipe.prep_time) ||
        recipe.prep_time < 0 ||
        !Number.isInteger(recipe.cook_time) ||
        recipe.cook_time < 0 ||
        !Number.isInteger(recipe.servings) ||
        recipe.servings < 1
    ) {
        showMessage(
            'Enter valid times and at least 1 serving.',
            true
        );
        return;
    }

    const isEditing = editingId !== null;

    const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

    const method = isEditing ? 'PUT' : 'POST';

    saveButton.disabled = true;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not save recipe.');
        }

        showMessage(
            isEditing
                ? 'Recipe updated successfully.'
                : 'Recipe added successfully.'
        );

        resetForm();
        await loadRecipes();
    } catch (error) {
        console.error(error);
        showMessage(error.message, true);
    } finally {
        saveButton.disabled = false;
    }
});

// Fill the form with an existing recipe
function editRecipe(recipe) {
    editingId = recipe.id;

    document.getElementById('title').value = recipe.title;
    document.getElementById('category').value = recipe.category;
    document.getElementById('description').value =
        recipe.description || '';
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;
    document.getElementById('prep_time').value = recipe.prep_time;
    document.getElementById('cook_time').value = recipe.cook_time;
    document.getElementById('servings').value = recipe.servings;

    formTitle.textContent = 'Edit Recipe';
    saveButton.textContent = 'Update Recipe';
    cancelButton.hidden = false;

    showMessage(`You are editing recipe ${recipe.id}.`);

    document.getElementById('title').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a recipe
async function deleteRecipe(id) {
    const confirmed = window.confirm(
        `Are you sure you want to delete recipe ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not delete recipe.');
        }

        if (editingId === id) {
            resetForm();
        }

        showMessage('Recipe deleted successfully.');
        await loadRecipes();
    } catch (error) {
        console.error(error);
        showMessage(error.message, true);
    }
}

// Return the form to its original state
function resetForm() {
    editingId = null;
    form.reset();

    formTitle.textContent = 'Add a New Recipe';
    saveButton.textContent = 'Save Recipe';
    cancelButton.hidden = true;
}

// Cancel editing
cancelButton.addEventListener('click', function () {
    resetForm();
    showMessage('Editing cancelled.');
});

// Load the recipes when the page opens
loadRecipes();