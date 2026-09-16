import React from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-md mx-auto p-4 md:p-6 bg-white shadow-xl min-h-screen relative overflow-hidden">
        {children}
      </main>
    </div>
  )
}
