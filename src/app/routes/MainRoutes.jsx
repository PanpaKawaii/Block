import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from '../hooks/ScrollToTop/useScrollToTop.jsx'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <></>
            <Routes>
                <Route path='/' element={<></>} />
                <Route path='*' element={<></>} />
            </Routes>
            <></>
        </BrowserRouter>
    )
}
