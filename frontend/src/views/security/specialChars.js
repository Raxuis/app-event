import he from 'he';

function convertEntitiesHTML(text) {
  // Checking if text is null or undefined
  if (text === null || typeof text === 'undefined') {
    return ''; // Returning an empty string if value is null or undefined
  }

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
