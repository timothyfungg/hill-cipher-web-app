from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
import HillCipher

app = FastAPI()
cipher = HillCipher

class Key(BaseModel):
    id : int
    content : list[list[int]]

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

@app.get("/HillCipher")
async def encrypt(text : str):
    return HillCipher.pairsToString(cipher.encrypt(text))

@app.get("/HillCipher")
async def decrypt(text : str):
    return HillCipher.pairsToString(cipher.decrypt(text))