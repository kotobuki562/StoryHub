/* eslint-disable @typescript-eslint/naming-convention */
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

export type QueryStories = {
  QueryStories: NexusGenFieldTypes["Story"][]
}

export type QueryStoryById = {
  QueryStoryById: NexusGenFieldTypes["Story"]
}