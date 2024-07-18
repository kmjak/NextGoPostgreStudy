"use client"
import React, { useState, useCallback } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string|null>(null);

  const handleDoubleClick = useCallback((content:string) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  return (
    <div className="app">
      <MessageList onDoubleClick={handleDoubleClick} />
      {isModalOpen && <Modal content={modalContent} onClose={closeModal} />}
    </div>
  );
}

function MessageList({ onDoubleClick }: { onDoubleClick: (content: string) => void }) {
  const messages = [
    { id: 1, text: "Hello" },
    { id: 2, text: "World" },
    // ... more messages
  ];

  return (
    <ul>
      {messages.map((message) => (
        <li 
          key={message.id} 
          onDoubleClick={() => onDoubleClick(message.text)}
        >
          {message.text}
        </li>
      ))}
    </ul>
  );
}

function Modal({ content, onClose }: { content: string | { text: string } | null, onClose: () => void }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Message Details</h2>
        <p>{content && typeof content === 'object' ? content.text : content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default App;