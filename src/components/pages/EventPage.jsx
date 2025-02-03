import { useState, useEffect } from 'react'

import { observer } from "mobx-react-lite";
import eventStore from '../../store/eventStore';

const EventPage = observer(({ eventId }) => {
    useEffect(() => {
      eventStore.fetchEvent(eventId); 
    }, [eventId]);
  
    if (eventStore.isLoading || !eventStore.event) {
      return <div>Loading...</div>;
    }
  
    const event = eventStore.event;
    const eventDate = new Date(event.dateTime).toLocaleString();
  
    return (
      <div className="bg-white">
        <div className="pb-16 pt-6 sm:pb-24">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="#" className="text-sm font-medium text-[#732D87]">Events</a>
              </li>
              <li className="text-sm">
                <a href="#" className="font-medium text-[#732D87]">{event.name}</a>
              </li>
            </ol>
          </nav>
  
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              {/* Данные о событии */}
              <div className="lg:col-span-5 lg:col-start-8">
                <div className="flex justify-between">
                  {eventStore.isEditing ? (
                    <input
                      type="text"
                      value={event.name}
                      onChange={(e) => eventStore.handleEditChange("name", e.target.value)}
                      className="text-xl font-medium text-[#732D87] w-full"
                    />
                  ) : (
                    <h1 className="text-xl font-medium text-[#732D87]">{event.name}</h1>
                  )}
                  <p className="text-xl font-medium text-black">{eventDate}</p>
                </div>
  
                <div className="mt-4">
                  {eventStore.isEditing ? (
                    <textarea
                      value={event.description}
                      onChange={(e) => eventStore.handleEditChange("description", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: event.description }} className="text-sm text-black" />
                  )}
                </div>
  
                {/* Участники */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-[#732D87]">Участники</h3>
                  <ul className="mt-2 text-sm text-black">
                    {event.participants.map((participant, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className={participant.struck ? "line-through text-gray-400" : ""}>
                          {participant.name || participant}
                        </span>
                        <button onClick={() => eventStore.toggleStrikeThrough(participant)} className="text-red-600">
                          &#10005;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
  
                {/* Кнопки */}
                <div className="mt-8">
                  {eventStore.isEditing ? (
                    <button onClick={() => eventStore.saveChanges()} className="px-4 py-2 bg-[#732D87] text-white">
                      Сохранить
                    </button>
                  ) : (
                    <button onClick={() => eventStore.setModalOpen(true)} className="px-4 py-2 bg-[#732D87] text-white">
                      Зарегистрироваться
                    </button>
                  )}
                  <button onClick={() => eventStore.setEditing(!eventStore.isEditing)} className="ml-4 px-4 py-2 bg-gray-300">
                    {eventStore.isEditing ? "Отменить" : "Редактировать"}
                  </button>
                </div>
              </div>
  
              {/* Изображение */}
              <div className="mt-8 lg:col-span-7 lg:col-start-1">
                <img src={event.posterUrl} alt={`Poster for ${event.name}`} className="rounded-lg w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Модальное окно */}
        {eventStore.isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-medium text-[#732D87]">Зарегистрироваться</h2>
              <input
                type="text"
                value={eventStore.newParticipant}
                onChange={(e) => eventStore.setNewParticipant(e.target.value)}
                placeholder="Enter your name"
                className="mt-2 w-full p-2 border border-[#732D87] rounded-md"
              />
              <div className="mt-6 flex justify-between">
                <button onClick={() => eventStore.setModalOpen(false)} className="px-4 py-2 bg-gray-300">Отменить</button>
                <button onClick={() => eventStore.addParticipant()} className="px-4 py-2 bg-[#732D87] text-white">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });
  
  export default EventPage;