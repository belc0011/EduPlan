import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AccommodationSearch() {

    const [accommodations, setAccommodations] = useState()
    const [accommodationsToDisplay, setAccommodationsToDisplay] = useState()
    useEffect(() => {
        fetch("http://127.0.0.1:5555/accommodations", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include'
        })
       .then(res => res.json())
       .then(data => {
        setAccommodations(data);
        setAccommodationsToDisplay(data); 
    console.log(accommodations)}) 
    }, [])
    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\'\- ]+$/, "Description can not contain numbers or special characters, except an apostrophe, hyphen or white space")
        .required("Description is required"),
      });

    const formik = useFormik({
        initialValues: {
          description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            const filteredAccommodations = accommodations.filter(accommodation => accommodation.description.toLowerCase().includes(values.description.toLowerCase()))
            setAccommodationsToDisplay(filteredAccommodations)
            resetForm()
        }
        });

        function handleClick(e) {
            setAccommodationsToDisplay(accommodations) //
        }
    
    return (
        <>
        <h1>Accommodations:</h1>
        {accommodationsToDisplay ? accommodationsToDisplay.map(accommodation => (
            <div key={accommodation.id}>
                <h3>{accommodation.student.first_name} {accommodation.student.last_name}</h3>
                <p>{accommodation.description}</p>
            </div>))
            : <p>No accommodations available</p>}
            <form onSubmit={formik.handleSubmit}>
            <label htmlFor="description">Enter key words to search: </label>
                    <div>
                        <input 
                        type="text" 
                        placeholder="Enter key words for description" 
                        name="description"
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
        <button onClick={handleClick}>Click here to restore list of accommodations</button>
        </>
    )
}
export default AccommodationSearch