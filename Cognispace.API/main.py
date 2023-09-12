from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
# from AI.cooking_agents import LlamaAgent
import csv
import ast
from fastapi.responses import JSONResponse
import requests
from gauth import GoogleAuthenticator
import routers.lidl as lidl
from typing import List


app = FastAPI()
app.include_router(lidl.router)

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "https://storage.googleapis.com",
    "https://storage.googleapis.com/cognispace",
    "https://storage.googleapis.com/cognispace/index.html"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Its one agent per entire application not one agent per user.
# 8 RAM is not enough - for efficient using 
# Future note: Buy >32 RAM minimum for AI engineering 

# agent_instance = LlamaAgent()
# agent_instance.initialize_llama()

@app.get("/allRecipes")
async def getAllRecipes():

    try:
        # Open the CSV file in read mode
        with open('data/RAW_recipes.csv', 'r') as csvfile:
            # Create a CSV reader object
            csvreader = csv.reader(csvfile)
            
            # Create a list to store the rows
            rows = []
            
            # Loop through each row in the CSV file
            for row in csvreader:
                rows.append(row)
        
        # Return the list of rows as a JSON response
        return {"data": rows}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/recipesByMeal")
async def get_recipes_by_meal(meal):
    try:
        INGREDIENT_COLUMN_INDEX = 10
        RECIPE_NAME_COLUMN_INDEX = 0
        
        # Open the CSV file in read mode
        with open('data/RAW_recipes.csv', 'r') as csvfile:
            # Create a CSV reader object
            csvreader = csv.reader(csvfile)
            
            # Get the header row
            header = next(csvreader)
            
            # Get the indices for the requested properties
            indices = {
                "name": RECIPE_NAME_COLUMN_INDEX,
                "id": 1,
                "minutes": 2,
                "contributor_id": 3,
                "submitted": 4,
                "tags": 5,
                "nutrition": 6,
                "n_steps": 7,
                "steps": 8,
                "description": 9,
                "ingredients": 10,
                "n_ingredients": 11
            }
            
            # Create a list to store matching rows
            matching_rows = []
            
            # Loop through each row in the CSV file
            for row in csvreader:
                row_ingredient = row[INGREDIENT_COLUMN_INDEX].lower() if INGREDIENT_COLUMN_INDEX < len(row) else ""
                row_recipe_name = row[RECIPE_NAME_COLUMN_INDEX].lower() if RECIPE_NAME_COLUMN_INDEX < len(row) else ""
                
                if meal.lower() in row_recipe_name:  # Check if meal is in recipe name     

                    row = {property_name: row[index] for property_name, index in indices.items()}
                    row["name"] = row["name"].capitalize()
                    row["tags"] = ast.literal_eval(row["tags"])
                    row["ingredients"] = ast.literal_eval(row["ingredients"])
                    row["nutrition"] = ast.literal_eval(row["nutrition"])
                    row["steps"] = ast.literal_eval(row["steps"])

                    matching_rows.append(row)
                    if len(matching_rows) >= 100:  # Break when 100 rows are found
                        break
            
        if not matching_rows:
            raise HTTPException(status_code=404, detail="No recipes found with the provided criteria.")
        
        return {"data": matching_rows}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# To search by ingredient: http://localhost:8000/recipes?ingredient=chicken
# To search by recipe name: http://localhost:8000/recipes?recipe_name=pasta
# To search by both ingredient and recipe name: http://localhost:8000/recipes?ingredient=chicken&recipe_name=pasta
@app.get("/recipes")
async def get_recipes_by_criteria(
    ingredients: List[str] = Query(None, description="List of ingredients to search for"),
    recipe_name: str = Query(None, description="Recipe name to search for")
):
    try:
        INGREDIENT_COLUMN_INDEX = 10
        RECIPE_NAME_COLUMN_INDEX = 0
        # Open the CSV file in read mode
        with open('data/RAW_recipes.csv', 'r') as csvfile:
            # Create a CSV reader object
            csvreader = csv.reader(csvfile)
            
            # Get the header row
            header = next(csvreader)
            
            # Get the indices for the requested properties
            indices = {
                "name": RECIPE_NAME_COLUMN_INDEX,
                "id": 1,
                "minutes": 2,
                "contributor_id": 3,
                "submitted": 4,
                "tags": 5,
                "nutrition": 6,
                "n_steps": 7,
                "steps": 8,
                "description": 9,
                "ingredients": 10,
                "n_ingredients": 11
            }
            
            # Create a list to store matching rows
            matching_rows = []
            
            # Loop through each row in the CSV file
            for row in csvreader:
                row_ingredient = row[INGREDIENT_COLUMN_INDEX].lower() if INGREDIENT_COLUMN_INDEX < len(row) else ""
                row_recipe_name = row[RECIPE_NAME_COLUMN_INDEX].lower() if RECIPE_NAME_COLUMN_INDEX < len(row) else ""

                # Check if any ingredient in the list matches the row
                if (ingredients and any(ingredient.lower() in row_ingredient for ingredient in ingredients)) or (recipe_name and recipe_name.lower() in row_recipe_name):

                    row = {property_name: row[index] for property_name, index in indices.items()} 
                    row["name"] = row["name"].capitalize()
                    row["tags"] = ast.literal_eval(row["tags"])
                    row["ingredients"] = ast.literal_eval(row["ingredients"])
                    row["nutrition"] = ast.literal_eval(row["nutrition"])
                    row["steps"] = ast.literal_eval(row["steps"])
                    matching_rows.append(row)
                    if len(matching_rows) >= 1000:  # Break when 100 rows are found
                        break
        
        if not matching_rows:
            raise HTTPException(status_code=404, detail="No recipes found with the provided criteria.")
        
        matching_rows.sort(key=lambda x: len(set(ingredients).intersection(set(x['ingredients']))), reverse=True)

        return {"recipes": matching_rows}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/ingredients")
async def get_ingredients(
    searchIngredient: str = Query(None, description="Ingredient to search for"),
):
    try:
        # Open the CSV file in read mode
        with open('data/RAW_recipes.csv', 'r') as csvfile:
            # Create a CSV reader object
            csvreader = csv.reader(csvfile)
            
            # Get the header row
            header = next(csvreader)
            
            # Create a list to store the rows
            rows = []
            
            # Loop through each row in the CSV file
            for row in csvreader:
                row_ingredients = ast.literal_eval(row[10])
                for ingredient in row_ingredients:
                    if ingredient not in rows:
                        if searchIngredient is None:
                            rows.append(ingredient)
                        elif searchIngredient.lower() in ingredient.lower():
                            rows.append(ingredient)
                    
                    # Limit
                    # Return the first 1000 ingredients
                    if len(rows) == 1000:
                        return {"data": rows}
        
        # Return the list of rows as a JSON response
        return {"data": rows}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/ingredientsOCR")
async def get_ingredients_from_image(image_url: str):

    try:
        authenticator = GoogleAuthenticator()
        authenticator.gauth()
        data = authenticator.read_text_from_image(image_url)
        return data.get("responses")[0].get("fullTextAnnotation").get("text")
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# @app.get("/llama")
# def chat_with_llama(human_input):
#     try:
#         modelResponse = LlamaAgent.generate(human_input)
#         return {"data": modelResponse}
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)  

# @app.get("/llama_conversation")
# def chat_with_llama_conversation(human_input):
#     try:
#         modelResponse = LlamaAgent.generate_conversations(agent_instance, human_input)
#         print(modelResponse)
#         return {"data": modelResponse}
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)  
