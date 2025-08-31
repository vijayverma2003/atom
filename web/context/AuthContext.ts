import { UserWithoutSensitiveInfo } from "@/app/types/users";
import { createContext } from "react";

const AuthContext = createContext<UserWithoutSensitiveInfo | null>(null);

export default AuthContext;
