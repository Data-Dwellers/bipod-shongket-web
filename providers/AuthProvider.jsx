"use client";

import auth from "@/auth/firebase.config";
import { getUsers, createUserDB } from "@/services/userService";

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

    const createUser = async (data) => {
        setLoading(true);
        try {
            // First create the user in Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            // Remove password from data before storing in DB
            const { password, ...dataWithoutPassword } = data;

            // Use Promise.all to handle both operations after Firebase auth
            await Promise.all([
                // Update user profile if needed
                updateProfile(userCredential.user, {
                    displayName: data.name || data.displayName,
                }),
                // Save user to database
                createUserDB({ ...dataWithoutPassword }).then((dbReply) => {
                    if (dbReply.success) {
                        console.log("User saved in DB");
                    } else {
                        console.log("Error saving user in DB");
                    }
                }),
            ]);

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
            setLoading(true);
            if (currentUser) {
                // Use Promise.all to handle both Firebase and DB operations concurrently
                Promise.all([
                    Promise.resolve(currentUser),
                    getUsers({ email: currentUser?.email }),
                ])
                    .then(([firebaseUser, dbData]) => {
                        console.log("Data from DB", dbData.data[0]);
                        if (dbData.data && dbData.data.length > 0) {
                            setUser(dbData.data[0]);
                        } else {
                            // Fallback to Firebase user if DB data isn't available
                            setUser(firebaseUser);
                        }
                    })
                    .catch((error) => {
                        console.error("Error processing user data:", error);
                        // Still set the Firebase user on error to maintain authentication state
                        setUser(currentUser);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setUser(null);
                setLoading(false);
            }
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
