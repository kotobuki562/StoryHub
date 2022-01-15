import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import Link from "next/link"
import { NexusGenObjects } from "src/generated/nexus-typegen"

import Layout from "../components/Layout"

const StoriesQuery = gql`
  query QueryStories($page: Int!, $pageSize: Int!) {
    QueryStories(page: $page, pageSize: $pageSize) {
      story_title
      story_synopsis
      story_categories
      story_image
      created_at
      viewing_restriction
    }
  }
`

type QueryStory = {
  QueryStories: NexusGenObjects["Story"][]
}

const Blog = () => {
  const { loading, error, data } = useQuery<QueryStory>(StoriesQuery, {
    variables: {
      page: 1,
      pageSize: 10,
    },
  })

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Blog</h1>
        <main>
          {data?.QueryStories.map(story => {
            return (
              <div key={story.id}>
                <h2>{story.story_title}</h2>
                <p>{story.story_synopsis}</p>
                <img
                  src={`${story.story_image}`}
                  alt={`${story.story_title}`}
                />
              </div>
            )
          })}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
