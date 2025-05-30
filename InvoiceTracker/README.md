# Invoice Generator

A customizable invoice generator web application built with React and Node.js that allows users to create professional invoices.

## Features

- Real-time invoice preview with professional styling
- Customizable company and client information forms
- Dynamic service management (add/remove services)
- Print functionality and PDF export options
- Pre-filled with MGR Cleaning Service defaults
- Responsive design with form validation

## Installation

1. Extract the zip file to your desired location
2. Make sure you have Node.js (version 18 or higher) installed on your computer
3. Open terminal/command prompt in the project folder
4. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and go to: `http://localhost:5000`

## Usage

1. Fill in your company information (pre-filled with MGR Cleaning Service details)
2. Enter client details and address
3. Add or modify services with descriptions and amounts
4. Use the live preview to see your invoice in real-time
5. Print directly or save as PDF

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend server
- `shared/` - Shared types and schemas
- `components/` - Reusable UI components

## Technologies Used

- React with TypeScript
- Node.js and Express
- Tailwind CSS for styling
- Shadcn/ui component library
- Vite for development and building

## Support

For any issues with setup or usage, make sure:
- Node.js is properly installed
- All dependencies are installed with `npm install`
- Port 5000 is available on your system