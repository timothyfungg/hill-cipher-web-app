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
    // Minimum height as screen height, set bg colour, enable flex, center content (vert. + hori.) and add horizontal padding
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Card container of md (448px) width with max possible fill, rounded corners, shadow, inner padding and child element spacing */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* Set font size, weight, centering, colour */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Hill 2x2 Cipher
        </h1>

        <Text
          label={keyStr}
        />

        <TextBox
          value={txt}
          onChange={change}
          placeholder="Enter text"
        />

        {/* Enable flex (buttons have flex-1) and spacing between children */}
        <div className="flex space-x-4">
          <Button
            label="Encrypt"
            onClick={click("http://localhost:8000/HillCipher/encrypt")}
            variant="primary"
          />
          <Button
            label="Decrypt"
            onClick={click("http://localhost:8000/HillCipher/decrypt")}
            variant="secondary"
          />
        </div>

        {/* Vertical spacing between children (text and group of text boxes) */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 text-center">
            Key Matrix
          </p>
      
          {/* Arrange children into a single column with spacing */}
          <div className="grid grid-cols gap-2">
            <TextBox
              value={key[0][0]}
              onChange={changeCell(0, 0)}
            />
            <TextBox
              value={key[0][1]}
              onChange={changeCell(0, 1)}
            />
            <TextBox
              value={key[1][0]}
              onChange={changeCell(1, 0)}
            />
            <TextBox
              value={key[1][1]}
              onChange={changeCell(1, 1)}
            />
          </div>
        </div>

        <Button
          label="Enter matrix"
          onClick={clickCell("http://localhost:8000/HillCipher/createKey")}
          variant="success"
        />
      </div>
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

function TextBox({value, onChange, placeholder}){
  return(
    // Text box with max possible fill, rounded corners, border, text padding, and blue ring transition when clicked
    <input
      className="
        w-full rounded-lg border border-gray-300 px-3 py-2
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition
      "
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

function Button({label, onClick, variant = "primary"}){
  // Different colour buttons
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 rounded-lg px-4 py-2 font-medium
        ${styles[variant]}
        transition active:scale-95
      `}
    >
      {label}
    </button>
  );
}

function Text({label}){
  return (
    // Center text on gray rounded background
    <div className="text-center text-gray-700 font-mono bg-gray-50 rounded-md py-2">
      {label}
    </div>
  );
}

export default App