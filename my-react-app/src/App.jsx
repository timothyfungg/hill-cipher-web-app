import { useState, useEffect } from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text (No spaces)");
  const [key, setKey] = useState([
    [0, 0],
    [0, 0]
  ]);
  const keyStr = `[${key[0][0]}, ${key[0][1]}]\n[${key[1][0]}, ${key[1][1]}]]`;

  // Higher order function to work with button
  const click = (path) => async () => {
    // Send text
    const res = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: txt})
    });

    if(res.status != 204){
      // Get text
      const data = await res.json(); // {content: text}
      setTxt(data.content); // Get the text in 'content'
    }
  }

  const change = (event) => {
    setTxt(event.target.value);
  }

  const changeCell = (row, col) => (event) => {
    const value = parseInt(event.target.value) || 0; // Set value as int if input is an int, otherwise leave at 0
    setKey(prev => setMatrixElement(prev, row, col, value));
  }

  const clickCell = (path) => async () =>{
    // Send key
    const res = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: key})
    });
    if(!res.ok){
      alert("Invalid key!") // tell user invalid key
    }
  }

  return (
    <div>
      <Text
        label = {keyStr}
      />
      <TextBox
        value = {txt}
        onChange = {change}
      />
      <Button
        label = "Encrypt"
        onClick = {click("http://localhost:8000/HillCipher/encrypt")}
      />
      <Button
        label = "Decrypt"
        onClick = {click("http://localhost:8000/HillCipher/decrypt")}
      />
      <TextBox
        value = {key[0][0]}
        onChange = {changeCell(0, 0)}
      />
      <TextBox
        value = {key[0][1]}
        onChange = {changeCell(0, 1)}
      />
      <TextBox
        value = {key[1][0]}
        onChange = {changeCell(1, 0)}
      />
      <TextBox
        value = {key[1][1]}
        onChange = {changeCell(1, 1)}
      />
      <Button
        label = "Enter matrix"
        onClick = {clickCell("http://localhost:8000/HillCipher/createKey")}
      />
    </div>
  )
}

function setMatrixElement(mat, row, col, value){
  const copy = mat.map(rowArr => [...rowArr]);
  copy[row][col] = value;
  return copy;
}

function TextBox({value, onChange}){
  return(
    <div className = "TextBox">
      <input onChange = {onChange}
      value = {value}/>
    </div>
  )
}

function Button({label, onClick}){
  return(
    <div className = "Button">
      <button onClick = {onClick}>{label}</button>
    </div>
  )
}

function Text({label}){
  return(
    <div>
      <h1>{label}</h1>
    </div>
  )
}

export default App