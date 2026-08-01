function trim(v: string | undefined): string {
  return (v ?? "").trim();
}

export function getCommandChatConfig() {
  const apiKey = trim(process.env.SPECTR_COMMAND_CHAT_API_KEY);
  const providerRaw = trim(process.env.SPECTR_COMMAND_CHAT_PROVIDER).toLowerCase();
  const provider =
    providerRaw === "anthropic" || providerRaw === "custom" || providerRaw === "openai"
      ? providerRaw
      : "anthropic";
  const baseUrl =
    trim(process.env.SPECTR_COMMAND_CHAT_BASE_URL) ||
    (provider === "anthropic" ? "https://api.anthropic.com" : "https://api.openai.com/v1");
  const model =
    trim(process.env.SPECTR_COMMAND_CHAT_MODEL) ||
    (provider === "anthropic" ? "claude-haiku-4-5-20251001" : "gpt-4o-mini");

  return {
    configured: Boolean(apiKey),
    provider,
    baseUrl,
    model,
    apiKey,
  };
}
