import request from "./request";

interface Response {
        resposta: string;
        chat_id: string;
}

interface Periodo {
    data_inicio: string;
    data_fim: string;  
}

export interface Patient {
        id: string;    
        nome: string;
        periodo: Periodo[];
}

const PatientService = {
        getAllPatients: async () : Promise<Patient[]> => {
                return (await request.get("/users")).data;
        },
        analyzeHealth: async (patientId: string, dateStart: string, dateEnd: string, question: string, chatId: string | undefined = undefined) : Promise<Response> => {
                return(await request.post("/analyze_health_data", {
                        id_paciente: patientId,
                        pergunta: question,
                        date_start: dateStart,
                        date_end: dateEnd,
                        chat_id: chatId
                })).data;
        }
}

export default PatientService;