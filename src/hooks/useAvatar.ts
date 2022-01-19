import type { ChangeEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Crop } from "react-image-crop"
import Resizer from "react-image-file-resizer"

const resizeFile = (
  file: Blob
): Promise<string | Blob | File | ProgressEvent<FileReader>> =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      70,
      0,
      uri => {
        resolve(uri)
      },
      "base64"
    )
  })

const useAvatar = () => {
  const [upImgUrl, setUpImgUrl] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState<Crop>({
    aspect: 1,
    width: 30,
    height: 30,
    x: 0,
    y: 0,
    unit: "%",
    // unit: "%",
    // width: 30,
    // aspect: 16 / 9,
    // x: 0,
    // y: 0,
    // height: 30,
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)

  const onSelectResizeImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        const resizedFile = await resizeFile(file)
        // resizeFileはbase64なので、Fileに変換する
        const bin = window.atob(`${resizedFile}`.replace(/^.*,/, ""))
        const buffer = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i)
        }
        // Blobを作成
        try {
          const blobData = new Blob([buffer.buffer], {
            type: "image/png",
          })
          const reader = new FileReader()
          reader.addEventListener("load", () =>
            setUpImgUrl(reader.result as string)
          )

          reader.readAsDataURL(blobData)
        } catch (e) {
          return false
        }
      }
    },
    []
  )

  const onLoad = useCallback((img: HTMLImageElement) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    imgRef.current = img
  }, [])

  const onChangeCrop = useCallback((crop: Crop) => {
    setCrop(crop)
  }, [])

  const onCompleteCrop = useCallback(
    (crop: Crop) => {
      setCompletedCrop(crop)
    },
    [setCompletedCrop]
  )

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop: Crop = completedCrop
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext("2d")
    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    if (ctx) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )
    }
  }, [completedCrop])

  return {
    upImgUrl,
    completedCrop,
    previewCanvasRef,
    crop,
    onSelectResizeImage,
    onLoad,
    onChangeCrop,
    onCompleteCrop,
  }
}

export { useAvatar }
