import { PropsWithChildren } from "react";
import Navbar from "./_components/Navbar";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default layout;
