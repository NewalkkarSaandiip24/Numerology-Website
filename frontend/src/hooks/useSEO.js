import { useEffect } from "react";

/**
 * Lightweight per-route SEO updater (no react-helmet dependency).
 * Updates <title>, meta[description], meta[keywords], og:title, og:description, canonical.
 */
export default function useSEO({ title, description, keywords, canonical, ogImage, noindex }) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (selector, attrName, value) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [, attr, attrValue] = selector.match(/\[(.+?)=["'](.+?)["']\]/) || [];
        if (attr && attrValue) el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attrName, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="keywords"]', "content", keywords);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    if (ogImage) setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);

    // Robots: allow opting a route out of indexing (e.g. private portals)
    let robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex,nofollow");
    } else if (robots) {
      robots.setAttribute("content", "index,follow");
    }

    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
      setMeta('meta[property="og:url"]', "content", canonical);
    }
  }, [title, description, keywords, canonical, ogImage, noindex]);
}
