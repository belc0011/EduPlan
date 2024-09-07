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
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { accommodation } = location.state || {};
    console.log(accommodation)
    const [showForm, setShowForm] = useState(false);
    const commentId = accommodation.comment[0].id;

    const formSchema = yup.object().shape({
        comment_text: yup
        .string()
        .matches(/^[a-zA-Z\' ]+$/, "Description can not contain numbers or special characters, except an apostrophe or a space")
        .required(),
      });

    const formik = useFormik({
        initialValues: {
          comment_text: accommodation.comment.description,
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
                    console.log(data);
                navigate('/students')
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
    return (
    <>
        <h1>{accommodation.description}</h1>
        <h2>{accommodation.comment.map(comment => {
            return <h3 key={comment.id}>Current comment: {comment.description}</h3>
        })}</h2>

        <button onClick={handleClick}>Click here to edit comment</button>
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