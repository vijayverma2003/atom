import { UserWithoutSensitiveInfo } from "@/types/users";
import { createContext } from "react";

const AuthContext = createContext<UserWithoutSensitiveInfo | null>(null);

export default AuthContext;
