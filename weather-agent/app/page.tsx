'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Weather Agent
        </h1>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent:
                message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor:
                  message.role === 'user' ? '#f0f0f0' : 'transparent',
              }}
            >
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <div key={index}>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p style={{ margin: '0 0 8px 0' }}>{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: '4px' }}>{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ fontWeight: '600' }}>{children}</strong>
                        ),
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        ))}
        {status === 'streaming' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'pulse 1.4s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        style={{
          padding: '16px',
          borderTop: '1px solid #e5e5e5',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Send a message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: status !== 'ready' ? '#e5e5e5' : '#000000',
            color: '#ffffff',
            cursor: status !== 'ready' ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ↑
        </button>
      </form>
    </div>
  );
}