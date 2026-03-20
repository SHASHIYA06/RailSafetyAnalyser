export function isAuthenticated(): boolean {
  return localStorage.getItem("dlp_auth") === "true";
}

export function getUser(): string {
  return localStorage.getItem("dlp_user") || "Admin";
}

export function getRole(): string {
  return localStorage.getItem("dlp_role") || "admin";
}

export function logout() {
  localStorage.removeItem("dlp_auth");
  localStorage.removeItem("dlp_role");
  localStorage.removeItem("dlp_user");
}
