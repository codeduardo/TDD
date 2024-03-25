export const createProduct = async (
  name: string,
  size: string,
  type: string
) => {
  return fetch("/api/createProduct", {
    method: "POST",
    body: JSON.stringify({ name, size, type }),
  });
};
