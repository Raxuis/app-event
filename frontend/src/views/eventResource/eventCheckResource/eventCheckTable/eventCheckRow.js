/* eslint-disable no-nested-ternary */
import viewColumn from './eventCheckCol';

export default (resources) => `
  ${resources.length > 1
    ? resources.map(
      (resource) => viewColumn(resource)
    ).join('')
    : resources.length > 0
      ? viewColumn(resources[0])
      : ''}
`;
