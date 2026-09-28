import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import ScrollToTop from './components/ScrollToTop'

// Pages — lazy loaded
import { lazy, Suspense } from 'react'

const Home           = lazy(() => import('./pages/Home'))
const About          = lazy(() => import('./pages/About'))
const Programs       = lazy(() => import('./pages/Programs'))
const ProgramDetail  = lazy(() => import('./pages/ProgramDetail'))
const Impact         = lazy(() => import('./pages/Impact'))
const GetInvolved    = lazy(() => import('./pages/GetInvolved'))
const Volunteer      = lazy(() => import('./pages/Volunteer'))
const Internship     = lazy(() => import('./pages/Internship'))
const Partnerships   = lazy(() => import('./pages/Partnerships'))
const Donate         = lazy(() => import('./pages/Donate'))
const Gallery        = lazy(() => import('./pages/Gallery'))
const Stories        = lazy(() => import('./pages/Stories'))
const StoryDetail    = lazy(() => import('./pages/StoryDetail'))
const Contact        = lazy(() => import('./pages/Contact'))
const PrivacyPolicy  = lazy(() => import('./pages/legal/PrivacyPolicy'))
const Terms          = lazy(() => import('./pages/legal/Terms'))
const RefundPolicy   = lazy(() => import('./pages/legal/RefundPolicy'))
const Disclaimer     = lazy(() => import('./pages/legal/Disclaimer'))
const NotFound       = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e0e0e0', borderTopColor: '#279490', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/"                index element={<Home />} />
            <Route path="/about"                  element={<About />} />
            <Route path="/programs"               element={<Programs />} />
            <Route path="/programs/:slug"         element={<ProgramDetail />} />
            <Route path="/impact"                 element={<Impact />} />
            <Route path="/get-involved"           element={<GetInvolved />} />
            <Route path="/get-involved/volunteer" element={<Volunteer />} />
            <Route path="/get-involved/internship"element={<Internship />} />
            <Route path="/get-involved/partner"   element={<Partnerships />} />
            <Route path="/donate"                 element={<Donate />} />
            <Route path="/gallery"                element={<Gallery />} />
            <Route path="/stories"                element={<Stories />} />
            <Route path="/stories/:slug"          element={<StoryDetail />} />
            <Route path="/contact"                element={<Contact />} />
            <Route path="/privacy-policy"         element={<PrivacyPolicy />} />
            <Route path="/terms"                  element={<Terms />} />
            <Route path="/refund-policy"          element={<RefundPolicy />} />
            <Route path="/disclaimer"             element={<Disclaimer />} />
            <Route path="*"                       element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
