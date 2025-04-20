import React from 'react'
import EmailForm from '../component/EmailForm'

const Home = () => {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 mx-8">
      <h1 className="text-3xl font-bold mb-6">Smart Email Generator</h1>
      <EmailForm />
    </main>
  )
}

export default Home