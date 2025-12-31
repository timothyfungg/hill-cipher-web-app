import React, {useState} from 'react';

function app(){
    const [key, newKey] = useState([]);
    const [text, newText] = useState("");

    const handleProcess = async () => {
        const res = await fetch("http://localhost:5173/", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body: JSON.stringify({text : input})
        })

    const data = await res.json();
    newText(data)
    };
}