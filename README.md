# Nutriinsight
Project for autonomous agents. 

Using: Llama-2 7B, LangChain, HuggingFace, FastAPI, Pydantic, Docker and more.

_____

Platform for creating agents (random generated agents):

- Mood-Based Recipe Generator:

This agent could generate recipes based on the user's mood or emotions. Users could input how they're feeling, and the agent would suggest recipes that match their mood, such as comfort foods for a bad day or energizing dishes for a productive day.

______


data

Including data from different sources of the internet, mainly:

- Spoonacular API (https://spoonacular.com/food-api/docs#Ingredient-Search)
- Kaggle (https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions?resource=download&select=RAW_recipes.csv)
- Agriculture Department (https://fdc.nal.usda.gov/api-guide.html)


___


awk -F, 'BEGIN {OFS=","} { print "SET",$2, $3}' RAW_recipes.csv | sed 's/\"//g'


