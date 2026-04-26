import slugifyLib from 'slugify';

export const generateSlug = (title: string): string => {
  const slug = slugifyLib(title, { lower: true, strict: true });
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
};
