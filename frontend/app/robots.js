export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/customer/", "/settings/"],
      },
    ],
    sitemap: "https://www.vinatap.io.vn/sitemap.xml",
    host: "https://www.vinatap.io.vn",
  };
}
