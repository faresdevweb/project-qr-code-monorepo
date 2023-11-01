import { useState, useEffect } from "react";
import { useRouter } from "next/router";


export const useCourse = (JWT: { access_token: string }) => {
    const router = useRouter();

    const [ groupe, setGroupe ] = useState<[]>([]);
    const [ teacher, setTeacher ] = useState<[]>([]);
    const [ course, setCourse ] = useState<[]>([]);

    useEffect(() => {
        if (router.pathname === "/managecourse") {
            getGroupe(JWT);
            getTeacher(JWT);
            getCourse(JWT);
        }

    }, [router.pathname]);

    const addStudentToCourse = async (JWT: { access_token: string }, courseId: string, groupId: string) => {
        try {
            const response = await fetch(`http://192.168.1.25:4000/admin/${courseId}/add-students-to-course`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ groupId: groupId })
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH ADD STUDENT TO COURSE",error)
        }
    }

    const createCourse = async (
        JWT: { access_token: string },
        subject: string, 
        startingTime: Date, 
        duration: number, 
        teacherId: string, 
        groupId: string ) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/admin/createCourse', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({
                    name: subject,
                    startingTime: startingTime, 
                    duration: duration, 
                    teacherId: teacherId, 
                    groupId: groupId })
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            
        }
    }

    

    const getCourse = async (JWT: { access_token: string }) => {
        try {
            console.log("ici");
            
            const response = await fetch('http://192.168.1.25:4000/admin/getCourse', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                }
            })
            const data = await response.json();
            setCourse(data)
        } catch (error) {
            console.log("ERROR IN CATCH GET GROUP",error)
        }
    }

    const getGroupe = async (JWT: { access_token: string }) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/admin/getGroup', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                }
            })
            const data = await response.json();
            setGroupe(data)
        } catch (error) {
            console.log("ERROR IN CATCH GET GROUP",error)
        }
    }

    const getTeacher = async (JWT: { access_token: string }) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/auth/getTeacher', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                }
            })
            const data = await response.json();
            setTeacher(data)
        } catch (error) {
            console.log("ERROR IN CATCH GET TEACHER",error)
        }
    }

    return { groupe,teacher, course, createCourse, addStudentToCourse }
}