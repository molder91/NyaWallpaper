import React from 'react'

const Collection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Collection</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Collection items will go here */}
        <div className="aspect-video rounded-lg bg-muted" />
        <div className="aspect-video rounded-lg bg-muted" />
        <div className="aspect-video rounded-lg bg-muted" />
        <div className="aspect-video rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export default Collection 