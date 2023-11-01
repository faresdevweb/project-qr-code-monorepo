

export const useRegister = () => {

    const registerTeacher = async (formData: any, JWT: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/auth/createTeacher', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${JWT}`
                },
                body: formData
            })
            const data = await response.json();
            if(!response.ok){
                console.log('Error :', data.message);
                
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier :", error);
        }
    }

    const registerStudent = async (formData: any, JWT: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/auth/createStudent', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${JWT}`
                },
                body: formData
            })
            const data = await response.json();
            if(data.success){
                console.log('Student registered successfully');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier :", error);
        }
    }

    return {
        registerStudent,
        registerTeacher
    }
}