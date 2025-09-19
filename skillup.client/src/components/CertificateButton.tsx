import React, { useState } from "react";
import Modal from "./Modal";
import Certificate, { type CertificateDto } from "./Certificate";
import { authService } from "../services/authService";

type Props = {
  courseSlug: string;
  label?: string;
};

const CertificateButton: React.FC<Props> = ({ courseSlug, label = "Visa certifikat" }) => {
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState<CertificateDto | null>(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const fetchCertificate = async () => {
    if (!authService.isLoggedIn()) {
      alert("Du måste vara inloggad.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/certificates/me/${courseSlug}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (!res.ok) throw new Error("Kunde inte hämta certifikat");
      const data: CertificateDto = await res.json();
      setCertificate(data);
      setOpen(true);
    } catch (e) {
      console.error(e);
      alert("Kunde inte hämta certifikatet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={fetchCertificate}
        disabled={loading}
        className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-50 transition"
      >
        {loading ? "Laddar..." : label}
      </button>

      <Modal open={open && !!certificate} onClose={() => setOpen(false)}>
        {certificate && (
          <Certificate certificate={certificate} embedded showPrintButton />
        )}
      </Modal>
    </>
  );
};

export default CertificateButton;
