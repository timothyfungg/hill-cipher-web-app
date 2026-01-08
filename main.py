from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from HillCipher import HillCipher

app = FastAPI()
cipher = HillCipher([[1, 0], [0, 1]])

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
        # Key class variables must be referenced like a dictionary (actual list is behind content)
        cipher.setKey(key.content)
    except Exception as e:
        #return {"content": "Invalid key"}
        raise HTTPException(status_code = 422, detail = "Invalid Key")
    return None

@app.post("/HillCipher/encrypt")
def encrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.encrypt(text.content))}

@app.post("/HillCipher/decrypt")
def decrypt(text : Text):
    return {"content": HillCipher.pairsToString(cipher.decrypt(text.content))}

@app.get("/HillCipher/getKey")
def getKey():
    return {"content": cipher.__str__()}

if __name__ == "__main__":
    uvicorn.run(app, host = "0.0.0.0", port = 8000)