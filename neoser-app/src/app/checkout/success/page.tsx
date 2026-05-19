import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";

type SearchParams = Promise<{ orderRef?: string }>;

function SuccessContent({ orderRef }: { orderRef?: string }) {
  return (
    <main className="min-h-screen bg-cream py-16 md:py-24">
      <div className="container-main mx-auto max-w-2xl">
        <div className="surface-card p-8 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-navy md:text-4xl">
            ¡Inscripción confirmada!
          </h1>

          {orderRef && (
            <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
              Orden: <span className="font-mono text-navy">{orderRef}</span>
            </p>
          )}

          <p className="mt-6 text-gray-600">
            Gracias por confiar en NeoSer. Te enviamos un correo con los
            detalles del curso al email registrado.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Si no recibes el correo en los próximos minutos, revisa tu bandeja
            de spam o escríbenos.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/cursos" className="btn-primary">
              Volver al catálogo
            </Link>
            <Link href="/" className="btn-pink-outline text-sm">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderRef } = await searchParams;

  return (
    <Suspense fallback={null}>
      <SuccessContent orderRef={orderRef} />
    </Suspense>
  );
}
