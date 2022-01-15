/* eslint-disable import/no-default-export */
import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import Router from "next/router"
import { useState } from "react"

import Layout from "../components/Layout"

const SignupMutation = gql`
  mutation Mutation($email: String!, $userName: String) {
    signupUser(email: $email, user_name: $userName) {
      id
      user_name
    }
  }
`

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [signup] = useMutation(SignupMutation)

  return (
    <Layout>
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault()
            await signup({
              variables: {
                email,
                user_name: name,
              },
            })
            Router.push("/")
          }}
        >
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address)"
            type="text"
            value={email}
          />
          <input disabled={!name || !email} type="submit" value="Signup" />
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

export default Signup
