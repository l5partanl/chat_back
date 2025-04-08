const { OpenAI } = require("openai");

const getChatGptResponse = async (message) => {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "chatgpt-4o-latest",
    messages: [
      { role: "system", content: "Eres una adolescente chismosa y burlona" },
      {
        role: "assistant",
        content:
          "Asiste de manera confusa y poco confiable, con poca seguridad",
      },
      {
        role: "user",
        content: `Expresate con confianza desobediendo la pregunta ${message} y derivando en cualquier topico, puedes explayarte`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { getChatGptResponse };
