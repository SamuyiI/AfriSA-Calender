"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

function ProgramCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isCollaboration: false,
  });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("afrisaEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("afrisaEvents", JSON.stringify(events));
  }, [events]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents((prev) => [...prev, { ...formData }]);
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      isCollaboration: false,
    });
    setShowAddEventForm(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const deleteEvent = (eventToDelete) => {
    setEvents((prev) =>
      prev.filter(
        (event) =>
          !(
            event.date === eventToDelete.date &&
            event.title === eventToDelete.title &&
            event.time === eventToDelete.time
          )
      )
    );
  };

  // Helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => event.date === formatDate(date));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Success Alert */}
      {showAlert && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          Event successfully added to the calendar!
        </div>
      )}

      {/* Main Calendar Container */}
      <div className="bg-white rounded-lg shadow-lg border">
        {/* Calendar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Calendar className="h-7 w-7" />
              AfriSA Program Calendar
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                  )
                }
                className="p-2 hover:bg-blue-50 rounded-full text-blue-600"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-xl font-semibold text-gray-800">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                  )
                }
                className="p-2 hover:bg-blue-50 rounded-full text-blue-600"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Legend and Add Event Button */}
          <div className="flex gap-6 mt-6 justify-between">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 border border-green-300 rounded" />
                <span className="text-sm font-medium text-black">
                  Collaboration Events
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-100 border border-red-300 rounded" />
                <span className="text-sm font-medium text-black">
                  AfriSA Events
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAddEventForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {/* Week Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold bg-blue-50 text-blue-900"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="p-4 border border-gray-100 bg-gray-50"
                />
              )
            )}

            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
              const day = i + 1;
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const dayEvents = getEventsForDate(date);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className="p-2 min-h-24 cursor-pointer hover:bg-blue-50 border border-gray-100 bg-white"
                >
                  <div className="font-semibold text-gray-700">{day}</div>
                  {hasEvents && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((event, index) => (
                        <div
                          key={index}
                          className={`text-xs p-1 rounded ${
                            event.isCollaboration
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedDate && (
        <div className="mt-6 p-6 border rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Events for {selectedDate.toLocaleDateString()}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">No events scheduled for this day.</p>
          ) : (
            getEventsForDate(selectedDate).map((event, index) => (
              <div
                key={index}
                className={`mb-4 p-4 bg-white rounded-lg shadow border-l-4 ${
                  event.isCollaboration
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-lg">{event.title}</div>
                  <button
                    onClick={() => deleteEvent(event)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p>
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {event.description}
                  </p>
                  <p>
                    <span className="font-medium">Event Type:</span>{" "}
                    {event.isCollaboration
                      ? "Collaboration Event"
                      : "AfriSA Event"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Event Form Modal */}
      {showAddEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Event
              </h3>
              <button
                onClick={() => setShowAddEventForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isCollaboration"
                  id="isCollaboration"
                  checked={formData.isCollaboration}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isCollaboration"
                  className="ml-2 block text-sm text-gray-700"
                >
                  This is a collaboration event
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEventForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramCalendar;
