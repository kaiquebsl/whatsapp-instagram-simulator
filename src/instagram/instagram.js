import './instagram.css';
import { renderControlsPanel } from '../shared/controls.js';

function generateWaveform() {
  const bars = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 14) + 4;
    bars.push(`<div class="ig-audio-bar" style="height:${h}px"></div>`);
  }
  return bars.join('');
}

function getAvatarHTML() {
  const state = window.chatState;
  if (state.contactPhoto) {
    return `<img src="${state.contactPhoto}" alt="${state.contactName}" />`;
  }
  return `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
}

export function renderInstagram(container) {
  const state = window.chatState;

  container.innerHTML = `
    <div class="phone-frame">
      <div class="ig-container">
        <!-- Status bar -->
        <div class="status-bar ig-status-bar">
          <span class="status-bar-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          <div class="status-bar-icons">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 22h20V2z M17 7L2 22h15z" opacity="0.3"/><path d="M2 22h20V2zm15-15v15H2z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
          </div>
        </div>
        
        <!-- Header -->
        <div class="ig-header" id="ig-header">
          <div class="ig-header-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div class="ig-header-avatar" id="ig-header-avatar">
            ${getAvatarHTML()}
          </div>
          <div class="ig-header-info">
            <div class="ig-header-name" id="ig-header-name">${state.contactName}</div>
          </div>
          <div class="ig-header-actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
        </div>
        
        <!-- Chat area -->
        <div class="ig-chat-area" id="ig-chat-area">
        </div>
        
        <!-- Emoji quick reactions -->
        <div class="ig-emoji-row">
          <span class="ig-emoji-item">❤️</span>
          <span class="ig-emoji-item">🔥</span>
          <span class="ig-emoji-item">👏</span>
          <span class="ig-emoji-item">😂</span>
          <span class="ig-emoji-item">😮</span>
          <span class="ig-emoji-item">😢</span>
        </div>
        
        <!-- Input bar -->
        <div class="ig-input-bar">
          <div class="ig-input-camera">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div class="ig-input-container">
            <div class="ig-input-text">Mensagem...</div>
            <div class="ig-input-actions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderInstagramMessages();
  renderControlsPanel('instagram');
}

export function updateInstagramHeader() {
  const state = window.chatState;
  const nameEl = document.getElementById('ig-header-name');
  const avatarEl = document.getElementById('ig-header-avatar');
  if (nameEl) nameEl.textContent = state.contactName;
  if (avatarEl) avatarEl.innerHTML = getAvatarHTML();
}

export function renderInstagramMessages() {
  const state = window.chatState;
  const chatArea = document.getElementById('ig-chat-area');
  if (!chatArea) return;

  chatArea.innerHTML = '';

  state.messages.forEach(msg => {
    const isSent = msg.sender === 'me';
    const div = document.createElement('div');

    if (msg.type === 'text') {
      div.className = `ig-message ${isSent ? 'ig-message-sent' : 'ig-message-received'}`;
      div.innerHTML = `
        <div class="ig-message-text">${escapeHtml(msg.text)}</div>
        <div class="ig-message-time">${msg.timestamp}</div>
      `;
    } else if (msg.type === 'image') {
      div.className = `ig-message ig-message-image ${isSent ? 'ig-message-sent' : 'ig-message-received'}`;
      div.style.background = 'transparent';
      div.innerHTML = `
        <img src="${msg.imageSrc}" alt="Imagem" />
        <div class="ig-message-time">${msg.timestamp}</div>
      `;
    } else if (msg.type === 'audio') {
      div.className = `ig-message ig-message-audio ${isSent ? 'ig-message-sent' : 'ig-message-received'}`;
      div.innerHTML = `
        <div class="ig-audio-player">
          <button class="ig-audio-play-btn">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="ig-audio-waveform">
            ${generateWaveform()}
          </div>
          <span class="ig-audio-duration">0:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}</span>
        </div>
        <div class="ig-audio-transcript-label">
          <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
          Transcrito
        </div>
        <div class="ig-audio-transcript">${escapeHtml(msg.text)}</div>
        <div class="ig-message-time">${msg.timestamp}</div>
      `;
    }

    chatArea.appendChild(div);
  });

  // Scroll to bottom
  chatArea.scrollTop = chatArea.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
