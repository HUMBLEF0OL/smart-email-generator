import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const POST = async (request: Request) => {
    try{
        const body = await request.json();
        const {context,tone} = body;

        // prompt template
        // const prompt = `You are a helpful assistant that generates a ${tone} response to the following context: ${context}`;
        const prompt = `Generate a professional email with the following context in a ${tone} tone. Only return the email without any introductions or explanations.\n\nContext: ${context}`;


        // using modern responses api instead of chat completion
        const response = await client.responses.create({
            model:'gpt-4.1-mini',
            temperature: 0.7,
            input:prompt,
            max_output_tokens: 300,

        })
        const result = response.output_text;
        return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }catch(err){
        console.log(err);
        return new Response('Error', { status: 500 });
    }
}