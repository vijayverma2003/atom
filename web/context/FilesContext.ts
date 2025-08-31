import { createContext } from "react";

interface FilesContextType {
  files: File[];
  onFileDataChange: (files: File[]) => void;
}

const FilesContext = createContext<FilesContextType>({
  files: [],
  onFileDataChange: () => {},
});

export default FilesContext;
