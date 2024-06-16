import he from 'he';

function convertEntitiesHTML(text) {
  // Decoding HTML entities using library he
  let decodedText = he.decode(text);

  // Replacing any remaining encoded entities
  decodedText = decodedText
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  return decodedText;
}

export default convertEntitiesHTML;
