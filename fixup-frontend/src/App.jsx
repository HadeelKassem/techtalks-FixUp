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
import ChatPage from "./pages/ChatPage";
import LiveLocationPage from "./pages/LiveLocationPage";
import ProviderProfile from "./components/Providerprofile";
import PublicProviderProfile from "./components/PublicProviderProfile";
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
  path="/client/chat"
  element={
    <ChatPage
      role="CLIENT"
    />
  }
/>

<Route
  path="/client/live-location"
  element={
    <LiveLocationPage
      role="CLIENT"
    />
  }
/>

<Route
  path="/providers/:id"
  element={<PublicProviderProfile />}
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
  path="/provider/chat"
  element={
    <ChatPage
      role="PROVIDER"
    />
  }
/>

<Route
  path="/provider/live-location"
  element={
    <LiveLocationPage
      role="PROVIDER"
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