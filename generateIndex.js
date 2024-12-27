const fs = require('fs');
const path = require('path');

// Paths
const blogDir = path.join(__dirname, 'content/blog');
const indexFile = path.join(blogDir, 'index.json');

function generateBlogIndex() {
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.json') && file !== 'index.json'); // Exclude index.json

  // Prepare metadata for index.json
  const posts = files.map(file => {
    const filePath = path.join(blogDir, file);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Skip invalid posts
    if (!post.date || !post.title || !post.body) {
      console.warn(`Skipping invalid post: ${file}`);
      return null;
    }

    return {
      filename: file,
      title: post.title,
      date: new Date(post.date).toISOString() // Standardize date format
    };
  }).filter(Boolean); // Remove null values

  // Sort posts by date (most recent first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index.json
  fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
  console.log(`Updated index.json with ${posts.length} posts.`);

  // Generate HTML for each post
  posts.forEach(({ filename }) => {
    const filePath = path.join(blogDir, filename);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <header>
          <h1>${post.title}</h1>
          <p><strong>Author:</strong> ${post.author} | <strong>Date:</strong> ${new Date(post.date).toLocaleDateString()}</p>
        </header>
        <main>
          <article>
            <p>${post.body}</p>
          </article>
          <a href="/content/blog/index.html" class="btn">Back to Blog</a>
        </main>
      </body>
      </html>
    `;

    const outputFilePath = path.join(blogDir, `${filename.replace('.json', '.html')}`);
    fs.writeFileSync(outputFilePath, htmlContent);
    console.log(`Generated HTML for: ${filename}`);
  });

  console.log('Blog index and HTML files updated.');
}

generateBlogIndex();
