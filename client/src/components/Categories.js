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
    })
           .catch(error => console.error('Error:', error));
    }, [])
    
    function handleClick(e) {
        setShowAddCategory(prevState => !prevState);
    }

    function handleEditClick(categoryId) {
        navigate(`/categories/edit_category/${categoryId}`);
    }

    function handleDeleteClick(categoryId) {
        const isConfirmed = window.confirm('Are you sure you want to delete this category?');
        if (isConfirmed) {
            fetch(`http://127.0.0.1:5555/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include'
            })
           .then(res => res.json())
           .then(data => {
                const updatedCategories = categories.filter(category => category.id!== categoryId);
                setCategories(updatedCategories);
            })
           .catch(err => {console.error("error: " + err.message)});
        }
        else {
            console.log('User canceled delete action')
        }
    }
    console.log(categories);

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
                            <button onClick={() => handleDeleteClick(category.id)} className="mx-3 border-2 border-red-800 text-red-800">DELETE</button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (<p className="text-3xl">No categories to display</p>)}
        {!showAddCategory ? (
            <div className="py-5">
                <button onClick={handleClick} className="bg-slate-700 text-white text-xl">NEW CATEGORY</button>
            </div>
            ) : (
            <div className="py-5">
                <button onClick={handleClick} className="bg-slate-700 text-white text-xl">HIDE NEW CATEGORY</button>
            </div>)}
        {showAddCategory && <AddCategory categories={categories} setCategories={setCategories}/>}
    </>
    )
}

export default Categories