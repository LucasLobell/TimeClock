# TimeClock

> **Work in progress!**  
> This is a personal project and is actively being developed and improved. The code and features are evolving, and the repository will be updated regularly as work continues. It will be uploaded in the future.

A modern time clock web application for tracking daily work hours, built with TypeScript, React, and Next.js.

## Features

- **Four-point time tracking**: Enter times for Morning Entry, Morning Exit, Afternoon Entry, and Afternoon Exit.
- **Automatic validation and auto-fill**: Enforces business rules such as minimum/maximum times, minimum lunch break, and chronological order. Time fields can auto-fill based on other entries using smart logic.
- **Editable, user-friendly UI**: Large digital-style time fields with interactive editing and visual feedback.
- **Persistent data per day**: Select dates and track your clock-in/clock-out times for any day.
- **Customizable business rules**: Easily adjust minimum/maximum entry/exit times and required lunch break by updating configuration constants.

## Technologies Used

- **TypeScript** for type safety and maintainability.
- **React** (v19) for UI components and state management.
- **Next.js** (v15) for app structure and server-side capabilities.
- **Tailwind CSS** for rapid, modern styling.
- **dayjs** for date utilities.
- Additional libraries: `react-calendar`, `react-datepicker`.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open in your browser:**  
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Business Logic

- **Time Entry Rules:**  
  - Morning entry: 07:00–09:00  
  - Morning exit: Not before 11:30 and minimum 3/maximum 5 hours after entry  
  - Minimum lunch break: 30 minutes  
  - Afternoon entry: Not after 14:00  
  - Afternoon exit: 17:00–19:00, ensuring full workday duration

- **Auto-calculation:**  
  Changing one time field may auto-update dependent fields to ensure all rules are met.

## Example Usage

- Select a date to view or edit your times for that day.
- Enter your morning entry time; the other fields will auto-fill based on rules.
- Adjust times as needed—the app will help ensure your entries are valid.

## File Structure Highlights

- `components/TimeClock.tsx` — Main business logic and UI for the time clock
- `utils/time.ts` — Helper functions for time formatting and validation
- `utils/timeLogic.ts` — Smart auto-fill logic for dependent time fields
- `constants/timeRules.ts` — All configurable time and business rules

## License

This project currently does not specify a license.

---

[Explore the code on GitHub](https://github.com/LucasLobell/TimeClock)