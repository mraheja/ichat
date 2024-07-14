import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
YOU ARE A BOT WRITING CODE BASED ON AN INSTRUCTION.

YOUR CODE SHOULD BE OUTPUT IN PYTHON SURROUNDED BY TRIPLE BACKTICKS.

EXAMPLE:
Instruction: hello world
Answer:
\`\`\`
print("hello world")
\`\`\`
`;

const USER_PROMPT = (instruction: string) =>  `
HERE IS THE INSTRUCTION: ${instruction}
`;


const config = process.env.OPENAI_API_KEY ?{
  apiKey: process.env.OPENAI_API_KEY
} : {
  apiKey: process.env.TOGETHER_API_KEY,
  base_url: "https://api.together.xyz/v1"
}
const openai = new OpenAI();


export async function POST(req: Request, { params: _params }: { params: any }) {
  const json: any = await req.json();

  const model = process.env.OPENAI_API_KEY ? 'gpt-3.5-turbo' : "meta-llama/Llama-3-8b-chat-hf";

  const res = await openai.chat.completions.create({
    model,

    messages: [
      { 
        role: 'system', 
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: USER_PROMPT(json.instruction),
      },
    ],
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(res);

  return new StreamingTextResponse(stream);
}