import {Box} from "@mui/system";
import {Autocomplete, Button, CircularProgress, TextField} from "@mui/material";
import {useState} from "react";
import Recipe, {RecipeData} from "./Components/Recipe";
import IngredientOptions from './files/Ingredients.json'

function App() {
    const [recipe, setRecipe] = useState({} as RecipeData)
    const [ingredients, setIngredients] = useState([] as string[])
    const [loading, setLoading] = useState(false);

    function loadingIndicator() {
        if (loading) {
            return (
                <Box>
                    <CircularProgress/>
                </Box>
            )
        }
    }

    async function getRecipe() {
        setLoading(true)
        const requestBody = JSON.stringify({
            ingredients: ingredients
        })
        await fetch("http://localhost:8000/keepAlive", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => setLoading(false));
        await fetch("http://localhost:8000/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: requestBody,
        }).then(response => response.json())
            .then(data => setRecipe(data))
            .finally(() => setLoading(false));
    }

    return (
        <>
            <Box>Andrea's Magic Cookbook</Box>
            <Autocomplete
                multiple // Allows you to select multiple items
                filterSelectedOptions // Filters out selected items
                disableCloseOnSelect // Prevents closing the dropdown menu on selecting an item
                options={IngredientOptions} // The options shown in the dropdown menu
                onChange={(event: any, newValue: string[]) => { // Handles changes, allowing you to set a state with the new values
                    setIngredients(newValue); // Here we're using a [ingredient, setIngredient] = useState([""]) state
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Ingredients"/> // The input field, showing what you type if you're using the built in search function
                )
                }/>
            <Button onClick={getRecipe}>Get Recipe</Button>
            {loadingIndicator()}
            {recipe.title &&
                <Recipe
                    title={recipe.title}
                    description={recipe.description}
                    ingredients={recipe.ingredients}
                    steps={recipe.steps}
                />
            }
        </>
    );
}

export default App
