#!/bin/bash

# 1. Ask for the news details
echo "📰 Enter News Title:"
read title
echo "✍️ Enter News Content (Press Enter when done):"
read content

# 2. Format a clean filename (lowercase, replaces spaces with hyphens)
filename=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# 3. Use Hugo to generate the new markdown post
hugo new "posts/${filename}.md"

# 4. Update the generated file with your custom title and content
# (Overwrites the draft status to false so it publishes immediately)
sed -i "s/title: .*/title: \"$title\"/" "content/posts/${filename}.md"
sed -i "s/draft: .*/draft: false/" "content/posts/${filename}.md"

# 5. Append your text to the end of the file
echo -e "\n$content" >> "content/posts/${filename}.md"

# 6. Build the static site files for GitHub Pages
echo "🏗️ Building static files with Hugo..."
hugo

# 7. Push everything straight to your GitHub repository
echo "🚀 Pushing updates to GitHub..."
git add .
git commit -m "Published News: $title"
git push origin main

echo "✅ Success! Your news article is live at https://ngetichkpeter.github.io/NgetichNews/"
