
export const downloadContract = (html: string, filename: string): void => {
  const element = document.createElement('a');
  const file = new Blob([html], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};
