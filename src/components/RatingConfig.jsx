import { useState } from 'react';
import './RatingConfig.css';

export default function RatingConfig({ config, onNext }) {
  const [useRating, setUseRating] = useState(false);
  const [playerRatings, setPlayerRatings] = useState(
    config.players.reduce((acc, player) => {
      acc[player] = { rating: 5, isCaptain: false };
      return acc;
    }, {})
  );

  const handleRatingChange = (player, rating) => {
    setPlayerRatings(prev => ({
      ...prev,
      [player]: { ...prev[player], rating: parseInt(rating) }
    }));
  };

  const handleCaptainChange = (player, isCaptain) => {
    setPlayerRatings(prev => ({
      ...prev,
      [player]: { ...prev[player], isCaptain }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const captains = Object.entries(playerRatings)
      .filter(([, data]) => data.isCaptain)
      .map(([name]) => name);

    if (useRating && captains.length > config.numTeams) {
      alert(`Solo puedes seleccionar hasta ${config.numTeams} capitanes (uno por equipo).`);
      return;
    }

    onNext({
      useRating,
      ratings: useRating ? playerRatings : null
    });
  };

  return (
    <div className="rating-container">
      <h1>Configuración de Equipos</h1>
      
      <form onSubmit={handleSubmit} className="rating-form">
        <div className="rating-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={useRating}
              onChange={(e) => setUseRating(e.target.checked)}
            />
            <span>¿Usar sistema de Rating?</span>
          </label>
          <p className="toggle-description">
            {useRating 
              ? 'Los equipos se balancearán según la calidad de los jugadores'
              : 'Los equipos se crearán de forma aleatoria'}
          </p>
        </div>

        {useRating && (
          <div className="players-rating-list">
            <h2>Califica a los jugadores</h2>
            <div className="rating-grid">
              {config.players.map(player => (
                <div key={player} className="player-rating-card">
                  <div className="player-name">{player}</div>
                  
                  <div className="rating-controls">
                    <label>
                      Rating:
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={playerRatings[player].rating}
                        onChange={(e) => handleRatingChange(player, e.target.value)}
                      />
                    </label>

                    <label className="captain-checkbox">
                      <input
                        type="checkbox"
                        checked={playerRatings[player].isCaptain}
                        onChange={(e) => handleCaptainChange(player, e.target.checked)}
                      />
                      <span>Capitán</span>
                    </label>
                  </div>

                  <div className="rating-indicator">
                    <div 
                      className="rating-bar" 
                      style={{ width: `${playerRatings[player].rating * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Generar Equipos →
          </button>
        </div>
      </form>
    </div>
  );
}
