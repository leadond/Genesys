import { faker } from '@faker-js/faker';

/**
 * Generate mock users
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of mock users
 */
export function generateMockUsers(count) {
  console.log(`Generating ${count} mock users...`);
  
  const users = [];
  const departments = ['Sales', 'Support', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations'];
  const states = ['active', 'inactive', 'deactivated'];
  const presenceStates = ['AVAILABLE', 'AWAY', 'BUSY', 'BREAK', 'MEAL', 'MEETING', 'TRAINING', 'OFF_QUEUE'];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      id: `mock-${faker.string.uuid()}`,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      username: faker.internet.userName({ firstName, lastName }),
      department: faker.helpers.arrayElement(departments),
      title: faker.person.jobTitle(),
      state: faker.helpers.arrayElement(states),
      presence: faker.helpers.arrayElement(presenceStates),
      routingStatus: faker.helpers.arrayElement(['IDLE', 'INTERACTING', 'NOT_RESPONDING', 'OFF_QUEUE']),
      phoneNumber: faker.phone.number(),
      createdDate: faker.date.past({ years: 2 }).toISOString(),
      lastModifiedDate: faker.date.recent({ days: 30 }).toISOString(),
      manager: Math.random() > 0.7 ? null : {
        id: `mock-${faker.string.uuid()}`,
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
      }
    });
  }
  
  return users;
}

/**
 * Generate mock queues
 * @param {number} count - Number of queues to generate
 * @returns {Array} Array of mock queues
 */
export function generateMockQueues(count) {
  console.log(`Generating ${count} mock queues...`);
  
  const queues = [];
  const queueTypes = ['voice', 'chat', 'email', 'social', 'callback'];
  
  for (let i = 0; i < count; i++) {
    const queueType = faker.helpers.arrayElement(queueTypes);
    
    queues.push({
      id: `mock-queue-${faker.string.uuid()}`,
      name: `${queueType.charAt(0).toUpperCase() + queueType.slice(1)} ${faker.word.adjective()} Queue`,
      description: faker.lorem.sentence(),
      dateModified: faker.date.recent({ days: 30 }).toISOString(),
      memberCount: faker.number.int({ min: 5, max: 50 }),
      mediaSettings: {
        [queueType]: {
          enabled: true,
          skillEvaluationMethod: 'BEST'
        }
      }
    });
  }
  
  return queues;
}

/**
 * Generate mock queue members
 * @param {Array} queues - Array of queues
 * @param {Array} users - Array of users
 * @returns {Object} Object mapping queue IDs to arrays of members
 */
export function generateMockQueueMembers(queues, users) {
  console.log(`Generating mock queue members...`);
  
  const queueMembers = {};
  
  queues.forEach(queue => {
    const memberCount = queue.memberCount || faker.number.int({ min: 5, max: 20 });
    const members = [];
    
    // Randomly select users for this queue
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, memberCount);
    
    selectedUsers.forEach(user => {
      members.push({
        id: user.id,
        name: user.name,
        joined: faker.date.past({ years: 1 }).toISOString(),
        ringNumber: faker.number.int({ min: 1, max: 5 })
      });
    });
    
    queueMembers[queue.id] = members;
  });
  
  return queueMembers;
}

/**
 * Simulate pagination for mock data
 * @param {Array} data - Data to paginate
 * @param {Function} progressCallback - Callback for reporting progress
 * @returns {Promise} Promise that resolves when pagination is complete
 */
export async function simulatePagination(data, progressCallback) {
  const pageSize = 25;
  const totalPages = Math.ceil(data.length / pageSize);
  let totalFetched = 0;
  
  for (let page = 1; page <= totalPages; page++) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const pageData = data.slice(startIndex, endIndex);
    
    totalFetched += pageData.length;
    
    // Report progress
    if (progressCallback) {
      progressCallback(page, pageData.length, totalFetched, data.length);
    }
  }
}
