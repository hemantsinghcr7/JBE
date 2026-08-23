/**
 * Pull a human-readable message out of an unknown thrown value.
 *
 * Supabase rejects with a PostgrestError — a plain object with
 * message/details/hint/code, NOT an Error instance. `err instanceof Error`
 * is false for those, so a naive catch block silently replaces a real
 * database error ("violates check constraint …") with a generic string and
 * makes the actual failure impossible to diagnose.
 */
export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  if (err && typeof err === "object") {
    const e = err as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [e.message, e.details, e.hint].filter(
      (p): p is string => typeof p === "string" && p.length > 0
    );
    if (parts.length > 0) {
      const code = typeof e.code === "string" && e.code ? ` [${e.code}]` : "";
      return `${parts.join(" — ")}${code}`;
    }
  }
  return fallback;
}
