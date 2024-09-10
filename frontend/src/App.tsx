import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

type GameScore = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

const App: React.FC = () => {
  const [sport, setSport] = useState<string>('MLB');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchScores = async () => {
    setLoading(true);
    try {
      const result = await backend.getScores(sport);
      if ('ok' in result) {
        setScores(result.ok);
      } else {
        console.error('Error fetching scores:', result.err);
      }
      const updateTime = await backend.getLastUpdateTime();
      setLastUpdate(new Date(Number(updateTime) / 1000000).toLocaleString());
    } catch (error) {
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
          Live Sports Scores
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
        ) : (
          <>
            <Grid container spacing={2}>
              {scores.map((game, index) => (
                <Grid item xs={12} sm={6} key={index}>
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
