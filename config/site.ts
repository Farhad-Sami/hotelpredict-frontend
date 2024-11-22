export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "HotelPredict",
  description: "Our Hotel Insights Are So Sharp, You Make Better Decisions.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Sale",
      href: "/sale",
    },
    {
      label: "Lease",
      href: "/lease",
    },
    {
      label: "Auction",
      href: "/auction",
    },
    {
      label: "Comp & Records",
      href: "/cmp",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
