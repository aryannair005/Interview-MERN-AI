import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import {askAi} from "../services/openRouter.service"

export const analyzeResume = async (req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({message:"Resume Required"})
        }
        const filepath = req.file.path

        const fileBuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(fileBuffer)

        const pdf = await pdfjsLib.getDocument({data:uint8Array}).promise

        let resumeText = "";

        for(let pageNum = 1;pageNum <= pdf.numPages ; pageNum++){
            const page = await pdf.getPage(pageNum)
            const content = await page.getTextContent()

            const pageText = content.items.map(item => item.str).join(" ")
            resumeText += pageText + "\n"
        }

        resumeText = resumeText.replace(/\s+/g," ").trim()

        const message = [
            {
                role:"system",
                content: `Extract structured data from resume.
                Return strictly JSON:
                {
                "role":"string",
                "experience":"string",
                "project":["project1","project2"],
                "skills":["skill1","skill2"]
                }`
            },
            {
                role:"user",
                content:resumeText
            }
        ]

        const aiResponse = await askAi(message)

        const parsed = JSON.parse(aiResponse)
        fs.unlinkSync(filepath)

        return res.json({
            role:parsed.role,
            experience:parsed.experience,
            projects : parsed.projects,
            skills : parsed.skills,
            resumeText
        })

    }catch(error){
        console.error(error)
        if(req.file && fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }

        return res.status(500).json({message:error.message})
    }
}