import "./App.css";
import { Box } from "@mui/system";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import Recipe from "./Components/Recipe";
import Background from "./Components/Background";
import Header from "./Components/Header";
import SearchBox from "./Components/SearchBox";
import { RecipeData } from "./Components/Query";
import Button from "./Components/Button";

function App() {
  const [recipe, setRecipe] = useState({} as RecipeData);
  const [ingredients, setIngredients] = useState([] as string[]);
  const [loading, setLoading] = useState(false);

  function loadingIndicator() {
    if (loading) {
      return (
        <Box>
          <CircularProgress />
        </Box>
      );
    }
  }

  async function getRecipe(ipAddress: string, port: number) {
    setLoading(true);
    const requestBody = JSON.stringify({
      ingredients: ingredients,
    });
    try {
      await fetch(`http://${ipAddress}:${port}/checkLiveness`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to execute the first fetch call:", error);
    }

    try {
      await fetch(`http://${ipAddress}:${port}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })
        .then((response) => response.json())
        .then((data) => setRecipe(data))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Failed to execute the second fetch call:", error);
    }
  }

  return (
    <Container disableGutters sx={{ margin: 0 }}>
      <Background />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <Grid container spacing={2} paddingTop={4} justifyContent={"center"}>
          <Header name={"Codepub's Magic Cookbook"} />
          <Grid
            width={1}
            display={"flex"}
            padding={4}
            gap={2}
            justifyContent={"center"}
          >
            <SearchBox setIngredients={setIngredients} />
            <Button onClick={() => getRecipe("localhost", 8000)}>
              Get Recipe
            </Button>
          </Grid>
          <Grid width={1} alignContent={"center"}>
            {loadingIndicator()}
            {recipe.title && (
              <Recipe
                title={recipe.title}
                description={recipe.description}
                ingredients={recipe.ingredients}
                steps={recipe.steps}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
