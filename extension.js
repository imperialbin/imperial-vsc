const vscode = require("vscode");
const Imperial = require("imperial-node").Imperial;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand("imperial.uploadCode", () => {
        const config = vscode.workspace.getConfiguration("imperial");
        const editor = vscode.window.activeTextEditor;
        // where da editor go?
        if(!editor) return;
        // Current highlighted code.
        const selectedCode = editor.document.getText(editor.selection);

        const imperialAPI = new Imperial(config.apiToken);
        const documentSettings = {
            longerUrls: config.longerUrls || false,
            instantDelete: config.instantDelete || false,
            imageEmbed: config.imageEmbed || false,
            expiration: config.expiration || 5,
        };

        imperialAPI.createDocument(selectedCode, documentSettings, async (err, document) => {
            if(err) return vscode.window.showInformationMessage("This upload failed, you may be getting rate limited!");
            const selection = await vscode.window.showInformationMessage(
                /* Text */
                `Uploaded selected text to Imperial!\n${document.formattedLink}`,
                /* Buttons */
                "Copy Link",
                "Open Document"
            );
            selection = selection.toLowerCase();

            if (selection == "copy link") {
                return await vscode.env.clipboard.writeText(document.formattedLink);
            } else if (selection == "open document") {
                return await vscode.commands.executeCommand(
                    "vscode.open",
                    vscode.Uri.parse(document.formattedLink)
                );
            }
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate,
};
