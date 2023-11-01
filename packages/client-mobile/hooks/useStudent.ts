import { useEffect, useState } from "react";

export const useStudent = (tokenJWT: string) => {

    const [messageCode, setMessageCode] = useState<string>('');
    const [edt, setEdt] = useState<[]>([]);

    console.log('edt:', edt);


    useEffect(() => {
        getEDT(tokenJWT);
      }, [])

      
    const scanQRCode = async (tokenJWT: string, token: string, courseId: string) => {
        try {
            const response = await fetch(`http://192.168.1.25:4000/student/${courseId}/sign-in`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenJWT}`
                },
                body: JSON.stringify({
                    token: token
                })
            });
            const errorData = await response.json();
            if (!response.ok) {
                console.error("Server responded with error:", errorData);
                setMessageCode(errorData.message);
            }
            return errorData;
        } catch (error) {
            console.error("Client responded with error:", error);
        }
    }


    const getEDT = async (tokenJWT: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/student/schedule', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${tokenJWT}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Server responded with error:", data);
            }
            setEdt(data);
        } catch (error) {
            console.error("Client responded with error:", error);
        }
    }

    return { scanQRCode, getEDT, messageCode, setMessageCode, edt };
}