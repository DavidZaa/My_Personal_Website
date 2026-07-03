import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/palette/CommandPalette";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <CommandPalette />
      <main className="flex-1 pt-14">{children}</main>
      <SiteFooter />
    </>
  );
}
