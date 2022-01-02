import React, { useState } from "react"
import Layout from "../components/Layout"
import Router, { useRouter } from "next/router"
import supabase from "src/lib/supabase"

function Signin(props) {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  return (
    <Layout>
      <div>
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
