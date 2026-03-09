export function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function createMessageId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}
