/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import "react-image-crop/dist/ReactCrop.css"

import type { FileObject } from "@supabase/storage-js"
import { useRouter } from "next/router"
import type { Dispatch, SetStateAction } from "react"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Layout } from "src/components/Layout"
import { supabase } from "src/lib/supabase"
import { isMe } from "src/tools/state"

import { UploadAvatorForm } from "./uploadAvator"
import { UploadStoryImageForm } from "./uploadStoryImage"

const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [storyFolder, setStoryFolder] = useState<FileObject[] | null>(null)
  const [storyImageUrls, setStoryImageUrls] = useState<string[]>([])
  const { userId } = useRouter().query
  const accessToken = supabase.auth.session()?.access_token
  const isMeState = useMemo(
    () => isMe(`${userId}`, `${accessToken}`),
    [accessToken, userId]
  )

  const getFolder = async ({
    list,
    setFolder,
  }: {
    list: string
    setFolder: Dispatch<SetStateAction<FileObject[] | null>>
  }) => {
    const { data, error } = await supabase.storage
      .from("management")
      .list(list, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      })
    if (error) {
      toast.custom(t => (
        <Alert
          t={t}
          title="エラーが発生しました"
          usage="error"
          message={error.message}
        />
      ))
    }
    setFolder(data)
  }

  const getAvatorImageUrl = useCallback(() => {
    const { publicURL } = supabase.storage
      .from("management")
      .getPublicUrl(`${userId}/avatar`)
    setAvatarUrl(publicURL as string)
  }, [userId])

  const getStoryImageUrls = useCallback(
    (folder: FileObject[]) => {
      const folderData = folder.map(file => {
        const { publicURL } = supabase.storage
          .from("management")
          .getPublicUrl(`${userId}/story/${file.name}`)
        return publicURL
      })
      setStoryImageUrls(folderData as string[])
    },
    [userId]
  )

  useEffect(() => {
    getAvatorImageUrl()
    getFolder({
      list: typeof userId === "string" ? `${userId}/story` : "",
      setFolder: setStoryFolder,
    })
  }, [userId])

  useEffect(() => {
    if (storyFolder) {
      getStoryImageUrls(storyFolder)
    }
  }, [storyFolder])

  return (
    <Layout>
      <Toaster position="top-center" />

      {isMeState && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-center items-center w-full">
            <img
              className="w-[200px] h-[200px] rounded-full"
              src={avatarUrl || "/img/Vector.png"}
              alt=""
            />
            <UploadAvatorForm
              userId={typeof userId === "string" ? userId : undefined}
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex overflow-x-scroll gap-8 items-center max-w-[500px] sm:w-[700px]">
              {storyImageUrls.map(url => (
                <img
                  key={url}
                  className="w-[210px] h-[297px]"
                  src={url}
                  alt=""
                />
              ))}
            </div>

            <UploadStoryImageForm
              userId={typeof userId === "string" ? userId : undefined}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default memo(ProfilePage)
