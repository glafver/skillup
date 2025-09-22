import React, { useMemo } from "react";

export type CertificateDto = {
  id: string;
  userId: string;
  courseSlug: string;
  firstname: string;
  lastname: string;
  courseTitle: string;
  issuedAt: string | Date;
};

type Props = {
  certificate: CertificateDto;
  logoSrc?: string;
  courseIconSrc?: string;
  showPrintButton?: boolean;
  embedded?: boolean;
};

const formatSvDate = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
};

const Certificate: React.FC<Props> = ({
  certificate,
  logoSrc = "/logo-cyan-name.png",
  courseIconSrc,
  showPrintButton = true,
}) => {
  const issued = useMemo(() => formatSvDate(certificate.issuedAt), [certificate.issuedAt]);
  const fullName = useMemo(
    () => `${certificate.firstname} ${certificate.lastname}`.trim(),
    [certificate.firstname, certificate.lastname]
  );

  const fallbackCourseIcon = `/${certificate.courseSlug}.png`;
  const iconSrc = courseIconSrc ?? fallbackCourseIcon;

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-6 print:p-0">
      <style>{`@page { size: A4 landscape; margin: 20mm; }`}</style>

      <section
        className="relative w-[297mm] max-w-[1200px] bg-white shadow-lg rounded-xl border-8 border-sky-700 print:shadow-none"
        aria-labelledby="certificate-title"
      >
        <div className="pointer-events-none absolute inset-4 rounded-lg border-2 border-sky-300/70" />

        <div className="relative px-10 lg:px-16 py-12 lg:py-16">
          <div className="mb-6">
            <img src={logoSrc} alt="SkillUp logo" className="mx-auto w-32" />
          </div>

          <h1
            id="certificate-title"
            className="font-[Playfair_Display] text-3xl sm:text-4xl lg:text-5xl text-sky-900 text-center tracking-wide mb-8"
          >
            Certificate of Completion
          </h1>

          <p className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            {fullName}
          </p>

          <p className="text-center text-lg sm:text-xl text-slate-700">
            har framgångsrikt slutfört kursen
          </p>
          <p className="text-center font-[Playfair_Display] text-2xl sm:text-3xl text-sky-800 mt-2">
            {certificate.courseTitle}
          </p>

          <div className="mx-auto mt-8 mb-10 h-px w-40 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

          <div className="mt-8 flex items-end justify-between gap-8">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-slate-500">Datum</p>
              <p className="mt-1 text-lg font-medium text-slate-800">{issued}</p>
            </div>

            <div className="flex-1 flex justify-end">
              <img src={iconSrc} alt="Kursikon" className="w-[100px] h-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {showPrintButton && (
        <div className="fixed bottom-4 right-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-sky-700 text-white shadow hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default Certificate;
