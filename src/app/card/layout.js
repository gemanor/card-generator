"use client";

import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";

/* Pick a theme of your choice */
import original from "react95/dist/themes/original";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
`;

export default function WizardLayout({ children }) {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>{children}</ThemeProvider>
    </>
  );
}
