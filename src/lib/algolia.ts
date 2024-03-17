import algolia from 'algoliasearch'

const algoliaClient = algolia(
  process.env.ALGOLIA_API_KEY!,
  process.env.ALGOLIA_ADMIN_API_KEY!
)

export const teachers_index = algoliaClient.initIndex(
  process.env.ALGOLIA_TEACHERS_INDEX_NAME!
)
