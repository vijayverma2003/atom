import { PropsWithChildren } from "react";
import FilesContextProvider from "../_components/FilesContextProvider";
import Navbar from "./_components/Navbar";
import DropArea from "./_components/DropArea";
import AuthProvider from "../_components/AuthProvider";

const layout = ({ children }: PropsWithChildren) => {
  console.log("Home");
  return (
    <main>
      <AuthProvider>
        <FilesContextProvider>
          <DropArea>
            <Navbar />
            {children}
          </DropArea>
        </FilesContextProvider>
      </AuthProvider>
    </main>
  );
};

export default layout;
