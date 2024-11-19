import { Uri } from "vscode";
import { FileController } from "../controllers/controller.interface";
import { VsCodeFileItem } from "../core/file-item";
import { CommandConstructorOptions, Command } from "./command.interface";

interface ExecuteControllerOptions {
    openFileInEditor?: boolean;
}

export abstract class BaseCommand<T extends FileController> implements Command {
    constructor(protected controller: T, readonly options?: CommandConstructorOptions) {}

    public abstract execute(uri?: Uri): Promise<void>;

    protected async executeController(
        fileItem: VsCodeFileItem | undefined,
        options?: ExecuteControllerOptions
    ): Promise<void> {
        if (fileItem) {
            const result = await this.controller.execute({ fileItem });
            if (options?.openFileInEditor) {
                await this.controller.openFileInEditor(result);
            }
        }
    }
}