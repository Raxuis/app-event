function convertEntitiesHTML(text) {
  if (text === null || typeof text === 'undefined') {
    return '';
  }

  // Use DOMParser to safely decode HTML entities
  const parser = new DOMParser();
  const decodedText = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;

  return decodedText;
}

export default convertEntitiesHTML;
