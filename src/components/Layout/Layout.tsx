/* eslint-disable react/destructuring-assignment */
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import type { ReactNode, VFC } from "react"
import { useEffect, useState } from "react"
import { memo } from "react"
import { supabase } from "src/lib/supabase"

import { Header } from "./Header"

type LayoutProps = {
  children: ReactNode
  meta?: {
    pageName?: string
    description?: string
    cardImage?: string
  }
}
const LayoutComp: VFC<LayoutProps> = props => {
  const { pathname, push } = useRouter()
  const meta = {
    title: props.meta?.pageName,
    description: props.meta?.description,
    cardImage: props.meta?.cardImage,
    ...props.meta,
  }
  const [isLoading, setIsLoading] = useState(true)

  supabase.auth.onAuthStateChange((_, session) => {
    if (!session?.user && pathname !== "/signup" && pathname !== "/") {
      push("/signin")
    }
  })

  useEffect(() => {
    ;(async () => {
      const user = supabase.auth.user()
      if (!user && pathname !== "/signup" && pathname !== "/") {
        await push("/signin")
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="robots" content="follow, index" />
        <link href="/img/StoryHubIcon.png" rel="shortcut icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/img/StoryHubIcon.png"
        />
        <link rel="icon" sizes="32x32" href="/img/StoryHubIcon.png" />
        <link rel="icon" sizes="16x16" href="/img/StoryHubIcon.png" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_ENDPOINT}${pathname}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@StoryHub" />
        <meta name="twitter:creator" content="@NEKO_and_SPA" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <div className="text-slate-800">
        <Header />
        {isLoading ? <div>Loading...</div> : <div>{props.children}</div>}
      </div>
    </>
  )
}

export const Layout = memo(LayoutComp)
