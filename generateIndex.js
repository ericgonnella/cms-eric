function generateBlogIndex() {
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.json') && file !== 'index.json'); // Skip index.json

  // Update index.json
  fs.writeFileSync(indexFile, JSON.stringify(files, null, 2));
  console.log(`Updated index.json with ${files.length} posts.`);

  // Generate HTML for each JSON file
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!post.title || !post.body || !post.author || !post.date) {
      console.error(`Invalid JSON structure in ${filePath}`);
      return; // Skip invalid posts
    }

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

    const outputFilePath = path.join(blogDir, `${file.replace('.json', '.html')}`);
    fs.writeFileSync(outputFilePath, htmlContent);
    console.log(`Generated HTML for: ${file}`);
  });

  console.log('Blog index and HTML files updated.');
}
