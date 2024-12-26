/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-minus-32': 'calc(100vh - 32px)', // Eliminate scrolling by offsetting screen height by 32px (avg title bar height on windowsOS and macOS)
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
}
