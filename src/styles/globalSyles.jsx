import { createGlobalStyle } from "styled-components";
import theme from "../themes/theme";

const GlobalStyle = createGlobalStyle`
   body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${theme.colors.primary};
   }
`;

export default GlobalStyle;
