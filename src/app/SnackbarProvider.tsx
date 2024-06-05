"use client";

import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

interface ReactQueryProviderProps {
  children: ReactNode;
}


export default function SnackBarProvider({
  children,
}: ReactQueryProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={1500}
    >
      {children}
    </SnackbarProvider>
  );
}
