import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
            troupeId: userObject.userTroupes[0].troupeId,
            troupeName: findUserTroupeName(userObject.userTroupes[0].troupeId),
            troupeLeader: userObject.userTroupes[0].isLeader
          })
        )
        navigate("/")
      } else {
        localStorage.setItem(
          "troupe_user",
          JSON.stringify({
            id: userObject.id,
            troupes: userObject.userTroupes,
            isLeader: userObject.isLeader
          })
        )
        navigate("/selectTroupe")
      }
      // if troupe count is 1 then set the troupe_user with userId and troupeId
      // if troupe count is greater than 1 - navigate to separate troup picker component
    } else {
      window.alert("Invalid login")
    }
}

  return (
    <main className="container--login">
      <section>
        <form className="form--login" onSubmit={handleTroupeLogin}>
          <h1 className="text-4xl font-light tracking-wider">Troupe</h1>
          <h2>Please sign in</h2>
          <fieldset>
            <label htmlFor="inputEmail"> Email address </label>
            <input
              type="email"
              value={email}
              onChange={(evt) => set(evt.target.value)}
              className="form-control"
              placeholder="Email address"
              required
              autoFocus
            />
          </fieldset>
          <fieldset>
            <button type="submit">Sign in</button>
          </fieldset>
        </form>
      </section>
      <section className="link--register">
        <Link to="/register">Not a member yet?</Link>
      </section>
    </main>
  );
};
