export default function Placeholder({ name }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-400">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-4"></div>
      <h2 className="text-xl font-medium">{name}</h2>
      <p className="text-sm mt-1">This page is under development</p>
    </div>
  )
}
