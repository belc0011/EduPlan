import React from 'react'
import { NavLink, Link, useNavigate } from "react-router-dom";
function NavBar({ user, setUser }) {
    const navigate = useNavigate()

    function handleLogoutClick() {
        fetch("https://eduplan.onrender.com/logout", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                setUser(null);
                navigate('/')
            }
        })
        .catch(error => console.log(error));
    }
    if (user) {
    return (
        <nav className = "justify-center flex px-px pt-1 pb-1">
            <div>
                <Link to="/" className="nav-link">Home</Link>
            </div>
            <div>
                <Link to="/students" className="nav-link">Students</Link>
            </div>
            <div>
                <Link to="/categories" className="nav-link">Categories</Link>
            </div>
            <div>
                <Link to="/accommodations" className="nav-link">Accommodations</Link>
            </div>
            <div>
                <Link to="/" className="nav-link" onClick={handleLogoutClick}>Logout</Link>
            </div>
        </nav>
    );
  }
}

  export default NavBar