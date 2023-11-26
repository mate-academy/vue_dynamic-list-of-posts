export const createInitErrors = (
  errors: string[]
): { [key: string]: boolean } => {
  return errors.reduce((acc, val) => ({ ...acc, [val]: false }), {});
};
