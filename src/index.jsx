import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { generateTheme } from "catppuccin-chakra-ui-theme";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

const theme = generateTheme("latte", "mocha");

// const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <ChakraProvider theme={theme}>
//                 <ColorModeProvider
//                     options={{
//                         useSystemColorMode: true,
//                     }}
//                 >
//                     <App />
//                 </ColorModeProvider>
//             </ChakraProvider>,
//     },
//   ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <ColorModeProvider
                    options={{
                        useSystemColorMode: true,
                    }}
                >
                    <App />
                </ColorModeProvider>
            </ChakraProvider>
        </BrowserRouter>
        {/* <RouterProvider router={router} /> */}
    </React.StrictMode>
);
