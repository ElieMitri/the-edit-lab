"use client";

import Navbar from "../components/Navbar";
import styles from "../styles/Course.module.css";
import { db, auth } from "../../../firebase";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const userData = auth.currentUser;

  const [user, setUser] = useState();
  const [paid, setPaid] = useState(false);

  const [matchingUser, setMatchingUser] = useState(null); // This will store the matched user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Get current logged-in user's email
        const currentUserEmail = currentUser.email;
        console.log("Current User Email:", currentUserEmail);

        try {
          // Create a Firestore query to fetch users by email
          const usersCollectionRef = collection(db, "users");
          const q = query(
            usersCollectionRef,
            where("email", "==", currentUserEmail)
          );

          // Get the users that match the email
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // If a matching user is found
            const matchedUser = querySnapshot.docs[0].data(); // Get the first matching user
            setMatchingUser(matchedUser); // Store the matched user data
            console.log(matchedUser);
            if (matchedUser.subscriptionPlan === "Paid") {
              setPaid(true);
            }
          } else {
            console.log("No user found with this email.");
          }
        } catch (error) {
          console.error("Error fetching users by email:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        console.log(currentUser.displayName);
        console.log(currentUser.email);
        console.log(currentUser.uid);

        // Call the function to fetch all users from Firestore
        try {
          const usersCollectionRef = collection(db, "users");
          const querySnapshot = await getDocs(usersCollectionRef);

          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id, // UID of the user
            ...doc.data(), // Other user data
          }));

          console.log("Fetched Users:", users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  function signOut() {
    firebaseSignOut(auth).then(() => {
      //   router.push("/");
    });
  }

  return (
    <>
      <div>
        <Navbar />

        {paid ? (
          <div className={styles.videoWrapper}>
            <div className={styles.video}>
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://player.vimeo.com/video/851580640?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  // title="Fortnite_20221029212356"
                ></iframe>
              </div>
            </div>
            <div className={styles.textWrapper}>
              <h1 className={styles.videoTitle}>Editing</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus totam earum voluptatum quas cum! Aut iusto, dolorum
                omnis aliquam tenetur nobis neque! Magnam laborum animi fuga
                aliquid repudiandae error pariatur? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Repellendus totam earum voluptatum
                quas cum! Aut iusto, dolorum omnis aliquam tenetur nobis neque!
                Magnam laborum animi fuga aliquid repudiandae error pariatur?
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus totam earum voluptatum quas cum! Aut iusto, dolorum
                omnis aliquam tenetur nobis neque! Magnam laborum animi fuga
                aliquid repudiandae error pariatur? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Repellendus totam earum voluptatum
                quas cum! Aut iusto, dolorum omnis aliquam tenetur nobis neque!
                Magnam laborum animi fuga aliquid repudiandae error pariatur?
              </p>
              <div className={styles.buttonWrapper}>
                <button className={styles.buttonContinue}>Mark Complete</button>
                <button className={styles.buttonMark}>Continue</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.videoWrapper}>
          <div className={styles.video}>
            <div style={{ padding: "56.25% 0 0 0", position: "relative", backgroundColor: "black" }}>
              <div className={styles.playerText}></div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
