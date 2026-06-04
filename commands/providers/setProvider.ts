import { Command } from "commander";
import { join } from "path";

export const setProviderCommand = new Command("set")
  .description("Set the default provider")
  .requiredOption(
    "-p, --provider <providerName>",
    "Name of the provider (gemini, claude, etc)"
  )
  .action(async (options) => {
    const configPath = join(import.meta.dir, "../../config.json");

    let configData: any = {
      provider: {},
      selectedmodel: {
        model: "",
      },
    };

    const file = Bun.file(configPath);

    if (await file.exists()) {
      try {
        const content = await file.text();
        configData = JSON.parse(content);
      } catch {
        console.error("Failed to read config.json");
        return;
      }
    }

    // Ensure selectedmodel exists
    if (
      !configData.selectedmodel ||
      typeof configData.selectedmodel !== "object"
    ) {
      configData.selectedmodel = {
        model: "",
      };
    }

    // ONLY update selectedmodel
    configData.selectedmodel.model = options.provider;

    await Bun.write(configPath, JSON.stringify(configData, null, 2));

    console.log(`Default provider set to: ${options.provider}`);
  });