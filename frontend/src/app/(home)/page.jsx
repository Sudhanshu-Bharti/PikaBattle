import React from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
const page = ({children}) => {
  return (
      <>
       <Navbar/> 
        <main className="container p-4 sm:p-6 flex-1">{children}</main>
      <Footer/>
      </>
  )
}

export default page