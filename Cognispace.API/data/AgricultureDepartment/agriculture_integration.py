
# DOCUMENTATION: 
# https://fdc.nal.usda.gov/api-guide.html#bkmk-5

API_KEY = "KeL5wtYU3SWkYmAajzBelBYL1C3XHC1M5bvXS5Vj"


#   {
#       "fdcId":2341752,
#       "description":"Abalone",
#       "dataType":"Survey (FNDDS)",
#       "publicationDate":"2022-10-28",
#       "foodCode":"26301110",
#       "foodNutrients":[
#          {
#             "number":"203",
#             "name":"Protein",
#             "amount":21.2,
#             "unitName":"G"
#          },
#          {
#             "number":"204",
#             "name":"Total lipid (fat)",
#             "amount":6.12,
#             "unitName":"G"
#          },
#       ]
#    },
food_list_url = "https://api.nal.usda.gov/fdc/v1/foods/list?api_key=${API_KEY}"

QUERY = "Yerba mate"

food_list_url_query = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${QUERY}"