import React, { useEffect, useState } from "react";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Home from './Home.js'

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;