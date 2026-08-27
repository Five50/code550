"use client";

import { Header } from "@/components/layout/header";
import { useContactModal } from "@/lib/contact-modal-context";
import type { MenuItem } from "@/lib/wordpress.d";

export function HeaderWithContact({ navItems }: { navItems: MenuItem[] }) {
  const { openModal } = useContactModal();
  return <Header navItems={navItems} onContactClick={openModal} />;
}
