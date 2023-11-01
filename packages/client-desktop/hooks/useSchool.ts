import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from 'react-cookie';

export const useSchool = () => {
    const router = useRouter();

    const [filiere, setFiliere] = useState<[] | null>([] || null);
    const [year, setYear] = useState<[] | null>([] || null);
    const [classData, setClassData] = useState<any[]>([]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    useEffect(() => {
        if(router.pathname === "/createyear") getFiliere(cookies.token)
        
        if(router.pathname === "/addstudentgroupandclass") getClass(cookies.token)

        if(router.pathname === "/creategroup"){ 
            getYear(cookies.token)
            getClass(cookies.token) 
        }

        if(router.pathname === "/createclass") getYear(cookies.token)
        
    }, [router.pathname])

    const createFiliere = async (JWT: { access_token: string}, filiereName: string, schoolId: string) => {
        try {
            const response = await fetch("http://192.168.1.25:4000/admin/createFiliere", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ name: filiereName, schoolId: schoolId })
            })
        } catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const createYear = async (JWT: { access_token: string }, year: string, filiereId: string) => {
        try {
            const response = await fetch("http://192.168.1.25:4000/admin/createYear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ year: year, filiereId: filiereId })
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const createClass = async (JWT: { access_token: string }, className: string, yearId: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/admin/createClass', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ name: className, yearId: yearId })
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const createGroup = async (JWT: { access_token: string }, groupName: string ,yearId: string, classId: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/admin/createGroup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ name: groupName, yearId: yearId, classId: classId })
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const addStudentToGroupAndClass = async (JWT: { access_token: string }, classId: string, formData: any) => {
        try {
            const response = await fetch(`http://192.168.1.25:4000/admin/${classId}/add-students`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${JWT}`
                },
                body: formData
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const getFiliere = async (JWT: { access_token: string}) => {
        try {
            const response = await fetch("http://192.168.1.25:4000/admin/getFiliere", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
            })
            const data = await response.json();
            setFiliere(data);
        }
        catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const getYear = async (JWT: { access_token: string}) => {
        try {
            const response = await fetch("http://192.168.1.25:4000/admin/getYear", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
            })
            const data = await response.json();
            setYear(data);
        }
        catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    const getClass = async (JWT: { access_token: string}) => {
        try {
            const response = await fetch("http://192.168.1.25:4000/admin/getClass", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
            })
            const data = await response.json();
            setClassData(data);
        }
        catch (error) {
            console.log("ERROR IN CATCH CREATE FILIERE",error)
        }
    }

    return { 
        createFiliere, 
        createYear,
        createClass,
        createGroup,
        addStudentToGroupAndClass, 
        getFiliere, 
        setFiliere,
        filiere,
        year,
        classData };
}