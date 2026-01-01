import { useState } from 'react'

function App() {
  const [txt, setTxt] = useState("Enter text");
/** 
 * ONLY GETS TEXT
  const getText = async () => {
    const response = await fetch("http://localhost:8000/HillCipher");

    if(!response.ok){
      throw new Error("No server reply")
    }

    // Get text from json
    const data = await response.json();
    setTxt(data);
  }

  * ONLY SENDS TEXT
  const sendText = async () => fetch("http://localhost:8000/HillCipher",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({content: txt})
  });
*/

  const click = async () => {
    /**
     * Sends text then gets text simultaneously, does not work
    sendText()
    getText()
    alert(txt)
    */
   // Send text
    const res = await fetch("http://localhost:8000/HillCipher/encrypt", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: txt})
    });

    if(!res.ok){
      const errText = await res.text();
      console.log("STATUS:", res.status);
      console.log("ERROR BODY:", errText);
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
    <div className = "App">
      <input onChange = {change}
      value = {txt}/>
      <button onClick = {click}>Enter</button>
    </div>
  )
}

export default App