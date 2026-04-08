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
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate && endDate <= newStartDate) {
      setEndDate("");
    }
  };

  const getMinEndDate = () => {
    if (!startDate) return "";

    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay.toISOString().split("T")[0];
  };

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
        onChange={handleStartDateChange}
      />

      <label>Data do fim</label>
      <input
        type="date"
        value={endDate}
        min={getMinEndDate()}
        disabled={!startDate}
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