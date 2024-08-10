import React from 'react'
import { NavLink, Link, useNavigate } from "react-router-dom";
function NavBar({ user, setUser }) {
    const navigate = useNavigate()

    function handleLogoutClick() {
        fetch('/logout', {
            method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                setUser(null);
                navigate('/')
            }
        })
    }
    if (user) {
    return (
        <nav>
            <div>
                <Link to="/" className="nav-link">Home</Link>
            </div>
            <div>
                <Link to="/login" className="nav-link" onClick={handleLogoutClick}>Logout</Link>
            </div>
        </nav>
    );
  }
}

  export default NavBar