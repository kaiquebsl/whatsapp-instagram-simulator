import './whatsapp.css';
import { renderControlsPanel } from '../shared/controls.js';

function generateWaveform() {
  const bars = [];
  const count = 28;
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 18) + 4;
    bars.push(`<div class="wa-audio-bar" style="height:${h}px"></div>`);
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

export function renderWhatsApp(container) {
  const state = window.chatState;

  container.innerHTML = `
    <div class="phone-frame">
      <div class="wa-container">
        <!-- Status bar -->
        <div class="status-bar wa-status-bar">
          <span class="status-bar-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          <div class="status-bar-icons">
            <svg viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
            <svg viewBox="0 0 24 24"><path d="M2 22h20V2z M17 7L2 22h15z" opacity="0.3"/><path d="M2 22h20V2zm15-15v15H2z"/></svg>
            <svg viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
          </div>
        </div>
        
        <!-- Header -->
        <div class="wa-header" id="wa-header">
          <div class="wa-header-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div class="wa-header-avatar" id="wa-header-avatar">
            ${getAvatarHTML()}
          </div>
          <div class="wa-header-info">
            <div class="wa-header-name" id="wa-header-name">${state.contactName}</div>
            <div class="wa-header-status">online</div>
          </div>
          <div class="wa-header-actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7V1h-6M16 8l7-7M1 17v6h6M8 16l-7 7"/><path d="M15 2H9a2 2 0 00-2 2v16a2 2 0 002 2h6"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </div>
        </div>
        
        <!-- Chat area -->
        <div class="wa-chat-area" id="wa-chat-area">
          <div class="wa-date-separator">HOJE</div>
        </div>
        
        <!-- Input bar -->
        <div class="wa-input-bar">
          <div class="wa-input-container">
            <div class="wa-input-emoji">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
            </div>
            <div class="wa-input-text">Digite uma mensagem</div>
            <div class="wa-input-actions">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="0"/></svg>
            </div>
          </div>
          <button class="wa-mic-btn">
            <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  renderWhatsAppMessages();
  renderControlsPanel('whatsapp');
}

export function updateWhatsAppHeader() {
  const state = window.chatState;
  const nameEl = document.getElementById('wa-header-name');
  const avatarEl = document.getElementById('wa-header-avatar');
  if (nameEl) nameEl.textContent = state.contactName;
  if (avatarEl) avatarEl.innerHTML = getAvatarHTML();
}

export function renderWhatsAppMessages() {
  const state = window.chatState;
  const chatArea = document.getElementById('wa-chat-area');
  if (!chatArea) return;

  chatArea.innerHTML = '<div class="wa-date-separator">HOJE</div>';

  state.messages.forEach(msg => {
    const isSent = msg.sender === 'me';
    const div = document.createElement('div');

    if (msg.type === 'text') {
      div.className = `wa-message ${isSent ? 'wa-message-sent' : 'wa-message-received'}`;
      div.innerHTML = `
        <div class="wa-message-text">
          ${escapeHtml(msg.text)}
          <span class="wa-message-meta">
            <span class="wa-message-time">${msg.timestamp}</span>
            ${isSent ? `<span class="wa-message-check">
              <svg viewBox="0 0 16 15"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L4.272 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z M11.588 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.244 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L.85 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z"/></svg>
            </span>` : ''}
          </span>
        </div>
      `;
    } else if (msg.type === 'image') {
      div.className = `wa-message wa-message-image ${isSent ? 'wa-message-sent' : 'wa-message-received'}`;
      div.innerHTML = `
        <img src="${msg.imageSrc}" alt="Imagem" />
        <span class="wa-message-meta">
          <span class="wa-message-time">${msg.timestamp}</span>
          ${isSent ? `<span class="wa-message-check">
            <svg viewBox="0 0 16 15"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L4.272 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z M11.588 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.244 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L.85 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z"/></svg>
          </span>` : ''}
        </span>
      `;
    } else if (msg.type === 'audio') {
      div.className = `wa-message wa-message-audio ${isSent ? 'wa-message-sent' : 'wa-message-received'}`;
      div.innerHTML = `
        <div class="wa-audio-player">
          <button class="wa-audio-play-btn">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="wa-audio-waveform">
            ${generateWaveform()}
          </div>
          <span class="wa-audio-duration">0:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}</span>
        </div>
        <div class="wa-audio-transcript-label">
          <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
          Transcrito
        </div>
        <div class="wa-audio-transcript">
          ${escapeHtml(msg.text)}
          <span class="wa-message-meta">
            <span class="wa-message-time">${msg.timestamp}</span>
            ${isSent ? `<span class="wa-message-check">
              <svg viewBox="0 0 16 15"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L4.272 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z M11.588 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.244 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.358.325a.32.32 0 0 1-.484-.033L.85 7.5a.366.366 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l6.9-8.643a.366.366 0 0 0-.063-.51z"/></svg>
            </span>` : ''}
          </span>
        </div>
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
