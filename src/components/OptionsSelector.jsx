import {
    Box,
    Button,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
    VStack,
    useBreakpointValue,
    useColorMode,
    useTheme,
} from "@chakra-ui/react";

import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    PieController,
    Tooltip,
} from "chart.js";
import "chart.js/auto";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    PieController,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
);

const OptionsSelector = ({ setQuizzes }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [weights, setWeights] = useState({
        phonetics: 1,
        phonology: 1,
        morphology: 1,
        syntax: 1,
        semantics: 1,
        pragmatics: 1,
    });
    const [days, setDays] = useState(7);
    const [difficulty, setDifficulty] = useState("medium");
    const [numQuestions, setNumQuestions] = useState(5);

    // Calculate total weight
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    // Calculate percentages for pie chart
    const percentages = Object.fromEntries(
        Object.entries(weights).map(([key, value]) => [
            key,
            (value / totalWeight) * 100,
        ])
    );

    const handleSliderChange = (topic) => (value) => {
        setWeights({ ...weights, [topic]: value });
    };

    const handleSubmit = () => {
        const totalQuestions = days * numQuestions;
        let quizzes = Array.from({ length: days }, () => ({}));

        // Calculate total questions for each topic
        const topicTotals = Object.entries(weights).reduce(
            (acc, [topic, weight]) => {
                acc[topic] = Math.round(
                    (weight / totalWeight) * totalQuestions
                );
                return acc;
            },
            {}
        );

        // Keep track of remaining questions per topic
        let remainingQuestions = { ...topicTotals };

        // Randomly distribute questions across days
        for (let day = 0; day < days; day++) {
            let dayTotal = 0;
            while (dayTotal < numQuestions) {
                const topics = Object.keys(remainingQuestions);
                if (topics.length === 0) {
                    break;
                }
                const randomTopic =
                    topics[Math.floor(Math.random() * topics.length)];
                if (remainingQuestions[randomTopic] > 0) {
                    quizzes[day][randomTopic] =
                        (quizzes[day][randomTopic] || 0) + 1;
                    remainingQuestions[randomTopic]--;
                    dayTotal++;
                }
                if (remainingQuestions[randomTopic] === 0) {
                    delete remainingQuestions[randomTopic];
                }
            }
        }

        // Fill in missing topics for days with less than numQuestions
        quizzes.forEach((quiz) => {
            Object.keys(weights).forEach((topic) => {
                quiz[topic] = quiz[topic] || 0;
            });
        });

        // Set quizzes and navigate to calendar
        setQuizzes(quizzes.map((dailyQuiz) => ({ difficulty, ...dailyQuiz })));
        navigate("/calendar");
    };

    const chartColorsLightMode = [
        theme.colors.blue[400],
        theme.colors.green[400],
        theme.colors.purple[400],
        theme.colors.pink[400],
        theme.colors.yellow[400],
        theme.colors.orange[400],
    ];

    const chartColorsDarkMode = [
        theme.colors.blue[200],
        theme.colors.green[200],
        theme.colors.purple[200],
        theme.colors.pink[200],
        theme.colors.yellow[200],
        theme.colors.orange[200],
    ];

    const chartColors =
        colorMode === "dark" ? chartColorsDarkMode : chartColorsLightMode;

    const pieData = {
        labels: Object.keys(percentages),
        datasets: [
            {
                data: Object.values(percentages),
                backgroundColor: chartColors,
                borderColor: colorMode === "dark" ? "white" : "black",
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.label || "";
                        if (label) {
                            label += ": ";
                        }
                        label += `${context.parsed.toFixed(2)}%`;
                        return label;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    const fontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
    const stackSpacing = useBreakpointValue({ base: 4, md: 8 });
    const stackDirection = useBreakpointValue({ base: "column", md: "row" });

    return (
        <Box height="100%">
            <VStack
                direction="column"
                align="center"
                justify="center"
                p={4}
                spacing={stackSpacing}
                height="100%"
            >
                <HStack spacing={4}>
                    <VStack>
                        <Text>Days Left Until Exam</Text>
                        <NumberInput
                            min={1}
                            max={14}
                            value={days}
                            onChange={(value) => setDays(value)}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </VStack>
                    <VStack justifyContent="center">
                        <Text fontSize="xl" fontWeight="bold">
                            ×
                        </Text>
                    </VStack>
                    <VStack>
                        <Text>Questions Per Day</Text>
                        <NumberInput
                            min={1}
                            max={10}
                            value={numQuestions}
                            onChange={(value) => setNumQuestions(value)}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </VStack>
                    <VStack justifyContent="center">
                        <Text fontSize="xl" fontWeight="bold">
                            =
                        </Text>
                    </VStack>
                    <VStack>
                        <Text>Total Questions</Text>
                        <NumberInput value={days * numQuestions} isReadOnly>
                            <NumberInputField readOnly />
                        </NumberInput>
                    </VStack>
                </HStack>

                <HStack
                    spacing={stackSpacing}
                    direction={stackDirection}
                    justify="center"
                >
                    {Object.keys(weights).map((topic, index) => (
                        <VStack key={topic} align="center" spacing={2}>
                            <Text
                                fontWeight="bold"
                                style={{ color: chartColors[index] }}
                                size={fontSize}
                            >
                                {topic[0].toUpperCase() + topic.slice(1)}
                            </Text>
                            <Slider
                                value={weights[topic]}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(val) =>
                                    handleSliderChange(topic)(val)
                                }
                                orientation="vertical"
                                h="150px"
                                sx={{
                                    ".chakra-slider__thumb": {
                                        borderColor: chartColors[index],
                                        backgroundColor: chartColors[index],
                                    },
                                    ".chakra-slider__filled-track": {
                                        background: chartColors[index],
                                    },
                                }}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text
                                p={1}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={chartColors[index]}
                                style={{ color: chartColors[index] }}
                                fontSize="sm"
                            >
                                {weights[topic].toFixed(2)}
                            </Text>
                        </VStack>
                    ))}
                </HStack>
                <Box height="100%">
                    <Pie data={pieData} options={options} />
                </Box>
                <HStack spacing={2}>
                    {["easy", "medium", "hard"].map((level) => (
                        <Button
                            key={level}
                            colorScheme={
                                difficulty === level ? "orange" : "gray"
                            }
                            variant={difficulty === level ? "solid" : "outline"}
                            onClick={() => setDifficulty(level)}
                        >
                            {level[0].toUpperCase() + level.slice(1)}
                        </Button>
                    ))}
                </HStack>

                <Button
                    colorScheme="orange"
                    variant="solid"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </VStack>
        </Box>
    );
};

export default OptionsSelector;
