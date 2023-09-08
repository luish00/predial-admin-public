import { tryLog } from "./utilities";

export const formateDateMx = (date: string | undefined | null) => {
  let sDate = '';

  if (!date) {
    return sDate;
  }

  try {
    sDate = new Date(date).toLocaleDateString('es-mx');
  } catch ({ message }) {
    tryLog({ key: 'formateDateMx', message: `params: ${date} ${message}` });
  }

  return sDate;
};
