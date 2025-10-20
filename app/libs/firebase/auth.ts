import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { auth } from "./client";







const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;
    const user = result.user;

    return { user, accessToken };
  } catch (error: any) {
    console.error("Login failed:", error);
    return null;
  }
}


export function useAuthListener() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.uid);

                if (location.pathname === "/login") {
                    navigate("/admin");
                }
            } else {
                console.log("User is logged out");
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [location.pathname]);
}