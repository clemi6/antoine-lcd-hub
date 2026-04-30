import { createContext, useContext, useState, type ReactNode } from "react";

type ThemeCtx = {
  isAfterparty: boolean;
  setIsAfterparty: (v: boolean) => void;
  accent: string;
  accentRgb: string;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isAfterparty, setIsAfterparty] = useState(false);
  const accent = isAfterparty ? "#ff0033" : "#00ffcc";
  const accentRgb = isAfterparty ? "255,0,51" : "0,255,204";
  return (
    <Ctx.Provider value={{ isAfterparty, setIsAfterparty, accent, accentRgb }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
