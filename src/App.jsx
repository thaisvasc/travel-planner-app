import "./App.css";
import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";

function App() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("");

  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem("trips");
    const parsedTrips = savedTrips ? JSON.parse(savedTrips) : [];

    return parsedTrips.map((trip) => ({
      destination: trip.destination || "",
      startDate: trip.startDate || "",
      endDate: trip.endDate || "",
      budget: trip.budget || "",
      status: trip.status || "",
      transport: {
        airline: trip.transport?.airline || "",
      },
      accommodation: trip.accommodation || "",
      attractions: trip.attractions || [],
      restaurants: trip.restaurants || [],
      notes: trip.notes || "",
      newAttraction: "",
      newRestaurant: "",
    }));
  });

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = () => {
    if (!destination || !startDate || !endDate || !budget || !status) {
      alert("Preencha todos os campos.");
      return;
    }

    const newTrip = {
      destination,
      startDate,
      endDate,
      budget,
      status,
      transport: {
        airline: "",
      },
      accommodation: "",
      attractions: [],
      restaurants: [],
      notes: "",
      newAttraction: "",
      newRestaurant: "",
    };

    setTrips((prevTrips) => [...prevTrips, newTrip]);

    setDestination("");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setStatus("");
  };

  const deleteTrip = (indexToDelete) => {
    setTrips((prevTrips) =>
      prevTrips.filter((_, index) => index !== indexToDelete)
    );
  };

  const updateTripField = (tripIndex, field, value) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex ? { ...trip, [field]: value } : trip
      )
    );
  };

  const updateTransportField = (tripIndex, field, value) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              transport: {
                ...trip.transport,
                [field]: value,
              },
            }
          : trip
      )
    );
  };

  const addAttraction = (tripIndex) => {
    const attraction = trips[tripIndex].newAttraction.trim();

    if (!attraction) return;

    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              attractions: [...trip.attractions, attraction],
              newAttraction: "",
            }
          : trip
      )
    );
  };

  const removeAttraction = (tripIndex, attractionIndex) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              attractions: trip.attractions.filter(
                (_, index) => index !== attractionIndex
              ),
            }
          : trip
      )
    );
  };

  const addRestaurant = (tripIndex) => {
    const restaurant = trips[tripIndex].newRestaurant.trim();

    if (!restaurant) return;

    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              restaurants: [...trip.restaurants, restaurant],
              newRestaurant: "",
            }
          : trip
      )
    );
  };

  const removeRestaurant = (tripIndex, restaurantIndex) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              restaurants: trip.restaurants.filter(
                (_, index) => index !== restaurantIndex
              ),
            }
          : trip
      )
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Travel Planner</h1>
        <p>Organize suas viagens de forma simples e prática</p>
      </header>

      <main className="container">
        <TripForm
          destination={destination}
          setDestination={setDestination}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          budget={budget}
          setBudget={setBudget}
          status={status}
          setStatus={setStatus}
          addTrip={addTrip}
        />

        <TripList
          trips={trips}
          deleteTrip={deleteTrip}
          updateTripField={updateTripField}
          updateTransportField={updateTransportField}
          addAttraction={addAttraction}
          removeAttraction={removeAttraction}
          addRestaurant={addRestaurant}
          removeRestaurant={removeRestaurant}
        />
      </main>
    </div>
  );
}

export default App;