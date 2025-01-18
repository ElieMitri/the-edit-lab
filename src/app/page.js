"use client"

import Image from "next/image";
import Navbar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { db, auth } from "../../firebase";
import LandingPage from "./components/LandingPage";

export default function Home() {

  console.log("test test");
  

  useEffect(() => {
    // Set up the listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, log the display name
        console.log(user.displayName);
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div>
        <Navbar />
        <LandingPage />
      </div>
    </>
  );
}
