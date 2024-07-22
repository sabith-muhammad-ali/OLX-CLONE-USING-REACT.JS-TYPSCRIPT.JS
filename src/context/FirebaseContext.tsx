import React, { createContext, useState, ReactNode } from "react";
import { Auth, User } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { Storage } from "firebase/storage";
import { auth, db, storage } from "../firebase/config";

interface FirebaseContextType {
  auth: Auth;
  db: Firestore;
  storage: Storage;
}

export const FirebaseContext = createContext<FirebaseContextType | null>(null);

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface ContextProps {
  children: ReactNode;
}

const Context: React.FC<ContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <FirebaseContext.Provider value={{ auth, db, storage }}>
        {children}
      </FirebaseContext.Provider>
    </AuthContext.Provider>
  );
};

export default Context;
