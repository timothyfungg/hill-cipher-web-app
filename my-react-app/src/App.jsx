import { useState } from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text (No spaces)");
  const [key, setKey] = useState("Enter key");

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
  const click = (path, vari, setVari) => async () => {
    /**
     * Sends text then gets text simultaneously, does not work
    sendText()
    getText()
    alert(txt)
    */
   // Send text
   try{
    const res = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: vari})
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
      setVari(data.content); // Get the text in 'content'
    }
   }catch{
      setVari("Invalid input")
   }
  }

  const change = (setVari) => (event) => {
    setVari(event.target.value);
  }

  return (
    <div>
      <TextBox
        value = {txt}
        onChange = {change(setTxt)}
      />
      <Button
        label = "Encrypt"
        onClick = {click("http://localhost:8000/HillCipher/encrypt", txt, setTxt)}
      />
      <Button
        label = "Decrypt"
        onClick = {click("http://localhost:8000/HillCipher/decrypt", txt, setTxt)}
      />
      <TextBox
        value = {key}
        onChange = {change(setKey)}
      />
      <Button
        label = "Enter"
        onClick = {click("http://localhost:8000/HillCipher/createKey", key, setKey)}
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