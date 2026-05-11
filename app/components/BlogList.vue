<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .all(),
)

function formatDate(d?: string) {
  if (!d) return ''
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <ul class="not-prose mt-8 space-y-8 list-none pl-0">
    <li v-for="post in posts" :key="post.path">
      <article>
        <NuxtLink
          :to="post.path"
          class="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:underline"
        >
          {{ post.title }}
        </NuxtLink>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <time v-if="post.date" :datetime="post.date">
            {{ formatDate(post.date) }}
          </time>
          <span v-if="post.category" class="ml-3">
            in <span class="font-medium">{{ post.category }}</span>
          </span>
          <span v-if="post.tags?.length" class="ml-3 space-x-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-gray-600 dark:text-gray-300"
            >#{{ tag }}</span>
          </span>
        </div>
        <p
          v-if="post.description"
          class="mt-2 text-gray-700 dark:text-gray-300"
        >
          {{ post.description }}
        </p>
      </article>
    </li>
    <li
      v-if="!posts?.length"
      class="text-gray-500 dark:text-gray-400 italic"
    >
      No posts yet.
    </li>
  </ul>
</template>
