import { useState } from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text (No spaces)");
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

    if(!res.ok){
      const errText = await res.text();
      console.log("STATUS:", res.status);
      console.log("ERROR BODY:", errText); // Error text for debugging
      throw new Error("Server error");
    }

    // Get text
    const data = await res.json(); // {content: text}
    setTxt(data.content); // Get the text in 'content'
  }

  const change = event => {
    setTxt(event.target.value);
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
    </div>
  )
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