// This is a simple example Widget to get you started with Übersicht.
// For the full documentation please visit:
// https://github.com/felixhageloh/uebersicht

// You can modify this widget as you see fit, or simply delete this file to
// remove it.

// this is the shell command that gets executed every time this widget refreshes
export const command = "whoami";

// the refresh frequency in milliseconds
export const refreshFrequency = 1000000;

// the CSS style for this widget, written using Emotion
// https://emotion.sh/
export const className = `
position: absolute;
bottom: 0;

left: 0;
//background trasparent
background: rgba(0, 0, 0, 0.5);

box-sizing: border-box;
margin: auto;

//background blueish
background: rgba(0, 11, 19, 0.5);


-webkit-backdrop-filter: blur(20px);
color: #fff;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

border: 2px solid #fff;
border-radius: 1px;
text-align: justify;
line-height: 1.5;

h1 {
  font-size: 20px;
  margin: 16px 0 8px;
}

#chatlog {
  height: 300px;
  max-height: 500px;
  overflow-y: scroll;
}

#message {
  
  height: 20px; 
  
  
  flex: 1;
}
.message-part {
  margin: 8px ;
}




button {
  background-color: #4CAF50; /* Green */  
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  //rounded corners
  border-radius: 8px;
  //smaller
  width: 100px;
  height: 50px;
  
}
.active {
  display: block;
}
.inactive {
  display: none;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`


const API_KEY = "INSERT_YOUR_KEY_HERE";
var Hide = () => {
  console.log("hide");
  //hide main
  var x = document.getElementById("Main");
  //change attribute class to inactive
  x.className = "inactive";
  //change button text to show
  var y = document.getElementById("ShowButton");
  y.className = "active";




};
var Show = () => {
  console.log("show");
  var x = document.getElementById("Main");
  //change attribute class to inactive
  x.className = "active";
  //change button text to show
  var y = document.getElementById("ShowButton");
  y.className = "inactive";

}
var sendMessage = async () => {

  //disable button
  var sendbutton = document.getElementById("sendbutton");
  sendbutton.disabled = true;
  //set button disabled
  sendbutton.className = "disabled";

  const messageInput = document.getElementById("message");
  const chatLog = document.getElementById("chatlog");
  const message = messageInput.value;



  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    }),
  }).then((response) => {
    sendbutton.disabled = false;
    sendbutton.className = "";
    return response;
  })
    ;

  const data = await response.json();
  //data obj to string

  //get choices[0].content from object using JSON
  const text = data.choices[0].message.content;
  console.log(text);
  console.log(typeof text);
  const answer = data.choices[0].message.content;
  const chatEntry = document.createElement("div");
  chatEntry.className = "message-part";
  chatEntry.innerHTML = `<p><strong style=\" color:red\">You:</strong> ${message}</p><p><strong style=\" color:green\">ChatGPT:</strong> ${answer.replace(/\n/g, "<br>")}</p>`;
  chatLog.appendChild(chatEntry);
  messageInput.value = "";
  var msg = new SpeechSynthesisUtterance();
  msg.text = answer;

  var voices = window.speechSynthesis.getVoices();
  console.log(voices);
  //get voice with name Daniel

  msg.voice = voices.filter((voice) => voice.name === "Daniel")[0];
  console.log(msg.voice);
  window.speechSynthesis.speak(msg);

  //scroll to bottom
  chatLog.scrollTop = chatLog.scrollHeight;


};



// render gets called after the shell command has executed. The command's output
// is passed in as a string.
export const render = ({ output, error }) => {

  console.log(error);
  return error ? (
    <div>Something went wrong: <strong>{String(error)}</strong></div>

  ) : (

    <div>
      <div >
        <img height={40} width={40} id="ShowButton" onClick={Show} className="inactive" src="./ChatGPT.svg" style={{
          backgroundColor: "white",
          color: "red",
          borderRadius: 25,
        }} />

      </div>
      <div id="Main" style={{
        width: "500px"
      }}>
        <h1>ChatGPT Snap</h1>
        <div id="chatlog" style={{ height: 300, maxHeight: 500, overflowY: "scroll" }}>


        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          fontFamily: "Arial",
          fontSize: 20,
          marginTop: 10,
          alignItems: "center",

        }}>
          <img height={40} width={40} onClick={Hide} src="./ChatGPT.svg" style={{
            backgroundColor: "white",
            borderRadius: 25,
          }} />
          <input type="text" id="message" />
          <button id="sendbutton" onClick={sendMessage}>Send</button>
        </div>

      </div>

    </div>

  );
}

