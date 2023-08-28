import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import config from "../config.json";

export const Ingredients = () => {

    const navigate = useNavigate();

    // Lidl API
    // https://github.com/KoenZomers/LidlApi/tree/main

    const [allProducts, setAllProducts] = useState<any[]>([])


    const getAllProducts = async () => {
        const response = await axios.get(
            `${config.apps.CognispaceAPI.url}/lidlAuth`
        );
        setAllProducts(response.data);
    }


    useEffect(() => {

        getAllProducts()

    }, [])


    return (
        <div style={{ paddingTop: '5%', paddingLeft: ' 70px' }}>
            <div onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></div>
            <h2>Ingredients:</h2>

            <h2>My Products:</h2>
            {allProducts.map((product) => {
                return (
                    <div>
                        <p>{product.name}</p>
                        <p>{product.quantity} x {product.currentUnitPrice}</p>
                    </div>
                )
            })}

        </div>
    )
}