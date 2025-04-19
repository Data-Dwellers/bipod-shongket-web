"use client";

import auth from "@/auth/firebase.config";
// import useServer from "@/hooks/useServer";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

// const googleAuthProvider = new GoogleAuthProvider();

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            setLoading(false);
            return userCredential;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setLoading(false);
            return userCredential;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // const googleSignIn = async () => {
    //     setLoading(true);
    //     try {
    //         const userCredential = await signInWithPopup(
    //             auth,
    //             googleAuthProvider
    //         );
    //         setLoading(false);
    //         return userCredential;
    //     } catch (error) {
    //         setLoading(false);
    //         throw error;
    //     }
    // };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const updateUser = async (user, displayName) => {
        setLoading(true);
        try {
            await updateProfile(user, { displayName });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // const { getUserByEmail } = useServer();
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                createUser,
                signIn,
                logOut,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
