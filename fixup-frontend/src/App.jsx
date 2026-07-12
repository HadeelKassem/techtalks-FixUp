import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./Register";
import ClientDashboard from "./ClientDashboard";
import ProviderDashboard from "./Providerdashboard";
import ClientProfile from "./components/ClientProfile";
import ProviderProfile from "./components/Providerprofile";

import {
  getValidSession,
  clearSession,
} from "./api";

import "./App.css";


function App() {

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);


  useEffect(() => {

    const { user: storedUser } = getValidSession();

    if(storedUser){
      setUser(storedUser);
    }

    setCheckingSession(false);

  }, []);



  const handleAuthDone = ({user}) => {

    if(user){
      setUser(user);
    }

  };



  const handleLogout = () => {

    clearSession();
    setUser(null);

  };



  if(checkingSession){
    return null;
  }



  if(!user){

    return (
      <Register
        onDone={handleAuthDone}
      />
    );

  }



  return (

    <Routes>


      {
        user.role === "CLIENT" && (

          <>
            <Route
              path="/client"
              element={
                <ClientDashboard
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />


            <Route
              path="/client/profile"
              element={
                <ClientProfile
                  user={user}
                />
              }
            />


            <Route
              path="*"
              element={
                <Navigate to="/client"/>
              }
            />

          </>

        )
      }



      {
        user.role === "PROVIDER" && (

          <>

            <Route
              path="/provider"
              element={
                <ProviderDashboard
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />


            <Route
              path="/provider/profile"
              element={
                <ProviderProfile
                  user={user}
                />
              }
            />


            <Route
              path="*"
              element={
                <Navigate to="/provider"/>
              }
            />


          </>

        )
      }



    </Routes>

  );

}


export default App;