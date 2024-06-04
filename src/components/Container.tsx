import React from "react"

export const Container: React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <>
      <div className='bg-gray-700 h-screen py-3'>
        <div className='w-[500px] mx-auto bg-gray-300 h-full p-4 rounded-md'>
          {children}
        </div>
      </div>
    </>
  )

}