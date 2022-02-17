/* eslint-disable import/no-default-export */
/* eslint-disable func-style */
import type { NextPageContext } from "next"

interface ErrorComponentProps {
  statusCode?: number
}

function ErrorComponent({ statusCode }: ErrorComponentProps): JSX.Element {
  return (
    <div className="bg-gradient-to-r from-purple-300 to-blue-200">
      <div className="flex justify-center items-center py-16 m-auto w-9/12 min-h-screen">
        <div className="overflow-hidden pb-8 bg-white shadow sm:rounded-lg">
          <div className="pt-8 text-center border-t border-gray-200">
            <h1 className="text-9xl font-bold text-purple-400">
              {statusCode ? statusCode : "???"}
            </h1>
            <h1 className="py-8 text-6xl font-medium">oops! Page not found</h1>
            <p className="px-12 pb-8 text-2xl font-medium">
              Oops! The page you are looking for does not exist. It might have
              been moved or deleted.
            </p>
            <button className="py-3 px-6 mr-6 font-semibold text-white bg-gradient-to-r from-purple-400 hover:from-pink-500 to-blue-500 hover:to-orange-500 rounded-md">
              HOME
            </button>
            <button className="py-3 px-6 font-semibold text-white bg-gradient-to-r from-red-400 hover:from-red-500 to-red-500 hover:to-red-500 rounded-md">
              Contact Us
            </button>
            <p>
              {statusCode
                ? `An error ${statusCode} occurred on server`
                : "An error occurred on client"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

ErrorComponent.getInitialProps = ({ err, res }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorComponent
