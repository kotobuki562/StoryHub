/* eslint-disable @typescript-eslint/naming-convention */
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

export interface QueryReviewsByStoryId {
  QueryReviewsByStoryId: NexusGenFieldTypes["Review"][]
}

export type QueryReviews = {
  QueryReviews: NexusGenFieldTypes["Review"][]
}

export type QueryReviewsCount = {
  QueryReviewsCount: number
}
