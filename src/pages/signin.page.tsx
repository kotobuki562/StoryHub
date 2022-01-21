/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import "react-image-crop/dist/ReactCrop.css"
import "react-quill/dist/quill.snow.css"

import dynamic from "next/dynamic"
import Router from "next/router"
import type { ChangeEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Crop } from "react-image-crop"
import ReactCrop from "react-image-crop"
import Resizer from "react-image-file-resizer"
import { Layout } from "src/components/Layout"
import { supabase } from "src/lib/supabase"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
})

const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["small", false, "large", "huge"] }, { color: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    // handlers: { image: this.imageHandler },
  },
  clipboard: { matchVisual: false },
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "size",
  "color",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
]

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

const Signin = () => {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")
  const [preview, setPreview] = useState<Blob | null>(null)
  const [upImg, setUpImg] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState<Crop>({
    // 正方形にするために、縦横比を維持して、縦横の最小値を設定する
    aspect: 1,
    width: 30,
    height: 30,
    x: 30,
    y: 30,
    unit: "%",

    // unit: "%",
    // width: 30,
    // aspect: 16 / 9,
    // x: 0,
    // y: 0,
    // height: 30,
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const user = supabase.auth.user()

  const onSelectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => setUpImg(reader.result as string))
      reader.readAsDataURL(e.target.files[0])
    }
  }, [])

  const onChangeImage = useCallback(() => {
    setText(pre => pre + `<img src="${imageUrl}">`)
  }, [imageUrl])

  const onSaveTextByLocalStorage = useCallback(() => {
    localStorage.setItem("text", text)
  }, [text])

  const onLoadTextByLocalStorage = useCallback(() => {
    setText(localStorage.getItem("text") || "")
  }, [])

  const onResizeImage = useCallback(
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
            setUpImg(reader.result as string)
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

  const uploadPreview = useCallback(
    async (canvas: HTMLCanvasElement, userId: string, crop: Crop) => {
      if (!userId || !canvas || !crop) {
        return
      }
      canvas.toBlob(
        async blob => {
          if (blob) {
            // blobをsupabaseにアップロードする
            return await supabase.storage
              .from("management")
              .upload(`${userId}/avatar`, blob, {
                cacheControl: "3600",
                upsert: false,
              })
              .then(async () => {
                await supabase.storage
                  .from("management")
                  .download(`${userId}/avatar`)
                  .then(res => {
                    setPreview(res.data)
                  })
              })
              .then(async () => {
                const { error, publicURL } = supabase.storage
                  .from("management")
                  .getPublicUrl(`${userId}/avatar`)
                // eslint-disable-next-line no-console
                console.log(publicURL, error)
              })
          }
        },
        "image/png",
        1
      )
    },
    []
  )

  const getImages = async () => {
    await supabase.storage
      .from("avatars")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      })
      .then(res => {
        // eslint-disable-next-line no-console
        console.log(res)
      })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    Router.push("/")
  }

  return (
    <Layout>
      <div>
        <img src="/img/StoryHubLogo.png" alt="Logo" />
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={text}
          onChange={e => setText(e)}
        />
        <input type="text" onChange={e => setImageUrl(e.target.value)} />
        <div className="flex justify-around">
          <button onClick={onChangeImage}>Image</button>
          <button onClick={onSaveTextByLocalStorage}>SAVE</button>
          <button onClick={onLoadTextByLocalStorage}>LOAD</button>
        </div>
        <div>
          CropImage
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <div>
          ResizeImage
          <input type="file" accept="image/*" onChange={onResizeImage} />
        </div>

        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={onChangeCrop}
          onComplete={onCompleteCrop}
        />
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
        <p>
          {`Note that the download below won't work in this sandbox due to the
          iframe missing 'allow-downloads'. It's just for your reference.`}
        </p>
        {previewCanvasRef.current && (
          <button
            type="button"
            onClick={async () =>
              await uploadPreview(
                previewCanvasRef.current as HTMLCanvasElement,
                `${user?.id}`,
                crop
              )
            }
          >
            Download cropped image
          </button>
        )}

        <button
          onClick={() => {
            getImages()
          }}
        >
          Get
        </button>
        <button
          onClick={() => {
            logout()
          }}
        >
          signout
        </button>
        <img
          src={
            preview
              ? URL.createObjectURL(preview)
              : "https://via.placeholder.com/150"
          }
          alt="data"
        />

        <form
          onSubmit={async e => {
            e.preventDefault()
            await supabase.auth
              .signIn({
                email,
                password,
              })
              .then(res => {
                // eslint-disable-next-line no-console
                console.log(res)
              })
            Router.push("/")
          }}
        >
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address)"
            type="text"
            value={email}
          />
          <input disabled={!password || !email} type="submit" value="Signin" />
        </form>
        <form
          onSubmit={async e => {
            e.preventDefault()
            await supabase.auth.api
              .updateUser(`${supabase.auth.session()?.access_token}`, {
                password: password,
              })
              .then(res => {
                // eslint-disable-next-line no-console
                console.log(res)
                Router.push("/")
              })
          }}
        >
          <h1>Reset Password</h1>
          <input
            autoFocus
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input disabled={!password} type="submit" value="Reset" />
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
        }

        input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Signin
