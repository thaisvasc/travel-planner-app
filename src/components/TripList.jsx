import { useState } from "react";

function TripList({
  trips,
  deleteTrip,
  updateTripField,

  updateTransportField,
}) {
  const [openTripId, setOpenTripId] = useState(null);

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
    setOpenTripId(openTripId === tripId ? null : tripId);
  };

  return (
    <section className="trips-section">
      <h2>Minhas viagens</h2>

      {trips.length === 0 ? (
        <p>Nenhuma viagem adicionada ainda.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <div className="trip-card-header">
              <div>
                <h3>{trip.destination}</h3>
                <p className="trip-duration">
                  {calculateTripDays(trip.startDate, trip.endDate)} dias de viagem
                </p>
              </div>

              <span className={getStatusClass(trip.status)}>
                {trip.status}
              </span>
            </div>

            <div className="trip-info-grid">
              <p><strong>Início:</strong> {trip.startDate}</p>
              <p><strong>Fim:</strong> {trip.endDate}</p>
              <p><strong>Orçamento:</strong> R$ {trip.budget}</p>
            </div>

            <button
              className="toggle-btn"
              onClick={() => toggleTripDetails(trip.id)}
            >
              {openTripId === trip.id ? "Fechar detalhes" : "Ver detalhes"}
            </button>

            {openTripId === trip.id && (
              <>
                <div className="trip-details">
                  <h4>Planejamento</h4>

                  <label>Companhia aérea</label>
                  <input
                    type="text"
                    placeholder="Ex: LATAM"
                    value={trip.transport?.airline || ""}
                    onChange={(e) =>
                      updateTransportField(trip.id, "airline", e.target.value)
                    }
                  />

                  <label>Hospedagem</label>
                  <input
                    type="text"
                    placeholder="Ex: Hotel no centro"
                    value={trip.accommodation || ""}
                    onChange={(e) =>
                      updateTripField(trip.id, "accommodation", e.target.value)
                    }
                  />

                  <label>Notas</label>
                  <textarea
                    placeholder="Observações sobre a viagem"
                    value={trip.notes || ""}
                    onChange={(e) =>
                      updateTripField(trip.id, "notes", e.target.value)
                    }
                  />
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTrip(trip.id)}
                >
                  Excluir viagem
                </button>
              </>
            )}
          </div>
        ))
      )}
    </section>
  );
}

export default TripList; 