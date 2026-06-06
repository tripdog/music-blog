import { getCollection } from 'astro:content';

export async function getAllPosts() {
	const posts = await getCollection('blog');
	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
}

export async function getLatestPost() {
	const posts = await getAllPosts();
	return posts.find((p) => p.data.featured === true);
}
