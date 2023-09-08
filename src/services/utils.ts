import { ErrorsType } from "../hooks";

export const errorsToString = (errors: ErrorsType[]): string => {
  if (errors?.length === 0) {
    return 'Ocurrio un error';
  }

  return errors.map((item: ErrorsType) => item.msg).join('\n');
};
