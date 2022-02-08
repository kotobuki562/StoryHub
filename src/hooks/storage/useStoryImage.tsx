import type { FileObject } from "@supabase/storage-js"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { supabase } from "src/lib/supabase"

export const useStoryImage = (userId: string) => {
  const [storyFolder, setStoryFolder] = useState<FileObject[] | null>(null)
  const [storyImageUrls, setStoryImageUrls] = useState<string[]>([])

  const getFolder = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from("management")
      .list(`${userId}/story`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      })
    if (error) {
      toast.custom(t => {
        return (
          <Alert
            t={t}
            title="エラーが発生しました"
            usage="error"
            message={error.message}
          />
        )
      })
    }
    setStoryFolder(data)
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

  const handleDeleteStoryImage = useCallback(
    async (url: string) => {
      const urlWithoutPublic = url.replace(
        `https://phwmepkoueewrufhxbnu.supabase.co/storage/v1/object/public/management/${userId}/story/`,
        ""
      )

      const { data, error } = await supabase.storage
        .from("management")
        .remove([`${userId}/story/${urlWithoutPublic}`])
      if (error) {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              title="エラーが発生しました"
              usage="error"
              message={error.message}
            />
          )
        })
      }
      if (data) {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              title="削除しました"
              usage="success"
              message="ストーリーの表紙を削除しました"
            />
          )
        })
        setStoryImageUrls(pre => {
          const newUrls = pre.filter(url => {
            return (
              url !==
              `https://phwmepkoueewrufhxbnu.supabase.co/storage/v1/object/public/management/${userId}/story/${urlWithoutPublic}`
            )
          })
          return newUrls
        })
      }
    },
    [userId]
  )

  useEffect(() => {
    getFolder()
  }, [getFolder, userId])

  useEffect(() => {
    if (storyFolder) {
      getStoryImageUrls(storyFolder)
    }
  }, [getStoryImageUrls, storyFolder])

  return {
    storyFolder,
    storyImageUrls,
    handleDeleteStoryImage,
  }
}
