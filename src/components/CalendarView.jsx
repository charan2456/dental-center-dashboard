import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CalendarView = () => {
  const { data, getPatientById } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    const calendarDays = [];
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isNextMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
        date: new Date(year, month, day)
      });
    }
    
    // Add next month's leading days to complete the grid
    const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
        date: new Date(year, month + 1, day)
      });
    }
    
    return calendarDays;
  }, [currentDate]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toDateString();
    return data.incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate.toDateString() === dateStr;
    });
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Handle day click
  const handleDayClick = (dayData) => {
    const appointments = getAppointmentsForDate(dayData.date);
    setSelectedDate(dayData.date);
    setSelectedAppointments(appointments);
    setIsDialogOpen(true);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Scheduled':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">Monthly view of appointments and treatments</p>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <CardTitle className="text-xl">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarData.map((dayData, index) => {
              const appointments = getAppointmentsForDate(dayData.date);
              const isToday = dayData.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                    ${!dayData.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                    ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                  `}
                  onClick={() => handleDayClick(dayData)}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isToday ? 'text-blue-600' : dayData.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  `}>
                    {dayData.day}
                  </div>
                  
                  {/* Appointment indicators */}
                  <div className="space-y-1">
                    {appointments.slice(0, 2).map((appointment, idx) => {
                      const patient = getPatientById(appointment.patientId);
                      return (
                        <div
                          key={idx}
                          className={`
                            text-xs p-1 rounded truncate
                            ${getStatusColor(appointment.status)}
                          `}
                        >
                          {formatTime(appointment.appointmentDate)} - {patient?.name}
                        </div>
                      );
                    })}
                    
                    {appointments.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.incidents.filter(incident => {
                const appointmentDate = new Date(incident.appointmentDate);
                return appointmentDate.getMonth() === currentDate.getMonth() &&
                       appointmentDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Total appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.incidents.filter(incident => {
                const appointmentDate = new Date(incident.appointmentDate);
                return appointmentDate.getMonth() === currentDate.getMonth() &&
                       appointmentDate.getFullYear() === currentDate.getFullYear() &&
                       incident.status === 'Completed';
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Treatments completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.incidents.filter(incident => {
                const appointmentDate = new Date(incident.appointmentDate);
                return appointmentDate.getMonth() === currentDate.getMonth() &&
                       appointmentDate.getFullYear() === currentDate.getFullYear() &&
                       incident.status === 'Pending';
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.incidents
                  .filter(incident => {
                    const appointmentDate = new Date(incident.appointmentDate);
                    return appointmentDate.getMonth() === currentDate.getMonth() &&
                           appointmentDate.getFullYear() === currentDate.getFullYear() &&
                           incident.status === 'Completed';
                  })
                  .reduce((sum, incident) => sum + (incident.cost || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Day Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Appointments for {selectedDate?.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointments.length} appointment{selectedAppointments.length !== 1 ? 's' : ''} scheduled
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAppointments.length > 0 ? (
              selectedAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId);
                return (
                  <Card key={appointment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {patient?.name?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">{patient?.name || 'Unknown Patient'}</h4>
                              <p className="text-sm text-gray-500">{patient?.contact}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{appointment.title}</h5>
                              <p className="text-sm text-gray-600">{appointment.description}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(appointment.appointmentDate)}</span>
                              </div>
                              
                              {appointment.cost > 0 && (
                                <div className="flex items-center space-x-1">
                                  <span>Cost: {formatCurrency(appointment.cost)}</span>
                                </div>
                              )}
                              
                              {appointment.files && appointment.files.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-4 w-4" />
                                  <span>{appointment.files.length} files</span>
                                </div>
                              )}
                            </div>
                            
                            {appointment.treatment && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">Treatment:</p>
                                <p className="text-sm text-gray-600">{appointment.treatment}</p>
                              </div>
                            )}
                            
                            {appointment.comments && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">Comments:</p>
                                <p className="text-sm text-gray-600">{appointment.comments}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this day.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;

