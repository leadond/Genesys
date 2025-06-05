// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const refreshButton = document.getElementById('refresh-button');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const dataTypeIndicator = document.getElementById('data-type-indicator');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');
const clearCacheButton = document.getElementById('clear-cache-button');

// User table elements
const usersTable = document.getElementById('users-table');
const departmentFilter = document.getElementById('department-filter');
const statusFilter = document.getElementById('status-filter');
const presenceFilter = document.getElementById('presence-filter');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const paginationInfo = document.getElementById('pagination-info');

// Queue table elements
const queuesTable = document.getElementById('queues-table');
const queueTypeFilter = document.getElementById('queue-type-filter');
const queuesPrevPageButton = document.getElementById('queues-prev-page');
const queuesNextPageButton = document.getElementById('queues-next-page');
const queuesPaginationInfo = document.getElementById('queues-pagination-info');

// Dashboard elements
const totalUsersCount = document.getElementById('total-users-count');
const activeUsersCount = document.getElementById('active-users-count');
const totalQueuesCount = document.getElementById('total-queues-count');
const departmentsCount = document.getElementById('departments-count');
const recentUsersTable = document.getElementById('recent-users-table');
const departmentChart = document.getElementById('department-chart');
const statusChart = document.getElementById('status-chart');
const queueTypeChart = document.getElementById('queue-type-chart');
const presenceChart = document.getElementById('presence-chart');

// Settings elements
const dataSourceValue = document.getElementById('data-source-value');
const regionValue = document.getElementById('region-value');
const cacheExpiration = document.getElementById('cache-expiration');
const lastUpdated = document.getElementById('last-updated');
const serverTime = document.getElementById('server-time');

// Departments page elements
const departmentsGrid = document.querySelector('.departments-grid');

// User Modal elements
const userModal = document.getElementById('user-modal');
const closeUserModal = userModal.querySelector('.close-modal');
const modalUserName = document.getElementById('modal-user-name');
const modalUserEmail = document.getElementById('modal-user-email');
const modalUserUsername = document.getElementById('modal-user-username');
const modalUserDepartment = document.getElementById('modal-user-department');
const modalUserTitle = document.getElementById('modal-user-title');
const modalUserStatus = document.getElementById('modal-user-status');
const modalUserPresence = document.getElementById('modal-user-presence');
const modalUserPhone = document.getElementById('modal-user-phone');
const modalUserId = document.getElementById('modal-user-id');

// Queue Modal elements
const queueModal = document.getElementById('queue-modal');
const closeQueueModal = queueModal.querySelector('.close-modal');
const modalQueueName = document.getElementById('modal-queue-name');
const modalQueueDescription = document.getElementById('modal-queue-description');
const modalQueueType = document.getElementById('modal-queue-type');
const modalQueueId = document.getElementById('modal-queue-id');
const modalQueueModified = document.getElementById('modal-queue-modified');
const queueMembersTable = document.getElementById('queue-members-table');

// State
let users = [];
let filteredUsers = [];
let queues = [];
let filteredQueues = [];
let departments = [];
let presenceStates = [];
let currentPage = 1;
let totalPages = 1;
let queuesCurrentPage = 1;
let queuesTotalPages = 1;
let itemsPerPage = 20;
let departmentChartInstance = null;
let statusChartInstance = null;
let queueTypeChartInstance = null;
let presenceChartInstance = null;
let isDataMock = true;
let systemInfo = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Initialize the application
async function initApp() {
  showLoading();
  
  try {
    // Fetch system info
    await fetchSystemInfo();
    
    // Fetch initial data
    await Promise.all([
      fetchUsers(),
      fetchQueues(),
      fetchStats()
    ]);
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI components
    initializeUI();
    
    // Show success toast
    showToast('Application Loaded', 'Data has been successfully loaded.', 'success');
  } catch (error) {
    console.error('Error initializing app:', error);
    showToast('Error', 'Failed to load application data. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

// Set up event listeners
function setupEventListeners() {
  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPage = item.getAttribute('data-page');
      changePage(targetPage);
    });
  });
  
  // Search
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Refresh data
  refreshButton.addEventListener('click', refreshData);
  
  // Clear cache
  clearCacheButton.addEventListener('click', clearCache);
  
  // User pagination
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderUsersTable();
    }
  });
  
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderUsersTable();
    }
  });
  
  // Queue pagination
  queuesPrevPageButton.addEventListener('click', () => {
    if (queuesCurrentPage > 1) {
      queuesCurrentPage--;
      renderQueuesTable();
    }
  });
  
  queuesNextPageButton.addEventListener('click', () => {
    if (queuesCurrentPage < queuesTotalPages) {
      queuesCurrentPage++;
      renderQueuesTable();
    }
  });
  
  // Filters
  departmentFilter.addEventListener('change', applyUserFilters);
  statusFilter.addEventListener('change', applyUserFilters);
  presenceFilter.addEventListener('change', applyUserFilters);
  queueTypeFilter.addEventListener('change', applyQueueFilters);
  
  // User Modal
  closeUserModal.addEventListener('click', () => {
    userModal.style.display = 'none';
  });
  
  // Queue Modal
  closeQueueModal.addEventListener('click', () => {
    queueModal.style.display = 'none';
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === userModal) {
      userModal.style.display = 'none';
    }
    if (e.target === queueModal) {
      queueModal.style.display = 'none';
    }
  });
}

// Initialize UI components
function initializeUI() {
  // Set data source indicator
  dataTypeIndicator.textContent = isDataMock ? 'Using Mock Data' : 'Using Real Data';
  dataTypeIndicator.style.color = isDataMock ? 'var(--warning-color)' : 'var(--success-color)';
  
  // Set settings values
  dataSourceValue.textContent = isDataMock ? 'Mock Data (Demonstration)' : 'Genesys Cloud API (Production)';
  regionValue.textContent = systemInfo.region || 'N/A';
  cacheExpiration.textContent = systemInfo.cacheExpiration ? `${Math.round(systemInfo.cacheExpiration / 60000)} minutes` : 'N/A';
  serverTime.textContent = formatDate(systemInfo.serverTime) || 'N/A';
  lastUpdated.textContent = formatDate(systemInfo.serverTime) || 'N/A';
  
  // Render dashboard
  renderDashboard();
  
  // Render users table
  renderUsersTable();
  
  // Render queues table
  renderQueuesTable();
  
  // Render departments
  renderDepartments();
}

// Fetch system info
async function fetchSystemInfo() {
  try {
    const response = await fetch('/api/system');
    if (!response.ok) {
      throw new Error('Failed to fetch system info');
    }
    
    systemInfo = await response.json();
    isDataMock = systemInfo.useMockData;
    
    return systemInfo;
  } catch (error) {
    console.error('Error fetching system info:', error);
    showToast('Error', 'Failed to fetch system information. Please try again.', 'error');
    throw error;
  }
}

// Fetch users from the API
async function fetchUsers() {
  try {
    const response = await fetch('/api/users?limit=1000');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    users = data.data;
    filteredUsers = [...users];
    totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    
    // Extract unique departments
    const uniqueDepartments = [...new Set(users.map(user => user.department || 'Unassigned'))].sort();
    departments = uniqueDepartments;
    
    // Extract unique presence states
    const uniquePresence = [...new Set(users.map(user => user.presence || 'unknown'))].sort();
    presenceStates = uniquePresence;
    
    // Populate department filter
    departmentFilter.innerHTML = '<option value="">All Departments</option>';
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      departmentFilter.appendChild(option);
    });
    
    // Populate presence filter
    presenceFilter.innerHTML = '<option value="">All Presence</option>';
    presenceStates.forEach(presence => {
      const option = document.createElement('option');
      option.value = presence;
      option.textContent = formatPresence(presence);
      presenceFilter.appendChild(option);
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    showToast('Error', 'Failed to fetch user data. Please try again.', 'error');
    throw error;
  }
}

// Fetch queues from the API
async function fetchQueues() {
  try {
    const response = await fetch('/api/queues?limit=1000');
    if (!response.ok) {
      throw new Error('Failed to fetch queues');
    }
    
    const data = await response.json();
    queues = data.data;
    filteredQueues = [...queues];
    queuesTotalPages = Math.ceil(filteredQueues.length / itemsPerPage);
    
    return data;
  } catch (error) {
    console.error('Error fetching queues:', error);
    showToast('Error', 'Failed to fetch queue data. Please try again.', 'error');
    throw error;
  }
}

// Fetch user and queue statistics
async function fetchStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    showToast('Error', 'Failed to fetch statistics. Please try again.', 'error');
    throw error;
  }
}

// Fetch queue members
async function fetchQueueMembers(queueId) {
  try {
    const response = await fetch(`/api/queues/${queueId}/members`);
    if (!response.ok) {
      throw new Error('Failed to fetch queue members');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching queue members:', error);
    showToast('Error', 'Failed to fetch queue members. Please try again.', 'error');
    return [];
  }
}

// Render the dashboard
async function renderDashboard() {
  try {
    // Fetch statistics
    const stats = await fetchStats();
    
    // Update stat cards
    totalUsersCount.textContent = stats.totalUsers;
    activeUsersCount.textContent = stats.states?.active || 0;
    totalQueuesCount.textContent = stats.queues?.total || 0;
    departmentsCount.textContent = Object.keys(stats.departments || {}).length;
    
    // Render charts
    renderDepartmentChart(stats.departments || {});
    renderStatusChart(stats.states || {});
    renderQueueTypeChart(stats.queues?.byType || {});
    renderPresenceChart(stats.presence || {});
    
    // Render recent users table
    renderRecentUsers();
  } catch (error) {
    console.error('Error rendering dashboard:', error);
  }
}

// Render the department chart
function renderDepartmentChart(departmentData) {
  const ctx = departmentChart.getContext('2d');
  
  // Destroy existing chart if it exists
  if (departmentChartInstance) {
    departmentChartInstance.destroy();
  }
  
  // Sort departments by user count (descending)
  const sortedDepartments = Object.entries(departmentData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7); // Show top 7 departments
  
  const labels = sortedDepartments.map(([dept]) => dept);
  const data = sortedDepartments.map(([, count]) => count);
  
  // Generate colors
  const colors = generateColors(labels.length);
  
  departmentChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Users',
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Render the status chart
function renderStatusChart(statusData) {
  const ctx = statusChart.getContext('2d');
  
  // Destroy existing chart if it exists
  if (statusChartInstance) {
    statusChartInstance.destroy();
  }
  
  const labels = Object.keys(statusData).map(status => 
    status.charAt(0).toUpperCase() + status.slice(1)
  );
  const data = Object.values(statusData);
  
  // Define colors for each status
  const colors = {
    'Active': 'rgba(40, 167, 69, 0.7)',
    'Inactive': 'rgba(108, 117, 125, 0.7)',
    'Deactivated': 'rgba(220, 53, 69, 0.7)',
    'Unknown': 'rgba(0, 123, 255, 0.7)'
  };
  
  const backgroundColor = labels.map(label => colors[label] || 'rgba(0, 123, 255, 0.7)');
  
  statusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Render the queue type chart
function renderQueueTypeChart(queueTypeData) {
  const ctx = queueTypeChart.getContext('2d');
  
  // Destroy existing chart if it exists
  if (queueTypeChartInstance) {
    queueTypeChartInstance.destroy();
  }
  
  const labels = Object.keys(queueTypeData).map(type => 
    type.charAt(0).toUpperCase() + type.slice(1)
  );
  const data = Object.values(queueTypeData);
  
  // Define colors for each queue type
  const colors = {
    'Voice': 'rgba(40, 167, 69, 0.7)',
    'Chat': 'rgba(0, 123, 255, 0.7)',
    'Email': 'rgba(255, 193, 7, 0.7)',
    'Social': 'rgba(108, 117, 125, 0.7)',
    'Callback': 'rgba(220, 53, 69, 0.7)',
    'Unknown': 'rgba(153, 102, 255, 0.7)'
  };
  
  const backgroundColor = labels.map(label => colors[label] || 'rgba(153, 102, 255, 0.7)');
  
  queueTypeChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Render the presence chart
function renderPresenceChart(presenceData) {
  const ctx = presenceChart.getContext('2d');
  
  // Destroy existing chart if it exists
  if (presenceChartInstance) {
    presenceChartInstance.destroy();
  }
  
  const labels = Object.keys(presenceData).map(presence => formatPresence(presence));
  const data = Object.values(presenceData);
  
  // Define colors for each presence state
  const colors = {
    'Available': 'rgba(40, 167, 69, 0.7)',
    'Away': 'rgba(255, 193, 7, 0.7)',
    'Busy': 'rgba(220, 53, 69, 0.7)',
    'Break': 'rgba(108, 117, 125, 0.7)',
    'Meal': 'rgba(108, 117, 125, 0.7)',
    'Meeting': 'rgba(108, 117, 125, 0.7)',
    'Training': 'rgba(108, 117, 125, 0.7)',
    'Off Queue': 'rgba(0, 123, 255, 0.7)',
    'Unknown': 'rgba(153, 102, 255, 0.7)'
  };
  
  const backgroundColor = labels.map(label => colors[label] || 'rgba(153, 102, 255, 0.7)');
  
  presenceChartInstance = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Render recent users in the dashboard
function renderRecentUsers() {
  const tbody = recentUsersTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  // Get the 5 most recent users (for demo purposes, just take the first 5)
  const recentUsers = users.slice(0, 5);
  
  recentUsers.forEach(user => {
    const tr = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.textContent = user.name;
    
    const emailCell = document.createElement('td');
    emailCell.textContent = user.email;
    
    const deptCell = document.createElement('td');
    deptCell.textContent = user.department || 'Unassigned';
    
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${user.state || 'unknown'}`;
    statusBadge.textContent = user.state || 'Unknown';
    statusCell.appendChild(statusBadge);
    
    const presenceCell = document.createElement('td');
    const presenceBadge = document.createElement('span');
    presenceBadge.className = `presence-badge presence-${user.presence || 'unknown'}`;
    presenceBadge.textContent = formatPresence(user.presence);
    presenceCell.appendChild(presenceBadge);
    
    tr.appendChild(nameCell);
    tr.appendChild(emailCell);
    tr.appendChild(deptCell);
    tr.appendChild(statusCell);
    tr.appendChild(presenceCell);
    
    tbody.appendChild(tr);
  });
}

// Render the users table
function renderUsersTable() {
  const tbody = usersTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  if (paginatedUsers.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 7;
    td.className = 'loading-message';
    td.textContent = 'No users found matching your criteria.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    paginatedUsers.forEach(user => {
      const tr = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = user.name;
      
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      
      const deptCell = document.createElement('td');
      deptCell.textContent = user.department || 'Unassigned';
      
      const titleCell = document.createElement('td');
      titleCell.textContent = user.title || 'N/A';
      
      const statusCell = document.createElement('td');
      const statusBadge = document.createElement('span');
      statusBadge.className = `status-badge status-${user.state || 'unknown'}`;
      statusBadge.textContent = user.state || 'Unknown';
      statusCell.appendChild(statusBadge);
      
      const presenceCell = document.createElement('td');
      const presenceBadge = document.createElement('span');
      presenceBadge.className = `presence-badge presence-${user.presence || 'unknown'}`;
      presenceBadge.textContent = formatPresence(user.presence);
      presenceCell.appendChild(presenceBadge);
      
      const actionsCell = document.createElement('td');
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'action-buttons';
      
      const viewButton = document.createElement('button');
      viewButton.className = 'action-button';
      viewButton.innerHTML = '<i class="fas fa-eye"></i>';
      viewButton.title = 'View Details';
      viewButton.addEventListener('click', () => showUserDetails(user));
      
      actionsDiv.appendChild(viewButton);
      actionsCell.appendChild(actionsDiv);
      
      tr.appendChild(nameCell);
      tr.appendChild(emailCell);
      tr.appendChild(deptCell);
      tr.appendChild(titleCell);
      tr.appendChild(statusCell);
      tr.appendChild(presenceCell);
      tr.appendChild(actionsCell);
      
      tbody.appendChild(tr);
    });
  }
  
  // Update pagination controls
  totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

// Render the queues table
function renderQueuesTable() {
  const tbody = queuesTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  // Calculate pagination
  const startIndex = (queuesCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQueues = filteredQueues.slice(startIndex, endIndex);
  
  if (paginatedQueues.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.className = 'loading-message';
    td.textContent = 'No queues found matching your criteria.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    paginatedQueues.forEach(queue => {
      const tr = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = queue.name;
      
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = queue.description || 'N/A';
      
      const typeCell = document.createElement('td');
      typeCell.textContent = getQueueType(queue);
      
      const membersCell = document.createElement('td');
      membersCell.textContent = queue.memberCount || 0;
      
      const modifiedCell = document.createElement('td');
      modifiedCell.textContent = formatDate(queue.dateModified);
      
      const actionsCell = document.createElement('td');
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'action-buttons';
      
      const viewButton = document.createElement('button');
      viewButton.className = 'action-button';
      viewButton.innerHTML = '<i class="fas fa-eye"></i>';
      viewButton.title = 'View Details';
      viewButton.addEventListener('click', () => showQueueDetails(queue));
      
      actionsDiv.appendChild(viewButton);
      actionsCell.appendChild(actionsDiv);
      
      tr.appendChild(nameCell);
      tr.appendChild(descriptionCell);
      tr.appendChild(typeCell);
      tr.appendChild(membersCell);
      tr.appendChild(modifiedCell);
      tr.appendChild(actionsCell);
      
      tbody.appendChild(tr);
    });
  }
  
  // Update pagination controls
  queuesTotalPages = Math.ceil(filteredQueues.length / itemsPerPage);
  queuesPaginationInfo.textContent = `Page ${queuesCurrentPage} of ${queuesTotalPages}`;
  queuesPrevPageButton.disabled = queuesCurrentPage <= 1;
  queuesNextPageButton.disabled = queuesCurrentPage >= queuesTotalPages;
}

// Render departments page
function renderDepartments() {
  departmentsGrid.innerHTML = '';
  
  if (departments.length === 0) {
    departmentsGrid.innerHTML = '<div class="loading-message">No departments found.</div>';
    return;
  }
  
  // Count users per department
  const deptCounts = {};
  departments.forEach(dept => {
    deptCounts[dept] = users.filter(user => (user.department || 'Unassigned') === dept).length;
  });
  
  // Count active users per department
  const activeDeptCounts = {};
  departments.forEach(dept => {
    activeDeptCounts[dept] = users.filter(user => 
      (user.department || 'Unassigned') === dept && user.state === 'active'
    ).length;
  });
  
  departments.forEach(dept => {
    const card = document.createElement('div');
    card.className = 'department-card';
    
    const header = document.createElement('h3');
    header.innerHTML = `<i class="fas fa-building"></i> ${dept}`;
    
    const stats = document.createElement('div');
    stats.className = 'department-stats';
    
    const totalStat = document.createElement('div');
    totalStat.className = 'department-stat';
    totalStat.innerHTML = `<p>${deptCounts[dept]}</p><p>Total Users</p>`;
    
    const activeStat = document.createElement('div');
    activeStat.className = 'department-stat';
    activeStat.innerHTML = `<p>${activeDeptCounts[dept]}</p><p>Active Users</p>`;
    
    const percentStat = document.createElement('div');
    percentStat.className = 'department-stat';
    const percent = deptCounts[dept] > 0 
      ? Math.round((activeDeptCounts[dept] / deptCounts[dept]) * 100) 
      : 0;
    percentStat.innerHTML = `<p>${percent}%</p><p>Active Rate</p>`;
    
    stats.appendChild(totalStat);
    stats.appendChild(activeStat);
    stats.appendChild(percentStat);
    
    card.appendChild(header);
    card.appendChild(stats);
    
    departmentsGrid.appendChild(card);
  });
}

// Show user details in modal
function showUserDetails(user) {
  modalUserName.textContent = user.name;
  modalUserEmail.textContent = user.email || 'N/A';
  modalUserUsername.textContent = user.username || 'N/A';
  modalUserDepartment.textContent = user.department || 'Unassigned';
  modalUserTitle.textContent = user.title || 'N/A';
  modalUserPhone.textContent = user.phoneNumber || 'N/A';
  
  modalUserStatus.innerHTML = '';
  const statusBadge = document.createElement('span');
  statusBadge.className = `status-badge status-${user.state || 'unknown'}`;
  statusBadge.textContent = user.state || 'Unknown';
  modalUserStatus.appendChild(statusBadge);
  
  modalUserPresence.innerHTML = '';
  const presenceBadge = document.createElement('span');
  presenceBadge.className = `presence-badge presence-${user.presence || 'unknown'}`;
  presenceBadge.textContent = formatPresence(user.presence);
  modalUserPresence.appendChild(presenceBadge);
  
  modalUserId.textContent = user.id;
  
  userModal.style.display = 'flex';
}

// Show queue details in modal
async function showQueueDetails(queue) {
  modalQueueName.textContent = queue.name;
  modalQueueDescription.textContent = queue.description || 'N/A';
  modalQueueType.textContent = getQueueType(queue);
  modalQueueId.textContent = queue.id;
  modalQueueModified.textContent = formatDate(queue.dateModified);
  
  // Show the modal
  queueModal.style.display = 'flex';
  
  // Clear and show loading in the members table
  const tbody = queueMembersTable.querySelector('tbody');
  tbody.innerHTML = '<tr><td colspan="3" class="loading-message">Loading queue members...</td></tr>';
  
  // Fetch queue members
  const members = await fetchQueueMembers(queue.id);
  
  // Render members table
  tbody.innerHTML = '';
  
  if (members.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.className = 'loading-message';
    td.textContent = 'No members found for this queue.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    members.forEach(member => {
      const tr = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = member.name || 'N/A';
      
      const joinedCell = document.createElement('td');
      joinedCell.textContent = formatDate(member.joined);
      
      const ringNumberCell = document.createElement('td');
      ringNumberCell.textContent = member.ringNumber || 'N/A';
      
      tr.appendChild(nameCell);
      tr.appendChild(joinedCell);
      tr.appendChild(ringNumberCell);
      
      tbody.appendChild(tr);
    });
  }
}

// Apply filters to the users table
function applyUserFilters() {
  const departmentValue = departmentFilter.value;
  const statusValue = statusFilter.value;
  const presenceValue = presenceFilter.value;
  const searchValue = searchInput.value.toLowerCase();
  
  filteredUsers = users.filter(user => {
    // Department filter
    if (departmentValue && (user.department || 'Unassigned') !== departmentValue) {
      return false;
    }
    
    // Status filter
    if (statusValue && user.state !== statusValue) {
      return false;
    }
    
    // Presence filter
    if (presenceValue && user.presence !== presenceValue) {
      return false;
    }
    
    // Search filter
    if (searchValue) {
      const searchFields = [
        user.name,
        user.email,
        user.username,
        user.department,
        user.title
      ].filter(Boolean).map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(searchValue));
    }
    
    return true;
  });
  
  // Reset to first page
  currentPage = 1;
  
  // Render the table with filtered data
  renderUsersTable();
}

// Apply filters to the queues table
function applyQueueFilters() {
  const typeValue = queueTypeFilter.value;
  const searchValue = searchInput.value.toLowerCase();
  
  filteredQueues = queues.filter(queue => {
    // Type filter
    if (typeValue) {
      const queueType = getQueueType(queue).toLowerCase();
      if (queueType !== typeValue) {
        return false;
      }
    }
    
    // Search filter
    if (searchValue) {
      const searchFields = [
        queue.name,
        queue.description
      ].filter(Boolean).map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(searchValue));
    }
    
    return true;
  });
  
  // Reset to first page
  queuesCurrentPage = 1;
  
  // Render the table with filtered data
  renderQueuesTable();
}

// Perform search
function performSearch() {
  const currentPage = document.querySelector('.page.active').id;
  
  if (currentPage === 'users-page') {
    applyUserFilters();
  } else if (currentPage === 'queues-page') {
    applyQueueFilters();
  } else {
    // If on another page, switch to users page and apply filters
    changePage('users');
    applyUserFilters();
  }
}

// Refresh data
async function refreshData() {
  showLoading();
  
  try {
    // Clear local cache by forcing a server-side refresh
    const response = await fetch('/api/system?refresh=true');
    if (!response.ok) {
      throw new Error('Failed to refresh data');
    }
    
    // Fetch fresh data
    await Promise.all([
      fetchSystemInfo(),
      fetchUsers(),
      fetchQueues(),
      fetchStats()
    ]);
    
    // Update UI
    renderDashboard();
    renderUsersTable();
    renderQueuesTable();
    renderDepartments();
    
    // Update settings
    lastUpdated.textContent = formatDate(new Date());
    
    showToast('Data Refreshed', 'Data has been successfully refreshed.', 'success');
  } catch (error) {
    console.error('Error refreshing data:', error);
    showToast('Error', 'Failed to refresh data. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

// Clear cache
async function clearCache() {
  showLoading();
  
  try {
    // Send request to clear cache
    const response = await fetch('/api/system?clearCache=true');
    if (!response.ok) {
      throw new Error('Failed to clear cache');
    }
    
    // Refresh data
    await refreshData();
    
    showToast('Cache Cleared', 'Cache has been successfully cleared and data refreshed.', 'success');
  } catch (error) {
    console.error('Error clearing cache:', error);
    showToast('Error', 'Failed to clear cache. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

// Change page
function changePage(targetPage) {
  // Update active nav item
  navItems.forEach(item => {
    if (item.getAttribute('data-page') === targetPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update active page
  pages.forEach(page => {
    if (page.id === `${targetPage}-page`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });
}

// Show loading overlay
function showLoading() {
  loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.style.display = 'none';
}

// Show toast notification
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'fas fa-info-circle';
  if (type === 'success') iconClass = 'fas fa-check-circle';
  if (type === 'error') iconClass = 'fas fa-exclamation-circle';
  if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close">&times;</div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
  
  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
}

// Generate colors for charts
function generateColors(count) {
  const baseColors = [
    'rgba(34, 102, 227, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 205, 86, 0.7)',
    'rgba(201, 203, 207, 0.7)',
    'rgba(255, 99, 71, 0.7)',
    'rgba(46, 204, 113, 0.7)',
    'rgba(142, 68, 173, 0.7)'
  ];
  
  // If we need more colors than in our base set, generate them
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  
  for (let i = baseColors.length; i < count; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  
  return colors;
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch {
    return 'Invalid Date';
  }
}

// Format presence state
function formatPresence(presence) {
  if (!presence) return 'Unknown';
  
  // Replace underscores with spaces and capitalize each word
  return presence.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Get queue type
function getQueueType(queue) {
  if (!queue.mediaSettings) return 'Unknown';
  
  if (queue.mediaSettings.voice?.enabled) return 'Voice';
  if (queue.mediaSettings.chat?.enabled) return 'Chat';
  if (queue.mediaSettings.email?.enabled) return 'Email';
  if (queue.mediaSettings.social?.enabled) return 'Social';
  if (queue.mediaSettings.callback?.enabled) return 'Callback';
  
  return 'Unknown';
}
