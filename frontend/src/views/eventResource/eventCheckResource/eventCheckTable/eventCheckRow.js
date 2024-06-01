import viewColumn from './eventCheckCol';

export default (resources) => `
  ${resources.length > 1
    ? resources.map((resource) => viewColumn(resource)).join('')
    : viewColumn(resources[0])}
      `;
