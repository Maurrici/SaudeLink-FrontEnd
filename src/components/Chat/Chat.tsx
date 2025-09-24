import { useState, type SetStateAction } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from "@mui/material";
import type { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

interface ChatProps {
        patientId: string;
}

interface Message {
        date: Date;
        from: "server" | "client";
        content: string;
}

const Chat = ({patientId} : ChatProps) => {

        const [value, setValue] = useState<DateRange<Dayjs>>([
                dayjs(),
                dayjs(),
        ]);
        const [question, setQuestion] = useState<string>();

        const [messages, setMessages] = useState<Message>();

        return(
                <div className="chat-container">
                        <div className="chat-output">
                                <div className={`${"server"}-container`}>
                                        <div className={`${"server"}-message`}>
                                                Ensure you have a compatible version of @mui/x-date-pickers-pro installed. Check the official MUI documentation for the correct import paths and available exports for your specific version. The DateRange interface might be available in a different module or under a different name in newer versions.
                                        </div>
                                </div>
                                <div className={`${"client"}-container`}>
                                        <div className={`${"client"}-message`}>
                                                Ensure you have a compatible version 
                                        </div>
                                </div>
                        </div>
                        <div className="chat-input">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangePicker', 'DateRangePicker']} sx={{paddingTop: "0px"}}>
                                                <DateRangePicker
                                                        calendars={1}
                                                        value={value}
                                                        onChange={(newValue: SetStateAction<DateRange<Dayjs>>) => setValue(newValue)}
                                                />
                                        </DemoContainer>
                                </LocalizationProvider>
                                
        
                                <TextField sx={{flexGrow: 2}} value={question} onChange={e => setQuestion(e.target.value)} />
                        </div>
                </div>
        )
}

export default Chat;