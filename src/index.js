export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Backend test
    if (url.pathname === "/api/test") {
      return Response.json({
        success: true,
        message: "AMP0W3R backend is online"
      });
    }

    // Product API
    if (url.pathname === "/api/products") {
      const { results } = await env.DB
        .prepare("SELECT * FROM products WHERE active = 1")
        .all();

      return Response.json(results);
    }

    // Serve the storefront
    return env.ASSETS.fetch(request);
  }
};
