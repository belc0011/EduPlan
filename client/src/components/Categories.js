import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import AddCategory from "./AddCategory.js";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);

    

    function handleClick(e) {
        setShowAddCategory(!showAddCategory);
    }
    return (
    <>
        {categories.length > 0 ? (
            <>
                <h1>Categories</h1>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>{category.description}</li>
                    ))}
                </ul>
            </>
        ) : (<p>No categories to display</p>)}
        <button onClick={handleClick}>Click here to add a new category</button>
        {showAddCategory && <AddCategory categories={categories} setCategories={setCategories}/>}
    </>
    )
}

export default Categories