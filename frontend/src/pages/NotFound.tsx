import { Link } from "react-router-dom"
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#f9fafb"}}>
      <div className="text-center px-6">
        <div className="font-display font-bold text-8xl mb-4" style={{color:"#e0e0e0"}}>404</div>
        <h1 className="font-display text-3xl font-bold mb-4" style={{color:"#0d2e2c"}}>Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
