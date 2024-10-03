import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AccommodationByCategory() {
    const { students, setStudents, studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay, categories, setCategories } = useContext(StudentContext);
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const categoryId = parseInt(parts[3], 10)
    
    if (!categories || categories.length === 0) {
        
        return <div>Loading categories...</div>;
    }
    
    const selectedCategory = categories.filter(category => category.id === categoryId);
    
    console.log(selectedCategory);



    return (
        <div>
            { selectedCategory[0].accommodations.length > 0 ? (selectedCategory[0].accommodations.map(accommodation => {
                return <div className="card">
                    <h1>{accommodation.student.first_name} {accommodation.student.last_name}</h1>
                    <h2 key={selectedCategory.id}>{accommodation.description}</h2>
                    </div>
            })
        ) : (
            <div className="text-2xl italic">No accommodations in this category</div>
        )}
        </div>
    )
}

export default AccommodationByCategory