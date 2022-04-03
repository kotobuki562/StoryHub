/* eslint-disable @typescript-eslint/naming-convention */
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

export type QueryEpisodes = {
  QueryStories: NexusGenFieldTypes["Episode"][]
}

export type QueryMyEpisodes = {
  QueryMyStories: NexusGenFieldTypes["Episode"][]
}

export type QueryEpisodeById = {
  QueryEpisodeById: NexusGenFieldTypes["Episode"]
}

export type QueryMyEpisodeById = {
  QueryMyEpisodeById: NexusGenFieldTypes["Episode"]
}
