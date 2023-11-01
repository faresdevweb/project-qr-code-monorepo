import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const useTeacher = (JWT: { access_token: string }) => {
    const router = useRouter();
    const [ course, setCourse ] = useState<[]>([]);

    useEffect(() => {
        if (
            router.pathname === "/startcourse" || 
            router.pathname === "/generateqrcode" || 
            router.pathname === "/reportissues" 
        ) {
            getTeacherCourse(JWT);
        }
    }, [router.pathname])

    const reportIssues = async (description: string, courseId: string) => {
        try {
            const response = await fetch(`http://192.168.1.25:4000/teacher/${courseId}/report-issue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({ description: description })
            });
            if(!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH REPORT ISSUES",error)
        }
    }

    const generateQrCode = async (courseId: string)=> {
        try {
            const response = await fetch(`http://192.168.1.25:4000/teacher/${courseId}/generate-qr`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                }
            })
            if(!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.log("ERROR IN CATCH GENERATE QR CODE",error)
            return null;
        }
        
    }

    const startCourse = async (courseId: string) => {
        try {
            const response = await fetch(`http://192.168.1.25:4000/teacher/${courseId}/start`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${JWT}`
                }
            })
            if(!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
            }
        } catch (error) {
            console.log("ERROR IN CATCH START COURSE",error)
        }
    }

    const getTeacherCourse = async (JWT: { access_token: string }) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/teacher/getCourses', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${JWT}`
                }
            })
            const data = await response.json();
            setCourse(data)
        } catch (error) {
            console.log("ERROR IN CATCH GET GROUP",error)
        }
    }

    return { course, startCourse, generateQrCode, reportIssues }
}