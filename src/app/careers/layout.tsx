import { CareersSubnav } from "@/components/careers/careers-subnav";
import { Footer } from "@/components/footer";

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-white text-[#0A0A0A]">
      <CareersSubnav />
      {children}
      <Footer />
    </div>
  );
}
