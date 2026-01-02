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

class Text(BaseModel):
    content: str

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
    )

"""
@field_validator('content')
@classmethod
def checkDimensions(cls, content):
    if(len(content) == 2):
        for i in range(0, 2):
            if(len(content) != 2):
                raise Exception("Invalid matrix size (Must have 2 columns)")
    else:
        raise Exception("Invalid matrix size (Must have 2 rows)")
    return content

@app.post("/hillcipher")
async def createCipher(key : Key):
    cipher = HillCipher(key)
"""
@app.post("/HillCipher/encrypt")
def encrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.encrypt(text.content))}

@app.post("/HillCipher/decrypt")
def decrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.decrypt(text.content))}

if __name__ == "__main__":
    uvicorn.run(app, host = "0.0.0.0", port = 8000)