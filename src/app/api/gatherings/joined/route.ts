import axios from "axios";

export async function GET(request: Request) {
    // const response = await axios.get(`https://fe-adv-project-together-dallaem.vercel.app/mm6-dev/gatherings/joined?sortBy=dateTime&sortOrder=asc`);
    const response = await axios.get(`https://fe-adv-project-together-dallaem.vercel.app/mm6-dev/gatherings`);
    console.log(response.data);
    return Response.json(response.data); //프론트엔드에게 데이터를 줘
}