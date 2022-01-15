/* eslint-disable react/destructuring-assignment */
import { useRouter } from "next/router"
import type { ReactNode, VFC } from "react"
import { useEffect, useState } from "react"
import { memo } from "react"
import { supabase } from "src/lib/supabase"

import { Header } from "./Header"

type LayoutProps = {
  children: ReactNode
}
const LayoutComp: VFC<LayoutProps> = props => {
  const { pathname, push } = useRouter()
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
    <div className="text-slate-800">
      <Header />
      {isLoading ? <div>Loading...</div> : <div>{props.children}</div>}
    </div>
  )
}

export const Layout = memo(LayoutComp)
