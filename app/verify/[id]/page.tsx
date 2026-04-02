import { CheckCircle2, XCircle, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MOCK_CERTIFICATES } from "@/lib/mock-data";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = MOCK_CERTIFICATES.find((c) => c.uniqueId === id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {certificate ? (
          <div className="text-center">
            {/* Success state */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="mb-1 text-2xl font-bold text-green-400">Certificate Verified</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              This certificate is authentic and valid.
            </p>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20">
              <Award className="h-10 w-10 text-amber-400" />
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <div>
                <p className="text-xs text-muted-foreground">Course</p>
                <p className="font-semibold">{certificate.courseTitle}</p>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <p className="text-xs text-muted-foreground">Recipient</p>
                <p className="font-semibold">{certificate.recipientName}</p>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <p className="text-xs text-muted-foreground">Date Issued</p>
                <p className="font-semibold">
                  {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <p className="text-xs text-muted-foreground">Certificate ID</p>
                <p className="font-mono text-sm">{certificate.uniqueId}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Not found state */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="mb-1 text-2xl font-bold text-red-400">Certificate Not Found</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              No certificate exists with the ID &quot;{id}&quot;. Please check the link and try again.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to EduForge
          </Link>
        </div>
      </div>
    </div>
  );
}
