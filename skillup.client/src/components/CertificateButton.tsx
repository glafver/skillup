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
      const res = await fetch(`${API}/api/certificate/me/${courseSlug}`, {
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
        className="flex-none self-center my-2 mx-4 px-4 py-2 text-sm font-medium rounded bg-sky-700 text-white hover:bg-sky-800 transition transform hover:scale-105"
        
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
