export const PUBLIC_BASE_PATH = '/balai/bbwssumatera8';
export const API_BASE_PATH = `${PUBLIC_BASE_PATH}/api`;

export const getPublicUploadUrl = (
  requestUrl: string,
  folderName: string,
  fileName: string
) => {
  const request = new URL(requestUrl);
  const protocol = process.env.NODE_ENV === 'production' ? 'https:' : request.protocol;

  return `${protocol}//${request.host}${PUBLIC_BASE_PATH}/uploads/${folderName}/${encodeURIComponent(fileName)}`;
};
