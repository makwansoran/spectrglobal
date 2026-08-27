export type AccountKind = "product" | "careers";

export type ProfileAccess = {
  productAccess: boolean;
  careersAccess: boolean;
  osDownloadGranted: boolean;
};

export function defaultNextForKind(kind: AccountKind) {
  return kind === "careers" ? "/careers/dashboard" : "/dashboard";
}

export function loginPathForKind(kind: AccountKind) {
  return kind === "careers" ? "/careers/login" : "/login";
}
