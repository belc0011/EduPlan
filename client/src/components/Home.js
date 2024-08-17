import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import AddStudent from './AddStudent'

function Home() {
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate()

    function handleClick(e) {
        navigate('/accommodations')
    }
    function handleSubmit(e) {
        e.preventDefault()
        setShowComponent(true)
    }
    
    function handleSubmit2(e) {
        e.preventDefault()
        navigate('/students')
        
    }

    return (
        <div>
            <main>
                <h3>Click here to search by accommodation: </h3>
                <button onClick={handleClick}>Accommodation Search</button>
                <form onSubmit={handleSubmit2}>
                    <h3>Click here for a list of your students</h3>
                    <div>
                        <p></p>
                        <button type="submit">Student List</button>
                    </div>
                </form>
                <form onSubmit={handleSubmit}>
                <h3>Click here to add a student</h3>
                    <div>
                        <p></p>
                        <button type="submit">Add a student</button>
                    </div>
                </form>
                {showComponent && <AddStudent />}
            </main>
        </div>
            )
}

export default Home