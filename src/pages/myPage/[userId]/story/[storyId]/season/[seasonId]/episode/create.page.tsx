/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import { memo } from "react"
import { Toaster } from "react-hot-toast"
import { Layout } from "src/components/Layout"

const CreateEpisode: NextPage = () => {
  // if (isMyStoryLoading || !userId || isLoadingCreateSeason) {
  //   return (
  //     <Layout>
  //       <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
  //         <LoadingLogo />
  //       </div>
  //     </Layout>
  //   )
  // }

  // if (!isMyStoryLoading && myStoryError && !isLoadingCreateSeason) {
  //   return (
  //     <Layout>
  //       <div className="flex flex-col justify-center items-center p-8 w-full h-screen">
  //         <LoadingLogo />
  //       </div>
  //     </Layout>
  //   )
  // }

  return (
    <Layout>
      <Toaster position="top-center" />
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(CreateEpisode)
