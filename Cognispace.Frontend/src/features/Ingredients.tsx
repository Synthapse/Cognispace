import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import config from "../config.json";
import { auth, readIngredientsData, writeIngredientsData } from "../auth/firebase";
import { DocumentData } from "firebase/firestore";


interface IProduct {
    name: string;
    quantity: string;
    currentUnitPrice: string;
}

export const Ingredients = () => {

    const navigate = useNavigate();

    // Lidl API
    // https://github.com/KoenZomers/LidlApi/tree/main

    const [allProducts, setAllProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const [ingredients, setIngredients] = useState<any[]>([])

    const [selectedIngredients, setSelectedIngredients] = useState<IProduct[]>([])


    const getAllProducts = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/lidlAuth`
        );
        setAllProducts(response.data);
        setCheckedState(new Array(response.data.length).fill(false));
        setLoading(false)
    }

    const fetchUserIngredients = async () => {
        if (auth.currentUser) {
            try {
                const data = await readIngredientsData(auth.currentUser.uid);
                setIngredients(data.map((item: DocumentData) => item.data))
                setLoading(false)
            } catch (error) {
                console.log("Error fetching history data: ", error);
            }
        }
    };

    const saveIngredients = () => {
        writeIngredientsData({
            userId: auth.currentUser?.uid ?? "",
            title: selectedIngredients.map(x => x.name).toString(),
        })
    }


    useEffect(() => {
        setLoading(true)
        getAllProducts()
        fetchUserIngredients()

    }, [])

    const [checkedState, setCheckedState] = useState(
        new Array(allProducts.length).fill(false)
    );

    const handleOnChange = (position: number) => {

        console.log(position)

        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        console.log(updatedCheckedState)

        setCheckedState(updatedCheckedState);

        const selectedProducts = updatedCheckedState.map((item, index) =>
            item === true ? allProducts[index] : null
        ).filter(x => x !== null);
        //@ts-ignore
        setSelectedIngredients(selectedProducts)
    };


    return (
        <div style={{ paddingTop: '5%', paddingLeft: ' 70px' }}>
            <div onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></div>
            <h2>Ingredients:</h2>

            {ingredients?.map((ingredient: any) => {
                return (
                    <p>
                        {ingredient.title}
                    </p>)
            })}
            <h2>My Products:</h2>
            {loading ? <p>Loading...</p> :
                allProducts.map((product, index) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={product.name}
                                value={product.name}
                                checked={checkedState[index]}
                                onChange={() => handleOnChange(index)}
                            />
                            <div>
                                <label htmlFor={`custom-checkbox-${index}`}>{product.name}</label>
                                <p>{product.quantity} x {product.currentUnitPrice}</p>
                            </div>
                        </div>
                    )
                })}
            <button onClick={() => saveIngredients()} className="primary-button">
                Save ingredients
            </button>


        </div>
    )
}