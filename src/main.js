import './style.css';
import { renderPlatformSelector } from './shared/platform-selector.js';

const app = document.getElementById('app');

// Global state
window.chatState = {
  platform: null, // 'whatsapp' | 'instagram'
  contactName: 'Contato',
  contactPhoto: null,
  messages: [],
  sender: 'me', // 'me' | 'them'
  messageType: 'text', // 'text' | 'image' | 'audio'
  pendingImage: null,
};

export function navigateTo(platform) {
  window.chatState.platform = platform;
  window.chatState.messages = [];

  if (platform === 'whatsapp') {
    import('./whatsapp/whatsapp.js').then(m => m.renderWhatsApp(app));
  } else if (platform === 'instagram') {
    import('./instagram/instagram.js').then(m => m.renderInstagram(app));
  } else {
    renderPlatformSelector(app);
  }
}

export function goBack() {
  window.chatState.platform = null;
  window.chatState.messages = [];
  window.chatState.contactPhoto = null;
  window.chatState.contactName = 'Contato';
  renderPlatformSelector(app);
}

// Initial render
renderPlatformSelector(app);
