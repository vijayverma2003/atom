import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}

export default useAuth;
