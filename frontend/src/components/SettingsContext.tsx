import React, {
  useState,
  createContext,
  useContext,
  Dispatch,
  useCallback,
} from "react";

type Settings = {
  menuCollapsed?: boolean;
  returnFromPage?: { from: string; to: string };
  setSession?: React.Dispatch<any>;
  isLoading: boolean;
};
type SettingsProviderProps = {
  initialData: Settings;
  children: React.ReactNode;
};

const SettingsContext = createContext<
  { settings: Settings; patchSettings: Dispatch<Partial<Settings>> } | undefined
>(undefined);

function SettingsProvider({
  initialData = { isLoading: false },
  children,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState(initialData);
  const patchSettings = useCallback(
    (updatedValues: Settings) =>
      setSettings((settings) => ({ ...settings, ...updatedValues })),
    []
  );

  const value = { settings, patchSettings };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export { SettingsProvider, useSettings };
