export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const owner = process.env.OWNER_EMAIL || 'goosewebstore@gmail.com';
  return email.toLowerCase() === owner.toLowerCase();
}
