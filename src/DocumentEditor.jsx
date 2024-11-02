import  { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { documentState } from './state/atoms';

const DocumentEditor = () => {
  const [documentContent, setDocumentContent] = useRecoilState(documentState);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [currentUserColor, setCurrentUserColor] = useState('#000000'); // Initialize the color state
  const ws = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:4000');

    ws.current.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'UPDATE_DOCUMENT') {
        setDocumentContent(data); // Update the document state
      }
    };

    return () => {
      ws.current.close();
    };
  }, [setDocumentContent]);

  const handleInputChange = (e) => {
    const inputText = e.target.value;

    // Update local state without sending the entire content to the server
    if (inputText.endsWith('\n')) {
      const newLine = {
        text: inputText.trim(), // Remove newline character
        user: username,
        color: currentUserColor,
      };

      const newDocumentContent = [...documentContent, newLine]; // Append new line
      setDocumentContent(newDocumentContent); // Update local state
      ws.current.send(JSON.stringify({ type: 'UPDATE_DOCUMENT', data: newDocumentContent })); // Send to server

      // Clear the textarea
      textAreaRef.current.value = ''; 
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const setUser = () => {
    if (username) {
      // Generate a random color for the user
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      setCurrentUserColor(randomColor); // Set the user's color
      setIsUsernameSet(true); // Mark username as set
    }
  };

  return (
    <div>
      <h1>Collaborative Document Editor</h1>
      {!isUsernameSet ? (
        <div>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
          />
          <button onClick={setUser}>Set Username</button>
        </div>
      ) : (
        <>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll', whiteSpace: 'pre-wrap' }}>
            {documentContent.map((line, index) => (
              <div key={index} style={{ color: line.color }}>
                {line.user}: {line.text}
              </div>
            ))}
          </div>
          <textarea
            ref={textAreaRef}
            onChange={handleInputChange}
            style={{ width: '100%', height: '50px' }}
            placeholder="Type your message and hit Enter..."
          />
        </>
      )}
    </div>
  );
};

export default DocumentEditor;
