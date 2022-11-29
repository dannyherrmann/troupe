import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import mainLogo from'../images/chair.jpg'

export const Login = () => {
  const [email, set] = useState("");
  const [troupes, setTroupes] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTroupes = async () => {
        const response = await fetch('http://localhost:8088/troupes')
        const troupesArray = await response.json()
        setTroupes(troupesArray)
    }
    fetchTroupes()
}, [])

const findUserTroupeName = (id) => {
  for (const troupe of troupes) {
      if (troupe.id === id) {
        return troupe.name
      }
  }
}

  const handleTroupeLogin = async (e) => {
    e.preventDefault()

    const response = await fetch(`http://localhost:8088/users?_embed=userTroupes&email=${email}`)
    const user = await response.json()
    console.log(user)
    if (user.length === 1) {
      const userObject = user[0]
      const userTroupeCount = userObject.userTroupes.length
      if (userTroupeCount === 1) {
        localStorage.setItem(
          "troupe_user",
          JSON.stringify({
            userId: userObject.id,
            userTroupeId: userObject.userTroupes[0].id,
            troupeId: userObject.userTroupes[0].troupeId,
            troupeName: findUserTroupeName(userObject.userTroupes[0].troupeId),
            troupeLeader: userObject.userTroupes[0].isLeader,
            userPhoto: userObject.photo
          })
        )
        navigate("/")
      } else {
        localStorage.setItem(
          "troupe_user",
          JSON.stringify({
            id: userObject.id,
            userPhoto: userObject.photo,
            troupes: userObject.userTroupes,
            isLeader: userObject.isLeader
          })
        )
        navigate("/selectTroupe")
      }
    } else {
      window.alert("Invalid login")
    }
}

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src={mainLogo}
            alt="Your Company"
          />
          

        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleTroupeLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(evt) => set(evt.target.value)}
                    autoComplete="off"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-1">
              <div>
                    <a
                      href="#"
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign in with Google</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
              </div>
              
              </div>
              
              
            </div>
          </div>
        </div>

    </>

  );
};
