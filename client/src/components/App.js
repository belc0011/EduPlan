import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login'
import NavBar from './NavBar'
import SignUp from './SignUp'
import Home from './Home'
import Students from './Students'
import EditStudent from "./EditStudent";
import StudentPage from './StudentPage';
import { StudentProvider } from './MyContext';
import Categories from './Categories';
import EditAccommodation from './EditAccommodation';
import AccommodationSearch from './AccommodationSearch';
import EditComment from './EditComment';
import AccommodationByCategory from "./AccommodationByCategory";
import EditCategory from "./EditCategory";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false)

  useEffect(() => {
    // auto-login
    fetch(`https://eduplan.onrender.com/check_session`, {
      method: "GET",
      credentials: 'include'
      })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        else if (r.status === 401){
          setUser(null);
          return null;
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then((user) => setUser(user))
      .catch((error) => console.error('There was a problem with the fetch operation:', error));
  }, []);
  
  return (
    <StudentProvider user={user}>
      <Router>
        {user ? (
          <>
            <NavBar user={user} setUser={setUser} />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:id" element={<StudentPage />} />
                <Route path="/students/edit_student/:id" element={<EditStudent />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/students/:id/:accommodationId" element={<EditAccommodation />} />
                <Route path="/accommodations" element={<AccommodationSearch />} />
                <Route path="/comment/:accommodationId" element={<EditComment />} />
                <Route path="/categories/accommodations/:categoryId" element={<AccommodationByCategory />} />
                <Route path="/categories/edit_category/:categoryId" element={<EditCategory />} />
                <Route path="*" element={<h1>Page not found</h1>} />
              </Routes>
            </main>
          </>
        ) : (
          <Login onLogin={setUser} />
        )}
      </Router>
    </StudentProvider>
  );
}

export default App;