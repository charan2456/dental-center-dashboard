// Mock data for the dental center management system
// Using Indian (Telugu) names as requested

export const initialData = {
  users: [
    { 
      id: "1", 
      role: "Admin", 
      email: "charan2456", 
      password: "Charan2456@",
      name: "Dr. Charan Reddy"
    },
    { 
      id: "2", 
      role: "Patient", 
      email: "teja.kumar", 
      password: "Teja@123", 
      patientId: "p1",
      name: "Teja Kumar"
    },
    { 
      id: "3", 
      role: "Patient", 
      email: "chaitanya.sharma", 
      password: "Chaitanya@123", 
      patientId: "p2",
      name: "Chaitanya Sharma"
    },
    { 
      id: "4", 
      role: "Patient", 
      email: "manideep.varma", 
      password: "Manideep@123", 
      patientId: "p3",
      name: "Manideep Varma"
    }
  ],
  patients: [
    {
      id: "p1",
      name: "Teja Kumar",
      dob: "1990-05-10",
      contact: "9876543210",
      healthInfo: "No known allergies, regular dental checkups"
    },
    {
      id: "p2",
      name: "Chaitanya Sharma",
      dob: "1985-08-15",
      contact: "9876543211",
      healthInfo: "Sensitive teeth, history of cavities"
    },
    {
      id: "p3",
      name: "Manideep Varma",
      dob: "1992-12-03",
      contact: "9876543212",
      healthInfo: "Braces treatment completed, regular maintenance"
    },
    {
      id: "p4",
      name: "Priya Reddy",
      dob: "1988-03-22",
      contact: "9876543213",
      healthInfo: "Gum sensitivity, requires gentle cleaning"
    },
    {
      id: "p5",
      name: "Ravi Krishna",
      dob: "1995-07-18",
      contact: "9876543214",
      healthInfo: "No major dental issues, preventive care"
    },
    {
      id: "p6",
      name: "Lakshmi Devi",
      dob: "1983-11-09",
      contact: "9876543215",
      healthInfo: "Root canal treatment history, crown maintenance"
    },
    {
      id: "p7",
      name: "Suresh Babu",
      dob: "1987-01-25",
      contact: "9876543216",
      healthInfo: "Wisdom teeth extraction completed"
    },
    {
      id: "p8",
      name: "Anjali Rao",
      dob: "1993-09-14",
      contact: "9876543217",
      healthInfo: "Orthodontic treatment in progress"
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Routine Dental Checkup",
      description: "Regular dental examination and cleaning",
      comments: "Good oral hygiene, no major issues found",
      appointmentDate: "2025-07-01T10:00:00",
      cost: 1500,
      treatment: "Professional cleaning and fluoride treatment",
      status: "Completed",
      nextDate: "2025-12-01T10:00:00",
      files: []
    },
    {
      id: "i2",
      patientId: "p2",
      title: "Cavity Treatment",
      description: "Filling for upper molar cavity",
      comments: "Patient experienced sensitivity before treatment",
      appointmentDate: "2025-06-28T14:30:00",
      cost: 2500,
      treatment: "Composite filling for upper right molar",
      status: "Completed",
      nextDate: "2025-09-28T14:30:00",
      files: []
    },
    {
      id: "i3",
      patientId: "p3",
      title: "Orthodontic Follow-up",
      description: "Braces adjustment and monitoring",
      comments: "Good progress with alignment",
      appointmentDate: "2025-07-02T11:00:00",
      cost: 3000,
      treatment: "Braces wire adjustment",
      status: "Completed",
      nextDate: "2025-08-02T11:00:00",
      files: []
    },
    {
      id: "i4",
      patientId: "p1",
      title: "Teeth Whitening",
      description: "Professional teeth whitening treatment",
      comments: "Patient requested cosmetic enhancement",
      appointmentDate: "2025-07-05T15:00:00",
      cost: 4000,
      treatment: "In-office teeth whitening procedure",
      status: "Pending",
      nextDate: null,
      files: []
    },
    {
      id: "i5",
      patientId: "p4",
      title: "Gum Treatment",
      description: "Deep cleaning for gum inflammation",
      comments: "Mild gingivitis detected",
      appointmentDate: "2025-07-03T09:30:00",
      cost: 2000,
      treatment: "Scaling and root planing",
      status: "Pending",
      nextDate: null,
      files: []
    },
    {
      id: "i6",
      patientId: "p5",
      title: "Wisdom Tooth Consultation",
      description: "Consultation for wisdom tooth extraction",
      comments: "X-ray required to assess positioning",
      appointmentDate: "2025-07-08T16:00:00",
      cost: 0,
      treatment: "Consultation and X-ray",
      status: "Scheduled",
      nextDate: null,
      files: []
    },
    {
      id: "i7",
      patientId: "p6",
      title: "Crown Replacement",
      description: "Replace old dental crown",
      comments: "Existing crown showing wear",
      appointmentDate: "2025-07-10T13:00:00",
      cost: 8000,
      treatment: "Ceramic crown replacement",
      status: "Scheduled",
      nextDate: null,
      files: []
    },
    {
      id: "i8",
      patientId: "p7",
      title: "Post-Extraction Checkup",
      description: "Follow-up after wisdom tooth extraction",
      comments: "Healing progress assessment",
      appointmentDate: "2025-07-04T10:30:00",
      cost: 500,
      treatment: "Wound inspection and care instructions",
      status: "Pending",
      nextDate: null,
      files: []
    }
  ],
  notifications: [
    {
      id: "n1",
      type: "Appointment Reminder",
      message: "Your appointment with Dr. Charan Reddy is scheduled for tomorrow at 10:00 AM.",
      date: "2025-06-30T10:00:00",
      read: false
    },
    {
      id: "n2",
      type: "New Patient Registration",
      message: "A new patient, Anjali Rao, has registered.",
      date: "2025-06-28T12:00:00",
      read: false
    },
    {
      id: "n3",
      type: "Treatment Completion",
      message: "Teja Kumar's routine checkup has been marked as completed.",
      date: "2025-07-01T11:00:00",
      read: true
    }
  ],
  settings: {
    theme: "light",
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: "en-US"
  }
};

// Utility functions for localStorage management
export const STORAGE_KEY = 'dentalCenterData';

export const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return initialData;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return initialData;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

export const initializeData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    saveData(initialData);
  }
  return loadData();
};



