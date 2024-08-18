import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AddCategory({ categories, setCategories}) {
    
    const navigate = useNavigate()
    
    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z'-]+$/, "Description can not contain numbers or special characters, except an apostrophe")
        .required("First name is required"),
      });

    const formik = useFormik({
        initialValues: {
          description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
          fetch("http://127.0.0.1:5555/categories", {
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
                navigate('/')
            })
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
   
    return(
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="description">Description: </label>
                    <div>
                        <input 
                        type="text" 
                        placeholder="Enter description:" 
                        description="description"
                        id="description" 
                        value={formik.values.description} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.description && formik.errors.description ? (
                        <p style={{ color: "red" }}>{formik.errors.description}</p>
                        ) : null}
                    </div>
                    <div>
                        <p></p>
                        <button type="submit">Submit</button>
                    </div>
        </form>
    )
}

export default AddCategory