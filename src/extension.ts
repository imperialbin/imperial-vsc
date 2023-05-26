/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import fetch from "node-fetch";
import { AcceptableSettings, Document, ImperialAPIResponse } from "./types";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "imperial.uploadDocument",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const selectedCode = editor.document.getText(editor.selection);
      if (selectedCode.trim().length === 0) return;

      const config = vscode.workspace.getConfiguration("imperial");
      const settings: AcceptableSettings = {
        apiToken: config.get("apiToken") ?? "",
        longURLs: config.get("longURLs") ?? false,
        shortURLs: config.get("shortURLs") ?? false,
        imageEmbed: config.get("imageEmbed") ?? false,
        expiration: config.get("expiration") ?? null,
        encrypted: config.get("encrypted") ?? false,
        password: undefined,
      };

      if (settings.encrypted) {
        settings.password = await vscode.window.showInputBox({
          prompt:
            "Enter a password to encrypt the document with (leave blank for autogen)",
          password: true,
        });
      }

      const response = await fetch("https://api.imperialb.in/v1/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: settings.apiToken,
        },
        body: JSON.stringify({
          content: selectedCode,
          settings: {
            long_urls: settings.longURLs,
            short_urls: settings.shortURLs,
            image_embed: settings.imageEmbed,
            expiration: settings.expiration,
            encrypted: settings.encrypted,
            password: settings.password,
            language: vscode.window.activeTextEditor?.document.languageId,
          },
        }),
      });

      const parsedResponse = (await response.json()) as ImperialAPIResponse<
        Document & { password?: string }
      >;

      if (!response.ok || !parsedResponse.success || !parsedResponse.data) {
        vscode.window.showErrorMessage(
          `An error occurred: ${
            parsedResponse?.message ?? response.statusText ?? "Unknown error"
          }`
        );
        return;
      }

      const formattedLink = `${parsedResponse.data.links.formatted}${
        parsedResponse.data.settings.encrypted
          ? `#${parsedResponse.data.password}`
          : ""
      }`;

      const selection = await vscode.window.showInformationMessage(
        `Uploaded to IMPERIAL!\n${parsedResponse.data.links.formatted}`,
        "Copy link",
        "Open document"
      );

      const btnSelection = selection?.toLowerCase();

      switch (btnSelection) {
        case "copy link":
          await vscode.env.clipboard.writeText(formattedLink);
          break;
        case "open document":
          await vscode.commands.executeCommand(
            "vscode.open",
            vscode.Uri.parse(formattedLink)
          );
          break;
        default:
          break;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
