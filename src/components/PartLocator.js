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
        "Dispatch Centre": { part_name: "Natwar, Bikramganj", lat: 25.232489218023193, lng: 84.15211882042063 },
        "Receiving Centre": { part_name: "Takiya Sasaram", lat: 24.962868, lng: 84.00794 }
    };

    const handleFileChange = async (event) => {
        const fileName = event.target.value;
        setSelectedFile(fileName);
        setMapLink('');
        setFoundPartName('');

        if (staticLocations[fileName]) {
            const location = staticLocations[fileName];
            setFoundPartName(location.part_name);
            const link = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
            setMapLink(link);
            setPartData([]);
            return;
        }

        if (fileName) {
            try {
                const response = await fetch(`/${fileName}`);
                const data = await response.json();
                setPartData(data);
            } catch (error) {
                console.error('Failed to fetch part data:', error);
                setPartData([]);
            }
        } else {
            setPartData([]);
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
                <InputLabel id="demo-simple-select-label">Select a File</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedFile}
                    label="Select Centre Type"
                    onChange={handleFileChange}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={`${process.env.PUBLIC_URL}/dinara.json`}>210-Dinara-AC</MenuItem>
                    <MenuItem value={`${process.env.PUBLIC_URL}/nokha.json`}>211-Nokha-AC</MenuItem>
                    <MenuItem value={`${process.env.PUBLIC_URL}/karakat.json`}>213-Karakat-AC</MenuItem>
                    <MenuItem value="Dispatch Centre">Dispatch Centre</MenuItem>
                    <MenuItem value="Receiving Centre">Receiving Centre</MenuItem>
                </Select>
            </FormControl>
            {partData.length > 0 && (
                <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="part-number-input"
                            label="Part Number"
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
                            renderInput={(params) => <TextField {...params} label="Part Name" />}
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
