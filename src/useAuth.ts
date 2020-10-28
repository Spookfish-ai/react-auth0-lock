import AuthContext from "./context";
import { State } from "./AuthProvider/AuthProvider";
import { useContext } from "react";

const useAuth = () => useContext<State>(AuthContext);

export default useAuth;
