import { PropsWithChildren } from "react";
import FilesContextProvider from "../_components/FilesContextProvider";
import Navbar from "./_components/Navbar";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <FilesContextProvider>
        <Navbar />
        {children}
      </FilesContextProvider>
    </main>
  );
};

export default layout;
