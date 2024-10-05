import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";

function EditCategory() {
    const { categories, setCategories, categoryToDisplay, setCategoryToDisplay } = useContext(StudentContext);

    return(
        <div>
            <h1>{categoryToDisplay.description}</h1>
        </div>
    )
}

export default EditCategory;