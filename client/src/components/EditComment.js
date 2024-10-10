import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";

function EditComment() {
    const { studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay } = useContext(StudentContext);
    const [showForm, setShowForm] = useState(false);
    const commentId = accommodationToDisplay.comment.id;
    const id = studentToDisplay.id;

    const formSchema = yup.object().shape({
        comment_text: yup
        .string()
        .matches(/^[a-zA-Z0-9\'\-\/ ]+$/, "Comment can not contain special characters, except an apostrophe, hyphen, forward slash, or white space")
        .required(),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: "",
          comment_id: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("inside on submit")
          fetch(`https://eduplan.onrender.com/comments/${commentId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(data => {
                    setAccommodationToDisplay(prevAccommodation => ({
                        ...prevAccommodation,
                        comment: data
                      }));
                resetForm()})
            }
            else {
                console.log("error: " + res)
            }
        })
        .catch(error => {
            console.error('Error updating student:', error)})
    }
    });

    function handleClick(e) {
        setShowForm(true)
    }

    function handleDelete(e) {
        const userConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (userConfirmed) {
            fetch(`https://eduplan.onrender.com/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                setAccommodationToDisplay(prevState => ({
                    ...prevState,
                    comment: {
                        ...prevState.comment,
                        description: ""
                    }
                }))
            })
            .catch(error => {console.error("error: " + error.message)});
        }
    }

    return (
    <>
    {accommodationToDisplay.comment ? (
        <div className="bg-slate-100">
            <a href={`/students/${id}`} className="text-blue-800 text-6xl font-bold">{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
            <h2 className="py-5 text-4xl">{accommodationToDisplay.description}</h2>
            <div className="grid grid-cols-2 pb-5">    
                <h2 className="italic text-3xl pl-15 text-right">Current comment:</h2>
                <h3 className="pr-20 pl-3 text-3xl text-left">{accommodationToDisplay.comment.description}</h3>
            </div>
            <div className="grid grid-cols-2 py-8">
                <button onClick={handleClick} className="text-3xl text-blue-800 font-bold border-slate-500 border-4 w-fit justify-self-center ml-20 bg-blue-100">EDIT COMMENT</button>
                <button onClick={handleDelete} className="text-3xl text-red-800 font-bold border-slate-500 border-4 w-fit justify-self-center mr-20 bg-red-100">DELETE COMMENT</button>
            </div>
            {showForm ? (
                <div className="text-white text-3xl italic py-5 border-2 border-slate-400 bg-slate-700">
                    <h1>EDIT COMMENT</h1>
                    <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="comment_text" className="text-2xl pt-5">Enter new comment: </label>
                        <input 
                        type="text" 
                        placeholder="Enter description" 
                        name="comment_text"
                        className="ml-10 my-5 text-black"
                        id="comment_text" 
                        value={formik.values.comment_text}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.comment_text && formik.errors.comment_text ? (
                        <p style={{ color: "red" }}>{formik.errors.comment_text}</p>
                        ) : null}
                    <div>
                        <button type="submit">SUBMIT</button>
                    </div>
                </form>
            </div>
            ) : null}
    </div>) : <p className="italic text-xl">Error loading page, please return to home page</p>}
    </>)

}
export default EditComment