import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";

function EditComment() {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const accommodationId = parseInt(parts[2], 10)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { students, accommodationToDisplay, setAccommodationToDisplay } = useContext(StudentContext);
    const [showForm, setShowForm] = useState(false);
    const [commentToDisplay, setCommentToDisplay] = useState("");

    const { accommodation, student, commentId } = location.state || {};
    console.log(accommodationToDisplay);
    console.log(student);
    console.log(commentId);

    console.log("Comment ID:" + commentId)

    const formSchema = yup.object().shape({
        comment_text: yup
        .string()
        .matches(/^[a-zA-Z\' ]+$/, "Description can not contain numbers or special characters, except an apostrophe or a space")
        .required(),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: accommodationToDisplay.comment.description,
          comment_id: commentId,
        },
        //validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("inside on submit")
          fetch(`http://127.0.0.1:5555/comments/${commentId}`, {
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
                    console.log("student: " + student + "accomm" + accommodationId);
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
        fetch(`http://127.0.0.1:5555/comments/${commentId}`, {
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
       });
    }
    return (
    <>
        <h1>{accommodationToDisplay.description}</h1>
        <h2>Current comment:</h2>
        <div>
            <h3>{accommodationToDisplay.comment.description}</h3>
        </div>
        <div>
            <button onClick={handleClick}>Edit comment</button>
        </div>
        <div>
            <button onClick={handleDelete}>Delete Comment</button>
        </div>
        {showForm ? (
            <form onSubmit={formik.handleSubmit}>
            <label htmlFor="comment_text">Enter new accommodation comment: </label>
                <div>
                    <input 
                    type="text" 
                    placeholder="Enter description" 
                    name="comment_text"
                    id="comment_text" 
                    value={formik.values.comment_text} /* add touched, blur and errors */
                    onChange={formik.handleChange}/>
                </div>
                <div>
                    <p></p>
                    <button type="submit">Submit</button>
                </div>
        </form>
        ) : null}
    </>)

}
export default EditComment