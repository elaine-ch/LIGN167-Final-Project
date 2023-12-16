import { Box, Button } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import * as gpt from "../utils/gpt";
import Loading from "./Loading";
import "./style.css";

const Quiz = ({ quizzes }) => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState("");
    const [showAnswerKey, setShowAnswerKey] = useState(false);

    const [feedback, setFeedback] = useState({ difficulty: "", relevance: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (typeof quizzes[id] === "undefined") {
            setQuiz("Quiz not found!");
            return;
        }
        const params = quizzes[id];
        if (params.quiz) {
            setQuiz(params.quiz);
            return;
        }
        (async () => {
            await gpt.startThread();
            const generatedQuiz = await gpt.generateQuiz(params);
            setQuiz(generatedQuiz[0].text.value);
            quizzes[id].quiz = generatedQuiz[0].text.value;
        })();
    }, [quizzes, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = {
            difficulty: feedback.difficulty,
            relevance: feedback.relevance,
        };
        setIsSubmitted(true);
        await gpt.updateThread(params);
    };

    return quiz ? (
        <>
            <Box maxWidth="60%" margin="auto" marginTop="auto" marginBottom="auto" paddingTop="15px">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                    {quiz.split("Answer Key").length > 1
                        ? quiz.split("Answer Key")[0]
                        : quiz}
                </ReactMarkdown>
                <div id="answerkeybutton" class="button">
                    <Button onClick={() => setShowAnswerKey(!showAnswerKey)} maxWidth="50%" margin="auto">
                        {showAnswerKey ? "Hide Answer Key" : "Show Answer Key"}
                    </Button>
                </div>
                {showAnswerKey && (
                    <div id="answers">
                    <ReactMarkdown
                        components={ChakraUIRenderer()}
                        skipHtml
                        id="answerKey"
                    >
                        {quiz.split("Answer Key").length > 1
                            ? quiz.split("Answer Key")[1]
                            : quiz}
                    </ReactMarkdown>
                    </div>
                )}
                <div id="feedbackbox">
                <div id="feedbackcontent">
                <h1 id="feedbackheader">⋆⋆⋆⋆⋆ Feedback ⋆⋆⋆⋆⋆</h1>
                <p>Help us customize the quiz to you!</p>
                {isSubmitted ? (
                    <p class="questionaire">  Thank you for your feedback! </p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div class="questionaire">
                            <label>How difficult was the quiz?</label>
                            <select
                                value={feedback.difficulty}
                                onChange={(e) =>
                                    setFeedback({
                                        ...feedback,
                                        difficulty: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <label>How relevant was the quiz?</label>
                            <select
                                value={feedback.relevance}
                                onChange={(e) =>
                                    setFeedback({
                                        ...feedback,
                                        relevance: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Relevance</option>
                                <option value="relevant">Relevant</option>
                                <option value="partially relevant">
                                    Partially Relevant
                                </option>
                                <option value="irrelevant">Irrelevant</option>
                            </select>
                        </div>
                        <div class="button">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                )}
                </div>
                </div>
            </Box>
        </>
    ) : (
        <Loading />
    );
};

Quiz.propTypes = {
    quizzes: PropTypes.object,
};

export default Quiz;
