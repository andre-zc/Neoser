import { login } from "./actions";

const LOGIN_ERRORS: Record<string, string> = {
  invalid_credentials: "El correo o la contraseña no son correctos.",
  email_not_confirmed: "La cuenta todavía no ha sido confirmada.",
  service_unavailable:
    "No pudimos conectar con el servicio de acceso. Intenta nuevamente en un momento.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;
  const errorMessage = errorCode ? LOGIN_ERRORS[errorCode] : null;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-[var(--navy)]">
        Acceso administrativo
      </h1>

      <p className="mb-6 text-center text-sm text-gray-600">
        Ingresa con una cuenta autorizada para gestionar los contactos de
        NeoSer.
      </p>

      {errorMessage && (
        <p
          role="alert"
          className="mb-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <form className="flex w-full flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Contrasena
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            className="rounded-md border px-3 py-2"
          />
        </label>

        <button
          formAction={login}
          className="rounded-md bg-[var(--navy)] px-4 py-2 text-white hover:opacity-90"
        >
          Entrar
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-500">
        Las cuentas administrativas son habilitadas únicamente por el equipo
        de NeoSer.
      </p>
    </main>
  );
}
