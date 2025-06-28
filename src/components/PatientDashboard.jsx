import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Calendar,
  Clock,
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  DollarSign,
  User,
  Phone,
  Heart,
  Activity
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { getPatientById, getIncidentsByPatientId } = useData();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const patient = getPatientById(user.patientId);
  const appointments = getIncidentsByPatientId(user.patientId);

  const upcomingAppointments = appointments
    .filter(appointment => new Date(appointment.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const pastAppointments = appointments
    .filter(appointment => new Date(appointment.appointmentDate) < new Date())
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const completedTreatments = appointments.filter(a => a.status === 'Completed');
  const totalSpent = completedTreatments.reduce((sum, a) => sum + (a.cost || 0), 0);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleFileView = (file) => {
    setSelectedFile(file);
    setIsFileDialogOpen(true);
  };

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Patient Not Found</h2>
        <p className="text-gray-600 mt-2">Unable to load patient information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Welcome, {patient.name}!</h1>
        <p className="text-green-100 mt-2">Your dental health overview and appointment history</p>
      </div>

      {/* Patient Info and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.contact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Born: {new Date(patient.dob).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Appointments scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
            <p className="text-xs text-muted-foreground">
              Treatments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              On dental treatments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{patient.healthInfo}</p>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Your scheduled dental appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{appointment.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(appointment.appointmentDate)}</span>
                        </div>
                        
                        {appointment.cost > 0 && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(appointment.cost)}</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.comments && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {appointment.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming appointments scheduled.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment History */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment History</CardTitle>
          <CardDescription>
            Your past dental treatments and records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </span>
                        
                        {appointment.files && appointment.files.length > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FileText className="h-3 w-3 mr-1" />
                            {appointment.files.length} files
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{appointment.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(appointment.appointmentDate)}</span>
                        </div>
                        
                        {appointment.cost > 0 && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(appointment.cost)}</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.treatment && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Treatment:</span> {appointment.treatment}
                          </p>
                        </div>
                      )}
                      
                      {appointment.comments && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {appointment.comments}
                          </p>
                        </div>
                      )}
                      
                      {appointment.nextDate && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Next Appointment:</span> {formatDateTime(appointment.nextDate)}
                          </p>
                        </div>
                      )}
                      
                      {/* Files */}
                      {appointment.files && appointment.files.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attached Files:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFileView(file)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFileDownload(file)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No treatment history available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* File View Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>File Preview</DialogTitle>
            <DialogDescription>
              {selectedFile?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="mt-4">
              {selectedFile.type?.startsWith('image/') ? (
                <img 
                  src={selectedFile.url} 
                  alt={selectedFile.name}
                  className="max-w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Preview not available for this file type.
                  </p>
                  <Button onClick={() => handleFileDownload(selectedFile)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;

