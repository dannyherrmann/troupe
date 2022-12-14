import { Route, Routes } from 'react-router-dom'
import { HomeDashboard } from '../dashboard/HomeDashboard'
import { Calendar } from '../calendar/Calendar'
import { MyTroupe } from '../mytroupe/MyTroupe'
import { YourProfile } from '../profile/YourProfile'

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
            <Route path="mytroupe" element={ <MyTroupe /> } />
            <Route path="profile" element={ <YourProfile /> } />
        </Routes>
    )
}