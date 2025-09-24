import request from "./request";

const PatientService = {
        getAllPatients: async () : Promise<string[]> => {
                return await request.get("/user");
        },
        analyzeHealth: async (patientId: string, dateStart: string, dateEnd: string, question: string) : Promise<string> => {
                return await request.post("/analyze_health_data", {
                        id_paciente: patientId,
                        pergunta: question,
                        date_start: dateStart,
                        date_end: dateEnd
                });
        }
}

export default PatientService;