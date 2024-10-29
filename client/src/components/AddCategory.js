import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function AddCategory({ categories, setCategories}) {
    
    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\s'/&-]+$/, "Description can not contain numbers or special characters, except an apostrophe, hyphen, ampersand or forward slash")
        .required("Description is required"),
      });

    const formik = useFormik({
        initialValues: {
          description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
          fetch("https://eduplan.onrender.com/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(
                    data => {setCategories(prevCategories => [...prevCategories, data])
                resetForm()
            })
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
   
    return(
        <form onSubmit={formik.handleSubmit} className="bg-slate-700">
            <div className="text-3xl">
                <div className="py-6">
                    <label htmlFor="description" className="text-white">Enter New Category Name: </label>
                    <input 
                    type="text" 
                    placeholder="Enter category name" 
                    description="description"
                    id="description" 
                    value={formik.values.description} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.description && formik.errors.description ? (
                    <p style={{ color: "red" }}>{formik.errors.description}</p>
                    ) : null}
                </div>
            </div>
                    <div>
                        <button type="submit" className="bg-slate-200 text-slate-700 font-bold border-3 text-2xl">SUBMIT</button>
                    </div>
        </form>
    )
}

export default AddCategory