import { useState } from "react";

function TripList({
  trips,
  deleteTrip,
  updateTripField,
  updateTransportField,
  addAttraction,
  removeAttraction,
  addRestaurant,
  removeRestaurant,
}) {
  const [openTripIndex, setOpenTripIndex] = useState(null);

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

  const toggleTripDetails = (index) => {
    setOpenTripIndex(openTripIndex === index ? null : index);
  };

  return (
    <section className="trips-section">
      <h2>Minhas viagens</h2>

      {trips.length === 0 ? (
        <p>Nenhuma viagem adicionada ainda.</p>
      ) : (
        trips.map((trip, index) => (
          <div key={index} className="trip-card">
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
              onClick={() => toggleTripDetails(index)}
            >
              {openTripIndex === index ? "Fechar detalhes" : "Ver detalhes"}
            </button>

            {openTripIndex === index && (
              <>
                <div className="trip-details">
                  <h4>Planejamento</h4>

                  <label>Companhia aérea</label>
                  <input
                    type="text"
                    placeholder="Ex: LATAM"
                    value={trip.transport?.airline || ""}
                    onChange={(e) =>
                      updateTransportField(index, "airline", e.target.value)
                    }
                  />

                  <label>Hospedagem</label>
                  <input
                    type="text"
                    placeholder="Ex: Hotel no centro"
                    value={trip.accommodation || ""}
                    onChange={(e) =>
                      updateTripField(index, "accommodation", e.target.value)
                    }
                  />

                  <label>Notas</label>
                  <textarea
                    placeholder="Observações sobre a viagem"
                    value={trip.notes || ""}
                    onChange={(e) =>
                      updateTripField(index, "notes", e.target.value)
                    }
                  />
                </div>

                <div className="trip-details">
                  <h4>Pontos turísticos</h4>

                  <div className="inline-field">
                    <input
                      type="text"
                      placeholder="Adicionar ponto turístico"
                      value={trip.newAttraction || ""}
                      onChange={(e) =>
                        updateTripField(index, "newAttraction", e.target.value)
                      }
                    />
                    <button
                      className="small-btn"
                      onClick={() => addAttraction(index)}
                    >
                      Adicionar
                    </button>
                  </div>

                  {trip.attractions.length === 0 ? (
                    <p>Nenhum ponto turístico adicionado.</p>
                  ) : (
                    <ul className="item-list">
                      {trip.attractions.map((attraction, attractionIndex) => (
                        <li key={attractionIndex} className="list-item">
                          <span>{attraction}</span>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              removeAttraction(index, attractionIndex)
                            }
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="trip-details">
                  <h4>Locais para comer</h4>

                  <div className="inline-field">
                    <input
                      type="text"
                      placeholder="Adicionar restaurante ou café"
                      value={trip.newRestaurant || ""}
                      onChange={(e) =>
                        updateTripField(index, "newRestaurant", e.target.value)
                      }
                    />
                    <button
                      className="small-btn"
                      onClick={() => addRestaurant(index)}
                    >
                      Adicionar
                    </button>
                  </div>

                  {trip.restaurants.length === 0 ? (
                    <p>Nenhum local para comer adicionado.</p>
                  ) : (
                    <ul className="item-list">
                      {trip.restaurants.map((restaurant, restaurantIndex) => (
                        <li key={restaurantIndex} className="list-item">
                          <span>{restaurant}</span>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              removeRestaurant(index, restaurantIndex)
                            }
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTrip(index)}
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