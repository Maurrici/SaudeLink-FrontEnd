import { useState, useRef, useEffect, type SetStateAction } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import PatientService, { type Patient, type Periodo } from "../../services/PatientService";
import { SafeHTML } from "../SafeHTML";
import loadingImg from "../../assets/loading.png"
import confirmUser from "../../assets/confirm-user.png"
import confirmCalendar from "../../assets/calendar.png"
import sending from "../../assets/sending.png"

interface ChatProps {
        paciente: Patient;
}

interface Message {
        date: Date;
        from: "server" | "client";
        content: string;
}

const Chat = () => {
        const [loading, setLoading] = useState<boolean>(false);
        const [step, setStep] = useState<"patient" | "period" | "chat">();

        // Paciente Selecionado
        const [patients, setPatients] = useState<Patient[]>([]);
        const [selectedPatient, setSelectedPatient] = useState<Patient>();
        const handleSelectPatient = (event: any) => {
                const patient = patients.find(p => p.id == event.target.value)
                setSelectedPatient(patient);
        }

        const handleConfirmPatient = () => {
                const messageServer : Message = {
                        content: selectedPatient?.nome ?? "",
                        from: "client",
                        date: new Date()
                }
                setMessages(prev => [...prev, messageServer])
                setStep("period")

                if(selectedPatient?.periodo) {
                        const periodos = selectedPatient!.periodo;
                        setMinDate(dayjs(
                                periodos!.reduce((min, p) => 
                                        p.data_inicio < min ? p.data_inicio : min, 
                                        periodos![0].data_inicio
                                )
                        ))
                        setMaxDate(dayjs(
                                periodos!.reduce((max, p) => 
                                        p.data_fim > max ? p.data_fim : max, 
                                        periodos![0].data_fim
                                )
                        ))
                        const ultimoPeriodo = periodos![periodos!.length - 1]
                        
                        setValue([
                                dayjs(ultimoPeriodo!.data_inicio),
                                dayjs(ultimoPeriodo!.data_fim)
                        ])
                }
        }

        const isPerfil = (id: string) => {
                if(id.includes("ATLETA") || id.includes("ESTRESSADO") || id.includes("SAUDAVEL") || id.includes("SEDENTARIO")) {
                        return true
                } else {
                        return false
                }
        }
        
        useEffect(() => {
                PatientService.getAllPatients()
                .then(res => {
                        setPatients(res);
                })
                .catch(err => {
                        console.log("Error: ", err)
                }) 
        }, [])
        // ---------------------------------------------------

        // Período de Avaliação
        const [minDate, setMinDate] = useState();
        const [maxDate, setMaxDate] = useState();

        const [value, setValue] = useState<DateRange<Dayjs>>();

        const handleConfirmDate = () => {
                const messageServer : Message = {
                        content: `De ${value![0]?.format("DD/MM/YYYY")} até ${value![1]?.format("DD/MM/YYYY")}`,
                        from: "client",
                        date: new Date()
                }
                setMessages(prev => [...prev, messageServer])
                setStep("chat")
        }
        // ---------------------------------------------------

        // Chat
        const [question, setQuestion] = useState<string>("");
        const [chatId, setChatId] = useState<string>();
        const [messages, setMessages] = useState<Message[]>([]);

        const sendMessage = (question: string) => {
                setLoading(true)

                const messageClient : Message = {
                        content: question,
                        from: "client",
                        date: new Date()
                }

                setMessages(prev => [...prev, messageClient])

                PatientService.analyzeHealth(selectedPatient!.id, value![0]?.format("YYYY-MM-DD") ?? "", value![1]?.format("YYYY-MM-DD") ?? "", question, chatId)
                .then(res => {
                        setChatId(res.chat_id);
                        const messageServer : Message = {
                                content: res.resposta,
                                from: "server",
                                date: new Date()
                        }

                        setMessages(prev => [...prev, messageServer])
                })
                .catch(err => {
                        const messageServer : Message = {
                                content: "Erro na comunicação com o servidor!",
                                from: "server",
                                date: new Date()
                        }

                        setMessages([...messages, messageServer])
                })
                .finally(() => {
                        setQuestion("")
                        setLoading(false)
                }) 
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                        sendMessage(question)
                }
        };

        const chatEndRef = useRef(null);

        useEffect(() => {
                if (chatEndRef.current) {
                        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
        }, [messages]);

        useEffect(() => {
                if(step) {
                        if(step == "patient") {
                                const messageServer : Message = {
                                        content: "Vamos começar. Qual paciente devemos analisar?",
                                        from: "server",
                                        date: new Date()
                                }

                                setMessages(prev => [...prev, messageServer])
                        } else if(step == "period") {
                                const messageServer : Message = {
                                        content: "Ótimo. Qual é o período que devemos considerar?",
                                        from: "server",
                                        date: new Date()
                                }

                                setMessages(prev => [...prev, messageServer]) 
                        } else {
                                const messageServer : Message = {
                                        content: `Tudo pronto. Pode perguntar sobre os dados do paciente ${selectedPatient?.nome} no período de ${value![0]?.format("DD/MM/YYYY")} até ${value![1]?.format("DD/MM/YYYY")}`,
                                        from: "server",
                                        date: new Date()
                                }

                                setMessages(prev => [...prev, messageServer]) 
                        }
                }else {
                        setStep("patient");
                }
        }, [step])

        return(
                <div className="chat-container">
                        <div className="chat-output">
                                {messages.map(m => (
                                        <div className={`${m.from}-container`}>
                                                <div className={`${m.from}-message`}>
                                                        <SafeHTML html={m.content} />
                                                </div>
                                        </div>
                                ))
                                }
                                <div ref={chatEndRef} />
                                {loading &&
                                        <img src={loadingImg} className="loading" />
                                }
                        </div>
                        <div className="chat-input">
                                {step == "patient" &&
                                <>
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

                                <Button
                                        variant="outlined"
                                        className="confirm-btn"
                                        onClick={handleConfirmPatient}
                                >
                                        <img src={confirmUser} />
                                </Button>
                                </>
                                }
                                {step == "period" &&
                                <>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangePicker', 'DateRangePicker']} sx={{paddingTop: "0px", width: "100%"}}>
                                                <DateRangePicker
                                                        disabled={loading}
                                                        calendars={1}
                                                        value={value}
                                                        format="DD/MM/YYYY"
                                                        onChange={(newValue: SetStateAction<DateRange<Dayjs>>) => setValue(newValue)}
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                />
                                        </DemoContainer>
                                </LocalizationProvider>

                                <Button
                                        variant="outlined"
                                        className="confirm-btn"
                                        onClick={handleConfirmDate}
                                >
                                        <img src={confirmCalendar} />
                                </Button>
                                </>
                                }
                                {step == "chat" &&
                                <>
                                <TextField 
                                        disabled={loading}
                                        sx={{flexGrow: 2}} 
                                        value={question} 
                                        onChange={e => setQuestion(e.target.value)} 
                                        onKeyDown={handleKeyDown}
                                />

                                <Button
                                        variant="outlined"
                                        className="confirm-btn"
                                        onClick={() => sendMessage(question)}
                                >
                                        <img src={sending} />
                                </Button>
                                </>
                                }
                        </div>
                </div>
        )
}

export default Chat;