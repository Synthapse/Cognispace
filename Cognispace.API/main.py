from fastapi import FastAPI, HTTPException, Query
import csv

app = FastAPI()

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


@app.get("/allRecipes")
async def root():

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


# To search by ingredient: http://localhost:8000/recipes?ingredient=chicken
# To search by recipe name: http://localhost:8000/recipes?recipe_name=pasta
# To search by both ingredient and recipe name: http://localhost:8000/recipes?ingredient=chicken&recipe_name=pasta
@app.get("/recipes")
async def get_recipes_by_criteria(
    ingredient: str = Query(None, description="Ingredient to search for"),
    recipe_name: str = Query(None, description="Recipe name to search for")
):

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
            
            if (ingredient and ingredient.lower() in row_ingredient) or (recipe_name and recipe_name.lower() in row_recipe_name):
                matching_rows.append({property_name: row[index] for property_name, index in indices.items()})
                if len(matching_rows) >= 100:  # Break when 100 rows are found
                    break
    
    if not matching_rows:
        raise HTTPException(status_code=404, detail="No recipes found with the provided criteria.")
    
    return {"recipes": matching_rows}