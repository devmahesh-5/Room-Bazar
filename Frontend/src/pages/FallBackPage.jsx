// ErrorPage.jsx
import { useRouteError, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
      {/* Animated floating emoji */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-9xl mb-6"
      >
        👻
      </motion.div>

      <h1 className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-[#6C48E3]">
        404
      </h1>
      
      <h2 className="text-3xl font-semibold mb-2">Houston, we have a problem!</h2>
      
      <p className="text-xl opacity-90 max-w-lg mb-8">
        The page you're looking for has either blasted off into space or never existed.
      </p>

      {/* Glowing button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/"
          className="relative inline-block px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-[#5a3acf] to-[#7733BB] hover:from-[#6C48E3] hover:to-[#6C48E3] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10">Go Home</span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 opacity-0 hover:opacity-100 animate-pulse blur-md transition-opacity duration-300"></span>
        </Link>
      </motion.div>

      {/* Debug info for developers */}
      {import.meta.env.DEV && (
        <div className="mt-12 p-4 bg-black bg-opacity-20 rounded-lg max-w-2xl text-left">
          <details>
            <summary className="text-sm font-mono cursor-pointer">Error Details</summary>
            <pre className="text-xs mt-2 overflow-auto p-2 bg-black bg-opacity-30 rounded">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}