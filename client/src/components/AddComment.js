import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'

function AddComment() {
    
    const navigate = useNavigate()
    
    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\s'-]+$/, "Description can not contain numbers or special characters, except an apostrophe")
        .required("First name is required"),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
          fetch("http://127.0.0.1:5555/comments", {
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
                    data => {console.log(data)
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
            <label htmlFor="comment_text">Enter comment: </label>
                    <div>
                        <input 
                        type="text" 
                        placeholder="Enter description:" 
                        name="comment_text"
                        id="comment_text" 
                        value={formik.values.comment_text} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.comment_text && formik.errors.comment_text ? (
                        <p style={{ color: "red" }}>{formik.errors.comment_text}</p>
                        ) : null}
                    </div>
                    <div>
                        <p></p>
                        <button type="submit">Submit</button>
                    </div>
        </form>
    )
}

export default AddComment