import { createContext, ReactNode, useContext, useState } from "react";
import LoadingBar from "react-top-loading-bar";

interface LoadingBarContextType {
  progress: number;
  setProgress: (value: number) => void;
  startLoading: () => void;
  completeLoading: () => void;
}

const LoadingBarContext = createContext<LoadingBarContextType | undefined>(
  undefined,
);

export const useLoadingBar = () => {
  const context = useContext(LoadingBarContext);
  if (context === undefined) {
    throw new Error("useLoadingBar must be used within a LoadingBarProvider");
  }
  return context;
};

export const LoadingBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState(0);

  const startLoading = () => setProgress(30);
  const completeLoading = () => setProgress(100);

  return (
    <LoadingBarContext.Provider
      value={{ progress, setProgress, startLoading, completeLoading }}
    >
      <LoadingBar
        color="#f19319"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {children}
    </LoadingBarContext.Provider>
  );
};
