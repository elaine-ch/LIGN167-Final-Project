import { Box, SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Calendar = ({ quizzes }) => {
    return quizzes.length > 0 ? (
        <SimpleGrid columns={3} spacing={5}>
            {" "}
            {}
            {quizzes.map((quiz, i) => {
                const description = `${
                    quiz.difficulty
                } quiz with ${Object.entries(quiz)
                    .filter(([key, value]) => key !== "difficulty" && key !== "quiz" && value !== 0)
                    .map(([key, value]) => `${value} ${key} questions`)
                    .join(", ")}`;

                return (
                    <Link to={`/quiz/${i}`} key={i}>
                        {" "}
                        {}
                        <Box
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ bg: "blue.100", cursor: "pointer" }}
                        >
                            <h3>Day {i + 1}</h3>
                            <p>{description}</p>
                        </Box>
                    </Link>
                );
            })}
        </SimpleGrid>
    ) : (
        <p>Go to the homepage to select your options!</p>
    );
};

Calendar.propTypes = {
    quizzes: PropTypes.array.isRequired,
};

export default Calendar;
