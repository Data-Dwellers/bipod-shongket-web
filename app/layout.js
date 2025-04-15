import { Geist, Geist_Mono, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoSans = Roboto({
    variable: "--font-roboto-sans",
    subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Bipod Shongket",
    description: "An app to send SOS and get help",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
