import React, { useState } from 'react';
import { Autocomplete, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Link, Grid } from '@mui/material';

function PartLocator() {
    const [selectedFile, setSelectedFile] = useState('');
    const [partData, setPartData] = useState([]);
    const [input, setInput] = useState('');
    const [partName, setPartName] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [foundPartName, setFoundPartName] = useState('');

    // Static location data
    const staticLocations = {
        "Natwar Dispatch Centre": { part_name: "Natwar, Bikramganj", lat: 25.232489218023193, lng: 84.15211882042063 },
        "Buxar Receiving Centre": { part_name: "Buxar", lat: 25.559996531774747, lng: 83.97295528115723 },
        "Takiya Receiving Centre": { part_name: "Takiya, Sasaram", lat: 24.962868, lng: 84.00794 }
    };

    const handleFileChange = async (event) => {
        const fileUrl = event.target.value;
        setSelectedFile(fileUrl); // Storing the URL in state
        setMapLink('');
        setFoundPartName('');
    
        if (staticLocations[fileUrl]) {
            const location = staticLocations[fileUrl];
            setFoundPartName(location.part_name);
            const link = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
            setMapLink(link);
            setPartData([]);
            return;
        }
    
        // Check if the fileUrl is a valid URL and attempt to fetch JSON data
        if (fileUrl && fileUrl.startsWith('http')) {
            try {
                const response = await fetch(fileUrl);
                const data = await response.json();
                setPartData(data); // Assuming you have a state to hold this data
                // Perform any additional actions with the fetched data
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setPartData([]); // Reset or handle error state
            }
        }
    };    

    const handlePartNumberChange = (event) => {
        const value = event.target.value;
        setInput(value);

        if (!partData.length) return; // Skip if no part data is loaded

        const foundPart = partData.find(part => part.part_number.toString() === value.trim());
        if (foundPart) {
            setPartName(foundPart.part_name);
        } else {
            setPartName('');
        }
    };

    const handleSearch = () => {
        if (!partData.length) {
            setMapLink('Please select a valid file.');
            setFoundPartName('');
            return;
        }

        const foundPart = partData.find(part => 
            part.part_number.toString() === input.trim() || part.part_name.toLowerCase() === partName.toLowerCase()
        );

        if (foundPart) {
            const link = `https://www.google.com/maps/search/?api=1&query=${foundPart.lat},${foundPart.lng}`;
            setMapLink(link);
            setFoundPartName(foundPart.part_name);  // Store the found part name
        } else {
            setMapLink('Location not found.');
            setFoundPartName('');
        }
    };

    return (
        <Box sx={{ width: '100%', margin: 'auto', textAlign: 'center', mt: 5, px: 3 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Where to go?</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedFile}
                    label="Where to go?"
                    onChange={handleFileChange}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="https://ramanhacks.github.io/part-locator/dinara.json">210-Dinara-AC-Booths</MenuItem>
                    <MenuItem value="https://ramanhacks.github.io/part-locator/nokha.json">211-Nokha-AC-Booths</MenuItem>
                    <MenuItem value="https://ramanhacks.github.io/part-locator/karakat.json">213-Karakat-AC-Booths</MenuItem>
                    <MenuItem value="Natwar Dispatch Centre">Natwar Dispatch Centre, BKG</MenuItem>
                    <MenuItem value="Buxar Receiving Centre">Buxar Receiving Centre</MenuItem>
                    <MenuItem value="Takiya Receiving Centre">Takiya Receiving Centre, Sasaram</MenuItem>
                </Select>
            </FormControl>
            {partData.length > 0 && (
                <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="part-number-input"
                            label="Booth Number"
                            value={input}
                            onChange={handlePartNumberChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="subtitle1">OR</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            freeSolo
                            disablePortal
                            id="autocomplete-part-name"
                            options={partData.map(part => part.part_name)}
                            value={partName}
                            renderInput={(params) => <TextField {...params} label="Booth Name" />}
                            onInputChange={(event, newInputValue) => setPartName(newInputValue)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleSearch} sx={{ mt: 2, mb: 2 }}>Find Booth</Button>
                    </Grid>
                </Grid>
            )}
            {mapLink && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography>
                        {foundPartName && <strong>Location: {foundPartName}</strong>}
                        {mapLink.startsWith('http') ? <><br /><Link href={mapLink} target="_blank" rel="noopener noreferrer">See Directions</Link></> : mapLink}
                    </Typography>
                </Grid>
            )}
        </Box>
    );
}

export default PartLocator;
