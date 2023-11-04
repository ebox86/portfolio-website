import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import AboutPage, { Experience } from "./about-page"

async function getExperiences(){
    try {
        const experiencesDirectory = path.join(process.cwd(), 'src/data/experiences');
        const filenames = fs.readdirSync(experiencesDirectory);
        const experiences = filenames.map(filename => {
            const filePath = path.join(experiencesDirectory, filename);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);
        
            // Check if the data has a 'skills' field and convert it to an array
            if (data.skills && typeof data.skills === 'string') {
                data.skills = data.skills.split(',').map(skill => skill.trim());
            }
        
            return data;
        });
    
        experiences.sort((a, b) => b.startYear - a.startYear);
        return experiences as Experience[]
    } catch (error: any) {
        throw new Error('failed to parse experience mdx')
    }
}

export default async function Page() {
    const exp = await getExperiences()
    return <AboutPage experiences={exp} />
}