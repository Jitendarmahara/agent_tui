import { Command } from "commander";
import { callagent } from "../agent-helper";

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    let response = await callagent( options.prompt)
    console.log(response)

    console.log("Agent loop done")


  });