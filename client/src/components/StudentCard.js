import React from 'react'
import { useNavigate } from 'react-router-dom'

function StudentCard({firstName, lastName, grade, accommodations, id}) {
    const navigate = useNavigate()
    function handleClick(e) {
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
                        <a href={`/comments/${id}/${accommodation.id}`}>{accommodation.description}</a>
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