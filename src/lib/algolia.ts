import algolia from 'algoliasearch'

const algoliaClient = algolia(
  process.env.ALGOLIA_API_KEY!,
  process.env.ALGOLIA_ADMIN_API_KEY!
)

export const teachers_index = algoliaClient.initIndex(
  process.env.ALGOLIA_TEACHERS_INDEX_NAME!
)

export const teachers_index_salary = algoliaClient.initIndex(
  process.env.ALGOLIA_TEACHERS_SALARY_INDEX_NAME!
)

export const students_index = algoliaClient.initIndex(
  process.env.ALGOLIA_STUDENTS_INDEX_NAME!
)
