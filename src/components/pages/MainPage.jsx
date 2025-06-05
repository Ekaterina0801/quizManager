import React, { useState, useEffect } from "react";
import userStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import teamStore from "../../store/teamStore";
import TeamAPI from "../../api/teamService";
import { observer } from "mobx-react-lite";
import UserAPI from "../../api/userService";
import { set } from "mobx";
import TeamList from "../TeamList";
import LoginRegisterModal from "../LoginRegisterModal";
import JoinTeamModal from "../JoinTeamModal";
import CreateTeamModal from "../CreateTeamModal";
import { Navigate } from "react-router-dom";
const MainPage = observer(() => {
  const navigate = useNavigate()
  const [showJoin,   setShowJoin]   = useState(false)
  const [showCreate, setShowCreate] = useState(false)


  useEffect(() => {
    if (userStore.me) {
      console.log('User already logged in:', userStore.me)
      teamStore.fetchAllByUserId(userStore.me.id)
    }
  }, [userStore.me])


  useEffect(() => {
    if (teamStore.selected) {
      navigate('/events', { replace: true })
    }
  }, [teamStore.selected, navigate])


  if (!userStore.me) {
    return <LoginRegisterModal show onSuccess={() => userStore.fetchMe()} />
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center 
                    bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 p-4">

      <div className="absolute inset-0 opacity-20 
                      bg-[url('/assets/trophy-flames.svg')] bg-center bg-cover" />

      <div className="relative bg-white rounded-3xl shadow-2xl 
                      w-full max-w-md p-8 z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Выберите команду
        </h1>

        <TeamList
          teams={teamStore.list}
          onSelect={id => teamStore.select(id)}
        />

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setShowJoin(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 
                       text-white rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Войти в команду
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-300 
                       text-white rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Создать команду
          </button>
        </div>
      </div>

      <JoinTeamModal
        show={showJoin}
        onClose={() => setShowJoin(false)}
        onJoin={async code => {
          await userStore.joinTeam(code)
          await teamStore.fetchAll()
          setShowJoin(false)
        }}
      />
      <CreateTeamModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={async (name, chatId) => {
          const t = await teamStore.create(name, chatId)
          teamStore.select(t.id)
          setShowCreate(false)
        }}
      />
    </div>
  )
})

export default MainPage