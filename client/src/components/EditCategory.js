import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";

function EditCategory() {
    const { categories, setCategories, categoryToDisplay, setCategoryToDisplay } = useContext(StudentContext);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\s'/-]+$/, "Description can not contain numbers or special characters, except an apostrophe, hyphen or forward slash")
        .required("Description is required"),
      });

      const formik = useFormik({
        initialValues: {
            description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            const changes = {};
    
            if (values.description !== formik.initialValues.description) {
                changes.description = values.description;
            }
    
            if (Object.keys(changes).length > 0) {
                fetch(`http://127.0.0.1:5555/categories/${categoryToDisplay.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(changes, null, 2),
                    credentials: 'include'
                })
                .then(res => {
                    if (res.ok) {
                        res.json().then(data => {
                            setCategoryToDisplay(data);
                            setCategories(prevCategories => [
                                ...prevCategories, data
                            ]);
                            resetForm();
                        });
                    } else {
                        console.log("error: " + res);
                    }
                })
                .catch(error => {
                    console.error('Error updating student:', error);
                });
            }
        }
    });

    function handleDeleteClick(e) {
        const isConfirmed = window.confirm('Are you sure you want to delete this accommodation?');
        if (isConfirmed) {
            fetch(`http://127.0.0.1:5555/categories/${categoryToDisplay.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                const updatedCategories = categories.filter(category => category.id !== categoryToDisplay.id);
                setCategories(updatedCategories);
                navigate("/categories");
            })
            .catch(err => {console.error("error: " + err.message)});
        }
        else {
            console.log('User canceled delete action')
        }
    }
    
    return(
        categoryToDisplay ? (
            <div className="bg-slate-200">
                <h1 className="text-4xl italic py-5">Current category: {categoryToDisplay.description}</h1>
                    <div className="bg-slate-700">
                        <h2 className="text-white text-xl italic py-3">Enter the updated category description</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="description" className="text-white text-3xl pb-2 italic">New description: </label>
                                    <input 
                                    type="text" 
                                    placeholder="Enter description"
                                    className="text-black text-2xl" 
                                    name="description"
                                    id="description" 
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}/>
                                    {formik.touched.description && formik.errors.description ? (
                                    <p style={{ color: "red" }}>{formik.errors.description}</p>
                                    ) : null}
                            </div>
                                <div className="py-3">
                                    <button type="submit" className="bg-slate-200 text-2xl font-bold text-black">SUBMIT</button>
                                </div>
                        </form>
                    </div>
                <div className="py-3">
                    <button onClick={handleDeleteClick}>DELETE THIS CATEGORY</button>
                </div>
            </div>
        ) : <p className="italic text-xl">Error loading page, please return to the home page</p>
    )
}

export default EditCategory;