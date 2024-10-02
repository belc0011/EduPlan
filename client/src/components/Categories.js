import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import AddCategory from "./AddCategory.js";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:5555/categories", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include'
        })
           .then(response => response.json())
           .then(data => {
            setCategories(data.categories || [])
        console.log(data)
    })
           .catch(error => console.error('Error:', error));
    }, [])
    console.log(categories)
    function handleClick(e) {
        setShowAddCategory(!showAddCategory);
    }
    return (
    <>
        {categories.length > 0 ? (
            <>
                <h1>Categories</h1>
                <div>
                    {categories.map(category => (
                        <div>
                        <a key={category.id} href={`/categories/accommodations/${category.id}`}>{category.description}</a>
                        </div>
                    ))}
                </div>
                <h3>Click on a category to see students with accommodations in that category</h3>
            </>
        ) : (<p>No categories to display</p>)}
        <button onClick={handleClick}>Click here to add a new category</button>
        {showAddCategory && <AddCategory categories={categories} setCategories={setCategories}/>}
    </>
    )
}

export default Categories