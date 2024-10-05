import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation } from 'react-router-dom'
import AddCategory from "./AddCategory.js";
import { StudentContext } from "./MyContext.js";

function Categories() {
    const { categories, setCategories, categoryToDisplay, setCategoryToDisplay } = useContext(StudentContext);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const navigate = useNavigate()

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

    function handleEditClick(categoryId) {
        const category = categories.find(category => category.id === categoryId);
        setCategoryToDisplay(category);
        navigate(`/categories/edit_category/${categoryId}`);
    }

    return (
    <>
        {categories.length > 0 ? (
            <div className="bg-slate-100">
                <h1 className="text-6xl font-bold py-8">Categories</h1>
                <div>
                    {categories.map(category => (
                        <div className="text-blue-700 font-bold py-3">
                            <a key={category.id} href={`/categories/accommodations/${category.id}`} className="text-4xl">{category.description}</a>
                            <button onClick={() => handleEditClick(category.id)} className="mx-5">EDIT</button>
                            <button className="mx-3 border-2 border-red-800 text-red-800">DELETE</button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (<p className="text-3xl">No categories to display</p>)}
        <div className="py-5">
            <button onClick={handleClick} className="bg-slate-700 text-white text-xl">NEW CATEGORY</button>
        </div>
        {showAddCategory && <AddCategory categories={categories} setCategories={setCategories}/>}
    </>
    )
}

export default Categories