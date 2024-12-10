import { Uri } from "vscode";
import { ExecuteOptions, FileController } from "../controllers/controller.interface";
import { CommandConstructorOptions, Command } from "./command.interface";

interface ExecuteControllerOptions {
    openFileInEditor?: boolean;
}

export abstract class BaseCommand<T extends FileController> implements Command {
    constructor(protected controller: T, readonly options?: CommandConstructorOptions) {}

    public abstract execute(uri?: Uri): Promise<void>;

    protected async executeController(
        executeOpts: ExecuteOptions | undefined,
        options?: ExecuteControllerOptions
    ): Promise<void> {
        if (executeOpts) {
            const result = await this.controller.execute(executeOpts);
            if (options?.openFileInEditor) {
                await this.controller.openFileInEditor(result);
            }
        }
    }
}