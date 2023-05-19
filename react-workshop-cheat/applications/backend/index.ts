import {Request, Response} from "express";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

app.post('/recipes', async (req: Request, res: Response) => {
    console.info('Received recipe request with request body: ', req.body);
    const ingredients: [string] = req.body.ingredients;
    console.log(ingredients)
    if (!ingredients || ingredients.length < 1) {
        const error = {
            message: "No ingredients provided, aborting request",
        };
        console.error(error.message);
        res.status(400).send(error);
        return;
    }

    console.log("New recipe request! Ingredients: ", ingredients);
    const recipe = {
        "title": "The Recipe 101",
        "description": "This is a recipe that will always work, perfect for everyone!",
        "ingredients": ingredients,
        "steps": [
            "1. Cut all vegetables",
            "2. Slice and spice fish or meat",
            "3. Heat whatever needs to be heated",
            "4. Put on a timer",
            "5. Sit down and wait with whatever you do to chill",
            "6. Put together a fresh salad",
            "7. Put it all together on a plate",
            "8. Enjoy!"
        ],
    }
    res.send(recipe)
});

app.get("/checkLiveness", async (req: Request, res: Response) => {
    console.log("We are live");
    res.send("Hi frontend 👋🏼\n")
});
