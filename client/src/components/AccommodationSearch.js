import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import Login from "./Login.js";

function AccommodationSearch() {

    const [accommodations, setAccommodations] = useState([])
    const [accommodationsToDisplay, setAccommodationsToDisplay] = useState([])
    const navigate = useNavigate()
    const { user } = useContext(StudentContext);

    useEffect(() => {
        fetch("https://eduplan.onrender.com/accommodations", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include'
        })
       .then(res => res.json())
       .then(data => {
        setAccommodations(data);
        setAccommodationsToDisplay(data)}) 
        .catch(err => {console.error(err);});
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

        function handleStudentClick(studentId) {
            
            navigate(`/students/${studentId}`)
        }
    
    return (
        user ? (
            accommodationsToDisplay.length > 0 ? (
                <div>
                    <h1 className="text-5xl py-7 font-bold">Accommodations:</h1>
                    <form onSubmit={formik.handleSubmit}>
                        <label htmlFor="description" className="text-2xl italic py-3">Enter key words to search accommodations: </label>
                                <div>
                                    <input 
                                    type="text" 
                                    placeholder="Enter key words for description" 
                                    name="description"
                                    id="description" 
                                    className="py-4 text-2xl w-1/3"
                                    value={formik.values.description} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}/>
                                    {formik.touched.description && formik.errors.description ? (
                                    <p style={{ color: "red" }}>{formik.errors.description}</p>
                                    ) : null}
                                </div>
                                <div className="py-3 text-xl">
                                    <button type="submit" className="bg-slate-700 text-white font-bold">SUBMIT</button>
                                </div>
                    </form>
                    <div className="py-3">
                        <button onClick={handleClick} className="py-3 text-xl bg-slate-200 font-bold text-black">RESTORE LIST</button>
                    </div>
                    <div className="grid grid-cols-4">
                        {accommodationsToDisplay.length > 0 ? accommodationsToDisplay.map(accommodation => (
                            <button key={accommodation.id} className="bg-slate-200 border-2 border-slate-700 mx-1 my-1" onClick={() => handleStudentClick(accommodation.student.id)}>
                                <h3 className="text-2xl text-red-700 font-bold py-2">{accommodation.student.first_name} {accommodation.student.last_name}</h3>
                                <p className="py-2 text-xl italic text-black">{accommodation.description}</p>
                            </button>))
                            : <p className="text-3xl italic">No accommodations available</p>}
                    </div>
                </div>
            ) : (<p>Loading, please wait...</p>)
        ) : <Login />
    )
}
export default AccommodationSearch