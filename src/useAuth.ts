import AuthContext from "./context";
import { AuthProviderState } from "./AuthProvider/AuthProvider";
import { useContext } from "react";

const useAuth = () => useContext<AuthProviderState>(AuthContext);

export default useAuth;
