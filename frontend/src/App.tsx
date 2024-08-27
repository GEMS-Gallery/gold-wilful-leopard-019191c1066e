import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [playbackStatus, setPlaybackStatus] = useState<string>('idle');
  const [eventLog, setEventLog] = useState<Array<[bigint, string]>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    const fetchEventLog = async () => {
      const log = await backend.getEventLog();
      setEventLog(log);
    };
    fetchEventLog();
  }, []);

  const handleError = (error: any) => {
    console.error('Error:', error);
    setLoading(false);
    alert("An error occurred. The canister may be out of cycles. Please try again later.");
  };

  const onSubmit = async (data: { text: string }) => {
    setLoading(true);
    try {
      const result = await backend.convertTextToSpeech(data.text);
      if ('ok' in result) {
        await backend.playAudio();
        await updatePlaybackStatus();
        await updateEventLog();
      } else {
        handleError(result.err);
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  const updatePlaybackStatus = async () => {
    const status = await backend.getPlaybackStatus();
    setPlaybackStatus(status);
  };

  const updateEventLog = async () => {
    const log = await backend.getEventLog();
    setEventLog(log);
  };

  const handleParticipantJoined = async () => {
    setLoading(true);
    try {
      const result = await backend.handleEvent('participant_joined');
      if ('ok' in result) {
        await updateEventLog();
        await updatePlaybackStatus();
      } else {
        handleError(result.err);
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        IC TTS App
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="text"
          control={control}
          defaultValue=""
          rules={{ required: 'Text is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Enter text for TTS"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Convert and Play'}
        </Button>
      </form>
      <Button
        onClick={handleParticipantJoined}
        variant="contained"
        color="secondary"
        style={{ marginTop: '1rem' }}
        disabled={loading}
      >
        Simulate Participant Joined
      </Button>
      <Typography variant="h6" style={{ marginTop: '1rem' }}>
        Playback Status: {playbackStatus}
      </Typography>
      <Typography variant="h6" style={{ marginTop: '1rem' }}>
        Event Log:
      </Typography>
      <List>
        {eventLog.map(([timestamp, event], index) => (
          <ListItem key={index}>
            <ListItemText
              primary={event}
              secondary={new Date(Number(timestamp) / 1000000).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
