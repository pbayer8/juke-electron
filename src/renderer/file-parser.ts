export const parseBlob = (buffer: ArrayBuffer, extension: string) => {
  const blob = new Blob([buffer], { type: extension });
  const url = URL.createObjectURL(blob);
  console.log(url);
  return url;
};

// TODO: fix eslint
export const fake = '';
