import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../config.json";
import { auth, readFirebaseUserData, updateFirebaseUserData, writeIngredientsData } from "../auth/firebase";
import { Tag } from "../components/Tag";
import Menu from "../components/Menu";
import { CgSearch } from "react-icons/cg";
import { CiCircleRemove } from "react-icons/ci";
import { Container } from "./Water";
import styled from "styled-components";


interface IProduct {
    name: string;
    quantity: string;
    currentUnitPrice: string;
}

interface IIngredient {
    title: string[];
    userId: string;
}

const IngredientsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Ingredient = styled.div`
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    width: 100%;
    height: 30px;
`

const NewIngredientContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    display: flex-start;
`

const NewIngredientSelect = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    width: 25%;
    height: 30px;
    border: 1px solid #ccc;
    `

export const Ingredients = () => {

    const [ingredients, setIngredients] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const removeIngredient = async (ingredient: string) => {
        updateFirebaseUserData(auth.currentUser?.uid ?? "", "ingredients", ingredients.filter(x => x !== ingredient)).then(
            () => {
                fetchUserIngredients()
            }
        ).catch((error) => {
            console.log(error);
        }
        )
    }

    const fetchUserIngredients = async () => {
        if (auth.currentUser) {
            try {
                console.log('fetching data...');
                const ingredients = await readFirebaseUserData(auth.currentUser.uid, "ingredients");
                if (!ingredients || !ingredients.length) {
                    return;
                }
                setIngredients(ingredients[0].ingredients)
                setLoading(false)
            } catch (error) {
                console.log("Error fetching history data: ", error);
            }
        }
    };

    useEffect(() => {
        fetchUserIngredients()
    }, [])


    const tabs = [
        {
            name: "New ingredients",
            component: <NewIngredients fetchUserIngredients={fetchUserIngredients} />
        },
        // {
        //     name: "Market products",
        //     component: <MarketProducts />
        // }
    ]

    const [activeTab, setActiveTab] = useState<string>(tabs[0].name)


    return (
        <Container>
            <Menu />
            <p>My ingredients:</p>
            <IngredientsContainer>
                {ingredients?.map((ingredient: string) => {
                    return (
                        <Ingredient>
                            <Tag text={ingredient} />
                            <CiCircleRemove onClick={() => removeIngredient(ingredient)} />
                        </Ingredient>
                    )
                })}
            </IngredientsContainer>
            <div className="tabs">
                {tabs.map((tab, index) => {
                    return (
                        <div key={index} className={activeTab == tab.name ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab.name)}>
                            <h1>{tab.name}</h1>
                        </div>
                    )
                }
                )}
            </div>

            {tabs.find(x => x.name === activeTab)?.component}


        </Container>
    )
}


interface INewIngredients {
    fetchUserIngredients: () => void;
}

const NewIngredients = ({ fetchUserIngredients }: INewIngredients) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [allIngredients, setAllIngredients] = useState<IIngredient[]>([])

    useEffect(() => {
        getIngredients()
    }, [])



    const getIngredients = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/ingredients`
        );
        setAllIngredients(response.data.data);
        setCheckedState(new Array(response.data.data.length).fill(false))
    }

    const saveIngredients = async () => {
        await writeIngredientsData({
            userId: auth.currentUser?.uid ?? "",
            ingredients: selectedIngredients
        }).then(() => {
            fetchUserIngredients()
        }).catch((error) => {
            console.log(error);
        })
    }

    const [checkedState, setCheckedState] = useState(
        new Array(allIngredients.length).fill(false)
    );

    const [searchIngredients, setSearchIngredients] = useState<any>([])
    const searchInputRef = useRef(null);
    const handleOnChange = (position: number) => {

        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);

        const selectedProducts = updatedCheckedState.map((item, index) => item === true ? allIngredients[index] : null
        ).filter(x => x !== null) as unknown as string[];
        setSelectedIngredients(selectedProducts)
    };

    const toggleSearch = () => {
        setTimeout(() => {
            // @ts-ignore
            searchInputRef?.current?.focus();
        }, 0);

    };

    const [searchIngredientsLoading, setSearchIngredientsLoading] = useState<boolean>(false)

    const searchIngredientsRequest = async () => {

        setSearchIngredientsLoading(true)
        const queryParams = [];
        if (searchIngredients) {
            queryParams.push(`searchIngredient=${searchIngredients}`);
        }

        const queryString = queryParams.join("&");
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/ingredients?${queryString}`
        );
        setCheckedState(new Array(response.data.data.length).fill(false));
        setAllIngredients(response.data.data)
        setSearchIngredientsLoading(false)
    }

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])


    return (
        <div>
            <>
                <div className={`search-container mt-3 expanded`}>
                    <div className="search-icon">
                        <CgSearch size={23} />
                    </div>
                    <input
                        type="text"
                        className="search-input"
                        style={{ width: "150px" }}
                        ref={searchInputRef}
                        placeholder="Ingredients"
                        value={searchIngredients}
                        onChange={(e) => setSearchIngredients(e.target.value)}
                        onClick={toggleSearch}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                toggleSearch();
                                searchIngredientsRequest();
                            }
                        }}
                    />
                </div>
                <button onClick={() => saveIngredients()} className="primary-button">
                    Save ingredients
                </button>
                {searchIngredientsLoading
                    ? <p>Loading...</p> :
                    <NewIngredientContainer>
                        {allIngredients.map((ingredient: any, index: number) => {
                            return (
                                <NewIngredientSelect>

                                    <input
                                        type="checkbox"
                                        id={`custom-checkbox-${index}`}
                                        name={ingredient}
                                        value={ingredient}
                                        checked={checkedState[index]}
                                        onChange={() => handleOnChange(index)}
                                    />
                                    <div className="product-checkbox-label">
                                        <label htmlFor={`custom-checkbox-${index}`}>{ingredient}</label>
                                    </div>
                                </NewIngredientSelect>
                            )
                        }
                        )}
                    </NewIngredientContainer>
                }
            </>
        </div>
    )
}


const MarketProducts = () => {

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
    const [marketProducts, setMarketProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [checkedState, setCheckedState] = useState(
        new Array(marketProducts.length).fill(false)
    );


    const handleOnChange = (position: number) => {

        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);

        const selectedProducts = updatedCheckedState.map((item, index) => item === true ? marketProducts[index] : null
        ).filter(x => x !== null) as unknown as string[];

        console.log(selectedProducts)
        setSelectedIngredients(selectedProducts)

    };


    const getProductsFromMarket = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/lidlAuth`
        );
        setMarketProducts(response.data);
        setCheckedState(new Array(response.data.length).fill(false));
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        getProductsFromMarket()
    }, [])

    return (
        <div>
            <h2>Lidl Authenticate:</h2>
            <input type="text" placeholder="phone" />
            <input type="text" placeholder="password" />
            {loading && !marketProducts ?
                <>
                    <p>Loading...</p>
                </> :
                <div className="market-products">
                    <h2>Market Products:</h2>
                    {marketProducts.sort((x, y) => +y.currentUnitPrice - +x.currentUnitPrice).map((product, index) => {
                        return (
                            <div className="product-checkbox">
                                <input
                                    type="checkbox"
                                    id={`custom-checkbox-${index}`}
                                    name={product.name}
                                    value={product.name}
                                    checked={checkedState[index]}
                                    onChange={() => handleOnChange(index)}
                                />
                                <div className="product-checkbox-label">
                                    <label htmlFor={`custom-checkbox-${index}`}>{product.name}</label>
                                    <p>{product.quantity} x {product.currentUnitPrice}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>}
        </div>
    )
}