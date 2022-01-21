/* eslint-disable import/no-default-export */
/* eslint-disable func-style */
import type { NextPageContext } from "next"

interface ErrorComponentProps {
  statusCode?: number
}

function ErrorComponent({ statusCode }: ErrorComponentProps): JSX.Element {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  )
}

ErrorComponent.getInitialProps = ({ err, res }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorComponent
