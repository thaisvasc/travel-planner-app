function TripForm({
  destination,
  setDestination,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  budget,
  setBudget,
  status,
  setStatus,
  addTrip,
}) {
  return (
    <section className="form-section">
      <h2>Nova viagem</h2>

      <input
        type="text"
        placeholder="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <label>Data de início</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label>Data do Fim</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <input
        type="number"
        placeholder="Orçamento"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Selecione o status</option>
        <option value="Planejada">Planejada</option>
        <option value="Reservada">Reservada</option>
        <option value="Concluída">Concluída</option>
      </select>

      <button className="add-btn" onClick={addTrip}>
        Adicionar viagem
      </button>
    </section>
  );
}

export default TripForm;