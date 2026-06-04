import { Command } from "commander";
import { providers } from "./model";

export const listproviders = new Command("list")
    .description("all the avaliable modes")
    .action(() => {
        console.log(("Available Providers and Models:"));
        providers.forEach(p => {
            console.log(`${(p.name)}`);
            console.log(` ${("Models:")} ${p.models.join(", ")}`);
        });
    });