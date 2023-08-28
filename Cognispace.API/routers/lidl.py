from lidlplus import LidlPlusApi
from fastapi import APIRouter

router = APIRouter(
    tags = ['Lidl']
)


@router.get("/lidlAuth/")
async def auth_lidl():
# async def auth_lidl(phone, password):

    # 28.08.2023 Each user have unique refresh_token - needs to authenticate by phone and password
    refresh_token = "E105C19AC50AC27134419E4559C1CD98196A85E0137BB3F68E6CC81DEBB1BE34"
    lidl = LidlPlusApi("PL", "pl", refresh_token=refresh_token)
    #lidl.login(phone, password)

    tickets = []
    products = []

    max_shopping_times = 3

    for index, ticket in enumerate(lidl.tickets()):
        if index >= max_shopping_times:
            break  # Stop after the first 5 iterations

        ticket_data = lidl.ticket(ticket["id"])
        for product in ticket_data["itemsLine"]:
            products.append(
                {
                    "currentUnitPrice": product["currentUnitPrice"],
                    "name": product["name"],
                    "quantity": product["quantity"]
                }
            )
        
    return products