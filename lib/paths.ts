/**
 * Public-asset URL helper. GitHub Pages serves the site under /Portfolio, and
 * Next only rewrites its own <Link>/<Image> for basePath — plain <img>, <a>,
 * <source> and markdown output need the prefix added by hand.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
