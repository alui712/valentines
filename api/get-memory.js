const memories = [
  "I love how you laugh at my bad jokes.",
  "Remember that time we got lost in the city?",
  "You are the best Valorant duo I could ask for.",
  "My favorite memory is our first date.",
  "You make every day better just by being in it.",
];

export default function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const message = memories[Math.floor(Math.random() * memories.length)];
  response.status(200).json({ message });
}
