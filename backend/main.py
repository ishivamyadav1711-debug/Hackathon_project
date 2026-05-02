from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

history = []

@app.get("/data")
def get_data():
    value = random.randint(50, 150)
    history.append(value)

    return {"value": value}


@app.get("/optimize")
def optimize():
    return {
        "message": "Shift usage to night hours → save ₹30"
    }
@app.get("/insight/{waste}")
def insight(waste: float):

    if waste > 20:
        tip = "⚠ High waste! Reduce heavy appliance usage."
    elif 20>=waste > 5:
        tip = "⚡ Moderate waste. Try shifting load to off-peak hours."
    elif 5>= waste > 0:
        tip = "🙂 Minor waste. Small optimizations possible."
    else:
        tip = "✅ Great! You're using energy efficiently."

    return {"tip": tip}