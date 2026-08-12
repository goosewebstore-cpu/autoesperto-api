const BUILTIN_OWNER_EMAILS = ['goosewebstore@gmail.com'];

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  const owners = [
    ...BUILTIN_OWNER_EMAILS,
    ...(process.env.OWNER_EMAIL
      ? process.env.OWNER_EMAIL.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
      : []),
  ];
  return owners.includes(normalized);
}
