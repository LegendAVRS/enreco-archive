import "@/index.css";
import { Kanit } from "next/font/google";

const kanit = Kanit({
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
