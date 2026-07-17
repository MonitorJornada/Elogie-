@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 220 20% 15%;

    --card: 0 0% 100%;
    --card-foreground: 220 20% 15%;

    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 15%;

    --primary: 88 80% 42%;
    --primary-foreground: 0 0% 100%;

    --secondary: 210 20% 97%;
    --secondary-foreground: 220 20% 15%;

    --muted: 210 20% 97%;
    --muted-foreground: 215 16% 47%;

    --accent: 190 100% 27%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 88 80% 42%;

    --radius: 0.75rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;

    /* Custom tokens */
    --elogie-lime: 67 100% 42%;
    --elogie-green: 122 44% 49%;
    --elogie-teal: 190 100% 27%;
    --surface: 210 20% 98%;

    /* Post-it colors */
    --postit-yellow: 50 96% 89%;
    --postit-green: 138 76% 93%;
    --postit-pink: 326 73% 93%;
    --postit-blue: 214 95% 93%;
    --postit-peach: 0 100% 94%;
  }

  .dark {
    --background: 220 20% 8%;
    --foreground: 210 40% 98%;
    --card: 220 20% 10%;
    --card-foreground: 210 40% 98%;
    --popover: 220 20% 10%;
    --popover-foreground: 210 40% 98%;
    --primary: 88 80% 42%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 190 100% 27%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 88 80% 42%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

@layer utilities {
  .gradient-brand {
    background: linear-gradient(to right, #C8D400, #4CAF50, #007B8A);
  }

  .gradient-brand-vertical {
    background: linear-gradient(to bottom, #C8D400, #4CAF50, #007B8A);
  }

  .gradient-text {
    background: linear-gradient(to right, #C8D400, #4CAF50, #007B8A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-separator {
    height: 4px;
    background: linear-gradient(to right, #C8D400, #4CAF50, #007B8A);
  }
}
