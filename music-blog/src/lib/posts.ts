import { getCollection } from 'astro:content';

export async function getAllPosts() {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => {
		const aOrder = a.data.order;
		const bOrder = b.data.order;
		if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
		if (aOrder !== undefined) return -1;
		if (bOrder !== undefined) return 1;
		return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
	});
}

export async function getLatestPost() {
	const posts = await getAllPosts();
	return posts.find((p) => p.data.featured === true);
}
