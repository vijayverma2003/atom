import { PropsWithChildren } from "react";
import FilesContextProvider from "../_components/FilesContextProvider";
import Navbar from "./_components/Navbar";
import DropArea from "./_components/DropArea";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <FilesContextProvider>
        <DropArea>
          <Navbar />
          {children}
        </DropArea>
      </FilesContextProvider>
    </main>
  );
};

export default layout;
