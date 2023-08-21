export const stringToConversationData = (inputString: string) => {
  const conversationData = [];
  const lines = inputString.split('\n');

  let currentRole = '';
  let currentText = '';

  for (const line of lines) {
    if (line.startsWith('Example:')) {
      continue;
    } else if (line.startsWith('User:')) {
      if (currentRole) {
        conversationData.push({ role: currentRole, text: currentText.trim() });
        currentText = '';
      }
      currentRole = 'human';
      currentText += line.replace('User:', '').trim() + '\n';
    } else if (line.startsWith('Agent:')) {
      if (currentRole) {
        conversationData.push({ role: currentRole, text: currentText.trim() });
        currentText = '';
      }
      currentRole = 'agent';
      currentText += line.replace('Agent:', '').trim() + '\n';
    } else {
      currentText += line.trim() + '\n';
    }
  }

  if (currentRole) {
    conversationData.push({ role: currentRole, text: currentText.trim() });
  }

  return conversationData;
}