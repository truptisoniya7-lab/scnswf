import { useParams } from "react-router-dom"
export default function StoryDetail() {
  const { slug } = useParams()
  return (
    <div className="container-custom section-padding mt-20">
      <h1 className="font-display text-4xl font-bold" style={{color:"#0d2e2c"}}>Story: {slug}</h1>
      <p className="mt-4 text-gray-600">Full story content will be loaded from the API in Phase 5.</p>
    </div>
  )
}
