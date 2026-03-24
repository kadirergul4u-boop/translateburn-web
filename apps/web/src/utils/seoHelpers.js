
export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.metaDescription || article.excerpt,
    "image": article.featuredImage || "https://horizons-cdn.hostinger.com/64a08437-edd0-45e0-b726-9bfc5fe6b734/c9a95e343abec83650a769b59639f563.jpg",
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "description": article.author.bio
    },
    "publisher": {
      "@type": "Organization",
      "name": "TranslateBurn",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/64a08437-edd0-45e0-b726-9bfc5fe6b734/c9a95e343abec83650a769b59639f563.jpg"
      }
    },
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://translateburn.com/blog/${article.slug}`
    },
    "keywords": article.keywords.join(", "),
    "articleSection": article.category,
    "wordCount": article.wordCount || Math.floor(article.content.split(' ').length)
  };
}

export function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TranslateBurn Blog",
    "description": "Çeviri teknolojileri, dil öğrenimi ve yapay zeka destekli çeviri araçları hakkında güncel makaleler",
    "url": "https://translateburn.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "TranslateBurn",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/64a08437-edd0-45e0-b726-9bfc5fe6b734/c9a95e343abec83650a769b59639f563.jpg"
      }
    }
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://translateburn.com${item.href}`
    }))
  };
}
