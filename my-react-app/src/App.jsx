import { useState, useEffect } from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text (No spaces)");
  const [key, setKey] = useState([
    [0, 0],
    [0, 0]
  ]);

/** 
 * DO NOT DO (ONLY GETS TEXT)
  const getText = async () => {
    const response = await fetch("http://localhost:8000/HillCipher");

    if(!response.ok){
      throw new Error("No server reply")
    }

    // Get text from json
    const data = await response.json();
    setTxt(data);
  }

  * DO NOT DO (ONLY SENDS TEXT)
  const sendText = async () => fetch("http://localhost:8000/HillCipher",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({content: txt})
  });
*/

  // Higher order function to work with button
  const click = (path) => async () => {
    /**
     * Sends text then gets text simultaneously, does not work
    sendText()
    getText()
    alert(txt)
    */
    // Send text
    const res = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: txt})
    });

    // Check for error
    if(!res.ok){
      const errText = await res.text();
      console.log("STATUS:", res.status);
      console.log("ERROR BODY:", errText); // Error text for debugging
      throw new Error("Server error");
    }

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
    const value = Number(event.target.value);
    setKey(prev => setMatrixElement(prev, row, col, value));
  }

  const clickCell = (path) => async () =>{
    // Send key
    const res = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: key})
    })
  }

  return (
    <div>
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

export default App