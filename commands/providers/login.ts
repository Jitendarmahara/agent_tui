
import { Command } from 'commander';
import { join } from 'path';

export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action(async (options) => {
        console.log(options);
                const configPath = join(import.meta.dir, '../../config.json');
                
                let configdat: any = {
                    provider: {},
                    selectedmodel: {
                        model: ""
                    }
                };
        
                const file = Bun.file(configPath);
                if (await file.exists()) {
                    try {
                        const content = await file.text();
                        const parsed = JSON.parse(content);
                        // Ensure parsed object has the correct top-level structure
                        if (parsed && typeof parsed === 'object') {
                            if (parsed.provider && typeof parsed.provider === 'object' && !Array.isArray(parsed.provider)) {
                                configdat.provider = parsed.provider;
                            }
                            if (parsed.selectedmodel && typeof parsed.selectedmodel === 'object' && !Array.isArray(parsed.selectedmodel)) {
                                configdat.selectedmodel = parsed.selectedmodel;
                            }
                        }
                    } catch (e) {
                        // Ignore parsing errors and keep defaults
                    }
                }
        
                if (options.provider && options.api_key) {
                    configdat.provider[options.provider] = options.api_key;
                }
        
                await Bun.write(configPath, JSON.stringify(configdat, null, 2));
                
                // Print the updated config and completion message
                console.log(configdat);
                console.log(`written to ${configPath}`);
        console.log("logging into " + options.provider)
    })
