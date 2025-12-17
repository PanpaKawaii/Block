import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from '../hooks/ScrollToTop/useScrollToTop.jsx'

import GenerateObjectController from '../pages/GenerateObject/GenerateObjectController.jsx'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <></>
            <Routes>
                <Route path='/' element={<GenerateObjectController />} />
                <Route path='*' element={<></>} />
            </Routes>
            <></>
        </BrowserRouter>
    )
}
