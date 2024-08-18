import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

function Categories() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch("http://127.0.0.1:5555/categories", {
            method: "GET",
            credentials: 'include'
        })
       .then(res => res.json())
       .then(data => setCategories(data))
       .catch(error => console.error('Error:', error));
    })
    return (
    <>
    {categories ? (
        <>
            <h1>Categories</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </>
    ) : (<p>No categories to display</p>)}
    </>
    )
}

export default Categories