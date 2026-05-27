export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
  label: string;
};

export const NEXPERTS_SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "facebook",
    href: "https://www.facebook.com/Nexpertsacademy",
    label: "Nexperts Academy on Facebook",
  },
  {
    platform: "instagram",
    href: "https://www.instagram.com/nexperts",
    label: "Nexperts Academy on Instagram",
  },
  {
    platform: "linkedin",
    href: "https://www.linkedin.com/company/nexperts-academy-sdn-bhd/",
    label: "Nexperts Academy on LinkedIn",
  },
  {
    platform: "youtube",
    href: "https://www.youtube.com/channel/UC9yAHm3DmVqrVf4fJFKWEQA",
    label: "Nexperts Academy on YouTube",
  },
  {
    platform: "tiktok",
    href: "https://www.tiktok.com/@nexperts_academy",
    label: "Nexperts Academy on TikTok",
  },
];
