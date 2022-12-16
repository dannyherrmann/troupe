import { Route, Routes } from 'react-router-dom'
import { HomeDashboard } from '../dashboard/HomeDashboard'
import { Calendar } from '../calendar/Calendar'

export const PerformerViews = () => {
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
            <Route path="calendar" element={ <Calendar /> } />
        </Routes>
    )
}