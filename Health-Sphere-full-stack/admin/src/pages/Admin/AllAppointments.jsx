import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  // Fire API call when token is available
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Define initial filters for all fields
  const initialFilters = {
    _id: '',
    userId: '',
    docId: '',
    slotDate: '',
    slotTime: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorName: '',
    doctorEmail: '',
    doctorSpeciality: '',
    amount: '',
    status: 'All', // Options: All, Cancelled, Completed, Pending
  };

  const [filters, setFilters] = useState(initialFilters);
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [statusData, setStatusData] = useState([]);

  // Whenever appointments data is updated, refresh the filtered list and status chart data
  useEffect(() => {
    setFilteredAppointments(appointments);
    
    // Calculate status counts for the pie chart
    if (appointments && appointments.length > 0) {
      const statusCounts = {
        completed: 0,
        cancelled: 0,
        pending: 0
      };
      
      appointments.forEach(appointment => {
        if (appointment.cancelled) {
          statusCounts.cancelled++;
        } else if (appointment.isCompleted) {
          statusCounts.completed++;
        } else {
          statusCounts.pending++;
        }
      });
      
      // Format data for pie chart
      const chartData = [
        { name: 'Completed', value: statusCounts.completed },
        { name: 'Cancelled', value: statusCounts.cancelled },
        { name: 'Pending', value: statusCounts.pending }
      ];
      
      setStatusData(chartData);
    }
  }, [appointments]);

  // Handler to update search results based on filters
  const handleUpdateSearch = () => {
    const filtered = appointments.filter((item) => {
      // Filter by appointment _id
      if (filters._id && !item._id.includes(filters._id)) return false;
      // Filter by userId
      if (filters.userId && !item.userId.includes(filters.userId)) return false;
      // Filter by docId
      if (filters.docId && !item.docId.includes(filters.docId)) return false;
      // Filter by slotDate (exact match as provided, e.g., "1_4_2025")
      if (filters.slotDate && item.slotDate !== filters.slotDate) return false;
      // Filter by slotTime
      if (filters.slotTime && !item.slotTime.includes(filters.slotTime)) return false;
      // Filter by patient name
      if (filters.patientName && !item.userData?.name?.toLowerCase().includes(filters.patientName.toLowerCase())) return false;
      // Filter by patient email
      if (filters.patientEmail && !item.userData?.email?.toLowerCase().includes(filters.patientEmail.toLowerCase())) return false;
      // Filter by patient phone
      if (filters.patientPhone && !item.userData?.phone?.includes(filters.patientPhone)) return false;
      // Filter by doctor name
      if (filters.doctorName && !item.docData?.name?.toLowerCase().includes(filters.doctorName.toLowerCase())) return false;
      // Filter by doctor email
      if (filters.doctorEmail && !item.docData?.email?.toLowerCase().includes(filters.doctorEmail.toLowerCase())) return false;
      // Filter by doctor speciality
      if (filters.doctorSpeciality && !item.docData?.speciality?.toLowerCase().includes(filters.doctorSpeciality.toLowerCase())) return false;
      // Filter by amount (exact match if provided)
      if (filters.amount && item.amount !== Number(filters.amount)) return false;
      // Filter by status
      if (filters.status !== 'All') {
        if (filters.status === 'Cancelled' && !item.cancelled) return false;
        if (filters.status === 'Completed' && !item.isCompleted) return false;
        if (filters.status === 'Pending' && (item.cancelled || item.isCompleted)) return false;
      }
      return true;
    });
    setFilteredAppointments(filtered);
  };

  // Colors for pie chart segments
  const COLORS = ['#4CAF50', '#F44336', '#2196F3'];

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      {/* Filters Section */}
      <div className='bg-white p-4 rounded border mb-4'>
        <h3 className='font-semibold mb-2'>Filter Appointments</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <input
            type='text'
            placeholder='Appointment ID'
            className='border p-2 rounded'
            value={filters._id}
            onChange={(e) => setFilters({ ...filters, _id: e.target.value })}
          />
          <input
            type='text'
            placeholder='User ID'
            className='border p-2 rounded'
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          />
          <input
            type='text'
            placeholder='Doctor ID'
            className='border p-2 rounded'
            value={filters.docId}
            onChange={(e) => setFilters({ ...filters, docId: e.target.value })}
          />
          <input
            type='text'
            placeholder='Slot Date (e.g., 1_4_2025)'
            className='border p-2 rounded'
            value={filters.slotDate}
            onChange={(e) => setFilters({ ...filters, slotDate: e.target.value })}
          />
          <input
            type='text'
            placeholder='Slot Time (e.g., 10:00)'
            className='border p-2 rounded'
            value={filters.slotTime}
            onChange={(e) => setFilters({ ...filters, slotTime: e.target.value })}
          />
          <input
            type='text'
            placeholder='Patient Name'
            className='border p-2 rounded'
            value={filters.patientName}
            onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
          />
          <input
            type='email'
            placeholder='Patient Email'
            className='border p-2 rounded'
            value={filters.patientEmail}
            onChange={(e) => setFilters({ ...filters, patientEmail: e.target.value })}
          />
          <input
            type='text'
            placeholder='Patient Phone'
            className='border p-2 rounded'
            value={filters.patientPhone}
            onChange={(e) => setFilters({ ...filters, patientPhone: e.target.value })}
          />
          <input
            type='text'
            placeholder='Doctor Name'
            className='border p-2 rounded'
            value={filters.doctorName}
            onChange={(e) => setFilters({ ...filters, doctorName: e.target.value })}
          />
          <input
            type='email'
            placeholder='Doctor Email'
            className='border p-2 rounded'
            value={filters.doctorEmail}
            onChange={(e) => setFilters({ ...filters, doctorEmail: e.target.value })}
          />
          <input
            type='text'
            placeholder='Doctor Speciality'
            className='border p-2 rounded'
            value={filters.doctorSpeciality}
            onChange={(e) => setFilters({ ...filters, doctorSpeciality: e.target.value })}
          />
          <input
            type='number'
            placeholder='Fees'
            className='border p-2 rounded'
            value={filters.amount}
            onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
          />
          <select
            className='border p-2 rounded'
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value='All'>All Statuses</option>
            <option value='Cancelled'>Cancelled</option>
            <option value='Completed'>Completed</option>
            <option value='Pending'>Pending</option>
          </select>
        </div>
        <button
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
          onClick={handleUpdateSearch}
        >
          Update Search Results
        </button>
      </div>

      {/* Appointments List */}
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div
            key={item._id || index}
            className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt='' />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt='' />
              <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-500 text-xs font-medium'>Completed</p>
            ) : (
              <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt='' />
            )}
          </div>
        ))}
      </div>

      {/* Pie Chart for Appointment Status */}
      {statusData.length > 0 && (
        <div className="bg-white p-4 rounded border mt-4 w-full">
          <h3 className='font-semibold mb-4 text-center'>Appointment Status Distribution</h3>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <div className="space-y-4">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 mr-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{status.name}:</span>
                      <span className="font-bold">{status.value}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
                      {statusData.reduce((sum, item) => sum + item.value, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;