import { useState } from "react";

function TripList({ trips, deleteTrip, saveTripEdits }) {
  const [openTripId, setOpenTripId] = useState(null);
  const [editingTripId, setEditingTripId] = useState(null);
  const [editedTrip, setEditedTrip] = useState(null);

  const formatCurrencyBRL = (value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return "R$ 0,00";

    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const calculateTripDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffInTime = end - start;
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1;

    return diffInDays > 0 ? diffInDays : 0;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Planejada":
        return "status-badge planned";
      case "Reservada":
        return "status-badge booked";
      case "Concluída":
        return "status-badge completed";
      default:
        return "status-badge";
    }
  };

  const toggleTripDetails = (tripId) => {
    if (editingTripId === tripId) return;
    setOpenTripId(openTripId === tripId ? null : tripId);
  };

  const startEditing = (trip) => {
    setOpenTripId(trip.id);
    setEditingTripId(trip.id);
    setEditedTrip({
      ...trip,
      transport: {
        airline: trip.transport?.airline || "",
      },
    });
  };

  const cancelEditing = () => {
    setEditingTripId(null);
    setEditedTrip(null);
  };

  const handleEditChange = (field, value) => {
    setEditedTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAirlineChange = (value) => {
    setEditedTrip((prev) => ({
      ...prev,
      transport: {
        ...prev.transport,
        airline: value,
      },
    }));
  };

  const getMinEndDate = (startDate) => {
    if (!startDate) return "";

    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay.toISOString().split("T")[0];
  };

  const handleStartDateChange = (value) => {
    setEditedTrip((prev) => {
      const updated = { ...prev, startDate: value };

      if (
        updated.endDate &&
        value &&
        new Date(updated.endDate) <= new Date(value)
      ) {
        updated.endDate = "";
      }

      return updated;
    });
  };

  const handleSave = async () => {
    const result = await saveTripEdits(editedTrip);

    if (result.success) {
      setEditingTripId(null);
      setEditedTrip(null);
    }
  };

  return (
    <section className="trips-section">
      <h2>Minhas viagens</h2>

      {trips.length === 0 ? (
        <p>Nenhuma viagem adicionada ainda.</p>
      ) : (
        trips.map((trip) => {
          const isOpen = openTripId === trip.id;
          const isEditing = editingTripId === trip.id;
          const currentTrip = isEditing ? editedTrip : trip;

          return (
            <div key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <div>
                  <h3>{trip.destination}</h3>
                  <p className="trip-duration">
                    {calculateTripDays(trip.startDate, trip.endDate)} dias de viagem
                  </p>
                </div>

                <span className={getStatusClass(trip.status)}>{trip.status}</span>
              </div>

              <div className="trip-info-grid">
                <p>
                  <strong>Início:</strong> {trip.startDate}
                </p>
                <p>
                  <strong>Fim:</strong> {trip.endDate}
                </p>
                <p>
                  <strong>Orçamento:</strong> {formatCurrencyBRL(trip.budget)}
                </p>
                <p>
                  <strong>Status:</strong> {trip.status}
                </p>
              </div>

              {!isOpen ? (
                <button
                  className="toggle-btn"
                  onClick={() => toggleTripDetails(trip.id)}
                >
                  Ver detalhes
                </button>
              ) : (
                <div className="card-actions">
                  {!isEditing ? (
                    <>
                      <button
                        className="toggle-btn"
                        onClick={() => toggleTripDetails(trip.id)}
                      >
                        Fechar detalhes
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => startEditing(trip)}
                      >
                        Editar viagem
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="save-btn" onClick={handleSave}>
                        Salvar alterações
                      </button>

                      <button className="cancel-btn" onClick={cancelEditing}>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              )}

              {isOpen && !isEditing && (
                <div className="trip-details">
                  <h4>Detalhes da viagem</h4>

                  <p>
                    <strong>Companhia aérea:</strong>{" "}
                    {trip.transport?.airline || "Não informada"}
                  </p>

                  <p>
                    <strong>Hospedagem:</strong>{" "}
                    {trip.accommodation || "Não informada"}
                  </p>

                  <p>
                    <strong>Notas:</strong> {trip.notes || "Sem observações"}
                  </p>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTrip(trip.id)}
                  >
                    Excluir viagem
                  </button>
                </div>
              )}

              {isOpen && isEditing && currentTrip && (
                <div className="trip-details">
                  <h4>Editar viagem</h4>

                  <label>Destino</label>
                  <input
                    type="text"
                    value={currentTrip.destination || ""}
                    onChange={(e) =>
                      handleEditChange("destination", e.target.value)
                    }
                  />

                  <label>Data de início</label>
                  <input
                    type="date"
                    value={currentTrip.startDate || ""}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />

                  <label>Data de fim</label>
                  <input
                    type="date"
                    value={currentTrip.endDate || ""}
                    min={getMinEndDate(currentTrip.startDate)}
                    disabled={!currentTrip.startDate}
                    onChange={(e) => handleEditChange("endDate", e.target.value)}
                  />

                  <label>Orçamento</label>
                  <input
                    type="number"
                    placeholder="Ex: 3500"
                    value={currentTrip.budget || ""}
                    onChange={(e) => handleEditChange("budget", e.target.value)}
                  />

                  <label>Status</label>
                  <select
                    value={currentTrip.status || ""}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                  >
                    <option value="">Selecione o status</option>
                    <option value="Planejada">Planejada</option>
                    <option value="Reservada">Reservada</option>
                    <option value="Concluída">Concluída</option>
                  </select>

                  <label>Companhia aérea</label>
                  <input
                    type="text"
                    placeholder="Ex: LATAM"
                    value={currentTrip.transport?.airline || ""}
                    onChange={(e) => handleAirlineChange(e.target.value)}
                  />

                  <label>Hospedagem</label>
                  <input
                    type="text"
                    placeholder="Ex: Hotel no centro"
                    value={currentTrip.accommodation || ""}
                    onChange={(e) =>
                      handleEditChange("accommodation", e.target.value)
                    }
                  />

                  <label>Notas</label>
                  <textarea
                    placeholder="Observações sobre a viagem"
                    value={currentTrip.notes || ""}
                    onChange={(e) => handleEditChange("notes", e.target.value)}
                  />

                  <button
                    className="delete-btn"
                    onClick={() => deleteTrip(trip.id)}
                  >
                    Excluir viagem
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  );
}

export default TripList;