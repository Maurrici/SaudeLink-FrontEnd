import { useEffect, useState } from 'react'
import { Box, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import './App.css'
import logo from "./assets/logo.png"
import PatientService, { type Patient } from './services/PatientService';
import SideBar from './components/SideBar/SideBar';
import Chat from './components/Chat/Chat';

function App() {
  const [step, setStep] = useState<number>(1);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  useEffect(() => {
    PatientService.getAllPatients()
      .then(res => {
        setPatients(res);
      })
      .catch(err => {s
        console.log("Error: ", err)
      }) 
  }, [])

  const handleSelectPatient = (event: any) => {
    setSelectedPatient(event.target.value as string);
    setStep(2);
  }

  const isPerfil = (id: string) => {
    if(id.includes("ATLETA") || id.includes("ESTRESSADO") || id.includes("SAUDAVEL") || id.includes("SEDENTARIO")) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className='fullSize elementsInCenter'>
      {step === 1 && 
      (
        <div style={{backgroundColor: "#0a505d", padding: "18px 2px", borderRadius: "36px"}}>
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
                    <MenuItem value={patient.id}>{patient.nome}{isPerfil(patient.id) ? `(${patient.id})` : ""}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        </div>
      )
      }

      {step == 2 && 
      (
        <SideBar onClickNewChat={() => setStep(1)}>
          <Chat paciente={patients.find(p => p.id == selectedPatient)!} />
        </SideBar>
      )
      }
    </div>
  )
}

export default App
