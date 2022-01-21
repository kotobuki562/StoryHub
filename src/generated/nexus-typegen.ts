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
  Chapter: { // root type
    chapter_image?: string | null; // String
    chapter_title?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    episode_id?: string | null; // String
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Character: { // root type
    character_category?: string | null; // String
    character_deal?: string | null; // String
    character_image?: string | null; // String
    character_name?: string | null; // String
    character_sex?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    isSpoiler?: boolean | null; // Boolean
    publish?: boolean | null; // Boolean
    season_id?: string | null; // String
    setting_material_id?: string | null; // String
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
  Object: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    isSpoiler?: boolean | null; // Boolean
    object_deal?: string | null; // String
    object_image?: string | null; // String
    object_name?: string | null; // String
    publish?: boolean | null; // Boolean
    season_id?: string | null; // String
    setting_material_id?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Page: { // root type
    chapter_id?: string | null; // String
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    page_body?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
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
  SettingMaterial: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    publish?: boolean | null; // Boolean
    setting_material_deal?: string | null; // String
    setting_material_image?: string | null; // String
    setting_material_title?: string | null; // String
    story_id?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
    user_id?: string | null; // String
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
    viewing_restriction?: string | null; // String
  }
  Terminology: { // root type
    created_at?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // ID
    isSpoiler?: boolean | null; // Boolean
    publish?: boolean | null; // Boolean
    season_id?: string | null; // String
    setting_material_id?: string | null; // String
    terminology_deal?: string | null; // String
    terminology_name?: string | null; // String
    updated_at?: NexusGenScalars['DateTime'] | null; // DateTime
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
  Character: { // field return type
    character_category: string | null; // String
    character_deal: string | null; // String
    character_image: string | null; // String
    character_name: string | null; // String
    character_sex: string | null; // String
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    isSpoiler: boolean | null; // Boolean
    publish: boolean | null; // Boolean
    season: NexusGenRootTypes['Season'] | null; // Season
    season_id: string | null; // String
    settingMaterial: NexusGenRootTypes['SettingMaterial'] | null; // SettingMaterial
    setting_material_id: string | null; // String
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
    createStory: NexusGenRootTypes['Story'] | null; // Story
    createUser: NexusGenRootTypes['User'] | null; // User
    deleteStory: NexusGenRootTypes['Story'] | null; // Story
    deleteUser: NexusGenRootTypes['User'] | null; // User
    signupUser: NexusGenRootTypes['User'] | null; // User
    updateStory: NexusGenRootTypes['Story'] | null; // Story
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  Object: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    isSpoiler: boolean | null; // Boolean
    object_deal: string | null; // String
    object_image: string | null; // String
    object_name: string | null; // String
    publish: boolean | null; // Boolean
    season: NexusGenRootTypes['Season'] | null; // Season
    season_id: string | null; // String
    settingMaterial: NexusGenRootTypes['SettingMaterial'] | null; // SettingMaterial
    setting_material_id: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Page: { // field return type
    chapter: NexusGenRootTypes['Chapter'] | null; // Chapter
    chapter_id: string | null; // String
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    page_body: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Query: { // field return type
    QueryChapterById: NexusGenRootTypes['Chapter'] | null; // Chapter
    QueryChapters: Array<NexusGenRootTypes['Chapter'] | null> | null; // [Chapter]
    QueryChaptersCountByPublish: number | null; // Int
    QueryChaptersCountByUnPublish: number | null; // Int
    QueryCharacterById: NexusGenRootTypes['Character'] | null; // Character
    QueryCharacters: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    QueryCharactersCountByPublish: number | null; // Int
    QueryCharactersCountByUnPublish: number | null; // Int
    QueryEpisodeById: NexusGenRootTypes['Episode'] | null; // Episode
    QueryEpisodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    QueryEpisodesCountByPublish: number | null; // Int
    QueryEpisodesCountByUnPublish: number | null; // Int
    QueryFavoritesByStory: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    QueryFavoritesByUser: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    QueryFollowers: Array<NexusGenRootTypes['Follow'] | null> | null; // [Follow]
    QueryFollowing: Array<NexusGenRootTypes['Follow'] | null> | null; // [Follow]
    QueryMe: NexusGenRootTypes['User'] | null; // User
    QueryMyChapterById: NexusGenRootTypes['Chapter'] | null; // Chapter
    QueryMyChapters: Array<NexusGenRootTypes['Chapter'] | null> | null; // [Chapter]
    QueryMyCharacterById: NexusGenRootTypes['Character'] | null; // Character
    QueryMyCharacters: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    QueryMyEpisodeById: NexusGenRootTypes['Episode'] | null; // Episode
    QueryMyEpisodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    QueryMyFavoritesByStory: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    QueryMyFavoritesByUser: Array<NexusGenRootTypes['Favorite'] | null> | null; // [Favorite]
    QueryMyObjectById: NexusGenRootTypes['Object'] | null; // Object
    QueryMyObjects: Array<NexusGenRootTypes['Object'] | null> | null; // [Object]
    QueryMyReviewById: NexusGenRootTypes['Review'] | null; // Review
    QueryMyReviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    QueryMySeasonById: NexusGenRootTypes['Season'] | null; // Season
    QueryMySeasons: Array<NexusGenRootTypes['Season'] | null> | null; // [Season]
    QueryMySettingMaterialById: NexusGenRootTypes['SettingMaterial'] | null; // SettingMaterial
    QueryMySettingMaterials: Array<NexusGenRootTypes['SettingMaterial'] | null> | null; // [SettingMaterial]
    QueryMyStories: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    QueryMyStoryById: NexusGenRootTypes['Story'] | null; // Story
    QueryMyTerminologies: Array<NexusGenRootTypes['Terminology'] | null> | null; // [Terminology]
    QueryMyTerminologyById: NexusGenRootTypes['Terminology'] | null; // Terminology
    QueryObjectById: NexusGenRootTypes['Object'] | null; // Object
    QueryObjects: Array<NexusGenRootTypes['Object'] | null> | null; // [Object]
    QueryObjectsCountByPublish: number | null; // Int
    QueryObjectsCountByUnPublish: number | null; // Int
    QueryPage: NexusGenRootTypes['Page'] | null; // Page
    QueryPageCountByChapterId: number | null; // Int
    QueryPages: Array<NexusGenRootTypes['Page'] | null> | null; // [Page]
    QueryPublishReviewsCount: number | null; // Int
    QueryReviewById: NexusGenRootTypes['Review'] | null; // Review
    QueryReviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    QuerySeasonById: NexusGenRootTypes['Season'] | null; // Season
    QuerySeasons: Array<NexusGenRootTypes['Season'] | null> | null; // [Season]
    QuerySeasonsCountByPublish: number | null; // Int
    QuerySeasonsCountByUnPublish: number | null; // Int
    QuerySettingMaterialById: NexusGenRootTypes['SettingMaterial'] | null; // SettingMaterial
    QuerySettingMaterials: Array<NexusGenRootTypes['SettingMaterial'] | null> | null; // [SettingMaterial]
    QuerySettingMaterialsCountByPublish: number | null; // Int
    QuerySettingMaterialsCountByUnPublish: number | null; // Int
    QueryStories: Array<NexusGenRootTypes['Story'] | null> | null; // [Story]
    QueryStoriesCountByPublish: number | null; // Int
    QueryStoriesCountByUnPublish: number | null; // Int
    QueryStoryById: NexusGenRootTypes['Story'] | null; // Story
    QueryTerminologies: Array<NexusGenRootTypes['Terminology'] | null> | null; // [Terminology]
    QueryTerminologiesCountByPublish: number | null; // Int
    QueryTerminologiesCountByUnPublish: number | null; // Int
    QueryTerminologyById: NexusGenRootTypes['Terminology'] | null; // Terminology
    QueryUnPublishReviewsCount: number | null; // Int
    QueryUserById: NexusGenRootTypes['User'] | null; // User
    QueryUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
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
    characters: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    episodes: Array<NexusGenRootTypes['Episode'] | null> | null; // [Episode]
    id: string | null; // ID
    objects: Array<NexusGenRootTypes['Object'] | null> | null; // [Object]
    publish: boolean | null; // Boolean
    season_categories: Array<string | null> | null; // [String]
    season_image: string | null; // String
    season_synopsis: string | null; // String
    season_title: string | null; // String
    story: NexusGenRootTypes['Story'] | null; // Story
    story_id: string | null; // String
    terminologies: Array<NexusGenRootTypes['Terminology'] | null> | null; // [Terminology]
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  SettingMaterial: { // field return type
    character: Array<NexusGenRootTypes['Character'] | null> | null; // [Character]
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    object: Array<NexusGenRootTypes['Object'] | null> | null; // [Object]
    publish: boolean | null; // Boolean
    setting_material_deal: string | null; // String
    setting_material_image: string | null; // String
    setting_material_title: string | null; // String
    story: NexusGenRootTypes['Story'] | null; // Story
    story_id: string | null; // String
    terminology: Array<NexusGenRootTypes['Terminology'] | null> | null; // [Terminology]
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string | null; // String
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
    viewing_restriction: string | null; // String
  }
  Terminology: { // field return type
    created_at: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // ID
    isSpoiler: boolean | null; // Boolean
    publish: boolean | null; // Boolean
    season: NexusGenRootTypes['Season'] | null; // Season
    season_id: string | null; // String
    settingMaterial: NexusGenRootTypes['SettingMaterial'] | null; // SettingMaterial
    setting_material_id: string | null; // String
    terminology_deal: string | null; // String
    terminology_name: string | null; // String
    updated_at: NexusGenScalars['DateTime'] | null; // DateTime
  }
  User: { // field return type
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
  Character: { // field return type name
    character_category: 'String'
    character_deal: 'String'
    character_image: 'String'
    character_name: 'String'
    character_sex: 'String'
    created_at: 'DateTime'
    id: 'ID'
    isSpoiler: 'Boolean'
    publish: 'Boolean'
    season: 'Season'
    season_id: 'String'
    settingMaterial: 'SettingMaterial'
    setting_material_id: 'String'
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
    createStory: 'Story'
    createUser: 'User'
    deleteStory: 'Story'
    deleteUser: 'User'
    signupUser: 'User'
    updateStory: 'Story'
    updateUser: 'User'
  }
  Object: { // field return type name
    created_at: 'DateTime'
    id: 'ID'
    isSpoiler: 'Boolean'
    object_deal: 'String'
    object_image: 'String'
    object_name: 'String'
    publish: 'Boolean'
    season: 'Season'
    season_id: 'String'
    settingMaterial: 'SettingMaterial'
    setting_material_id: 'String'
    updated_at: 'DateTime'
  }
  Page: { // field return type name
    chapter: 'Chapter'
    chapter_id: 'String'
    created_at: 'DateTime'
    id: 'ID'
    page_body: 'String'
    updated_at: 'DateTime'
  }
  Query: { // field return type name
    QueryChapterById: 'Chapter'
    QueryChapters: 'Chapter'
    QueryChaptersCountByPublish: 'Int'
    QueryChaptersCountByUnPublish: 'Int'
    QueryCharacterById: 'Character'
    QueryCharacters: 'Character'
    QueryCharactersCountByPublish: 'Int'
    QueryCharactersCountByUnPublish: 'Int'
    QueryEpisodeById: 'Episode'
    QueryEpisodes: 'Episode'
    QueryEpisodesCountByPublish: 'Int'
    QueryEpisodesCountByUnPublish: 'Int'
    QueryFavoritesByStory: 'Favorite'
    QueryFavoritesByUser: 'Favorite'
    QueryFollowers: 'Follow'
    QueryFollowing: 'Follow'
    QueryMe: 'User'
    QueryMyChapterById: 'Chapter'
    QueryMyChapters: 'Chapter'
    QueryMyCharacterById: 'Character'
    QueryMyCharacters: 'Character'
    QueryMyEpisodeById: 'Episode'
    QueryMyEpisodes: 'Episode'
    QueryMyFavoritesByStory: 'Favorite'
    QueryMyFavoritesByUser: 'Favorite'
    QueryMyObjectById: 'Object'
    QueryMyObjects: 'Object'
    QueryMyReviewById: 'Review'
    QueryMyReviews: 'Review'
    QueryMySeasonById: 'Season'
    QueryMySeasons: 'Season'
    QueryMySettingMaterialById: 'SettingMaterial'
    QueryMySettingMaterials: 'SettingMaterial'
    QueryMyStories: 'Story'
    QueryMyStoryById: 'Story'
    QueryMyTerminologies: 'Terminology'
    QueryMyTerminologyById: 'Terminology'
    QueryObjectById: 'Object'
    QueryObjects: 'Object'
    QueryObjectsCountByPublish: 'Int'
    QueryObjectsCountByUnPublish: 'Int'
    QueryPage: 'Page'
    QueryPageCountByChapterId: 'Int'
    QueryPages: 'Page'
    QueryPublishReviewsCount: 'Int'
    QueryReviewById: 'Review'
    QueryReviews: 'Review'
    QuerySeasonById: 'Season'
    QuerySeasons: 'Season'
    QuerySeasonsCountByPublish: 'Int'
    QuerySeasonsCountByUnPublish: 'Int'
    QuerySettingMaterialById: 'SettingMaterial'
    QuerySettingMaterials: 'SettingMaterial'
    QuerySettingMaterialsCountByPublish: 'Int'
    QuerySettingMaterialsCountByUnPublish: 'Int'
    QueryStories: 'Story'
    QueryStoriesCountByPublish: 'Int'
    QueryStoriesCountByUnPublish: 'Int'
    QueryStoryById: 'Story'
    QueryTerminologies: 'Terminology'
    QueryTerminologiesCountByPublish: 'Int'
    QueryTerminologiesCountByUnPublish: 'Int'
    QueryTerminologyById: 'Terminology'
    QueryUnPublishReviewsCount: 'Int'
    QueryUserById: 'User'
    QueryUsers: 'User'
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
    characters: 'Character'
    created_at: 'DateTime'
    episodes: 'Episode'
    id: 'ID'
    objects: 'Object'
    publish: 'Boolean'
    season_categories: 'String'
    season_image: 'String'
    season_synopsis: 'String'
    season_title: 'String'
    story: 'Story'
    story_id: 'String'
    terminologies: 'Terminology'
    updated_at: 'DateTime'
  }
  SettingMaterial: { // field return type name
    character: 'Character'
    created_at: 'DateTime'
    id: 'ID'
    object: 'Object'
    publish: 'Boolean'
    setting_material_deal: 'String'
    setting_material_image: 'String'
    setting_material_title: 'String'
    story: 'Story'
    story_id: 'String'
    terminology: 'Terminology'
    updated_at: 'DateTime'
    user: 'User'
    user_id: 'String'
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
    viewing_restriction: 'String'
  }
  Terminology: { // field return type name
    created_at: 'DateTime'
    id: 'ID'
    isSpoiler: 'Boolean'
    publish: 'Boolean'
    season: 'Season'
    season_id: 'String'
    settingMaterial: 'SettingMaterial'
    setting_material_id: 'String'
    terminology_deal: 'String'
    terminology_name: 'String'
    updated_at: 'DateTime'
  }
  User: { // field return type name
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
      pageUserId?: string | null; // String
    }
  }
  Episode: {
    chapters: { // args
      chapterAccessToken?: string | null; // String
      chapterUserId?: string | null; // String
    }
  }
  Mutation: {
    createStory: { // args
      acessToken: string; // String!
      publish: boolean; // Boolean!
      storyCategories: string[]; // [String!]!
      storyImage?: string | null; // String
      storySynopsis?: string | null; // String
      storyTitle: string; // String!
      viewingRestriction?: string | null; // String
    }
    createUser: { // args
      accessToken: string; // String!
      image?: string | null; // String
      userDeal: string; // String!
      userName: string; // String!
    }
    deleteStory: { // args
      storyId: string; // String!
    }
    deleteUser: { // args
      accessToken: string; // String!
    }
    signupUser: { // args
      email: string; // String!
      password: string; // String!
      userName?: string | null; // String
    }
    updateStory: { // args
      publish: boolean; // Boolean!
      storyCategories: string[]; // [String!]!
      storyId: string; // String!
      storyImage?: string | null; // String
      storySynopsis?: string | null; // String
      storyTitle: string; // String!
      viewingRestriction?: string | null; // String
    }
    updateUser: { // args
      accessToken: string; // String!
      image?: string | null; // String
      userDeal: string; // String!
      userName: string; // String!
    }
  }
  Query: {
    QueryChapterById: { // args
      id: string; // String!
    }
    QueryChapters: { // args
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
    }
    QueryCharacterById: { // args
      id: string; // String!
    }
    QueryCharacters: { // args
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
    }
    QueryEpisodeById: { // args
      id: string; // String!
    }
    QueryEpisodes: { // args
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
    }
    QueryFavoritesByStory: { // args
      storyId: string; // String!
    }
    QueryFavoritesByUser: { // args
      userId: string; // String!
    }
    QueryFollowers: { // args
      accessToken: string; // String!
    }
    QueryFollowing: { // args
      accessToken: string; // String!
    }
    QueryMe: { // args
      accessToken: string; // String!
    }
    QueryMyChapterById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMyChapters: { // args
      accessToken: string; // String!
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
      userId: string; // String!
    }
    QueryMyCharacterById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMyCharacters: { // args
      accessToken: string; // String!
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
      userId: string; // String!
    }
    QueryMyEpisodeById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMyEpisodes: { // args
      accessToken: string; // String!
      searchTitle?: string | null; // String
      serchSeasonId?: string | null; // String
      userId: string; // String!
    }
    QueryMyFavoritesByStory: { // args
      accessToken: string; // String!
      storyId: string; // String!
    }
    QueryMyFavoritesByUser: { // args
      accessToken: string; // String!
    }
    QueryMyObjectById: { // args
      accessToken: string; // String!
      objectId: string; // String!
      userId: string; // String!
    }
    QueryMyObjects: { // args
      accessToken: string; // String!
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
      userId: string; // String!
    }
    QueryMyReviewById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMyReviews: { // args
      accessToken: string; // String!
      searchTitle?: string | null; // String
      serchUserId?: string | null; // String
    }
    QueryMySeasonById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMySeasons: { // args
      accessToken: string; // String!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
      userId: string; // String!
    }
    QueryMySettingMaterialById: { // args
      accessToken: string; // String!
      id: string; // String!
      userId: string; // String!
    }
    QueryMySettingMaterials: { // args
      accessToken: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
      serchStoryId?: string | null; // String
    }
    QueryMyStories: { // args
      accessToken: string; // String!
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
    QueryMyTerminologies: { // args
      accessToken: string; // String!
      page: number; // Int!
      pageSize: number; // Int!
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
      userId: string; // String!
    }
    QueryMyTerminologyById: { // args
      accessToken: string; // String!
      terminologyId: string; // String!
      userId: string; // String!
    }
    QueryObjectById: { // args
      objectId: string; // String!
    }
    QueryObjects: { // args
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
    }
    QueryPage: { // args
      id: string; // String!
    }
    QueryPageCountByChapterId: { // args
      chapterId: string; // String!
    }
    QueryPages: { // args
      serchSeasonId?: string | null; // String
    }
    QueryReviewById: { // args
      id: string; // String!
    }
    QueryReviews: { // args
      searchTitle?: string | null; // String
      serchUserId?: string | null; // String
    }
    QuerySeasonById: { // args
      id: string; // String!
    }
    QuerySeasons: { // args
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
    }
    QuerySettingMaterialById: { // args
      id: string; // String!
    }
    QuerySettingMaterials: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchCategory?: string | null; // String
      searchTitle?: string | null; // String
      searchUserId?: string | null; // String
      serchStoryId?: string | null; // String
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
    QueryTerminologies: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchTitle?: string | null; // String
      serchSettingMaterialId?: string | null; // String
    }
    QueryTerminologyById: { // args
      terminologyId: string; // String!
    }
    QueryUserById: { // args
      id: string; // String!
    }
    QueryUsers: { // args
      page: number; // Int!
      pageSize: number; // Int!
      searchUserName?: string | null; // String
    }
  }
  Season: {
    characters: { // args
      characterAccessToken?: string | null; // String
      characterUserId?: string | null; // String
    }
    episodes: { // args
      episodeAccessToken?: string | null; // String
      episodeUserId?: string | null; // String
    }
    objects: { // args
      objectAccessToken?: string | null; // String
      objectUserId?: string | null; // String
    }
    terminologies: { // args
      terminologyAccessToken?: string | null; // String
      terminologyUserId?: string | null; // String
    }
  }
  SettingMaterial: {
    character: { // args
      storyAccessToken?: string | null; // String
    }
    object: { // args
      reviewAccessToken?: string | null; // String
    }
    story: { // args
      storyAccessToken?: string | null; // String
    }
    terminology: { // args
      terminologyAccessToken?: string | null; // String
    }
  }
  Story: {
    seasons: { // args
      seasonAccessToken?: string | null; // String
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