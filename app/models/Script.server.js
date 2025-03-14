export async function getWebPixels(graphql) {
  const response = await graphql(
    `query {
      webPixel {
        id
        settings
      }
    }
    `
  );

  const {
    data
  } = await response.json();

  return data
}