const BASE_URL = "http://localhost:5000/api/quiz";

//create
export const createQuiz = async (data) => {

    //hardcode
     const payload = {
        title: data.title,
        teacherId: "699fe963fac309cee0d145a8",
        classroomId:  "699c1b8f7d82290b85e8bdd9",
        questions: data.questions || [],          
        startTime: data.startTime ? new Date(data.startTime) : undefined,
       endTime: data.endTime ? new Date(data.endTime) : undefined,
       isPublished: typeof data.isActive !== "undefined" ? data.isActive : false,
    };

    const res = await fetch (`${BASE_URL}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization:`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWZlOTYzZmFjMzA5Y2VlMGQxNDVhOCIsInJvbGUiOiJ0ZWFjaGVyIiwic2Nob29sIjpudWxsLCJpYXQiOjE3NzQ5MzgxMTYsImV4cCI6MTc3NTAyNDUxNn0.TDEFg4zjzj4HrRBD9YPHFLbQmAl7F1dYkSXA5v_er3s`
        },
        //body: JSON.stringify(data),
         body: JSON.stringify(payload),

    });

    if (!res.ok) {
    const text = await res.text(); 
    console.error("Server response:", text);
    throw new Error("Failed to create quiz");
  }
    return res.json();
};