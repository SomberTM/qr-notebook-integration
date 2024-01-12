export function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex min-h-screen flex-col py-12 xl:px-64 lg:px-48 md:px-32 sm:px-16 px-8">
			{children}
		</main>
	);
}
