document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.getElementById("mainHeader");

  // ====================================================
  // 1. Header Scroll Functionality (Added)
  // ====================================================
  if (mainHeader) {
    function handleHeaderScroll() {
      // Add 'scrolled' class when scrolled past the header height (e.g., 50px)
      if (window.scrollY > 50) {
        mainHeader.classList.add("scrolled");
      } else {
        mainHeader.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", handleHeaderScroll);
    handleHeaderScroll(); // Check on load
  }

  // ====================================================
  // 2. Hamburger Menu Functionality (Reviewed & Cleaned)
  // ====================================================
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mainNav = document.getElementById("mainNav");

  if (hamburgerMenu && mainNav) {
    hamburgerMenu.setAttribute("aria-expanded", "false");

    const toggleMenu = (open) => {
      const isOpen =
        open !== undefined ? open : mainNav.classList.toggle("active");
      hamburgerMenu.classList.toggle("is-open", isOpen);
      mainNav.classList.toggle("active", isOpen);
      hamburgerMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    hamburgerMenu.addEventListener("click", () => toggleMenu());

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("active")) {
        toggleMenu(false);
      }
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (
        mainNav.classList.contains("active") &&
        !mainNav.contains(e.target) &&
        !hamburgerMenu.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  // ====================================================
  // 3. Image Gallery Functionality (Fixed)
  // ====================================================
  const galleryImages = [
    "assets/pro1.png",
    "assets/pro2.png",
    "assets/pro3.png",
  ];
  // NOTE: currentImageIndex should track the active thumbnail index (0-7), not the image array index
  let currentThumbnailIndex = 0;
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".gallery-thumbnails img");
  const prevArrow = document.querySelector(".gallery-arrow-prev");
  const nextArrow = document.querySelector(".gallery-arrow-next");
  const galleryDotsContainer = document.getElementById("galleryDots");

  // Create dots dynamically
  if (galleryDotsContainer) {
    for (let i = 0; i < galleryImages.length; i++) {
      const dot = document.createElement("button");
      dot.className = `gallery-dot ${i === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      dot.dataset.index = i;
      galleryDotsContainer.appendChild(dot);
    }
  }
  const dots = document.querySelectorAll(".gallery-dot");

  // Function to update gallery
  function updateGallery(thumbnailIndex) {
    // 1. Determine the main image index (0, 1, or 2) from the thumbnail index (0-7)
    // Assuming: Thumbnails 0-2 -> Image 0; 3-5 -> Image 1; 6-7 -> Image 2
    let imageIndex;
    if (thumbnailIndex <= 2) {
      imageIndex = 0;
    } else if (thumbnailIndex <= 5) {
      imageIndex = 1;
    } else {
      imageIndex = 2;
    }

    // 2. Update main image
    if (mainImage) {
      mainImage.src = galleryImages[imageIndex];
    }

    // 3. Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      if (i === thumbnailIndex) {
        thumb.classList.add("active");
      } else {
        thumb.classList.remove("active");
      }
    });

    // 4. Update active dot (based on imageIndex)
    dots.forEach((dot, i) => {
      if (i === imageIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    currentThumbnailIndex = thumbnailIndex;
  }

  // Initialize gallery on load (set initial active thumbnail/dot)
  if (thumbnails.length > 0) {
    updateGallery(0); // Start with the first thumbnail (index 0)
  }

  // Previous arrow
  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      const totalThumbnails = thumbnails.length;
      const newIndex =
        currentThumbnailIndex === 0
          ? totalThumbnails - 1
          : currentThumbnailIndex - 1;
      updateGallery(newIndex);
    });
  }

  // Next arrow
  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      const totalThumbnails = thumbnails.length;
      const newIndex =
        currentThumbnailIndex === totalThumbnails - 1
          ? 0
          : currentThumbnailIndex + 1;
      updateGallery(newIndex);
    });
  }

  // Thumbnail clicks
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index);
      updateGallery(index);
    });
  });

  // Dot clicks (Fixed logic to map dot index to image, then find a corresponding thumbnail)
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const dotIndex = parseInt(dot.dataset.index); // 0, 1, or 2

      // Find the first thumbnail that corresponds to this image index (e.g., dot 1 -> thumbnail 3)
      let targetThumbnailIndex;
      if (dotIndex === 0) targetThumbnailIndex = 0;
      else if (dotIndex === 1) targetThumbnailIndex = 3;
      else if (dotIndex === 2) targetThumbnailIndex = 6;

      updateGallery(targetThumbnailIndex);
    });
  });

  // ====================================================
  // 4. Dynamic Add to Cart Link + Purchase UI toggle (9 variants)
  // ====================================================
  const fragranceRadios = document.querySelectorAll('input[name="fragrance"]');
  const purchaseTypeRadios = document.querySelectorAll(
    'input[name="purchaseType"]'
  );
  const addToCartLink = document.getElementById("addToCartLink");

  // CRITICAL FIX: Removed the redundant 'includedRadios' logic as the display is CSS-only.

  function updateAddToCartLink() {
    // Read the currently checked values, defaulting to 'original' and 'single'
    const selectedFragrance =
      document.querySelector('input[name="fragrance"]:checked')?.value ||
      "original";
    const selectedPurchaseType =
      document.querySelector('input[name="purchaseType"]:checked')?.value ||
      "single";

    // Generate 9 different variations (3 fragrances x 3 purchase types)
    const cartLinks = {
      "original-single":
        "https://example.com/cart?fragrance=original&type=single",
      "original-double":
        "https://example.com/cart?fragrance=original&type=double",
      "original-onetime":
        "https://example.com/cart?fragrance=original&type=onetime",

      "lily-single": "https://example.com/cart?fragrance=lily&type=single",
      "lily-double": "https://example.com/cart?fragrance=lily&type=double",
      "lily-onetime": "https://example.com/cart?fragrance=lily&type=onetime",

      "rose-single": "https://example.com/cart?fragrance=rose&type=single",
      "rose-double": "https://example.com/cart?fragrance=rose&type=double",
      "rose-onetime": "https://example.com/cart?fragrance=rose&type=onetime",
    };

    const linkKey = `${selectedFragrance}-${selectedPurchaseType}`;

    if (addToCartLink && cartLinks[linkKey]) {
      addToCartLink.href = cartLinks[linkKey];
      // Optionally update button text based on selection
      // addToCartLink.textContent = `Add ${selectedPurchaseType} to Cart`;
    }
  }

  // Toggle expanded/collapsed subscription UI based on purchase type
  // IMPORTANT: Scope to main product details; do NOT affect the right-side aside
  const productDetails = document.querySelector(".product-details");
  const doubleExpanded = productDetails
    ? productDetails.querySelector(".subscription-card-double")
    : null;
  const doubleCollapsed = productDetails
    ? productDetails.querySelector(".subscription-card-double-collapsed")
    : null;
  const onetimeCollapsed = productDetails
    ? productDetails.querySelector(".subscription-card-onetime-collapsed")
    : null;
  const singleHeader = productDetails
    ? productDetails.querySelector(".subscription-card-single")
    : null;

  function updatePurchaseUI() {
    const selectedPurchaseType =
      document.querySelector('input[name="purchaseType"]:checked')?.value ||
      "single";

    // Double: show expanded, hide collapsed others
    if (doubleExpanded && doubleCollapsed) {
      const isDouble = selectedPurchaseType === "double";
      doubleExpanded.style.display = isDouble ? "block" : "none";
      doubleCollapsed.style.display = isDouble ? "none" : "block";
    }
    // One-time and Single are header-only rows; make sure their rows remain visible
    if (onetimeCollapsed) {
      onetimeCollapsed.style.opacity = selectedPurchaseType === "onetime" ? "1" : "1";
    }
    if (singleHeader) {
      singleHeader.style.opacity = selectedPurchaseType === "single" ? "1" : "1";
    }
  }

  // Add event listeners to all radio buttons
  [...fragranceRadios, ...purchaseTypeRadios].forEach((radio) => {
    radio.addEventListener("change", () => {
      updateAddToCartLink();
      updatePurchaseUI();
    });
  });

  // Initialize on load
  updateAddToCartLink();
  updatePurchaseUI();

  // ====================================================
  // 5. Percentage Counter Animation
  // ====================================================
  const percentageNumbers = document.querySelectorAll(".percentage-number");
  let hasAnimated = false;

  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    if (isNaN(target)) return;
    const duration = 2000; // 2 seconds
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = target / steps;
    let current = 0;

    // Clear existing text content before starting animation
    element.textContent = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 1000 / fps); // ~16ms for 60fps
  }

  function checkScrollForCounter() {
    const percentageSection = document.querySelector(".percentage-section");
    if (!percentageSection || hasAnimated) return;

    const rect = percentageSection.getBoundingClientRect();
    // Trigger animation when the top of the section enters the viewport
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;

    if (isVisible) {
      percentageNumbers.forEach((num) => {
        animateCounter(num);
      });
      hasAnimated = true;
      window.removeEventListener("scroll", checkScrollForCounter);
    }
  }

  // Check on scroll and on load
  window.addEventListener("scroll", checkScrollForCounter);
  checkScrollForCounter();

  // ====================================================
  // 6. Lazy Loading for Images (Removed 'loading="lazy"' from mainImage fix)
  // ====================================================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              // img.removeAttribute("data-src"); // Keep if you use it for CSS selectors
            }
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "0px 0px 200px 0px", // Load images 200px before they enter view
      }
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});
