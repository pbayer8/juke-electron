export const parseBlob = (buffer: ArrayBuffer, extension: string) => {
  const blob = new Blob([buffer], { type: extension });
  const url = URL.createObjectURL(blob);
  return url;
};
