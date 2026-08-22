export type AccountKind = "product" | "careers";

export type ProfileAccess = {
  productAccess: boolean;
  careersAccess: boolean;
  osDownloadGranted: boolean;
};

export function defaultNextForKind(kind: AccountKind) {
  return kind === "careers" ? "/careers/apply" : "/dashboard";
}

export function loginPathForKind(kind: AccountKind) {
  return kind === "careers" ? "/careers/login" : "/login";
}

export function signupPathForKind(kind: AccountKind) {
  return kind === "careers" ? "/careers/signup" : "/signup";
}
