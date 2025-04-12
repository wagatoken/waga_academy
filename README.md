# Protocol Academy Codebase 

## Overview
#### (for the backend-dev branch)

The **Protocol Academy** codebase is a Next.js-based web application designed to provide educational resources and courses focused on coffee production, sustainability, blockchain, and Web3 technologies. The platform includes features for course management, user interaction, and administrative tools. It leverages modern web development practices, including server-side rendering, client-side interactivity, and integration with Supabase for backend services.

---

## Features

### 1. **Course Management**
   - Dynamic course pages generated based on the `slug` parameter.
   - Courses include detailed descriptions, learning outcomes, and structured modules with lessons.
   - Examples of courses:
     - *DeFi Solutions for Coffee Farmers*
     - *IoT for Coffee Farm Monitoring*
     - *Web3 Digital Marketing for Coffee Brands*

### 2. **Admin Panel**
   - Administrative tools for managing the platform.
   - Sidebar navigation for accessing settings, help, and other admin features.
   - Mobile-friendly design with a backdrop for the sidebar.

### 3. **User Interaction**
   - Waitlist functionality for upcoming courses.
   - Interactive course curriculum with expandable sections.
   - Links to documentation and help resources.

### 4. **Web3 and Blockchain Integration**
   - Courses and features focus on blockchain, tokenization, and decentralized finance.
   - Practical exercises and projects for implementing blockchain solutions in coffee production.

### 5. **Responsive Design**
   - Fully responsive layout for both desktop and mobile users.
   - Optimized for accessibility and usability.

---

## Tech Stack

### **Frontend**
- **Framework**: [Next.js](https://nextjs.org/) (React-based framework for server-side rendering and static site generation).
- **UI Components**: Custom components like `Button`, `Card`, `Tabs`, `Badge`, and `Avatar`.
- **Icons**: [Lucide React](https://lucide.dev/) for scalable vector icons.

### **Backend**
- **Database**: PostgreSQL (via Supabase).
- **API**: Supabase RESTful API for data management and authentication.

### **Environment Variables**
The application uses a .env.local file to manage sensitive credentials and configuration. Key variables include:
- `POSTGRES_URL`: Connection string for the PostgreSQL database.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: Supabase project URL and public API key.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for privileged operations.

---

## Folder Structure

### **app**
- Contains the main application logic and routes.
- **`/courses/[slug]`**: Dynamic route for individual course pages.
- **`/about`**: Static page for information about the platform.

### **components**
- Reusable UI components and layouts.
- **`/admin`**: Components for the admin panel, including `AdminSidebar` and `AdminLayoutClient`.

### **public**
- Static assets like images and icons.

### **styles**
- Global and component-specific styles.

---

## Key Files

### **`/app/courses/[slug]/page.tsx`**
- Dynamic course page component.
- Fetches course data based on the `slug` parameter.
- Displays course details, curriculum, and instructor information.

### **`/components/admin/admin-sidebar.tsx`**
- Sidebar navigation for the admin panel.
- Includes links to settings, help, and other admin tools.

### **`/components/admin/admin-layout-client.tsx`**
- Layout component for the admin panel.
- Handles mobile responsiveness and renders child components.

### **`.env.local`**
- Environment variables for database connections and API keys.

---

## Installation and Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/protocol-academy.git
   cd protocol-academy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a .env.local file in the root directory.
   - Add the required variables (refer to the .env.local example provided).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the application for production.
- **`npm run start`**: Start the production server.
- **`npm run lint`**: Run ESLint to check for code quality issues.

---

## Future Enhancements

1. **Course Enrollment**: Add functionality for users to enroll in courses.
2. **Progress Tracking**: Enable users to track their progress through lessons and modules.
3. **Payment Integration**: Implement payment gateways for premium courses.
4. **Analytics Dashboard**: Provide insights into user engagement and course performance.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Submit a pull request for review.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions or support, please contact the development team at [devs@wagatoken.io](mailto:devs@wagatoken.io).
