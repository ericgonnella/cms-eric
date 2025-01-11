const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // Import the markdown parser

// Paths
const blogDir = path.join(__dirname, 'content/blog');
const postsDir = path.join(blogDir, 'posts');
const indexFile = path.join(blogDir, 'index.json');
const recommendedFile = path.join(blogDir, 'recommended.json');

// Ensure the posts directory exists
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

function generateBlogIndex() {
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json')); // Only JSON files

  if (files.length === 0) {
    console.warn('No blog post files found in the posts directory.');
    return;
  }

  // Prepare metadata for index.json
  const posts = files.map(file => {
    try {
      const filePath = path.join(postsDir, file); // Correct path to the JSON file
      const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Skip invalid posts
      if (!post.date || !post.title || !post.body) {
        console.warn(`Skipping invalid post: ${file}`);
        return null;
      }

      return {
        filename: file, // Just the filename (e.g., test-post.json)
        title: post.title,
        date: new Date(post.date).toISOString()
      };
    } catch (error) {
      console.error(`Error reading or parsing file: ${file}`, error);
      return null;
    }
  }).filter(Boolean); // Remove null values

  if (posts.length === 0) {
    console.warn('No valid posts found.');
    return;
  }

  // Sort posts by date (most recent first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index.json with all posts
  fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
  console.log(`Updated index.json with ${posts.length} posts.`);

  // Write recommended.json with the last 5 posts
  const recommended = posts.slice(0, 5); // Get the most recent 5 posts
  fs.writeFileSync(recommendedFile, JSON.stringify(recommended, null, 2));
  console.log(`Updated recommended.json with ${recommended.length} posts.`);

  // Generate HTML for each post
  posts.forEach(({ filename }) => {
    try {
      const filePath = path.join(postsDir, filename); // Path to the JSON file
      const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Convert markdown body to HTML
      const postContentHTML = marked(post.body);

      const postDir = path.join(postsDir, filename.replace('.json', '')); // Create a folder for each post
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      const htmlOutputPath = path.join(postDir, 'index.html'); // Output HTML file

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.title}</title>
          <link rel="stylesheet" href="/global.css"> 
        <link rel="stylesheet" href="/blog/blog.css">
        </head>
        <body>
          <header>
            <h1>${post.title}</h1>
            <p><strong>Author:</strong> ${post.author} | <strong>Date:</strong> ${new Date(post.date).toLocaleDateString()}</p>
          </header>
          <main>
            <article>
              ${postContentHTML} <!-- Rendered HTML from markdown -->
            </article>
            <a href="/content/blog/index.html" class="btn">Back to Blog</a>
          </main>
        </body>
        </html>
      `;

      fs.writeFileSync(htmlOutputPath, htmlContent);
      console.log(`Generated HTML for: ${filename}`);
    } catch (error) {
      console.error(`Error generating HTML for: ${filename}`, error);
    }
  });

  console.log('Blog index and HTML files updated.');
}

generateBlogIndex();
