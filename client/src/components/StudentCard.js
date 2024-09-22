import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import { StudentContext } from "./MyContext.js";

function StudentCard({firstName, lastName, grade, accommodations, id}) {
    const navigate = useNavigate()
    const { studentToDisplay, setStudentToDisplay } = useContext(StudentContext);
    function handleClick(e) {
        setStudentToDisplay({firstName, lastName, grade, accommodations, id})
        navigate(`edit_student/${id}`)
    }
    return (
        <div className="card">
            <a href={`/students/${id}`}>{firstName} {lastName}</a>
            <h3>Grade {grade}</h3>
               <p> Accommodations: </p>
                {accommodations && accommodations.length > 0 ? (
                    accommodations.map(accommodation => (
                        <div key={accommodation.id}>
                        <a href={`/students/${id}/${accommodation.id}`}>{accommodation.description}</a>
                        </div>
                    ))
                ) : (
                    <div>No Accommodations</div>
                )}
            <button onClick={handleClick}>Click to edit student info</button>
        </div>
    )
}

export default StudentCard