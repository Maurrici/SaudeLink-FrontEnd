import { useEffect, useState } from 'react'
import { Box, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import './App.css'
import logo from "./assets/logo.png"
import PatientService from './services/PatientService';
import SideBar from './components/SideBar/SideBar';
import Chat from './components/Chat/Chat';

function App() {
  const [step, setStep] = useState<number>(1);
  const [patients, setPatients] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  useEffect(() => {
    PatientService.getAllPatients()
      .then(res => {
        setPatients(res);
      })
      .catch(err => {
        setPatients(["A", "B"])
      }) 
  }, [])

  const handleSelectPatient = (event: any) => {
    setSelectedPatient(event.target.value as string);
    setStep(2);
  }

  return (
    <div className='fullSize elementsInCenter'>
      {step === 1 && 
      (
        <Box className='selectPatient'>
          <img src={logo} alt="Logo da Aplicação" />

          <FormControl fullWidth>
            <InputLabel id="patient-field-label">Paciente</InputLabel>
            <Select
              labelId="patient-field-label"
              value={selectedPatient}
              label="Paciente"
              sx={{minWidth: "200px"}}
              onChange={handleSelectPatient}
            >
              {
                patients.map(patient => (
                  <MenuItem value={patient}>{patient}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      )
      }

      {step == 2 && 
      (
        <SideBar onClickNewChat={() => setStep(1)}>
          <Chat patientId={selectedPatient} />
        </SideBar>
      )
      }
    </div>
  )
}

export default App
