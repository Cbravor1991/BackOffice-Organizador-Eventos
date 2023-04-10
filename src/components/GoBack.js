import * as React from 'react';
import { useNavigate } from "react-router-dom";

export default function GoBack() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)} 
      title="Volver" 
      style={{ 
        backgroundColor: '#1286f7',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '8px 16px',
        cursor: 'pointer',
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)'
      }}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.95313 1.04688L3.90625 8L8.95313 14.9531L7.42188 16.4844L0.9375 10L0.9375 5L7.42188 0.515625L8.95313 1.04688Z" fill="white"/>
      </svg>
      <span style={{ marginLeft: '8px', fontSize: '14px' }}>Volver</span>
    </button>
  );
}
