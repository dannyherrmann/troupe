import { Route, Routes } from 'react-router-dom'
import { HomeDashboard } from '../dashboard/HomeDashboard'
import { CastShow } from '../events/CastShow'

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
            >
                <Route path="castShow" element={ <CastShow /> } />
            </Route>
        </Routes>
    )
}