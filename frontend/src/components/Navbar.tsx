import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { Link } from "react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
}

const Navbar = ({
  logo = {
    url: "/",
    src: "images/Mecoso.png",
    alt: "logo",
    title: "Mecoso",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/contact",
        },
        {
          title: "Gallery",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/gallery", 
        },
        {
          title: "Machines",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "/machines",
        },
      ],
    },
    {
      title: "About Us",
      url: "/about",
    },
    {
      title: "Services",
      url: "/services",
    },
  ],
}: Navbar1Props) => {
  return (
    <section className="py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between items-center lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              <img src={logo.src} className="max-h-40" alt={logo.alt} />
            </Link>
          </div>
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="text-xl flex items-center gap-8">
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/contact"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get a quote
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SheetHeader>
                    <SheetTitle>
                      <Link to={logo.url} className="flex items-center gap-2">
                        <img src={logo.src} className="max-h-8" alt={logo.alt} />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                        <Link
                          to="/contact"
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-center"
                        >
                          Get a quote
                        </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl min-w-[28rem] backdrop-blur-sm">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="text-xl w-[28rem]">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          to={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-lg font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 duration-300"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-lg py-0 font-semibold hover:no-underline text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="text-lg font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  // Check if it's a router link or external/hash link
  const isRouterLink = item.url.startsWith('/') && !item.url.startsWith('/#');
  
  if (isRouterLink) {
    return (
      <Link
        className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-all duration-300 outline-none select-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 group transform hover:scale-[1.02]"
        to={item.url}
      >
        <div className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.icon}</div>
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.title}</div>
          {item.description && (
            <p className="text-sm leading-snug text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-all duration-300 outline-none select-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 group transform hover:scale-[1.02]"
      href={item.url}
    >
      <div className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-slate-600 dark:text-slate-400">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };