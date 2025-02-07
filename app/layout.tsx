import "@/index.css";
import { Lexend } from "next/font/google";

const kanit = Lexend({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${kanit.className}`}>
            <body>{children}</body>
        </html>
    );
}
