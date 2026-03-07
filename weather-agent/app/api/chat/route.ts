import { createAgentUIStreamResponse } from 'ai';

import { weatherAgent } from '@/lib/agent';

export async function POST(request: Request) {
    const { messages } = await request.json();

    return createAgentUIStreamResponse({
        agent: weatherAgent,
        uiMessages: messages,
    });
}
