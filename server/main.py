from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

memories = [
    "I love how you laugh at my bad jokes.",
    "Remember that time we got lost in the city?",
    "You are the best Valorant duo I could ask for.",
    "My favorite memory is our first date.",
    "You make every day better just by being in it."
]

@app.get("/get-memory")
def get_memory():
    return {"message": random.choice(memories)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)