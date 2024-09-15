import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from 'react-router-dom'

function AddComment({accommodation, setAccommodation, student, setStudent}) {
    
    const navigate = useNavigate()
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const accommodationId = parseInt(parts[3], 10)
    const studentId = parseInt(parts[2], 10)

    const formSchema = yup.object().shape({
        comment_text: yup
        .string()
        .matches(/^[a-zA-Z\s'-]+$/, "Description can not contain numbers or special characters, except an apostrophe")
        .required("Description is required"),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: "",
          accommodation_id: accommodationId,
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("click")
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
                res.json().then(data => {
                    // Assuming data contains the new comment, not the entire accommodation
                    setAccommodation(prevAccommodation => ({
                        ...prevAccommodation,
                        comment: data.comment // Update the comment field with the new data
                    }));
                    resetForm(); // Reset the form after setting the accommodation
                });
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