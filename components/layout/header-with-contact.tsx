"use client";

import { Header } from "@/components/layout/header";
import { useContactModal } from "@/lib/contact-modal-context";

export function HeaderWithContact() {
  const { openModal } = useContactModal();
  return <Header onContactClick={openModal} />;
}
