import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { careersOfficeImage } from "@/lib/careers";

type JoinTeamImageProps = {
  href?: string;
  children?: ReactNode;
  minHeightClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function JoinTeamImage({
  href,
  children,
  minHeightClassName = "min-h-[28rem] sm:min-h-[36rem]",
  priority = false,
  sizes = "100vw",
}: JoinTeamImageProps) {
  const frame = (
    <div className="rounded-[1.4rem] bg-white p-2 sm:rounded-[1.6rem] sm:p-3">
      <div className={`relative overflow-hidden rounded-2xl ${minHeightClassName}`}>
        <Image
          src={careersOfficeImage.src}
          alt={careersOfficeImage.alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        {children ? (
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block focus-visible:outline-offset-4">
        {frame}
      </Link>
    );
  }

  return frame;
}
