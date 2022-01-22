import { CheckCircleIcon } from "@heroicons/react/solid"
import gsap from "gsap"
import type { VFC } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import ReactCrop from "react-image-crop"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { useResize } from "src/hooks/useResize"
import { supabase } from "src/lib/supabase"

type UpdateImageFormProps = {
  userId?: string
}

const UploadStoryImageFormComp: VFC<UpdateImageFormProps> = ({ userId }) => {
  const iconRef = useRef<HTMLDivElement>(null)

  const [timeline] = useState(gsap.timeline({ paused: true }))
  const [isLoadingFunction, setIsLoadingFunction] = useState(false)
  const {
    completedCrop,
    crop,
    img,
    onChangeCrop,
    onCompleteCrop,
    onLoad,
    onSelectResizeImage,
    previewCanvasRef,
    upImgUrl,
  } = useResize({
    // A4: 210mm x 297mmの比率
    aspect: 210 / 297,
  })

  const handleUpdateUserProfileImage = useCallback(() => {
    if (!userId || !previewCanvasRef.current || !crop) {
      return
    }
    setIsLoadingFunction(true)
    previewCanvasRef.current.toBlob(
      async blob => {
        if (blob) {
          // blobをsupabaseにアップロードする
          return await supabase.storage
            .from("management")
            .upload(`${userId}/story/${img?.name}`, blob, {
              cacheControl: "3600",
              upsert: true,
            })
            .catch(error => {
              toast.custom(t => (
                <Alert
                  t={t}
                  title="エラーが発生しました"
                  usage="error"
                  message={error.message}
                />
              ))
            })
            .finally(() => {
              setIsLoadingFunction(false)
            })
        }
      },
      "image/png",
      1
    )
  }, [crop, img?.name, previewCanvasRef, userId])
  useEffect(() => {
    if (iconRef.current) {
      timeline.from(iconRef.current, {
        opacity: 0,
        display: "none",
        scale: 0,
        ease: "back.out(3)",
        duration: 0.5,
        stagger: 0.3,
      })
    }
  }, [timeline])

  useEffect(() => {
    if (upImgUrl !== null) {
      timeline.play()
    } else {
      timeline.reverse()
    }
  }, [timeline, upImgUrl])

  return (
    <div className="p-4 w-full">
      <div className="flex justify-center items-center w-full">
        <label className="flex relative flex-col items-center py-6 px-4 w-full tracking-wide text-white uppercase bg-purple-500 rounded-lg cursor-pointer">
          <div ref={iconRef} className="absolute -top-5 -right-5">
            <CheckCircleIcon className="w-10 h-10 text-yellow-400 bg-purple-500 rounded-full" />
          </div>
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectResizeImage}
          />
        </label>
      </div>

      <div className="flex justify-around items-center mb-4">
        {upImgUrl && (
          <ReactCrop
            src={upImgUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={onChangeCrop}
            onComplete={onCompleteCrop}
          />
        )}

        <div>
          <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          />
        </div>
      </div>

      <Button
        disabled={isLoadingFunction || !upImgUrl}
        isLoading={isLoadingFunction}
        onClick={handleUpdateUserProfileImage}
        text="更新"
      />
    </div>
  )
}

export const UploadStoryImageForm = memo(UploadStoryImageFormComp)
