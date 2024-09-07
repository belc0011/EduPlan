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
    const id = parseInt(parts[3], 10)
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { accommodation } = location.state || {};
    console.log(accommodation)
    return (<>
    <h2>{accommodation.comment.map(comment => {
        return <h3 key={comment.id}>{comment.description}</h3>
    })}</h2>
    </>)

}
export default EditComment