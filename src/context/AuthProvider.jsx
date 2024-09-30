import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 

  

    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (error) {
        return {};
      }
    };

     let tkn = localStorage.getItem("SocToken");
     let token = parseJwt(tkn);

     const [userDetails, setUserDetails] = useState({
       name: token.name,
       userName: token.user,
       id: token._id,
       role: token.role,
     });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ isSocietyOpen , setIsSocietyOpen] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        isAuthenticated,
        setIsAuthenticated,
        setIsAdmin,
        isAdmin,
        isSocietyOpen,
        setIsSocietyOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
