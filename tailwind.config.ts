import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                dark: "#050911",
            }
        },
    },
    plugins: [require("@tailwindcss/typography")],
} satisfies Config;
