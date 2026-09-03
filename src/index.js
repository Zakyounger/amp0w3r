export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Backend health check
    if (url.pathname === "/api/test") {
      return Response.json({
        success: true,
        message: "AMP0W3R backend is online"
      });
    }

    // Product catalog
    if (url.pathname === "/api/products") {
      try {
        const { results } = await env.DB
          .prepare(`
            SELECT
              p.id,
              p.name,
              p.slug,
              p.sku,
              p.description,
              p.price_cents,
              p.inventory,
              p.image_url,
              p.active,
              b.name AS brand_name,
              b.slug AS brand_slug
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            WHERE p.active = 1
            ORDER BY p.id DESC
          `)
          .all();

        return Response.json(results, {
          headers: {
            "Cache-Control": "public, max-age=60"
          }
        });
      } catch (error) {
        console.error("Product API error:", error);

        return Response.json(
          {
            success: false,
            error: "Unable to load products"
          },
          { status: 500 }
        );
      }
    }

    // Serve the storefront
    return env.ASSETS.fetch(request);
  }
};
