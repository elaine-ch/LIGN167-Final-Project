import OpenAI from "openai";

const ORGANIZATION_KEY = "org-085MHx6M9JwSzB0auUa4uZoA";
const API_KEY = "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";
const ASSISTANT_ID = "asst_D9gROyL0uLhCrzhruN3SkTe2";

const openai = new OpenAI({
    organization: ORGANIZATION_KEY,
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
});

let thread;

async function startThread() {
    thread = (await openai.beta.threads.create()).id;
}

// params should have format: {difficulty: "easy"|"medium"|"hard", phonetics: Int, phonology: Int, ...}
async function generateQuiz(params) {
    const difficulty = params.difficulty;
    try {
        await openai.beta.threads.messages.create(thread, {
            role: "user",
            content: `Generate a quiz with ${params.difficulty} difficulty containing ${Object.entries(
                params
            ).filter(([key]) => key != difficulty)
                .map(([key, value]) => `${value} ${key} questions, `)
                .join("")}.`,
        });
        const run = await openai.beta.threads.runs.create(thread, {
            assistant_id: ASSISTANT_ID,
        });
        let runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);
        while (runStatus.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);
        }
        const messages = await openai.beta.threads.messages.list(thread);
        return messages.data[0].content;
    } catch (err) {
        console.log(err);
    }
}

// params should have format: [{difficulty: "easy"|"medium"|"hard", relevance: "relevant"|"partially relevant"|"irrelevant"}, ...]
async function updateThread(params) {
    try {
        await openai.beta.threads.messages.create(thread, {
            role: "user",
            // content: `Update quiz difficulties based on this feedback: ${params
            //     .map(
            //         (param, i) =>
            //             `Question ${i + 1} was ${param.difficulty} and ${
            //                 param.relevance
            //             }. `
            //     )
            //     .join("")}`,
            content: `Update future quiz difficulties based on this feedback: This quiz was ${params.difficulty} and ${params.relevance} to the topics.`,
        });
        const run = await openai.beta.threads.runs.create(thread, {
            assistant_id: ASSISTANT_ID,
        });
        let runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);
        while (runStatus.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);
        }
    } catch (err) {
        console.log(err);
    }
}

export { generateQuiz, startThread, updateThread };
