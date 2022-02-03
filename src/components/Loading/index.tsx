/* eslint-disable @next/next/no-img-element */
export const LoadingLogo = () => {
  return (
    <span className="flex w-[100px] h-[100px]">
      <img
        className="inline-flex absolute w-[100px] h-[100px] rounded-full opacity-75 animate-ping"
        src="/img/LoadingLogo.svg"
        alt=""
      />
      <img
        className="inline-flex relative w-[100px] h-[100px] rounded-full"
        src="/img/LoadingLogo.svg"
        alt=""
      />
    </span>
  )
}
