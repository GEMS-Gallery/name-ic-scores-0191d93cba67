import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid, CircularProgress, Alert, Paper } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

type GameScore = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

const MLBScoreTile: React.FC<{ game: GameScore }> = ({ game }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
    <Typography variant="subtitle1" gutterBottom>
      {game.homeTeam} vs {game.awayTeam}
    </Typography>
    <Typography variant="h4">
      {game.homeScore} - {game.awayScore}
    </Typography>
  </Paper>
);

const App: React.FC = () => {
  const [sport, setSport] = useState<string>('MLB');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.getScores(sport);
      if ('ok' in result) {
        setScores(result.ok);
      } else {
        setError(result.err);
      }
      const updateTime = await backend.getLastUpdateTime();
      setLastUpdate(new Date(Number(updateTime) / 1000000).toLocaleString());
    } catch (error) {
      setError('Error fetching scores. Please try again later.');
      console.error('Error fetching scores:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [sport]);

  const handleSportChange = (event: SelectChangeEvent) => {
    setSport(event.target.value as string);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Live Sports Scores (Mock Data)
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="sport-select-label">Sport</InputLabel>
          <Select
            labelId="sport-select-label"
            id="sport-select"
            value={sport}
            label="Sport"
            onChange={handleSportChange}
          >
            <MenuItem value="MLB">MLB</MenuItem>
            <MenuItem value="NBA">NBA</MenuItem>
            <MenuItem value="NFL">NFL</MenuItem>
            <MenuItem value="NHL">NHL</MenuItem>
            <MenuItem value="MLS">MLS</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Grid container spacing={2}>
              {scores.map((game, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  {sport === 'MLB' ? (
                    <MLBScoreTile game={game} />
                  ) : (
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {game.homeTeam} vs {game.awayTeam}
                        </Typography>
                        <Typography variant="body1">
                          {game.homeScore} - {game.awayScore}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Last updated: {lastUpdate}
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default App;
