import { goBack } from '../main.js';
import { getTimestamp, createMessageId } from '../shared/utils.js';

export function renderControlsPanel(platform) {
  const state = window.chatState;
  const isWhatsApp = platform === 'whatsapp';

  // Remove existing controls
  const existing = document.querySelector('.controls-panel');
  if (existing) existing.remove();
  const existingBack = document.querySelector('.back-btn');
  if (existingBack) existingBack.remove();

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
    Voltar
  `;
  backBtn.addEventListener('click', () => {
    const panel = document.querySelector('.controls-panel');
    if (panel) panel.remove();
    backBtn.remove();
    goBack();
  });
  document.body.appendChild(backBtn);

  // Controls panel
  const panel = document.createElement('div');
  panel.className = 'controls-panel';
  panel.innerHTML = `
    <h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
      Controles
    </h3>
    
    <div class="control-divider"></div>
    
    <div class="control-group">
      <label>Nome do Contato</label>
      <input type="text" id="contact-name" value="${state.contactName}" placeholder="Nome do contato" />
    </div>
    
    <div class="control-group">
      <label>Foto do Contato</label>
      <div class="photo-upload">
        <div class="photo-preview" id="photo-preview">
          ${state.contactPhoto
      ? `<img src="${state.contactPhoto}" alt="Foto" />`
      : `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
    }
        </div>
        <button class="photo-upload-btn" id="photo-upload-btn">Escolher foto</button>
        <input type="file" accept="image/*" class="hidden-input" id="photo-input" />
      </div>
    </div>
    
    <div class="control-divider"></div>
    
    <div class="control-group">
      <label>Remetente</label>
      <div class="sender-toggle">
        <button class="${state.sender === 'me' ? 'active' : ''}" data-sender="me">Eu</button>
        <button class="${state.sender === 'them' ? 'active' : ''}" data-sender="them">Contato</button>
      </div>
    </div>
    
    <div class="control-group">
      <label>Tipo de Mensagem</label>
      <div class="msg-type-buttons">
        <button class="msg-type-btn ${state.messageType === 'text' ? 'active' : ''}" data-type="text">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Texto
        </button>
        <button class="msg-type-btn ${state.messageType === 'image' ? 'active' : ''}" data-type="image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          Imagem
        </button>
        <button class="msg-type-btn ${state.messageType === 'audio' ? 'active' : ''}" data-type="audio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          Áudio
        </button>
      </div>
    </div>
    
    <div class="control-group" id="text-input-group">
      <label>Mensagem</label>
      <textarea id="msg-text" placeholder="Digite a mensagem..." rows="2"></textarea>
    </div>
    
    <div class="control-group" id="image-input-group" style="display:none;">
      <label>Imagem</label>
      <input type="file" accept="image/*" id="msg-image-input" class="photo-upload-btn" style="padding:10px 12px; background:#222; border:1px solid #333; border-radius:8px; color:#ccc; width:100%;" />
      <div id="msg-image-preview"></div>
    </div>
    
    <div class="control-group" id="audio-input-group" style="display:none;">
      <label>Texto Transcrito do Áudio</label>
      <textarea id="msg-audio-text" placeholder="Texto da transcrição..." rows="2"></textarea>
    </div>
    
    <div class="control-group">
      <label>Horário (opcional)</label>
      <input type="time" id="msg-time" />
    </div>
    
    <button class="send-btn ${isWhatsApp ? 'whatsapp-send' : 'instagram-send'}" id="send-msg-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Enviar Mensagem
    </button>
    
    <div class="control-divider"></div>
    
    <button class="danger-btn" id="clear-msgs-btn" style="width:100%;">
      Limpar Conversa
    </button>
  `;

  document.body.appendChild(panel);

  // Event Listeners
  setupControlEvents(platform);
}

function setupControlEvents(platform) {
  const state = window.chatState;

  // Contact name
  document.getElementById('contact-name').addEventListener('input', (e) => {
    state.contactName = e.target.value || 'Contato';
    updateHeader(platform);
  });

  // Photo upload
  document.getElementById('photo-upload-btn').addEventListener('click', () => {
    document.getElementById('photo-input').click();
  });

  document.getElementById('photo-preview').addEventListener('click', () => {
    document.getElementById('photo-input').click();
  });

  document.getElementById('photo-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.contactPhoto = ev.target.result;
        document.getElementById('photo-preview').innerHTML = `<img src="${ev.target.result}" alt="Foto" />`;
        updateHeader(platform);
      };
      reader.readAsDataURL(file);
    }
  });

  // Sender toggle
  document.querySelectorAll('.sender-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sender-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sender = btn.dataset.sender;
    });
  });

  // Message type
  document.querySelectorAll('.msg-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.msg-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.messageType = btn.dataset.type;

      document.getElementById('text-input-group').style.display = btn.dataset.type === 'text' ? '' : 'none';
      document.getElementById('image-input-group').style.display = btn.dataset.type === 'image' ? '' : 'none';
      document.getElementById('audio-input-group').style.display = btn.dataset.type === 'audio' ? '' : 'none';
    });
  });

  // Image message input
  document.getElementById('msg-image-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.pendingImage = ev.target.result;
        document.getElementById('msg-image-preview').innerHTML = `
          <div class="image-preview-container">
            <img src="${ev.target.result}" alt="Preview" />
            <button class="image-preview-remove" id="remove-image-preview">×</button>
          </div>
        `;
        document.getElementById('remove-image-preview').addEventListener('click', () => {
          state.pendingImage = null;
          document.getElementById('msg-image-preview').innerHTML = '';
          document.getElementById('msg-image-input').value = '';
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // Send message
  document.getElementById('send-msg-btn').addEventListener('click', () => {
    sendMessage(platform);
  });

  // Textarea Enter key
  const textArea = document.getElementById('msg-text');
  if (textArea) {
    textArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(platform);
      }
    });
  }

  const audioArea = document.getElementById('msg-audio-text');
  if (audioArea) {
    audioArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(platform);
      }
    });
  }

  // Clear messages
  document.getElementById('clear-msgs-btn').addEventListener('click', () => {
    state.messages = [];
    renderMessages(platform);
  });
}

function sendMessage(platform) {
  const state = window.chatState;
  const timeInput = document.getElementById('msg-time');
  const timestamp = timeInput.value || getTimestamp();

  let message = null;

  if (state.messageType === 'text') {
    const textEl = document.getElementById('msg-text');
    const text = textEl.value.trim();
    if (!text) return;

    message = {
      id: createMessageId(),
      type: 'text',
      text,
      sender: state.sender,
      timestamp,
    };
    textEl.value = '';
  } else if (state.messageType === 'image') {
    if (!state.pendingImage) return;

    message = {
      id: createMessageId(),
      type: 'image',
      imageSrc: state.pendingImage,
      sender: state.sender,
      timestamp,
    };
    state.pendingImage = null;
    document.getElementById('msg-image-preview').innerHTML = '';
    document.getElementById('msg-image-input').value = '';
  } else if (state.messageType === 'audio') {
    const audioTextEl = document.getElementById('msg-audio-text');
    const text = audioTextEl.value.trim();
    if (!text) return;

    message = {
      id: createMessageId(),
      type: 'audio',
      text,
      sender: state.sender,
      timestamp,
    };
    audioTextEl.value = '';
  }

  if (message) {
    state.messages.push(message);
    renderMessages(platform);
  }
}

function renderMessages(platform) {
  if (platform === 'whatsapp') {
    import('../whatsapp/whatsapp.js').then(m => m.renderWhatsAppMessages());
  } else {
    import('../instagram/instagram.js').then(m => m.renderInstagramMessages());
  }
}

function updateHeader(platform) {
  if (platform === 'whatsapp') {
    import('../whatsapp/whatsapp.js').then(m => m.updateWhatsAppHeader());
  } else {
    import('../instagram/instagram.js').then(m => m.updateInstagramHeader());
  }
}
