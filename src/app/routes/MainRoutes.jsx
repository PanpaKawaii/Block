import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from '../hooks/ScrollToTop/useScrollToTop.jsx'

import GenerateObjectController from '../pages/GenerateObject/GenerateObjectController.jsx'
import NavigationBar from '../pages/NavigationBar/NavigationBar.jsx'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <></>
            <Routes>
                <Route path='/' element={<NavigationBar />}>
                    <Route index element={<GenerateObjectController />} />
                    {/* <Route path='my-block' element={<MyBlock />} /> */}
                </Route>
                <Route path='*' element={<></>} />
            </Routes>
            <></>
        </BrowserRouter>
    )
}
