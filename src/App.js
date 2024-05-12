import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import PartLocator from './components/PartLocator';  // Assuming PartLocator is your main component

function App() {
  return (
      <>
          <CssBaseline />
          <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
              <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                      2024 Bihar Lok Sabha Map Locator
                  </Typography>
              </Toolbar>
          </AppBar>
          <Container>
              <PartLocator />
          </Container>
      </>
  );
}

export default App;
