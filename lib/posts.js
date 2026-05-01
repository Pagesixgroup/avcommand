import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fn => fn.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || '',
        date: data.date ? String(data.date) : '',
        description: data.description || '',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

export function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title || '',
    date: data.date ? String(data.date) : '',
    description: data.description || '',
    tags: data.tags || [],
    content,
  };
}
