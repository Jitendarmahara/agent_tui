/*import { Command } from "commander";
export const fetchallthemodel = new Command("fetch")
    .description("fetch all the models list")
    .action(async () => {
        console.log("hi al the modles avaliable")
        const response = await fetch("https://models.dev/api.json")
        const data = await response.json() as Record<string, unknown>;
        const allmodels: string[] = [];

        for (const provider of Object.values(data)) {
            console.log(provider);
        }
    })
        */
