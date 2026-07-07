'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getProductImageFallbacks,
  placeholderSvg,
  resolveProductImage,
  type ProductLike,
} from '@/lib/commerce/product-images';

interface ProductImageProps {
  /** Full product object (preferred). */
  product?: ProductLike;
  /** Build a product-like from these when a full product isn't available. */
  name?: string;
  category?: { slug?: string; name?: string } | string;
  tags?: string[];
  eventType?: string;
  alt?: string;
  className?: string;
  /** Use object-contain instead of object-cover (good for detail pages). */
  contain?: boolean;
  /**
   * Force a specific image URL first (e.g. the currently-selected gallery
   * image). On error, falls back through the resolver chain.
   */
  src?: string;
}

/**
 * Renders a product image with an accurate, type-matched source and a
 * guaranteed fallback chain so images never render blank or as a broken
 * image icon. Falls back through: curated primary -> event image ->
 * secondary type image -> SVG placeholder (emoji gradient).
 */
export default function ProductImage({
  product,
  name,
  category,
  tags,
  eventType,
  alt = 'Product image',
  className = '',
  contain = false,
  src,
}: ProductImageProps) {
  const resolvedProduct: ProductLike = useMemo(() => {
    if (product) return product;
    return { name, category, tags };
  }, [product, name, category, tags]);

  // Use database image directly, no fallbacks
  const imageUrl = src || resolvedProduct.primary_image_url || placeholderSvg(resolvedProduct);
  
  const [currentSrc, setCurrentSrc] = useState(imageUrl);
  const [hasError, setHasError] = useState(false);

  // Reset when product changes
  useEffect(() => {
    setCurrentSrc(imageUrl);
    setHasError(false);
  }, [imageUrl]);

  const fitClass = contain ? 'object-contain' : 'object-cover';

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`w-full h-full ${fitClass} ${className}`}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(placeholderSvg(resolvedProduct));
        }
      }}
      loading="lazy"
    />
  );
}
