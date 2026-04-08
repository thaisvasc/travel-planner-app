import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";

function App() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("");
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("id", { ascending: false });
    
    console.log("data:", data);
    console.log("error:", error);

    if (error) {
      console.error("Erro ao buscar viagens:", error.message);
      return;
    }

    const formattedTrips = data.map((trip) => ({
      id: trip.id,
      destination: trip.destination || "",
      startDate: trip.start_date || "",
      endDate: trip.end_date || "",
      budget: trip.budget || "",
      status: trip.status || "",
      transport: {
        airline: trip.airline || "",
      },
      accommodation: trip.accommodation || "",
      attractions: [],
      restaurants: [],
      notes: trip.notes || "",
      newAttraction: "",
      newRestaurant: "",
    }));

    setTrips(formattedTrips);
  };

  const addTrip = async () => {
    if (!destination || !startDate || !endDate || !budget || !status) {
      alert("Preencha todos os campos.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      alert("A data final deve ser maior que a data de início.");
      return;
    }

    const { error } = await supabase.from("trips").insert([
      {
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        status,
        airline: "",
        accommodation: "",
        notes: "",
      },
    ]);

    if (error) {
      console.error("Erro ao salvar viagem:", error.message);
      alert("Não foi possível salvar a viagem.");
      return;
    }

    setDestination("");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setStatus("");

    fetchTrips();
  };

  const deleteTrip = async (tripId) => {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (error) {
      console.error("Erro ao excluir viagem:", error.message);
      return;
    }

    fetchTrips();
  };

  const updateTripField = async (tripId, field, value) => {
    const columnMap = {
      accommodation: "accommodation",
      notes: "notes",
      status: "status",
      budget: "budget",
      destination: "destination",
    };

    const dbField = columnMap[field];
    if (!dbField) return;

    const { error } = await supabase
      .from("trips")
      .update({ [dbField]: value })
      .eq("id", tripId);

    if (error) {
      console.error("Erro ao atualizar viagem:", error.message);
      return;
    }

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId ? { ...trip, [field]: value } : trip
      )
    );
  };

  const updateTransportField = async (tripId, field, value) => {
    if (field !== "airline") return;

    const { error } = await supabase
      .from("trips")
      .update({ airline: value })
      .eq("id", tripId);

    if (error) {
      console.error("Erro ao atualizar companhia aérea:", error.message);
      return;
    }

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              transport: {
                ...trip.transport,
                airline: value,
              },
            }
          : trip
      )
    );
  };

  const addAttraction = () => {};
  const removeAttraction = () => {};
  const addRestaurant = () => {};
  const removeRestaurant = () => {};

return (
  <div className="app">
    <header className="header">
      <div>
        <p className="mini-title">Travel Planner</p>
        <h1>Organize suas viagens com visual profissional</h1>
        <p className="header-subtitle">
          Planeje destinos, orçamento, datas e detalhes em um só lugar.
        </p>
      </div>

      <button className="header-btn">+ Nova viagem</button>
    </header>

    <section className="dashboard">
      <div className="dashboard-card">
        <span>Total de viagens</span>
        <strong>{trips.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Planejadas</span>
        <strong>
          {trips.filter((trip) => trip.status === "Planejada").length}
        </strong>
      </div>

      <div className="dashboard-card">
        <span>Reservadas</span>
        <strong>
          {trips.filter((trip) => trip.status === "Reservada").length}
        </strong>
      </div>
    </section>

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