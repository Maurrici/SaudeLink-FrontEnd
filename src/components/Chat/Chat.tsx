import { useState, useRef, useEffect, type SetStateAction } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from "@mui/material";
import type { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import PatientService, { type Patient } from "../../services/PatientService";
import { SafeHTML } from "../SafeHTML";
import loadingImg from "../../assets/loading.png"

interface ChatProps {
        paciente: Patient;
}

interface Message {
        date: Date;
        from: "server" | "client";
        content: string;
}

const Chat = ({paciente} : ChatProps) => {
        const [loading, setLoading] = useState<boolean>(false);

        const periodos = paciente.periodo;

        const minDate = dayjs(
                periodos.reduce((min, p) => 
                        p.data_inicio < min ? p.data_inicio : min, 
                        periodos[0].data_inicio
                )
        );

        const maxDate = dayjs(
                periodos.reduce((max, p) => 
                        p.data_fim > max ? p.data_fim : max, 
                        periodos[0].data_fim
                )
        );

        const ultimoPeriodo = periodos[periodos.length - 1];
        const [value, setValue] = useState<DateRange<Dayjs>>([
                dayjs(ultimoPeriodo.data_inicio),
                dayjs(ultimoPeriodo.data_fim)
        ]);

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

                PatientService.analyzeHealth(paciente.id, value[0]?.format("YYYY-MM-DD") ?? "", value[1]?.format("YYYY-MM-DD") ?? "", question, chatId)
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

        console.log(loading)

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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangePicker', 'DateRangePicker']} sx={{paddingTop: "0px"}}>
                                                <DateRangePicker
                                                        disabled={loading}
                                                        calendars={1}
                                                        value={value}
                                                        onChange={(newValue: SetStateAction<DateRange<Dayjs>>) => setValue(newValue)}
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                />
                                        </DemoContainer>
                                </LocalizationProvider>
                                
        
                                <TextField 
                                        disabled={loading}
                                        sx={{flexGrow: 2}} 
                                        value={question} 
                                        onChange={e => setQuestion(e.target.value)} 
                                        onKeyDown={handleKeyDown}
                                />
                        </div>
                </div>
        )
}

export default Chat;