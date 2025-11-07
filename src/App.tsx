import { useEffect, useState } from 'react'
import { Box, Select, FormControl, InputLabel, MenuItem, Button } from '@mui/material';
import './App.css'
import logo from "./assets/logo.png"
import PatientService, { type Patient } from './services/PatientService';
import SideBar from './components/SideBar/SideBar';
import Chat from './components/Chat/Chat';

function App() {
  const [startChat, setStartChat] = useState<boolean>(false);

  return (
    <div className='fullSize elementsInCenter'>
      {startChat == false && 
      (
        <div style={{backgroundColor: "#0a505d", padding: "18px 2px", borderRadius: "36px"}}>
          <Box className='selectPatient'>
            <img src={logo} alt="Logo da Aplicação" />

            <Button className="btn-newChat" onClick={() => setStartChat(true)} variant="contained">Iniciar Análise</Button>
          </Box>
        </div>
      )
      }

      {startChat && 
      (
        <SideBar onClickNewChat={() => {
          setStartChat(false)
        }}>
          <Chat />
        </SideBar>
      )
      }
    </div>
  )
}

export default App
