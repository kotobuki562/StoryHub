import type { FileObject } from "@supabase/storage-js"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { supabase } from "src/lib/supabase"

export const useStorage = (userId: string, path: string) => {
  const [folder, setFolder] = useState<FileObject[] | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const getFolder = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from("management")
      .list(`${userId}/${path}`, {
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
  }, [path, userId])

  const getImageUrls = useCallback(
    (folder: FileObject[]) => {
      const folderData = folder.map(file => {
        const { publicURL } = supabase.storage
          .from("management")
          .getPublicUrl(`${userId}/${path}/${file.name}`)
        return publicURL
      })
      setImageUrls(folderData as string[])
    },
    [path, userId]
  )

  const handleDeleteImage = useCallback(
    async (url: string) => {
      const urlWithoutPublic = url.replace(
        `https://phwmepkoueewrufhxbnu.supabase.co/storage/v1/object/public/management/${userId}/${path}/`,
        ""
      )

      const { data, error } = await supabase.storage
        .from("management")
        .remove([`${userId}/${path}/${urlWithoutPublic}`])
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
      if (data) {
        toast.custom(t => (
          <Alert
            t={t}
            title="削除しました"
            usage="success"
            message="画像を削除しました"
          />
        ))
        setImageUrls(pre => {
          const newUrls = pre.filter(
            url =>
              url !==
              `https://phwmepkoueewrufhxbnu.supabase.co/storage/v1/object/public/management/${userId}/${path}/${urlWithoutPublic}`
          )
          return newUrls
        })
      }
    },
    [path, userId]
  )

  useEffect(() => {
    getFolder()
  }, [getFolder, userId])

  useEffect(() => {
    if (folder) {
      getImageUrls(folder)
    }
  }, [getImageUrls, folder])

  return {
    folder,
    imageUrls,
    handleDeleteImage,
  }
}
