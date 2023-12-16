import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    IconButton,
    VStack,
    useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const DarkModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box textAlign="center" fontSize="2xl">
            <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                isRound={true}
            />
        </Box>
    );
};

const Menu = () => (
    <VStack spacing={4} align="stretch">
        <DarkModeToggle />
        <Link to="/" style={{ width: "100%" }}>
            <Button variant="ghost" width="100%">
                Home
            </Button>
        </Link>
        <Link to="/calendar" style={{ width: "100%" }}>
            <Button variant="ghost" width="100%">
                Calendar
            </Button>
        </Link>
    </VStack>
);

export default Menu;
