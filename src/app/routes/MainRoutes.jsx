import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from '../hooks/ScrollToTop/useScrollToTop.jsx'

import MyBlock from '../pages/MyBlock/MyBlock.jsx'
import UserLayout from '../layouts/UserLayout/UserLayout.jsx'
import Home from '../pages/Home/Home.jsx'
import MyBlockController from '../pages/MyBlockController/MyBlockController.jsx'
import Test from '../pages/Test/Test.jsx'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path='/' element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path='my-block' element={<MyBlock />} />
                    <Route path='my-block-controller' element={<MyBlockController />} />
                    <Route path='test' element={<Test />} />
                </Route>
                <Route path='*' element={<></>} />
            </Routes>
        </BrowserRouter>
    )
}
