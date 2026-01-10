import {useState} from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text (No spaces)");
  const [key, setKey] = useState([
    [1, 0],
    [0, 1]
  ]);
  const keyStr = `[[${key[0][0]}, ${key[0][1]}], [${key[1][0]}, ${key[1][1]}]]`; // Updates every re-render (eg. when setKey() used)

  // Higher order function to work with button
  const click = (path) => async () => {
    // Send text
    const res = await fetch(path, { // Promise to receive data
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: txt})
    });

    // Get/process text from promise
    const data = await res.json(); // Json in the form {content: text}
    setTxt(data.content); // Get the text in 'content'
  }

  // Get event (from being onChange function)
  const change = (event) => {
    setTxt(event.target.value); // sets the text as the value that triggered onChange
  }

  const changeCell = (row, col) => (event) => {
    const value = parseInt(event.target.value) || 0; // Set value as int if input is an int, otherwise leave at 0
    setKey(prev => setMatrixElement(prev, row, col, value)); // Set element at row col of key
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

// Copies previous matrix to ensure React knows that key changed (different reference) and sets the element at row col
function setMatrixElement(mat, row, col, value){
  // Deep copy to change reference
  const copy = mat.map(rowArr => [...rowArr]); // Loops through the inner arrays and replaces each with a copy
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