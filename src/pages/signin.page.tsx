import React, { useState } from "react"
import Layout from "../components/Layout"
import Router, { useRouter } from "next/router"
import supabase from "src/lib/supabase"
import { uuidv4 } from "src/tools/uuidv4"
import jwt from "jsonwebtoken"

function Signin(props) {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [avater, setAvater] = useState<File>(null)
  const [preview, setPreview] = useState<Blob>(null)
  const auth = supabase.auth.session()

  if (auth?.access_token) {
    const decode = jwt.decode(`${auth?.access_token}`)

    // auth?.access_tokenを取得して、jwt.verifyで認証する
    console.log(decode?.sub)
  }

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
            console.log(URL.createObjectURL(res.data))

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
