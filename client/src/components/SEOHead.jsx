import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, author }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', title);
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
    }

    if (keywords) {
      const metaKey = document.querySelector('meta[name="keywords"]');
      if (metaKey) metaKey.setAttribute('content', keywords);
    }

    if (author) {
      const metaAuth = document.querySelector('meta[name="author"]');
      if (metaAuth) metaAuth.setAttribute('content', author);
    }
  }, [title, description, keywords, author]);

  return null;
}
