import React, { useState } from "react";
import Modal from "./Modal";
import Certificate, { type CertificateDto } from "./Certificate";
import { authService } from "../services/authService";

type Props = {
  courseSlug: string;
  label?: string;
};

const CertificateButton: React.FC<Props> = ({
  courseSlug,
  label = "View Certificate",
}) => {
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState<CertificateDto | null>(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const fetchCertificate = async () => {
    if (!authService.isLoggedIn()) {
      alert("You must be logged in to view the certificate.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/certificate/me/${courseSlug}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch certificate");
      const data: CertificateDto = await res.json();
      setCertificate(data);
      setOpen(true);
    } catch (e) {
      console.error(e);
      alert("Could not fetch certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={fetchCertificate}
        disabled={loading}
        className="flex-none self-center px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-cyan-800 transition transform hover:scale-105"
      >
        {loading ? "Loading..." : label}
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
