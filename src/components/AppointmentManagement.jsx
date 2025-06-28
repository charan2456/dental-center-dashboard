import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Clock,
  User,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';

const AppointmentManagement = () => {
  const { 
    data, 
    addIncident, 
    updateIncident, 
    deleteIncident, 
    getPatientById,
    addFileToIncident,
    removeFileFromIncident
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled',
    nextDate: ''
  });
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const filteredIncidents = data.incidents.filter(incident => {
    const patient = getPatientById(incident.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    }
    
    if (formData.cost && isNaN(formData.cost)) {
      newErrors.cost = 'Cost must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const incidentData = {
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      files: uploadedFiles
    };

    if (selectedIncident) {
      updateIncident(selectedIncident.id, incidentData);
      setIsEditDialogOpen(false);
    } else {
      addIncident(incidentData);
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: 'Scheduled',
      nextDate: ''
    });
    setErrors({});
    setSelectedIncident(null);
    setUploadedFiles([]);
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments || '',
      appointmentDate: incident.appointmentDate.slice(0, 16), // Format for datetime-local input
      cost: incident.cost?.toString() || '',
      treatment: incident.treatment || '',
      status: incident.status,
      nextDate: incident.nextDate ? incident.nextDate.slice(0, 16) : ''
    });
    setUploadedFiles(incident.files || []);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile = {
          name: file.name,
          url: event.target.result,
          type: file.type,
          size: file.size
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AppointmentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientId">Patient *</Label>
        <Select 
          value={formData.patientId} 
          onValueChange={(value) => setFormData({ ...formData, patientId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a patient" />
          </SelectTrigger>
          <SelectContent>
            {data.patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name} - {patient.contact}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.patientId && (
          <Alert variant="destructive">
            <AlertDescription>{errors.patientId}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Routine Checkup, Cavity Treatment"
        />
        {errors.title && (
          <Alert variant="destructive">
            <AlertDescription>{errors.title}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of the treatment or procedure"
          rows={3}
        />
        {errors.description && (
          <Alert variant="destructive">
            <AlertDescription>{errors.description}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointmentDate">Appointment Date & Time *</Label>
        <Input
          id="appointmentDate"
          type="datetime-local"
          value={formData.appointmentDate}
          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
        />
        {errors.appointmentDate && (
          <Alert variant="destructive">
            <AlertDescription>{errors.appointmentDate}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost (₹)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="0"
            min="0"
            step="0.01"
          />
          {errors.cost && (
            <Alert variant="destructive">
              <AlertDescription>{errors.cost}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Treatment Details</Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          placeholder="Details about the treatment performed"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Additional comments or notes"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextDate">Next Appointment Date</Label>
        <Input
          id="nextDate"
          type="datetime-local"
          value={formData.nextDate}
          onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="files">Upload Files</Label>
        <Input
          id="files"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileUpload}
        />
        
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files:</Label>
            <div className="space-y-1">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedIncident ? 'Update Appointment' : 'Add Appointment'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and treatments</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Schedule a new appointment for a patient.
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.incidents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.incidents.filter(i => i.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.incidents.filter(i => i.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            Complete list of all patient appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => {
                    const patient = getPatientById(incident.patientId);
                    return (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {patient?.name?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{patient?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{patient?.contact}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{incident.title}</div>
                            <div className="text-sm text-gray-500">
                              {incident.description.length > 50 
                                ? `${incident.description.substring(0, 50)}...`
                                : incident.description
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {formatDateTime(incident.appointmentDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {getStatusIcon(incident.status)}
                            <span className="ml-1">{incident.status}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span>{formatCurrency(incident.cost || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {incident.files && incident.files.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FileText className="h-3 w-3 mr-1" />
                              {incident.files.length} files
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">No files</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(incident)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(incident.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'No appointments found matching your criteria.' 
                          : 'No appointments scheduled yet.'
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update the appointment information below.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentManagement;

