import { useState } from "react";
import CertificateButton from "../components/CertificateButton";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function TestCertificate() {
  const [slug, setSlug] = useState("javascript");
  const [issuing, setIssuing] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const issueCertificate = async () => {
    if (!authService.isLoggedIn()) {
      alert("Du måste vara inloggad.");
      navigate("/account");
      return;
    }
    setIssuing(true);
    try {
      const res = await fetch(`${API}/api/certificates/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Kunde inte utfärda certifikat");
      }
      alert("Certifikat utfärdat (eller fanns redan) – klicka sedan på 'Visa certifikat'.");
    } catch (err) {
      console.error(err);
      alert("Kunde inte utfärda certifikat.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Certifikat – Test</h1>

      <div className="space-y-2">
        <label className="block text-sm text-slate-600">Kursens slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="t.ex. javascript, csharp, html"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={issueCertificate}
          disabled={issuing}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {issuing ? "Skapar..." : "Skapa/utfärda certifikat (seed)"}
        </button>

        <CertificateButton courseSlug={slug} label="Visa certifikat" />
      </div>
    </div>
  );
}
