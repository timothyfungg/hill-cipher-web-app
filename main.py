from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
from HillCipher import HillCipher

app = FastAPI()
cipher = HillCipher([[3, 5], [2, 7]])

origins = [
    "http://localhost:5173"
]

class Key(BaseModel):
    content : list[list[int]]

    @field_validator('content')
    @classmethod
    def checkDimensions(cls, content):
        if(len(content) == 2):
            for i in range(0, 2):
                if(len(content) != 2):
                    raise ValueError("Invalid matrix size (Must have 2 columns)")
        else:
            raise ValueError("Invalid matrix size (Must have 2 rows)")
        return content

class Text(BaseModel):
    content: str

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
    )

@app.post("/HillCipher/createKey")
def createKey(key : Key):
    try:
        cipher = HillCipher(key)
    except Exception as e:
        return {"content": "Invalid key"}
    return None

@app.post("/HillCipher/encrypt")
def encrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.encrypt(text.content))}

@app.post("/HillCipher/decrypt")
def decrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.decrypt(text.content))}

if __name__ == "__main__":
    uvicorn.run(app, host = "0.0.0.0", port = 8000)