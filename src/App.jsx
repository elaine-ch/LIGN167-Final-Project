import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Calendar from "./components/Calendar";
import Menu from "./components/Menu";
import OptionsSelector from "./components/OptionsSelector";
import Quiz from "./components/Quiz";
import Cookies from "js-cookie";

function App() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue("gray.100", "gray.800");

    const [quizzes, setQuizzes] = useState(() => {
        const savedQuizzes = Cookies.get('quizzes');
        if(savedQuizzes){
            return JSON.parse(savedQuizzes);
        } else{
            return [];
        }
    });

    useEffect(() => {
        Cookies.set('quizzes', JSON.stringify(quizzes));
    }, [quizzes]);

    return (
        <Box w="100vw" h="100vh" bg={bgColor} position="relative" paddingTop="20px">
            <IconButton
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="outline"
                aria-label="Open Menu"
                position="absolute"
                top={4}
                left={4}
                zIndex="overlay"
            />

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                    <DrawerBody>
                        <Menu />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            {/* {currentPage === "home" ? (
                <OptionsSelector setOptions={setOptions} />
            ) : (
                <CalendarPage options={options} />
            )} */}
            {/* {currentPage === "home" ? (
                <OptionsSelector setQuizzes={setQuizzes} setCurrentPage={setCurrentPage} />
            ) : (
                <Calendar quizzes={quizzes} />
            )} */}
            <Routes>
                <Route
                    path="/"
                    element={<OptionsSelector setQuizzes={setQuizzes}/>}
                />
                <Route
                    path="/calendar"
                    element={<Calendar quizzes={quizzes} />}
                />
                <Route path="/quiz/:id" element={<Quiz quizzes={quizzes}/>} />
            </Routes>
        </Box>
    );
}

export default App;
