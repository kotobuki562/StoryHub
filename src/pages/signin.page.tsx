import "react-image-crop/dist/ReactCrop.css"
import "react-quill/dist/quill.snow.css"
import jwt from "jsonwebtoken"
import Router, { useRouter } from "next/router"
import type { ChangeEvent } from "react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import type { Crop } from "react-image-crop"
import ReactCrop from "react-image-crop"
import supabase from "src/lib/supabase"
import { uuidv4 } from "src/tools/uuidv4"
import Resizer from "react-image-file-resizer"

import Layout from "../components/Layout"
import dynamic from "next/dynamic"
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

function Signin() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")
  const [preview, setPreview] = useState<Blob | null>(null)
  const [upImg, setUpImg] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const quillRef = useRef(null)
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

  const onSelectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        return setUpImg(reader.result as string)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }, [])

  console.log(text)

  const onChangeImage = useCallback(() => {
    setText(pre => {
      return pre + `<img src="${imageUrl}">`
    })
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
        var bin = atob(`${resizedFile}`.replace(/^.*,/, ""))
        var buffer = new Uint8Array(bin.length)
        for (var i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i)
        }
        // Blobを作成
        try {
          var blob = new Blob([buffer.buffer], {
            type: "image/png",
          })
        } catch (e) {
          return false
        }
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          return setUpImg(reader.result as string)
        })
        console.log(blob)

        reader.readAsDataURL(blob)
      }
    },
    []
  )

  const onLoad = useCallback((img: HTMLImageElement) => {
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

  // if (auth?.access_token) {
  //   const decode = jwt.decode(`${auth?.access_token}`)

  //   // auth?.access_tokenを取得して、jwt.verifyで認証する
  //   console.log(decode?.sub)
  // }

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
              .from("avatars")
              .upload(`public/${userId}/avatar`, blob, {
                cacheControl: "3600",
                upsert: false,
              })
              .then(async res => {
                console.log(res)
                await supabase.storage
                  .from("avatars")
                  .download(`public/${userId}`)
                  .then(res => {
                    setPreview(res.data)
                  })
              })
              .then(async () => {
                const { publicURL, error } = supabase.storage
                  .from("avatars")
                  .getPublicUrl(`public/${userId}`)
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
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={text}
          onChange={e => {
            return setText(e)
          }}
        />
        <input
          type="text"
          onChange={e => {
            return setImageUrl(e.target.value)
          }}
        />
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
        {/* @ts-ignore */}
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
          Note that the download below won't work in this sandbox due to the
          iframe missing 'allow-downloads'. It's just for your reference.
        </p>
        {previewCanvasRef.current && (
          <button
            type="button"
            onClick={async () => {
              return await uploadPreview(
                previewCanvasRef.current as HTMLCanvasElement,
                uuidv4(),
                crop
              )
            }}
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
                console.log(res)
              })
            Router.push("/")
          }}
        >
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => {
              return setPassword(e.target.value)
            }}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input
            onChange={e => {
              return setEmail(e.target.value)
            }}
            placeholder="Email address)"
            type="text"
            value={email}
          />
          <input disabled={!password || !email} type="submit" value="Signup" />
          <a
            className="back"
            href="#"
            onClick={() => {
              return Router.push("/")
            }}
          >
            or Cancel
          </a>
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
