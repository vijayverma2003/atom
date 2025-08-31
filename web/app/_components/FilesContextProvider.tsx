"use client";

import FilesContext from "@/context/FilesContext";
import { PropsWithChildren, useState } from "react";

const FilesContextProvider = ({ children }: PropsWithChildren) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilesContext.Provider
      value={{ files, onFileDataChange: (files) => setFiles(files) }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export default FilesContextProvider;
