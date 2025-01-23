import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { logoutUser } from "../service/authApi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  
  const handleLogout = async() => {
    try {
      const {data} = await logoutUser();
      logout(data);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }

  if(!user) {
    // Redirect to login page if user is not logged in
    navigate("/login");
    return 
  }


  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Welcome, {user.username}</h2>

      <p>You have successfully logged in and verified </p>

      <button
        type="button"
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
