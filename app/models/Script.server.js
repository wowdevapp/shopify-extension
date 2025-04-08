export async function getWebPixels(graphql) {
  try {
    const response = await graphql(
      `query {
        webPixel {
          id
          settings
        }
      }
      `
    );

    const { data } = await response.json();

    // Check if data and webPixel exist
    if (!data || !data.webPixel) {
      return { webPixel: null, error: "No web pixel data found" };
    }

    return data;
  } catch (error) {
    console.error("Error fetching web pixels:", error);
    return { webPixel: null, error: error.message || "Failed to fetch web pixels" };
  }
}