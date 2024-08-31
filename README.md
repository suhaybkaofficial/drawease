# DrawEase

DrawEase is a web application that allows users to create, save, and share digital drawings with ease. Built with Next.js and PocketBase, DrawEase provides a seamless drawing experience with a user-friendly interface.

## Features

- Interactive drawing canvas with customizable brush colors and sizes
- User authentication via Google Sign-In
- Save and manage drawings
- Download drawings as PNG or SVG
- Responsive design for desktop and mobile devices
- User profile management

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the frontend
- [PocketBase](https://pocketbase.io/) - Backend and database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [Lucide React](https://lucide.dev/) - Icon library

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PocketBase server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/draweaseapp.git
   cd draweaseapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```bash
   NEXT_PUBLIC_PB_URL=your_pocketbase_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

For deployment to platforms like Vercel or Netlify, follow their respective documentation for Next.js deployments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
