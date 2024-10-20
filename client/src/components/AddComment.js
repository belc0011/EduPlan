import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { StudentContext } from "./MyContext.js";
import Login from "./Login.js";

function AddComment({accommodation, setAccommodation, student, setStudent, students, setStudents}) {
    const { user } = useContext(StudentContext);
    const accommodationId = accommodation.id

    const formSchema = yup.object().shape({
        comment_text: yup
        .string()
        .matches(/^[a-zA-Z0-9\'\-\/ ]+$/, "Comment can not contain special characters, except an apostrophe, hyphen, forward slash, or white space")
        .required("Comment description is required"),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: "",
          accommodation_id: accommodationId,
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("click")
          fetch("https://eduplan.onrender.com/comments", {
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
                    setAccommodation(prevAccommodation => ({
                        ...prevAccommodation,
                        comment: data
                      }));
                    setStudent(prevStudent => ({
                        ...prevStudent,
                        accommodations: prevStudent.accommodations.map(accommodation =>
                            accommodation.id === accommodationId ? {...accommodation, comment: data} : accommodation
                        )
                    }));
                    setStudents(prevStudents => 
                        prevStudents.map(student1 => 
                            student1.id === student.id ? { ...student1, ...student } : student1
                        ))
                    resetForm(); 
                    console.log(accommodation);
                    console.log(student);
                });
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
   
    return (
        user ? (
            <form onSubmit={formik.handleSubmit} className="bg-slate-700 text-white">
                <label htmlFor="comment_text" className="text-3xl">Enter comment: </label>
                    <input 
                    type="text" 
                    placeholder="Enter description:" 
                    name="comment_text"
                    id="comment_text" 
                    className="ml-10 mt-8 mb-5 text-black"
                    value={formik.values.comment_text} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.comment_text && formik.errors.comment_text ? (
                    <p style={{ color: "red" }}>{formik.errors.comment_text}</p>
                    ) : null}
                <div>
                    <button type="submit" className="mb-5 text-xl">SUBMIT</button>
                </div>
            </form>
        ) : <Login />
    )
}

export default AddComment