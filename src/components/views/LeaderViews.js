import { Route, Routes } from 'react-router-dom'
import { HomeDashboard } from '../dashboard/HomeDashboard'

export const LeaderViews = () => {
    return (
        <Routes>
            <Route
            path="/"
            element={
                <>
                <HomeDashboard />
                </>
            }
            ></Route>
        </Routes>
    )
}