

const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
}; 
 

const pickQuery = async (query: Record<string, any>) => {
  const paginationOptions = pick(query, ['page', 'limit', 'sort']);

  const filters = await Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) =>
        !['page', 'limit', 'sort'].includes(key) && value != null && value !== '',
    ),
  );

  return {
    pagination: paginationOptions,
    filters,
  };
};

export default pickQuery;