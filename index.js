document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------
  // 1. Tag Filtering Functionality
  // -------------------------------------------------
  const tagLinks = document.querySelectorAll('.tag-link');
  const items = document.querySelectorAll('.item');

  tagLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedTag = link.dataset.tag;

      // Update active state for tag links
      tagLinks.forEach(tl => {
        tl.classList.remove('active');
        tl.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'true');

      // Filter items based on selected tag
      items.forEach(item => {
        if (!item.dataset.tags) return;
        const itemTags = item.dataset.tags.split(',').map(tag => tag.trim());
        const shouldShow = selectedTag === 'all' || itemTags.includes(selectedTag);

        if (shouldShow) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          void item.offsetWidth; // Force reflow to restart CSS transition
          item.style.opacity = '1';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // -------------------------------------------------
  // 2. Initialize AOS (Animate on Scroll)
  // -------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init();
  } else {
    console.error('AOS library is not loaded.');
  }

  // -------------------------------------------------
  // 3. Optimized GSAP & SplitType Animation for Target Text Using ScrollTrigger
  // -------------------------------------------------
  const target = document.querySelector('#target');
  if (
    target &&
    typeof SplitType !== 'undefined' &&
    typeof gsap !== 'undefined' &&
    typeof ScrollTrigger !== 'undefined'
  ) {
    const text = new SplitType(target, { types: 'words, chars' });
    gsap.set(text.chars, { opacity: 0, y: 20 });
    gsap.to(text.chars, {
      opacity: 1,
      y: 0,
      duration: 0.75,          // Faster animation
      ease: "power2.out",
      stagger: 0.02,           // Minimal stagger for fluidity
      scrollTrigger: {
        trigger: target,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      }
    });
  } else {
    console.warn('Either #target is missing or required libraries (SplitType, gsap, ScrollTrigger) are not loaded.');
  }

  // -------------------------------------------------
  // 4. Load and Display Articles from JSON
  // -------------------------------------------------
  async function loadArticles() {
    const articlesContainer = document.getElementById('articles');
    if (!articlesContainer) {
      console.error('Articles container not found!');
      return;
    }
    try {
      const response = await fetch('/content/blog/index.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      let articles = await response.json();
      // Sort articles by date (most recent first)
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      articles = articles.slice(0, 5); // Limit to 5 articles
      articlesContainer.innerHTML = '';
      articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
          <h2>
            <a href="/content/blog/posts/${article.filename.replace('.json', '/index.html')}">
              ${article.title}
            </a>
          </h2>
          <p>${new Date(article.date).toLocaleDateString()}</p>
        `;
        articlesContainer.appendChild(articleElement);
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      articlesContainer.innerHTML = '<p>Could not load articles. Please try again later.</p>';
    }
  }
  loadArticles();

  // -------------------------------------------------
  // 5. Custom Cursor Animation
  // -------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    const easing = 0.1;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * easing;
      cursorY += (mouseY - cursorY) * easing;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  } else {
    console.error('Custom cursor element not found!');
  }
});
