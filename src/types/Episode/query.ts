/* eslint-disable @typescript-eslint/naming-convention */
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

export type QueryStories = {
  QueryStories: NexusGenFieldTypes["Episode"][]
}

export type QueryMyStories = {
  QueryMyStories: NexusGenFieldTypes["Episode"][]
}

export type QueryEpisodeById = {
  QueryEpisodeById: NexusGenFieldTypes["Episode"]
}

export type QueryMyEpisodeById = {
  QueryMyEpisodeById: NexusGenFieldTypes["Episode"]
}
