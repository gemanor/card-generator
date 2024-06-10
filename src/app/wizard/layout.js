"use client";

import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";

/* Pick a theme of your choice */
import original from "react95/dist/themes/original";

/* Original Windows95 font (optional) */
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

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
