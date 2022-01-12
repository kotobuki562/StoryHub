import React, { useCallback, useEffect, useRef, useState } from "react"
import Layout from "../components/Layout"
import Router, { useRouter } from "next/router"
import supabase from "src/lib/supabase"
import { uuidv4 } from "src/tools/uuidv4"
import jwt from "jsonwebtoken"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { PDFDOcument } from "src/components/Pdf"
import ReactCrop, { Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

function generateDownload(canvas: HTMLCanvasElement, crop: Crop) {
  if (!crop || !canvas) {
    return
  }

  canvas.toBlob(
    blob => {
      if (blob) {
        const previewUrl = window.URL.createObjectURL(blob)

        const anchor = document.createElement("a")
        anchor.download = "cropPreview.png"
        anchor.href = URL.createObjectURL(blob)
        anchor.click()

        window.URL.revokeObjectURL(previewUrl)
      }
    },
    "image/png",
    1
  )
}

function Signin() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [avater, setAvater] = useState<File | null>(null)
  const [preview, setPreview] = useState<Blob | null>(null)
  const [upImg, setUpImg] = useState()
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const auth = supabase.auth.session()

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => setUpImg(reader.result))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onLoad = useCallback(img => {
    imgRef.current = img
  }, [])

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

  const uploadImage = async (userId: string) => {
    return await supabase.storage
      .from("avatars")
      .upload(`public/${userId}`, avater, {
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
        <div>
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        {/* @ts-ignore */}
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
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
            onClick={() =>
              generateDownload(previewCanvasRef.current, completedCrop)
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
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            setAvater(e.target.files[0])
          }}
        />
        <button
          onClick={() => {
            uploadImage(uuidv4())
          }}
        >
          Upload
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
          <input disabled={!password || !email} type="submit" value="Signup" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
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
