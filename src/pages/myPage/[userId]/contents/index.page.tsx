/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import "react-image-crop/dist/ReactCrop.css"

import { XCircleIcon } from "@heroicons/react/solid"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Toaster } from "react-hot-toast"
import { Layout } from "src/components/Layout"
import { useStorage } from "src/hooks/storage/useStorage"
import { supabase } from "src/lib/supabase"
import { isMe } from "src/tools/state"

import { UploadAvatorForm } from "./uploadAvator"
import { UploadEpisodeImageForm } from "./uploadEpisode"
import { UploadSeasonImageForm } from "./uploadSeasonImage"
import { UploadStoryImageForm } from "./uploadStoryImage"

const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const { userId } = useRouter().query
  const {
    handleDeleteImage: handleDeleteStoryImage,
    imageUrls: storyImageUrls,
  } = useStorage(userId as string, "story")
  const {
    handleDeleteImage: handleDeleteSeasonImage,
    imageUrls: seasonImageUrls,
  } = useStorage(userId as string, "season")
  const {
    handleDeleteImage: handleDeleteEpisodeImage,
    imageUrls: episodeImageUrls,
  } = useStorage(userId as string, "episode")

  const accessToken = supabase.auth.session()?.access_token
  const isMeState = useMemo(() => {
    return isMe(`${userId}`, `${accessToken}`)
  }, [accessToken, userId])

  const getAvatorImageUrl = useCallback(() => {
    const { publicURL } = supabase.storage
      .from("management")
      .getPublicUrl(`${userId}/avatar`)
    setAvatarUrl(publicURL as string)
  }, [userId])

  useEffect(() => {
    getAvatorImageUrl()
  }, [userId])

  return (
    <Layout>
      <Toaster position="top-center" />

      {isMeState && (
        <div className="flex flex-col items-center p-8">
          <div className="flex flex-col justify-center items-center mb-8 w-full">
            <h3 className="mb-8 text-2xl font-bold text-purple-500">
              プロフィール画像
            </h3>
            <img
              className="w-[200px] h-[200px] rounded-full"
              src={avatarUrl || "/img/Vector.png"}
              alt=""
            />
            <UploadAvatorForm
              userId={typeof userId === "string" ? userId : undefined}
            />
          </div>
          <div className="flex flex-col justify-center items-center mb-8 w-full">
            <h3 className="mb-8 text-2xl font-bold text-purple-500">
              ストーリー表紙
            </h3>
            <div className="flex overflow-x-scroll gap-8 items-center w-[300px] xs:w-[500px] md:w-[700px]">
              {storyImageUrls.map(url => {
                return (
                  <div className="relative min-w-[210px]" key={url}>
                    <button
                      className="absolute top-1 right-1"
                      onClick={() => {
                        handleDeleteStoryImage(url)
                      }}
                    >
                      <XCircleIcon className="w-8 h-8 text-red-500" />
                    </button>
                    <img
                      key={url}
                      className="w-[210px] h-[297px]"
                      src={url}
                      alt=""
                    />
                  </div>
                )
              })}
            </div>
            {storyImageUrls.length <= 2 && (
              <UploadStoryImageForm
                userId={typeof userId === "string" ? userId : undefined}
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center mb-8 w-full">
            <h3 className="mb-8 text-2xl font-bold text-purple-500">
              シーズン表紙
            </h3>
            <div className="flex overflow-x-scroll gap-8 items-center w-[300px] xs:w-[500px] md:w-[700px]">
              {seasonImageUrls.map(url => {
                return (
                  <div className="relative min-w-[297px]" key={url}>
                    <button
                      className="absolute top-1 right-1"
                      onClick={() => {
                        handleDeleteSeasonImage(url)
                      }}
                    >
                      <XCircleIcon className="w-8 h-8 text-red-500" />
                    </button>
                    <img
                      key={url}
                      className="w-[297px] h-[210px]"
                      src={url}
                      alt=""
                    />
                  </div>
                )
              })}
            </div>
            {seasonImageUrls.length <= 2 && (
              <UploadSeasonImageForm
                userId={typeof userId === "string" ? userId : undefined}
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center mb-8 w-full">
            <h3 className="mb-8 text-2xl font-bold text-purple-500">
              エピソード表紙
            </h3>
            <div className="flex overflow-x-scroll gap-8 items-center w-[300px] xs:w-[500px] md:w-[700px]">
              {episodeImageUrls.map(url => {
                return (
                  <div className="relative min-w-[297px]" key={url}>
                    <button
                      className="absolute top-1 right-1"
                      onClick={() => {
                        handleDeleteEpisodeImage(url)
                      }}
                    >
                      <XCircleIcon className="w-8 h-8 text-red-500" />
                    </button>
                    <img
                      key={url}
                      className="w-[297px] h-[210px]"
                      src={url}
                      alt=""
                    />
                  </div>
                )
              })}
            </div>
            {episodeImageUrls.length <= 2 && (
              <UploadEpisodeImageForm
                userId={typeof userId === "string" ? userId : undefined}
              />
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default memo(ProfilePage)
