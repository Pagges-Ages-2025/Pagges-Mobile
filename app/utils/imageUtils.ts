export const base64Uri = (base64: string, imageType: string = "") =>
    `data:image/${imageType};base64,${base64}`;
  