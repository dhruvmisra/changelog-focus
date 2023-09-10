import Image from "next/image";
import Logo from "@/assets/logo.svg";
import GitHubLogo from "@/assets/github-logo.svg";
import Link from "next/link";

export const Header = () => {
    return (
        <header className="flex items-center justify-between py-4">
            <Link href="/">
                <Image
                    priority
                    src={Logo as string}
                    height={32}
                    width={32}
                    alt="Changelog Focus logo"
                />
            </Link>
            <Link
                href="https://github.com/dhruvmisra/changelog-focus"
                target="_blank"
                rel="nofollow"
            >
                <Image
                    priority
                    src={GitHubLogo as string}
                    height={24}
                    width={24}
                    alt="GitHub logo"
                />
            </Link>
        </header>
    );
};
