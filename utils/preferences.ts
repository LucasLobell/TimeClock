import { account } from "@/app/appwrite";

export const STRICT_TIME_RULING_PREF_KEY = "strictTimeRuling";

export function getStrictTimeRulingPreference(
  prefs?: Record<string, unknown> | null
) {
  const value = prefs?.[STRICT_TIME_RULING_PREF_KEY];

  return typeof value === "boolean" ? value : true;
}

export async function updateStrictTimeRulingPreference(strictTimeRuling: boolean) {
  const user = await account.get();
  const currentPrefs = (user.prefs ?? {}) as Record<string, unknown>;

  return account.updatePrefs({
    ...currentPrefs,
    [STRICT_TIME_RULING_PREF_KEY]: strictTimeRuling,
  });
}