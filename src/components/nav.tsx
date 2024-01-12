import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
	return (
		<header className="flex justify-between items-center pb-8">
			<span>
				<Link href="/">
					<Image
						priority
						src={"/merck.png"}
						width={200}
						height={100}
						alt="Merck Logo"
					/>
				</Link>
			</span>
			<nav className="flex gap-4">
				<Link href="/">
					<Button variant="link">Home</Button>
				</Link>
				<Link href="/editor">
					<Button variant="link">Editor</Button>
				</Link>
				<Link href="/printers">
					<Button variant="link">Printers</Button>
				</Link>
			</nav>
		</header>
	);
}
