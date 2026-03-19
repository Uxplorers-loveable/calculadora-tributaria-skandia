export const PERSONALIZED_USER_NAME = 'Andres';

export const getPersonalizedName = (documentNumber?: string) => {
  if (!documentNumber?.trim()) return null;
  return PERSONALIZED_USER_NAME;
};
