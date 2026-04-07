import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import { COUNTRIES } from './data.js'

/**
 * Fisher-Yates shuffle for an array (in-place).
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Build gallery items from COUNTRIES data.
 * Picks 2 images per country from galleryImages, totaling ~44 items.
 * Each item has a thumbnail URL, full-size URL, and caption.
 */
function buildGalleryItems(countries) {
  const items = []

  countries.forEach(country => {
    const images = country.galleryImages || []
    // Pick the first 2 images from each country's gallery
    const selected = images.slice(0, 2)

    selected.forEach((imgUrl, idx) => {
      // Thumbnail: use the image as-is (w=800)
      const thumbnail = imgUrl
      // Full size: swap to w=1200 for the lightbox
      const fullSize = imgUrl.replace(/w=\d+/, 'w=1200')

      items.push({
        thumbnail,
        fullSize,
        caption: `${country.flag} ${country.name}`,
        country: country.name,
        continent: country.continent,
        index: idx,
      })
    })
  })

  // Shuffle for visual variety
  return shuffle(items)
}

/**
 * Create the masonry-style grid of gallery images.
 * Uses CSS columns layout with 4 columns.
 */
function createGalleryGrid(container, items) {
  // Apply masonry styles to the container
  container.style.columnCount = '4'
  container.style.columnGap = '12px'
  container.style.padding = '0 1rem'

  // Responsive column adjustment
  const style = document.createElement('style')
  style.textContent = `
    #photo-gallery {
      column-count: 4;
      column-gap: 12px;
    }
    @media (max-width: 1024px) {
      #photo-gallery { column-count: 3; }
    }
    @media (max-width: 768px) {
      #photo-gallery { column-count: 2; }
    }
    @media (max-width: 480px) {
      #photo-gallery { column-count: 1; }
    }
    #photo-gallery .gallery-item {
      break-inside: avoid;
      margin-bottom: 12px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      display: block;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    #photo-gallery .gallery-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(108, 138, 255, 0.2);
    }
    #photo-gallery .gallery-item img {
      width: 100%;
      display: block;
      border-radius: 12px;
      transition: filter 0.3s ease;
    }
    #photo-gallery .gallery-item:hover img {
      filter: brightness(1.1);
    }
    #photo-gallery .gallery-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      color: white;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 0 0 12px 12px;
    }
    #photo-gallery .gallery-item:hover .gallery-caption {
      opacity: 1;
    }
  `
  document.head.appendChild(style)

  // Build gallery HTML
  items.forEach(item => {
    const anchor = document.createElement('a')
    anchor.className = 'gallery-item'
    anchor.href = item.fullSize
    anchor.setAttribute('data-src', item.fullSize)
    anchor.setAttribute('data-sub-html', `<p>${item.caption}</p>`)

    const img = document.createElement('img')
    img.src = item.thumbnail
    img.alt = item.caption
    img.loading = 'lazy'
    img.decoding = 'async'

    const caption = document.createElement('div')
    caption.className = 'gallery-caption'
    caption.textContent = item.caption

    anchor.appendChild(img)
    anchor.appendChild(caption)
    container.appendChild(anchor)
  })
}

/**
 * Initialize the photo gallery with lightGallery lightbox.
 */
export function initGallery() {
  const container = document.getElementById('photo-gallery')
  if (!container) {
    console.warn('[gallery.js] #photo-gallery not found')
    return null
  }

  const countries = [...COUNTRIES]
  if (!countries.length) {
    console.warn('[gallery.js] No country data available')
    return null
  }

  const items = buildGalleryItems(countries)

  // Create the masonry grid with gallery images
  createGalleryGrid(container, items)

  // Initialize lightGallery on the container
  const gallery = lightGallery(container, {
    plugins: [lgZoom, lgThumbnail],
    selector: '.gallery-item',
    speed: 400,
    backdropDuration: 300,
    thumbnail: true,
    animateThumb: true,
    zoomFromOrigin: true,
    allowMediaOverlap: false,
    toggleThumb: true,
    download: false,
    counter: true,
    mousewheel: true,
    getCaptionFromTitleOrAlt: false,
    mobileSettings: {
      controls: true,
      showCloseIcon: true,
    },
  })

  return gallery
}
