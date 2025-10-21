import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { auth } from "./client";
import { toast } from "sonner";







const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

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

export async function logoutUser(): Promise<boolean> {
  try {
    await signOut(auth);
    toast("User signed out successfully");
    return true;
  } catch (error: any) {
    toast("Sign out failed:", error);
    return false;
  }
}


export function useAuthListener() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store user data in localStorage
        const userData = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        localStorage.setItem("currentUser", JSON.stringify(userData));

        console.log("User logged in:", user.uid);

        // Redirect if on login page
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else {
        // Clear user data from localStorage on logout
        localStorage.removeItem("currentUser");

        console.log("User is logged out");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);
}
