import type { User } from "@supabase/supabase-js"

export type GoogleUserMetadata = {
  avatar_url: string
  email: string
  email_verified: true
  full_name: string
  iss: string
  name: string
  picture: string
  provider_id: string
  sub: string
}

export type GoogleAccount = User & {
  user_metadata?: GoogleUserMetadata
}
