import html2canvas from 'html2canvas';

export class ChatRecorder {
  constructor(platform) {
    this.platform = platform;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.chunks = [];
    this.canvas = null;
    this.ctx = null;
    this.stream = null;
    this.animationFrameId = null;
    this.messageDelay = 2000; // ms between messages
    this.typingDuration = 1500; // ms typing indicator shown
  }

  async start() {
    const state = window.chatState;
    if (state.messages.length === 0) {
      alert('Adicione mensagens antes de gravar!');
      return;
    }

    this.isRecording = true;
    this.chunks = [];

    const phoneFrame = document.querySelector('.phone-frame');
    if (!phoneFrame) return;

    // Create offscreen canvas matching phone frame dimensions
    const rect = phoneFrame.getBoundingClientRect();
    this.canvas = document.createElement('canvas');
    this.canvas.width = rect.width * 2;  // 2x for quality
    this.canvas.height = rect.height * 2;
    this.ctx = this.canvas.getContext('2d');

    // Setup MediaRecorder
    this.stream = this.canvas.captureStream(30); // 30 FPS

    // Try VP9 first for better quality, fallback to VP8
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];

    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: selectedMime,
      videoBitsPerSecond: 5000000, // 5 Mbps for good quality
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.exportVideo();
    };

    this.mediaRecorder.start(100); // collect data every 100ms

    // Store messages and clear them
    const allMessages = [...state.messages];
    state.messages = [];
    this.renderCurrentMessages();

    // Update recording UI
    this.updateRecordingUI(true);

    // Wait a beat showing empty chat
    await this.captureFrames(500);

    // Animate messages one by one
    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i];

      // Show typing indicator for received messages
      if (msg.sender === 'them') {
        this.showTypingIndicator();
        await this.captureFrames(this.typingDuration);
        this.hideTypingIndicator();
      } else {
        // Brief pause before sent message
        await this.captureFrames(400);
      }

      // Add message with animation
      state.messages.push(msg);
      this.renderCurrentMessages();

      // Mark new message with animation class
      const chatArea = this.getChatArea();
      if (chatArea) {
        const lastMsg = chatArea.lastElementChild;
        if (lastMsg) {
          lastMsg.classList.add('msg-animate-in');
        }
        chatArea.scrollTop = chatArea.scrollHeight;
      }

      // Capture the message appearing
      await this.captureFrames(this.messageDelay);
    }

    // Final pause
    await this.captureFrames(1000);

    // Stop recording
    this.isRecording = false;
    this.mediaRecorder.stop();
    this.updateRecordingUI(false);
  }

  async captureFrames(durationMs) {
    const phoneFrame = document.querySelector('.phone-frame');
    if (!phoneFrame) return;

    const startTime = Date.now();
    const frameInterval = 1000 / 30; // 30 FPS

    while (Date.now() - startTime < durationMs) {
      const frameStart = Date.now();

      try {
        const captured = await html2canvas(phoneFrame, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: phoneFrame.offsetWidth,
          height: phoneFrame.offsetHeight,
        });

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(captured, 0, 0, this.canvas.width, this.canvas.height);
      } catch (e) {
        console.warn('Frame capture failed:', e);
      }

      const elapsed = Date.now() - frameStart;
      const waitTime = Math.max(0, frameInterval - elapsed);
      if (waitTime > 0) {
        await this.sleep(waitTime);
      }
    }
  }

  showTypingIndicator() {
    const chatArea = this.getChatArea();
    if (!chatArea) return;

    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';

    if (this.platform === 'whatsapp') {
      indicator.className = 'wa-message wa-message-received wa-typing-indicator';
      indicator.innerHTML = `
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
    } else {
      indicator.className = 'ig-message ig-message-received ig-typing-indicator';
      indicator.innerHTML = `
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
    }

    chatArea.appendChild(indicator);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  getChatArea() {
    if (this.platform === 'whatsapp') {
      return document.getElementById('wa-chat-area');
    }
    return document.getElementById('ig-chat-area');
  }

  renderCurrentMessages() {
    if (this.platform === 'whatsapp') {
      import('../whatsapp/whatsapp.js').then(m => m.renderWhatsAppMessages());
    } else {
      import('../instagram/instagram.js').then(m => m.renderInstagramMessages());
    }
  }

  exportVideo() {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${this.platform}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Also show in a preview modal
    this.showPreviewModal(url);

    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  showPreviewModal(videoUrl) {
    // Remove existing modal
    const existing = document.getElementById('video-preview-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'video-preview-modal';
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-backdrop"></div>
      <div class="video-modal-content">
        <div class="video-modal-header">
          <h3>🎬 Vídeo Gravado</h3>
          <button class="video-modal-close" id="close-video-modal">×</button>
        </div>
        <video src="${videoUrl}" controls autoplay class="video-modal-player"></video>
        <div class="video-modal-actions">
          <a href="${videoUrl}" download="chat-${this.platform}-${Date.now()}.webm" class="video-download-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Baixar Novamente
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    document.getElementById('close-video-modal').addEventListener('click', () => modal.remove());
    modal.querySelector('.video-modal-backdrop').addEventListener('click', () => modal.remove());
  }

  updateRecordingUI(recording) {
    const btn = document.getElementById('record-btn');
    const indicator = document.getElementById('recording-status');

    if (btn) {
      if (recording) {
        btn.disabled = true;
        btn.innerHTML = `
          <span class="recording-dot"></span>
          Gravando...
        `;
      } else {
        btn.disabled = false;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          Gravar Vídeo
        `;
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
