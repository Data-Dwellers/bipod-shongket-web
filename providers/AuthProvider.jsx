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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            if (userCredential.user.email) {
                const { password, ...dataWithoutPassword } = data;
                const dbReply = await createUserDB({ ...dataWithoutPassword });
                if (dbReply.success) {
                    console.log("User saved in DB");
                } else {
                    console.log("Error saving user in DB");
                }
            }

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
            if (currentUser) {
                setUser(currentUser);
                getUsers({ email: currentUser?.email })
                    .then((dbData) => {
                        console.log("Data from DB", dbData.data[0]);
                        // setUser(currentUser);
                        if (dbData.data && dbData.data.lenth > 0) {
                            setUser(dbData.data[0]);
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching user data from DB :",
                            error
                        );
                        console.log(error);
                    });
            } else {
                setUser(null);
                setLoading(false);
            }
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
