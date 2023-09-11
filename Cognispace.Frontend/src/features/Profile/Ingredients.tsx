import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../../config.json";
import { auth, readFirebaseUserData, writeIngredientsData } from "../../auth/firebase";
import '../../style/ingredients.scss'
import { Tag } from "../../components/Tag";
import Menu from "../../components/Menu";
import { CgSearch } from "react-icons/cg";


interface IProduct {
    name: string;
    quantity: string;
    currentUnitPrice: string;
}

interface IIngredient {
    title: string[];
    userId: string;
}

export const Ingredients = () => {

    const [marketProducts, setMarketProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const [allIngredients, setAllIngredients] = useState<IIngredient[]>([])
    const [ingredients, setIngredients] = useState<IIngredient[]>([])
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

    const getProductsFromMarket = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/lidlAuth`
        );
        setMarketProducts(response.data);
        setCheckedState(new Array(response.data.length).fill(false));
        setLoading(false)
    }

    const fetchUserIngredients = async () => {
        if (auth.currentUser) {
            try {
                const ingredients = await readFirebaseUserData(auth.currentUser.uid, "ingredients");
                setIngredients(ingredients[0].ingredients)
                setLoading(false)
            } catch (error) {
                console.log("Error fetching history data: ", error);
            }
        }
    };

    const saveIngredients = () => {
        writeIngredientsData({
            userId: auth.currentUser?.uid ?? "",
            ingredients: selectedIngredients
        })
        fetchUserIngredients()
    }


    useEffect(() => {
        setLoading(true)

        //
        //getProductsFromMarket()
        getIngredients()
        fetchUserIngredients()

    }, [])

    const [searchIngredients, setSearchIngredients] = useState<any>([])
    // adding market products
    const [checkedState, setCheckedState] = useState(
        new Array(allIngredients.length).fill(false)
    );

    const handleOnChange = (position: number) => {

        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);

        const selectedProducts = updatedCheckedState.map((item, index) => item === true ? allIngredients[index] : null
        ).filter(x => x !== null) as unknown as string[];

        console.log(selectedProducts)
        setSelectedIngredients(selectedProducts)

    };

    const getIngredients = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/ingredients`
        );
        setAllIngredients(response.data.data);
    }

    const searchInputRef = useRef(null);

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
        setAllIngredients(response.data.data)
        setSearchIngredientsLoading(false)
    }

    return (
        <div className="profile-container">
            <Menu />
            <h2>My ingredients:</h2>

            {ingredients?.map((ingredient: any) => {
                return (
                    <div className="tags">
                        <Tag text={ingredient} />
                    </div>
                )
            })}
            <>
                <h2>Lidl Authenticate:</h2>
                <input type="text" placeholder="phone" />
                <input type="text" placeholder="password" />
                {/* {loading && !marketProducts ?
                    <>
                        <p>Loading...</p>
                    </> :
                    <div className ="market-products">
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
                    </div>} */}
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
                    <>
                        {allIngredients.map((ingredient: any, index: number) => {
                            return (
                                <div className="tags">
                                    <div className="product-checkbox">
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
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </>
                }
            </>
        </div >
    )
}