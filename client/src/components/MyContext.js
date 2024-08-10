import React from 'react';
import { useState, useEffect } from'react';

const StudentContext = React.createContext()

function StudentProvider({children}) {
    const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/students")
    .then(res => res.json())
    .then(data => setStudents(data))
    .catch(error => console.error(error))
  }, []);
    return <StudentContext.Provider value={{students, setStudents}}>{children}</StudentContext.Provider>
}

export {StudentContext, StudentProvider}