import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import { StudentContext } from "./MyContext.js";

function StudentCard({firstName, lastName, grade, accommodations, id}) {
    const navigate = useNavigate()
    const { studentToDisplay, setStudentToDisplay } = useContext(StudentContext);
    function handleClick(e) {
        setStudentToDisplay({firstName, lastName, grade, accommodations, id})
        navigate(`/students/${id}`)
    }
    return (
        firstName && lastName && grade && accommodations && id ? (
        <div className="bg-slate-200 border-4 border-black/50 rounded-2xl flex flex-col">
            <button onClick={handleClick}>
                <h1 className="text-red-900 font-bold text-3xl">{firstName} {lastName}</h1>
                <h3 className="text-lg">Grade {grade}</h3>
                <p className="text-2xl underline pb-2"> Accommodations: </p>
                    {accommodations && accommodations.length > 0 ? (
                        accommodations.map(accommodation => (
                            <div key={accommodation.id}>
                            <li className="pb-2 text-lg">{accommodation.description}</li>
                            </div>
                        ))
                    ) : (
                        <div className="italic">No Accommodations</div>
                    )}
            </button>
        </div>
        ) : (
            <p className="italic text-2xl">Loading...</p>
        )
    )
}

export default StudentCard