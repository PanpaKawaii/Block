import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from '../hooks/ScrollToTop/useScrollToTop.jsx'

import GenerateObjectController from '../pages/GenerateObject/GenerateObjectController.jsx'
import MyBlock from '../pages/MyBlock/MyBlock.jsx'
import NavigationBar from '../pages/NavigationBar/NavigationBar.jsx'
import Home from '../pages/Home/Home.jsx'
import MyBlockController from '../pages/MyBlockController/MyBlockController.jsx'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <></>
            <Routes>
                <Route path='/' element={<NavigationBar />}>
                    <Route index element={<Home />} />
                    <Route path='my-block' element={<MyBlock />} />
                    <Route path='my-block-controller' element={<MyBlockController />} />
                </Route>
                <Route path='*' element={<></>} />
            </Routes>
            <></>
        </BrowserRouter>
    )
}
