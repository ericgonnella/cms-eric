
<script>
  document.addEventListener('DOMContentLoaded', () => {
      const tagLinks = document.querySelectorAll('.tag-link');
      const items = document.querySelectorAll('.item');

      tagLinks.forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const selectedTag = link.dataset.tag;

              // Update active state of tag links
              tagLinks.forEach(tl => {
                  tl.classList.remove('active');
                  tl.removeAttribute('aria-current');
              });
              link.classList.add('active');
              link.setAttribute('aria-current', 'true');

              // Filter items
              items.forEach(item => {
                  const itemTags = item.dataset.tags.split(',');
                  const shouldShow = selectedTag === 'all' || itemTags.includes(selectedTag);
                  
                  if (shouldShow) {
                      item.classList.remove('hidden');
                      // Reset animation
                      item.style.opacity = '0';
                      // Force reflow
                      void item.offsetWidth;
                      // Trigger animation
                      item.style.opacity = '1';
                  } else {
                      item.classList.add('hidden');
                  }
              });
          });
      });
  });
</script>

<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <script>
    AOS.init();
    </script>

    <script src="/index.js"></script>

    <script src="https://unpkg.com/split-type"></script>

  <!-- Include SplitType and GSAP from CDNs -->
  <script src="https://unpkg.com/split-type"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js"></script>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize SplitType
      const target = document.querySelector('#target');
      const text = new SplitType(target, { types: 'words, chars' });


      // Function to check if the element is partially in the viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        console.log('Element rect:', rect);
        return (
          rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom > 0
        );
      }

      // Scroll event listener to trigger animation
      function onScroll() {
  
        if (isInViewport(target)) {
          console.log('Animating text');
              gsap.set(text.chars, { opacity: 0, y: 20 }); // Set initial state
              gsap.to(text.chars, {
      opacity: 1,
      translateY: '5px', // Avoid layout-affecting changes
      duration: 0.95,
      stagger: { amount: 1.1 },
});
          window.removeEventListener('scroll', onScroll); // Remove listener after animation
        }
      }

      window.addEventListener('scroll', onScroll);

      // Trigger the scroll event once to check if the element is already in view
      onScroll();
    });
    document.addEventListener("DOMContentLoaded", () => {
  async function loadArticles() {
    const articlesContainer = document.getElementById('articles');

    if (!articlesContainer) {
      console.error('Articles container not found!');
      return;
    }

    try {
      // Fetch articles from index.json
      const response = await fetch('/content/blog/index.json'); // Adjust the path if necessary
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let articles = await response.json();

      // Sort articles by date (most recent first)
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Display only the last 5 articles
      articles = articles.slice(0, 5);

      // Clear the container
      articlesContainer.innerHTML = '';

      // Loop through articles and create HTML elements
      articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
          <h2><a href="/content/blog/posts/${article.filename.replace('.json', '/index.html')}">${article.title}</a></h2>
          <p><strong></strong> ${new Date(article.date).toLocaleDateString()}</p>
        `;
        articlesContainer.appendChild(articleElement);
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      articlesContainer.innerHTML = '<p>Could not load articles. Please try again later.</p>';
    }
  }

  loadArticles();
});
</script>



<script>
  // Wait for the DOM to fully load
  document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector('.custom-cursor');
    
    // Check if the cursor element exists
    if (!cursor) {
      console.error("Custom cursor element not found!");
      return;
    }

    // Initial mouse and cursor positions
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Easing factor for smooth transition
    const easing = 0.1;

    // Update target mouse coordinates on mouse move
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animation loop using requestAnimationFrame
    function animateCursor() {
      cursorX += (mouseX - cursorX) * easing;
      cursorY += (mouseY - cursorY) * easing;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(animateCursor);
    }

    // Start the animation loop
    animateCursor();
  });
</script>


