import Image from "next/image";

interface ProfilePhotoProps {
  alt: string;
  size: number;
  priority?: boolean;
}

export function ProfilePhoto({ alt, size, priority = false }: ProfilePhotoProps) {
  return (
    <span className="profile-photo" style={{ width: size, height: size * 1.25 }}>
      <Image
        src="/eric-mariano.jpeg"
        alt={alt}
        fill
        sizes={`${Math.ceil(size * 2.5)}px`}
        priority={priority}
      />
    </span>
  );
}
