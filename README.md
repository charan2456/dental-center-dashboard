# Dental Care Center - Management Dashboard

A comprehensive dental center management system built with React, featuring patient management, appointment scheduling, and role-based access control.

## 🚀 Features

### Admin Features
- **Dashboard**: Comprehensive overview with KPIs, statistics, and quick insights
- **Patient Management**: Complete CRUD operations for patient records
- **Appointment Management**: Schedule, update, and manage patient appointments
- **Calendar View**: Monthly calendar with appointment visualization
- **File Management**: Upload and manage treatment files and documents
- **Revenue Tracking**: Monitor treatment costs and revenue analytics

### Patient Features
- **Personal Dashboard**: View personal information and health records
- **Appointment History**: Access complete treatment history
- **Upcoming Appointments**: View scheduled appointments
- **File Access**: Download and view treatment documents
- **Treatment Records**: Detailed view of past treatments and costs

## 🛠️ Technology Stack

- **Frontend**: React 18 with functional components
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: TailwindCSS with shadcn/ui components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: localStorage (simulated backend)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or pnpm package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-center-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   pnpm build
   ```

## 🏗️ Project Architecture

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Login.jsx        # Authentication component
│   ├── Layout.jsx       # Main layout wrapper
│   ├── Dashboard.jsx    # Admin dashboard
│   ├── PatientDashboard.jsx  # Patient dashboard
│   ├── PatientManagement.jsx # Patient CRUD operations
│   ├── AppointmentManagement.jsx # Appointment management
│   └── CalendarView.jsx # Calendar component
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── DataContext.jsx  # Application data state
├── data/               # Mock data and utilities
│   └── mockData.js     # Initial data and localStorage helpers
├── App.jsx             # Main application component
├── App.css             # Global styles
└── main.jsx            # Application entry point
```

## 🔐 Authentication

The application uses simulated authentication with the following demo accounts:

### Admin Account
- **Email**: admin@dentalcare.in
- **Password**: admin123
- **Role**: Admin (Full access)

### Patient Accounts
- **Email**: teja@email.com
- **Password**: patient123
- **Role**: Patient (Limited access)

## 💾 Data Management

All data is stored in localStorage to simulate a backend database. The data structure includes:

- **Users**: Authentication and role information
- **Patients**: Patient records and personal information
- **Incidents**: Appointment and treatment records

## 🎨 UI Components

The application uses shadcn/ui components for consistent design:
- Forms and inputs
- Tables and data display
- Dialogs and modals
- Cards and layouts
- Buttons and navigation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🔄 State Management

Uses React Context API for:
- **AuthContext**: User authentication and session management
- **DataContext**: Application data and CRUD operations

## 📊 Key Features Implementation

### Patient Management
- Add, edit, and delete patient records
- Search and filter functionality
- Patient health information tracking
- Appointment history per patient

### Appointment System
- Schedule new appointments
- Update appointment status
- File upload and management
- Treatment cost tracking
- Next appointment scheduling

### Calendar Integration
- Monthly calendar view
- Appointment visualization
- Day-specific appointment details
- Status-based color coding

### File Management
- Upload treatment files
- Preview image files
- Download functionality
- File association with appointments

## 🚀 Deployment

The application is ready for deployment on static hosting platforms like:
- Netlify
- Vercel
- GitHub Pages

Build the project using `npm run build` and deploy the `dist` folder.

## 🐛 Known Issues

- File upload is simulated using base64 encoding
- No real-time data synchronization
- Limited to localStorage capacity

## 🔮 Future Enhancements

- Real backend integration
- Email notifications
- Advanced reporting
- Multi-clinic support
- Mobile app version

## 📝 Technical Decisions

### Why React Context over Redux?
- Simpler setup for this project scope
- No complex state transformations needed
- Easier to understand and maintain

### Why localStorage over external API?
- Project requirement for frontend-only solution
- Simulates real database operations
- No backend infrastructure needed

### Why TailwindCSS?
- Utility-first approach for rapid development
- Consistent design system
- Easy responsive design implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed for educational and demonstration purposes.

## 👥 Team

Developed by the dental care management team with focus on user experience and functionality.

---

**Note**: This is a demonstration project with simulated data. For production use, integrate with a real backend database and authentication system.

