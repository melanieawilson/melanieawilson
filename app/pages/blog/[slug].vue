<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('content').path(route.path).first(),
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  })
}

useSeoMeta(
  post.value?.seo || {
    title: post.value?.title,
    description: post.value?.description,
  },
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
  <NuxtLayout
    name="default"
    class="bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700"
  >
    <article
      class="prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900"
    >
      <header
        class="not-prose mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
      >
        <NuxtLink
          to="/"
          class="text-sm text-gray-500 dark:text-gray-400 hover:underline"
        >
          ← Home
        </NuxtLink>
        <h1
          class="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {{ post?.title }}
        </h1>
        <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <time v-if="post?.date" :datetime="post.date">
            {{ formatDate(post.date) }}
          </time>
          <span v-if="post?.category" class="ml-3">
            in <span class="font-medium">{{ post.category }}</span>
          </span>
          <span v-if="post?.tags?.length" class="ml-3 space-x-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-gray-600 dark:text-gray-300"
            >#{{ tag }}</span>
          </span>
        </div>
      </header>
      <ContentRenderer v-if="post" :value="post" />
    </article>
  </NuxtLayout>
</template>
