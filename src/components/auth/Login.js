import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import mainLogo from'../images/chair.jpg'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import GoogleButton from "react-google-button";

export const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
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

const updateLogin = (evt) => {
  const copy = { ...login };
  copy[evt.target.id] = evt.target.value;
  setLogin(copy);
};

  const handleTroupeLogin = async (uid) => {
    const response = await fetch(`http://localhost:8088/users?_embed=userTroupes&uid=${uid}`)
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
            uid: uid,
            userTroupeId: userObject.userTroupes[0].id,
            troupeId: userObject.userTroupes[0].troupeId,
            troupeName: findUserTroupeName(userObject.userTroupes[0].troupeId),
            troupeLeader: userObject.userTroupes[0].isLeader,
            userPhoto: userObject.photo,
          })
        )
        navigate("/")
      } else {
        localStorage.setItem(
          "troupe_user",
          JSON.stringify({
            id: userObject.id,
            uid: uid,
            userPhoto: userObject.photo,
            troupes: userObject.userTroupes,
            isLeader: userObject.isLeader
          })
        )
        navigate("/selectTroupe")
      }
    }
  }

  const emailAuth = async (e) => {
    e.preventDefault()
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, login.email, login.password)
    const uid = userCredential.user.uid
    handleTroupeLogin(uid)
  }

  const googleAuth = async (e) => {
    e.preventDefault()
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    const userCredential = await signInWithPopup(auth, provider)
    const uid = userCredential.user.uid
    handleTroupeLogin(uid)
  }



  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">


        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={emailAuth}>
              <div>

              <div className="sm:mx-auto sm:w-full sm:max-w-md mb-5">
          <img
            className="mx-auto h-12 w-auto"
            src={mainLogo}
            alt="Your Company"
          />
          

        </div>

                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={login.email}
                    onChange={(evt) => updateLogin(evt)}
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
                    value={login.password}
                    onChange={(evt) => updateLogin(evt)}
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
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              
            <div className="mt-6 grid grid-cols-1 gap-1">
              <div>
                <div className="relative flex justify-center text-sm">
                    <GoogleButton 
                    type="light"
                    onClick={googleAuth}
                    className="ml-19"
                    />
                </div>
              </div>
            </div>
              
              </div>
              
              
            </div>
          </div>
        </div>

    </>

  );
};
