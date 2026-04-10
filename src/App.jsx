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

  const saveTripEdits = async (updatedTrip) => {
    if (
      !updatedTrip.destination ||
      !updatedTrip.startDate ||
      !updatedTrip.endDate ||
      !updatedTrip.budget ||
      !updatedTrip.status
    ) {
      alert("Preencha todos os campos obrigatórios da viagem.");
      return { success: false };
    }

    if (new Date(updatedTrip.endDate) <= new Date(updatedTrip.startDate)) {
      alert("A data final deve ser maior que a data de início.");
      return { success: false };
    }

    const { error } = await supabase
      .from("trips")
      .update({
        destination: updatedTrip.destination,
        start_date: updatedTrip.startDate,
        end_date: updatedTrip.endDate,
        budget: updatedTrip.budget,
        status: updatedTrip.status,
        airline: updatedTrip.transport?.airline || "",
        accommodation: updatedTrip.accommodation || "",
        notes: updatedTrip.notes || "",
      })
      .eq("id", updatedTrip.id);

    if (error) {
      console.error("Erro ao salvar alterações:", error.message);
      alert("Não foi possível salvar as alterações.");
      return { success: false };
    }

    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );

    return { success: true };
  };

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

        <button
          className="header-btn"
          onClick={() =>
            document
              .querySelector(".form-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          + Nova viagem
        </button>
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
          saveTripEdits={saveTripEdits}
        />
      </main>
    </div>
  );
}

export default App;