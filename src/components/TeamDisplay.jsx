import { useMemo } from 'react';
import './TeamDisplay.css';

const calculateTeamRating = (team, ratings) => {
  if (!ratings) return null;
  return team.reduce((sum, player) => sum + ratings[player].rating, 0);
};

export default function TeamDisplay({ teams, config, onReset }) {
  const suggestions = useMemo(() => {
    if (!config.useRating) return [];

    const swaps = [];
    const maxMargin = 5;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        for (let p1 = 0; p1 < team1.length; p1++) {
          for (let p2 = 0; p2 < team2.length; p2++) {
            const player1 = team1[p1];
            const player2 = team2[p2];

            if (config.ratings[player1].isCaptain && config.ratings[player2].isCaptain) {
              continue;
            }

            const currentRating1 = calculateTeamRating(team1, config.ratings);
            const currentRating2 = calculateTeamRating(team2, config.ratings);
            const currentDiff = Math.abs(currentRating1 - currentRating2);

            const newTeam1 = [...team1];
            const newTeam2 = [...team2];
            newTeam1[p1] = player2;
            newTeam2[p2] = player1;

            const newRating1 = calculateTeamRating(newTeam1, config.ratings);
            const newRating2 = calculateTeamRating(newTeam2, config.ratings);
            const newDiff = Math.abs(newRating1 - newRating2);

            const improvement = currentDiff - newDiff;

            if (improvement > 0 && improvement <= maxMargin) {
              swaps.push({
                player1,
                player2,
                team1Index: i,
                team2Index: j,
                improvement,
                currentDiff,
                newDiff
              });
            }
          }
        }
      }
    }

    return swaps.sort((a, b) => b.improvement - a.improvement).slice(0, 5);
  }, [teams, config.useRating, config.ratings]);

  return (
    <div className="teams-container">
      <h1>🎯 Equipos Generados</h1>

      {config.useRating && suggestions.length > 0 && (
        <div className="suggestions-panel">
          <h3>💡 Sugerencias de Intercambio</h3>
          <p className="suggestions-intro">
            Intercambios que mejorarían el balance sin alterar demasiado los equipos:
          </p>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-number">#{index + 1}</span>
                  <span className="improvement-badge">
                    Mejora: {suggestion.improvement.toFixed(1)} pts
                  </span>
                </div>
                <div className="suggestion-swap">
                  <div className="swap-player">
                    <span className="team-label">Equipo {suggestion.team1Index + 1}</span>
                    <span className="player-name">{suggestion.player1}</span>
                  </div>
                  <div className="swap-arrow">⇄</div>
                  <div className="swap-player">
                    <span className="team-label">Equipo {suggestion.team2Index + 1}</span>
                    <span className="player-name">{suggestion.player2}</span>
                  </div>
                </div>
                <div className="suggestion-stats">
                  <span>Diferencia actual: {suggestion.currentDiff.toFixed(1)}</span>
                  <span>→</span>
                  <span className="new-diff">Nueva: {suggestion.newDiff.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {config.useRating && suggestions.length === 0 && (
        <div className="suggestions-panel no-suggestions">
          <h3>✅ Equipos Perfectamente Balanceados</h3>
          <p>No hay intercambios que mejoren significativamente el equilibrio actual.</p>
        </div>
      )}

      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <h2>Equipo {index + 1}</h2>
            {config.useRating && (
              <div className="team-rating">
                <div className="rating-total">Rating Total: {calculateTeamRating(team, config.ratings)}</div>
                <div className="rating-avg">
                  Promedio: {(calculateTeamRating(team, config.ratings) / team.length).toFixed(1)}
                </div>
              </div>
            )}
            <ul className="player-list">
              {team.map(player => {
                const isCaptain = config.ratings?.[player]?.isCaptain;
                return (
                  <li 
                    key={player} 
                    className={`player-item ${isCaptain ? 'captain' : ''}`}
                  >
                    <span className="player-info">
                      {isCaptain && <span className="captain-badge">👑</span>}
                      {player}
                    </span>
                    {config.ratings && (
                      <span className="player-rating">
                        {config.ratings[player].rating}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {config.extraPlayers && config.extraPlayers.length > 0 && (
        <div className="extra-players">
          <h3>Jugadores Suplentes</h3>
          <p>{config.extraPlayers.join(', ')}</p>
        </div>
      )}

      <button onClick={onReset} className="btn-reset">
        ← Crear Nuevos Equipos
      </button>
    </div>
  );
}
