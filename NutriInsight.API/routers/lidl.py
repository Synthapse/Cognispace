from lidlplus import LidlPlusApi
from fastapi import APIRouter

router = APIRouter(
    tags = ['Lidl']
)

@router.get("/lidlAuthenticate/")
async def authenticate_lidl(phone, password):
    print('endpoint')
    lidl = LidlPlusApi(language="PL", country="pl")
    print(lidl)
    login = lidl.login(phone, password, verify_token_func=lambda: input("Insert code: "))
    print(login)


@router.get("/lidlAuth/")
async def auth_lidl():
# async def auth_lidl(phone, password):

    # 28.08.2023 Each user have unique refresh_token - needs to authenticate by phone and password
    refresh_token = "E105C19AC50AC27134419E4559C1CD98196A85E0137BB3F68E6CC81DEBB1BE34"
    lidl = LidlPlusApi("PL", "pl", refresh_token=refresh_token)
    #lidl.login(phone, password)

    tickets = []
    products = []

    max_shopping_times = 2

    for index, ticket in enumerate(lidl.tickets()):
        if index >= max_shopping_times:
            break  # Stop after the first  iterations

        ticket_data = lidl.ticket(ticket["id"])
        print(ticket_data)
        for product in ticket_data["itemsLine"]:
            product_name = product["name"]
                
            # Check if the product already exists in the products list
            existing_product = next((p for p in products if p["name"] == product_name), None)
            
            if existing_product:
                # Update the quantity of the existing product
                existing_product["quantity"] += float(product["quantity"])
            else:
                # Product doesn't exist, add it to the list
                products.append(
                    {
                        "currentUnitPrice": product["currentUnitPrice"],
                        "name": product_name,
                        "quantity": float(product["quantity"])
                    }
                )
        
    return products