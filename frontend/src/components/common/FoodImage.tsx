import { useState, useEffect } from 'react'
import { getFoodPhoto, DEFAULT_FOOD_PHOTO } from '../../utils/foodImages'

interface FoodImageProps {
  name?: string
  category?: string
  alt?: string
  className?: string
  fallbackSrc?: string
}

export default function FoodImage({
  name,
  category,
  alt,
  className = 'w-full h-40 object-cover rounded-xl',
  fallbackSrc = DEFAULT_FOOD_PHOTO,
}: FoodImageProps) {
  const primarySrc = getFoodPhoto(name, category)
  const [src, setSrc] = useState(primarySrc)
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSrc(primarySrc)
    setHasError(false)
    setLoaded(false)
  }, [primarySrc])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setSrc(fallbackSrc)
    }
  }

  return (
    <div className={`relative overflow-hidden bg-[#F5F3EF] ${className}`}>
      {/* Soft Shimmer Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDE8E3]/60 via-[#FDFCF8] to-[#EDE8E3]/60 animate-pulse flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#78716C] tracking-wider uppercase">
            [IMG.LOADING]
          </span>
        </div>
      )}
      <img
        src={src}
        alt={alt || name || 'Food portion'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{
          imageRendering: '-webkit-optimize-contrast',
        }}
        className={`w-full h-full object-cover transition-all duration-300 ease-out ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  )
}
