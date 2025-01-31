import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";  
import axios from "axios";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SummarizePage from "./components/SummarizePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["token"], (result) => {
      if (result.token) {
        axios
          .get("http://localhost:5000/auth/verify", {
            headers: { Authorization: `Bearer ${result.token}` },
            withCredentials: true,
          })
          .then(() => {
            setIsAuthenticated(true);
          })
          .catch(() => {
            setIsAuthenticated(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        chrome.storage.local.remove("token", () => {
          setIsAuthenticated(false);
        });
      })
      .catch((error) => {
        console.log("Error during logout", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <div>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <SummarizePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
