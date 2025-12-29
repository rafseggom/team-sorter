import { useState } from 'react';
import './InitialConfig.css';
import faviconImg from '../assets/favicon.png';

export default function InitialConfig({ onNext }) {
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(5);
  const [playerNames, setPlayerNames] = useState('');
  const [error, setError] = useState('');

  const currentPlayerCount = playerNames
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0).length;

  const totalPlayers = numTeams * playersPerTeam;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const names = playerNames
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    const totalPlayers = numTeams * playersPerTeam;

    if (names.length === 0) {
      setError('Por favor, introduce al menos un nombre.');
      return;
    }

    if (names.length < totalPlayers) {
      setError(`Necesitas al menos ${totalPlayers} jugadores para ${numTeams} equipos de ${playersPerTeam} personas.`);
      return;
    }

    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
      setError('Hay nombres duplicados. Por favor, usa nombres únicos o diferenciables.');
      return;
    }

    onNext({
      numTeams,
      playersPerTeam,
      players: names.slice(0, totalPlayers),
      extraPlayers: names.slice(totalPlayers)
    });
  };

  return (
    <div className="config-container">
      <h1>
        <img src={faviconImg} alt="" className="title-icon" />
        Team Sorter
        <img src={faviconImg} alt="" className="title-icon" />
      </h1>
      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label htmlFor="numTeams">Número de equipos:</label>
          <input
            id="numTeams"
            type="number"
            min="2"
            max="10"
            value={numTeams}
            onChange={(e) => setNumTeams(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="playersPerTeam">Jugadores por equipo:</label>
          <input
            id="playersPerTeam"
            type="number"
            min="1"
            max="20"
            value={playersPerTeam}
            onChange={(e) => setPlayersPerTeam(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="playerNames">
            Nombres de jugadores (separados por coma):
          </label>
          <textarea
            id="playerNames"
            rows="5"
            placeholder="Juan, María, Pedro, Ana, Luis, Carmen..."
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            required
          />
          <div className="player-count-info">
            <small className="help-text">
              Total necesario: {totalPlayers} jugadores
            </small>
            <small className={`current-count ${currentPlayerCount >= totalPlayers ? 'enough' : 'not-enough'}`}>
              Introducidos: {currentPlayerCount}
            </small>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-primary">
          Siguiente
        </button>
      </form>
    </div>
  );
}
