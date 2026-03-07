import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
    stepCountIs,
    tool,
} from 'ai';
import { z } from 'zod';

export const weatherAgent = new Agent({
    model: 'openai/gpt-5',
    instructions: 'You are a helpful weather assistant. Use the getWeather tool to fetch current weather information for cities.',
    tools: {
        getWeather: tool({
            description: 'Get the current weather for a city',
            inputSchema: z.object({
                city: z.string().describe('The city name to get weather for')
            }),
            execute: async ({ city }) => {
                try {
                    const response = await fetch(
                        `${process.env.WEATHER_API_URL}/api/weather/${encodeURIComponent(city)}`
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch weather: ${response.statusText}`);
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    return {
                        error: `Unable to fetch weather data for ${city}. Make sure the weather API is running on port 3001.`,
                    };
                }
            }
        }),
    },
    stopWhen: stepCountIs(10),
});

export type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;