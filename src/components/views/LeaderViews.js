import { Route, Routes } from 'react-router-dom'
import { HomeDashboard } from '../dashboard/HomeDashboard'
import { Calendar } from '../calendar/Calendar'
import { MyTroupe } from '../mytroupe/MyTroupe'
import { YourProfile } from '../profile/YourProfile'
import { AddUser } from '../profile/AddUser'

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
            <Route path="calendar" element={ <Calendar /> } />
            <Route path="mytroupe" element={ <MyTroupe /> } />
            <Route path="profile" element={ <YourProfile /> } />
            <Route path="myTroupe/addUser" element={ <AddUser /> } />
        </Routes>
    )
}