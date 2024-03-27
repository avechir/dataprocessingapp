import './App.css';
import React from "react";
import { useState } from 'react';
import '@fontsource/roboto/300.css';
import { Button, Checkbox, Container, TextField, FormControlLabel, Typography } from '@mui/material';
import { Paper } from '@mui/material';

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState('');
  const [booleanInput, setBooleanInput] = useState(false);
  const [feature1, setFeature1] = useState('');
  const [feature2, setFeature2] = useState('');
  const [n_clusters, setNclusters] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  
  const fetchData = async (feature1, feature2) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const booleanInputVal = booleanInput ? 1 : 0;
      const response1 = await fetch(`http://localhost:5000/calculations/${booleanInputVal}`, 
      { mode: 'cors', method: 'POST', body: formData} );
      const responseData = await response1.json();
      setData(responseData);
      const response2 = await fetch(`http://localhost:5000/clustering/${booleanInputVal}/${feature1}/${feature2}/${n_clusters}`,
      {mode: 'cors', method: 'POST', body: formData});
      const blob = await response2.blob();
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(feature1, feature2);  
    if (!file) {
      alert('Please select a file');
      return;
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  console.log('Data state:', data);

  return(
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Means calculation and cluster plotting
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="text" component="label">
        Choose File
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Button>
            {file && (
        <Typography variant="body1">{file.name}</Typography>
        
      )}
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={booleanInput}
              onChange={(e) => setBooleanInput(e.target.checked)}
            />
          }
          label="There is ID"
        />
        <Typography variant="h6" gutterBottom>State number of clusters and features for the plot</Typography>
        <TextField
          type="number"
          label="Number of clusters"
          value={n_clusters}
          onChange={(e) => setNclusters(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '16px' }}
          inputProps={{ min: 1 }}
          required
        />
        <TextField
          label="Feature 1"
          value={feature1}
          onChange={(e) => setFeature1(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '16px' }}
          required  
        />
        <TextField
          label="Feature 2"
          value={feature2}
          onChange={(e) => setFeature2(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '16px' }}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h3" gutterBottom>Result</Typography>
        {data ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <Typography variant="body1"><strong>{key}:</strong> {value}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body1">No data available</Typography>
        )}
        {imageSrc && <img src={imageSrc} alt="Plot" style={{ marginTop: '20px', maxWidth: '100%' }} />}
      </Paper>
    </Container>
  )
}

export default App;
