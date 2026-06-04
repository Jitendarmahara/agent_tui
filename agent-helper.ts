import { GoogleGenAI, Type } from "@google/genai";
import type { Tool, Content } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

function get_weather_forecast(args: Record<string, unknown>) {
  const location = args.location as string;
  console.log(`Tool Call: get_weather_forecast(location=${location})`);
  console.log("Tool Response: {'temperature': 25, 'unit': 'celsius'}");
  return { temperature: 25, unit: "celsius" };
}

function set_thermostat_temperature(args: Record<string, unknown>) {
  const temperature = args.temperature as number;
  console.log(
    `Tool Call: set_thermostat_temperature(temperature=${temperature})`,
  );
  console.log("Tool Response: {'status': 'success'}");
  return { status: "success" };
}

const toolFunctions: Record<
  string,
  (args: Record<string, unknown>) => unknown
> = {
  get_weather_forecast,
  set_thermostat_temperature,
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "get_weather_forecast",
        description:
          "Gets the current weather temperature for a given location.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
          },
          required: ["location"],
        },
      },
      {
        name: "set_thermostat_temperature",
        description: "Sets the thermostat to a desired temperature.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            temperature: { type: Type.NUMBER },
          },
          required: ["temperature"],
        },
      },
    ],
  },
];

export async function callagent(prompt: string) {
  let contents: Content[] = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { tools },
    });

    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0]!;

      const { name, args } = functionCall;

      if (!name || !toolFunctions[name]) {
        throw new Error(`Unknown function call: ${name}`);
      }

      const toolResponse = toolFunctions[name](args ?? {});

      const functionResponsePart = {
        name: functionCall.name,
        response: { result: toolResponse } as Record<string, unknown>,
        id: functionCall.id,
      };

      contents.push({
        role: "model",
        parts: [
          {
            functionCall: functionCall,
          },
        ],
      });
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      console.log(result.text);
      break;
    }
  }
}
