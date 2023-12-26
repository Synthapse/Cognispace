import requests 

SPOONACULAR_API_KEY = "2f3cee9d3f054e80ac64029e3903deb4"


#{"results":[{"id":631814,"title":"$50,000 Burger","image":"https://spoonacular.com/recipeImages/631814-312x231.jpg","imageType":"jpg"},{"id":642539,"title":"Falafel Burger","image":"https://spoonacular.com/recipeImages/642539-312x231.png","imageType":"png"},{"id":663050,"title":"Tex-Mex Burger","image":"https://spoonacular.com/recipeImages/663050-312x231.jpg","imageType":"jpg"},{"id":622825,"title":"Tortilla Burger Loco Vaca","image":"https://spoonacular.com/recipeImages/622825-312x231.jpg","imageType":"jpg"},{"id":663357,"title":"The Unagi Burger","image":"https://spoonacular.com/recipeImages/663357-312x231.jpg","imageType":"jpg"},{"id":663252,"title":"The Blarney Burger","image":"https://spoonacular.com/recipeImages/663252-312x231.jpg","imageType":"jpg"},{"id":651190,"title":"Masala-Tofu Burger","image":"https://spoonacular.com/recipeImages/651190-312x231.jpg","imageType":"jpg"},{"id":663209,"title":"The Benedict Burger","image":"https://spoonacular.com/recipeImages/663209-312x231.jpg","imageType":"jpg"},{"id":650181,"title":"Little Italy Burger","image":"https://spoonacular.com/recipeImages/650181-312x231.jpg","imageType":"jpg"},{"id":637631,"title":"Cheesy Bacon Burger with Spicy Chipotle Aiolo Sauce","image":"https://spoonacular.com/recipeImages/637631-312x231.jpg","imageType":"jpg"}],"offset":0,"number":10,"totalResults":54}
def sponacular_integration(query):

    url = "https://api.spoonacular.com/recipes/complexSearch"
    querystring = {"apiKey":SPOONACULAR_API_KEY,"query":query,"number":"10"}
    response = requests.request("GET", url, params=querystring)
    print(response.text)

#{"results":[{"id":1027063,"name":"breakfast sausage","image":"breakfast-sausage-links.jpg"},{"id":19113,"name":"table syrup","image":"maple-syrup-or-agave-nectar.jpg"},{"id":1037063,"name":"sausage links","image":"breakfast-sausage-links.jpg"},{"id":8029,"name":"bran flakes","image":"bran-flakes.jpg"},{"id":10010151,"name":"ham slices","image":"ham.png"},{"id":1047063,"name":"sausage patties","image":"breakfast-sausage.png"},{"id":99301,"name":"sugar free pancake syrup","image":"pancake-syrup.jpg"}],"offset":0,"number":10,"totalResults":7}
def get_all_ingredients(query):
    url = "https://api.spoonacular.com/food/ingredients/search"
    querystring = {"apiKey":SPOONACULAR_API_KEY,"query":query,"number":"10"}
    response = requests.request("GET", url, params=querystring)
    print(response.text)


# https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
def find_recipe_by_ingredients(ingredients):
    url = "https://api.spoonacular.com/recipes/findByIngredients"
    querystring = {"apiKey":SPOONACULAR_API_KEY,"ingredients":ingredients}
    response = requests.request("GET", url, params=querystring)
    print(response.text)


# Meal Plan Week
# Shipping List


get_all_ingredients("Breakfast")
#sponacular_integration("Burger")