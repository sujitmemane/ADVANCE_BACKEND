import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const eventSource = new EventSource("http://localhost:9000/events");
  eventSource.onmessage = (event) => {
    console.log(event.data);
  };

  eventSource.onerror = (event) => {
    console.log(error);
    eventSource.close();
  };

  // const pollMessages = async () => {
  //   try {
  //     const lastMessageId =
  //       messages.length === 0 ? 0 : messages[messages.length - 1].id;

  //     const res = await fetch(
  //       `http://localhost:9000/messages?lastMessageId=${lastMessageId}`
  //     );

  //     const data = await res.json();
  //     console.log(data);

  //     setMessages([...messages, ...data?.data]);

  //     setTimeout(pollMessages, 1000);
  //   } catch (err) {
  //     console.error("Polling error:", err.message);
  //     setTimeout(pollMessages, 5000);
  //   }
  // };

  // useEffect(() => {
  //   pollMessages();
  // }, []);

  console.log(messages);

  const sendMessage = async () => {
    console.log(newMessage, "hit");
    if (!newMessage.trim()) return;

    const response = await fetch("http://localhost:9000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage }),
    });
    console.log(response);

    setNewMessage("");
  };

  return (
    <>
      <h1>Backend Communication Pattern</h1>
      <div className="p-4">
        <div className="mb-4">
          {messages?.map((m, index) => (
            <p key={index}>{m?.message}</p>
          ))}
        </div>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </>
  );
}

export default App;
