/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Category: { // root type
    category_title?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: number | null; // Int
    user_id?: string | null; // String
  }
  Chapter: { // root type
    chapter_image?: string | null; // String
    chapter_title?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    episode_id?: string | null; // String
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Episode: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    episode_image?: string | null; // String
    episode_synopsis?: string | null; // String
    episode_title?: string | null; // String
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    season_id?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Favorite: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: number | null; // Int
    story_id?: string | null; // String
    user_id?: string | null; // String
  }
  Follow: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    follow_id?: string | null; // String
    id?: number | null; // Int
    user_id?: string | null; // String
  }
  Mutation: {};
  Page: { // root type
    chapter_id?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    page_body?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Post: { // root type
    content?: string | null; // String
    id?: number | null; // Int
    published?: boolean | null; // Boolean
    title?: string | null; // String
  }
  Query: {};
  Review: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    review_body?: string | null; // String
    review_title?: string | null; // String
    stars?: number | null; // Int
    story_id?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
    user_id?: string | null; // String
  }
  Season: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    season_categories?: Array<string | null> | null; // [String]
    season_image?: string | null; // String
    season_synopsis?: string | null; // String
    season_title?: string | null; // String
    story_id?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Story: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    story_categories?: Array<string | null> | null; // [String]
    story_image?: string | null; // String
    story_synopsis?: string | null; // String
    story_title?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
    user_id?: string | null; // String
  }
  User: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    image?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
    user_deal?: string | null; // String
    user_name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Category: { // field return type
    category_title: string | null; // String
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: number | null; // Int
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
  }
  Chapter: { // field return type
    chapter_image: string | null; // String
    chapter_title: string | null; // String
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    episode: NexusGenRootTypes['Episode'] | null; // Episode
    episode_id: string | null; // String
    id: string | null; // ID
    pages: Array<NexusGenRootTypes['Page'] | null> | null; // [Page]
    publish: boolean | null; // Boolean
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Episode: { // field return type
    chapters: Array<NexusGenRootTypes['Chapter'] | null> | null; // [Chapter]
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    episode_image: string | null; // String
    episode_synopsis: string | null; // String
    episode_title: string | null; // String
    id: string | null; // ID
    publish: boolean | null; // Boolean
    season: NexusGenRootTypes['Season'] | null; // Season
    season_id: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Favorite: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: number | null; // Int
    story: NexusGenRootTypes['Story'] | null; // Story
    story_id: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
  }
  Follow: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    follow_id: string | null; // String
    id: number | null; // Int
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
  }
  Mutation: { // field return type
    createDraft: NexusGenRootTypes['Post'] | null; // Post
    deletePost: NexusGenRootTypes['Post'] | null; // Post
    publish: NexusGenRootTypes['Post'] | null; // Post
    signupUser: NexusGenRootTypes['User'] | null; // User
  }
  Page: { // field return type
    chapter: NexusGenRootTypes['Chapter'] | null; // Chapter
    chapter_id: string | null; // String
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    page_body: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Post: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    content: string | null; // String
    id: number | null; // Int
    published: boolean | null; // Boolean
    title: string | null; // String
  }
  Query: { // field return type
    QueryEpisodeById: NexusGenRootTypes['Episode'] | null; // Episode
    QueryEpisodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    QueryEpisodesCountByPublish: number | null; // Int
    QueryEpisodesCountByUnPublish: number | null; // Int
    QueryMe: NexusGenRootTypes['User'] | null; // User
    QueryMyEpisodeById: NexusGenRootTypes['Episode'] | null; // Episode
    QueryMyEpisodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    QueryMySeasonById: NexusGenRootTypes['Season'] | null; // Season
    QueryMySeasons: Array<NexusGenRootTypes['Season'] | null> | null; // [Season]
    QueryMyStories: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    QueryMyStoryById: NexusGenRootTypes['Story'] | null; // Story
    QueryPageReviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    QuerySeasonById: NexusGenRootTypes['Season'] | null; // Season
    QuerySeasons: Array<NexusGenRootTypes['Season'] | null> | null; // [Season]
    QuerySeasonsCountByPublish: number | null; // Int
    QuerySeasonsCountByUnPublish: number | null; // Int
    QueryStories: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    QueryStoriesCountByPublish: number | null; // Int
    QueryStoriesCountByUnPublish: number | null; // Int
    QueryStoryById: NexusGenRootTypes['Story'] | null; // Story
    QueryUserById: NexusGenRootTypes['User'] | null; // User
    QueryUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    categories: Array<NexusGenRootTypes['Category'] | null> | null; // [Category]
    drafts: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    filterFavoritesByStoryId: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    filterFavoritesByUserId: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    filterFollowsByFollowId: Array<NexusGenRootTypes['Follow'] | null> | null; // [Follow]
    filterFollowsByUserId: Array<NexusGenRootTypes['Follow'] | null> | null; // [Follow]
    filterPosts: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    filterReviewsByStoryId: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    filterReviewsByUserId: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    filterStoriesByUserId: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    post: NexusGenRootTypes['Post'] | null; // Post
    reviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
  }
  Review: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    publish: boolean | null; // Boolean
    review_body: string | null; // String
    review_title: string | null; // String
    stars: number | null; // Int
    story: NexusGenRootTypes['Story'] | null; // Story
    story_id: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
  }
  Season: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    episodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    id: string | null; // ID
    publish: boolean | null; // Boolean
    season_categories: Array<string | null> | null; // [String]
    season_image: string | null; // String
    season_synopsis: string | null; // String
    season_title: string | null; // String
    story: NexusGenRootTypes['Story'] | null; // Story
    story_id: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Story: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    favorites: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    id: string | null; // ID
    publish: boolean | null; // Boolean
    reviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    seasons: Array<NexusGenRootTypes['Season'] | null> | null; // [Season]
    story_categories: Array<string | null> | null; // [String]
    story_image: string | null; // String
    story_synopsis: string | null; // String
    story_title: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
  }
  User: { // field return type
    categories: Array<NexusGenRootTypes['Category'] | null> | null; // [Category]
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    favorites: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    follows: Array<NexusGenRootTypes['Follow'] | null> | null; // [Follow]
    id: string | null; // ID
    image: string | null; // String
    reviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    stories: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
    user_deal: string | null; // String
    user_name: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Category: { // field return type name
    category_title: 'String'
    created_at: 'DateTime'
    id: 'Int'
    user: 'User'
    user_id: 'String'
  }
  Chapter: { // field return type name
    chapter_image: 'String'
    chapter_title: 'String'
    created_at: 'DateTime'
    episode: 'Episode'
    episode_id: 'String'
    id: 'ID'
    pages: 'Page'
    publish: 'Boolean'
    updated_at: 'DateTime'
  }
  Episode: { // field return type name
    chapters: 'Chapter'
    created_at: 'DateTime'
    episode_image: 'String'
    episode_synopsis: 'String'
    episode_title: 'String'
    id: 'ID'
    publish: 'Boolean'
    season: 'Season'
    season_id: 'String'
    updated_at: 'DateTime'
  }
  Favorite: { // field return type name
    created_at: 'DateTime'
    id: 'Int'
    story: 'Story'
    story_id: 'String'
    user: 'User'
    user_id: 'String'
  }
  Follow: { // field return type name
    created_at: 'DateTime'
    follow_id: 'String'
    id: 'Int'
    user: 'User'
    user_id: 'String'
  }
  Mutation: { // field return type name
    createDraft: 'Post'
    deletePost: 'Post'
    publish: 'Post'
    signupUser: 'User'
  }
  Page: { // field return type name
    chapter: 'Chapter'
    chapter_id: 'String'
    created_at: 'DateTime'
    id: 'ID'
    page_body: 'String'
    updated_at: 'DateTime'
  }
  Post: { // field return type name
    author: 'User'
    content: 'String'
    id: 'Int'
    published: 'Boolean'
    title: 'String'
  }
  Query: { // field return type name
    QueryEpisodeById: 'Episode'
    QueryEpisodes: 'Episode'
    QueryEpisodesCountByPublish: 'Int'
    QueryEpisodesCountByUnPublish: 'Int'
    QueryMe: 'User'
    QueryMyEpisodeById: 'Episode'
    QueryMyEpisodes: 'Episode'
    QueryMySeasonById: 'Season'
    QueryMySeasons: 'Season'
    QueryMyStories: 'Story'
    QueryMyStoryById: 'Story'
    QueryPageReviews: 'Review'
    QuerySeasonById: 'Season'
    QuerySeasons: 'Season'
    QuerySeasonsCountByPublish: 'Int'
    QuerySeasonsCountByUnPublish: 'Int'
    QueryStories: 'Story'
    QueryStoriesCountByPublish: 'Int'
    QueryStoriesCountByUnPublish: 'Int'
    QueryStoryById: 'Story'
    QueryUserById: 'User'
    QueryUsers: 'User'
    categories: 'Category'
    drafts: 'Post'
    filterFavoritesByStoryId: 'Favorite'
    filterFavoritesByUserId: 'Favorite'
    filterFollowsByFollowId: 'Follow'
    filterFollowsByUserId: 'Follow'
    filterPosts: 'Post'
    filterReviewsByStoryId: 'Review'
    filterReviewsByUserId: 'Review'
    filterStoriesByUserId: 'Story'
    post: 'Post'
    reviews: 'Review'
  }
  Review: { // field return type name
    created_at: 'DateTime'
    id: 'ID'
    publish: 'Boolean'
    review_body: 'String'
    review_title: 'String'
    stars: 'Int'
    story: 'Story'
    story_id: 'String'
    updated_at: 'DateTime'
    user: 'User'
    user_id: 'String'
  }
  Season: { // field return type name
    created_at: 'DateTime'
    episodes: 'Episode'
    id: 'ID'
    publish: 'Boolean'
    season_categories: 'String'
    season_image: 'String'
    season_synopsis: 'String'
    season_title: 'String'
    story: 'Story'
    story_id: 'String'
    updated_at: 'DateTime'
  }
  Story: { // field return type name
    created_at: 'DateTime'
    favorites: 'Favorite'
    id: 'ID'
    publish: 'Boolean'
    reviews: 'Review'
    seasons: 'Season'
    story_categories: 'String'
    story_image: 'String'
    story_synopsis: 'String'
    story_title: 'String'
    updated_at: 'DateTime'
    user: 'User'
    user_id: 'String'
  }
  User: { // field return type name
    categories: 'Category'
    created_at: 'DateTime'
    favorites: 'Favorite'
    follows: 'Follow'
    id: 'ID'
    image: 'String'
    reviews: 'Review'
    stories: 'Story'
    updated_at: 'DateTime'
    user_deal: 'String'
    user_name: 'String'
  }
}

export interface NexusGenArgTypes {
  Chapter: {
    pages: { // args
      pageAccessToken?: string | null; // String
      pagePage: number; // Int!
      pagePageSize: number; // Int!
      pageUserId?: string | null; // String
    }
  }
  Episode: {
    chapters: { // args
      chapterAccessToken?: string | null; // String
      chapterPage: number; // Int!
      chapterPageSize: number; // Int!
      chapterUserId?: string | null; // String
    }
  }
  Mutation: {
    createDraft: { // args
      authorEmail?: string | null; // String
      content?: string | null; // String
      title: string; // String!
    }
    deletePost: { // args
      postId?: string | null; // String
    }
    publish: { // args
      postId?: string | null; // String
    }
    signupUser: { // args
      email: string; // String!
      user_name?: string | null; // String
    }
  }
  Query: {
    QueryEpisodeById: { // args
      id: string; // String!
    }
    QueryEpisodes: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
    }
    QueryMe: { // args
      accessToken: string; // String!
    }
    QueryMyEpisodeById: { // args
      accessToken: string; // String!
      id: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      userId: string; // String!
    }
    QueryMyEpisodes: { // args
      accessToken: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
      userId: string; // String!
    }
    QueryMySeasonById: { // args
      accessToken: string; // String!
      id: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      userId: string; // String!
    }
    QueryMySeasons: { // args
      accessToken: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
      userId: string; // String!
    }
    QueryMyStories: { // args
      accessToken: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
      userId: string; // String!
    }
    QueryMyStoryById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryPageReviews: { // args
      page: string | null; // String
    }
    QuerySeasonById: { // args
      id: string; // String!
    }
    QuerySeasons: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
    }
    QueryStories: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
    }
    QueryStoryById: { // args
      id: string; // String!
    }
    QueryUserById: { // args
      id: string; // String!
    }
    QueryUsers: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchUserName?: string | null; // String
    }
    filterFavoritesByStoryId: { // args
      storyId: string; // String!
    }
    filterFavoritesByUserId: { // args
      userId: string; // String!
    }
    filterFollowsByFollowId: { // args
      followId: string; // String!
    }
    filterFollowsByUserId: { // args
      userId: string; // String!
    }
    filterPosts: { // args
      searchString?: string | null; // String
    }
    filterReviewsByStoryId: { // args
      storyId: string; // String!
    }
    filterReviewsByUserId: { // args
      userId: string; // String!
    }
    filterStoriesByUserId: { // args
      userId: string; // String!
    }
    post: { // args
      postId: string; // String!
    }
  }
  Season: {
    episodes: { // args
      episodeAccessToken?: string | null; // String
      episodePage: number; // Int!
      episodePageSize: number; // Int!
      episodeUserId?: string | null; // String
    }
  }
  Story: {
    seasons: { // args
      seasonAccessToken?: string | null; // String
      seasonPage: number; // Int!
      seasonPageSize: number; // Int!
      seasonUserId?: string | null; // String
    }
  }
  User: {
    reviews: { // args
      reviewAccessToken?: string | null; // String
      reviewPage: number; // Int!
      reviewPageSize: number; // Int!
    }
    stories: { // args
      storyAccessToken?: string | null; // String
      storyPage: number; // Int!
      storyPageSize: number; // Int!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}