import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Save data to a JSON file
 * @param {string} filePath - Path to the file
 * @param {Object} data - Data to save
 * @returns {Promise} Promise that resolves when the file is saved
 */
export async function saveToJsonFile(filePath, data) {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Save data to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Load data from a JSON file
 * @param {string} filePath - Path to the file
 * @param {Object} defaultValue - Default value to return if file doesn't exist
 * @returns {Promise<Object>} Promise that resolves with the loaded data
 */
export async function loadFromJsonFile(filePath, defaultValue = null) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File not found: ${filePath}, returning default value`);
      return defaultValue;
    }
    console.error(`Error loading data from ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} Promise that resolves with true if the file exists
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a file is older than a specified time
 * @param {string} filePath - Path to the file
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {Promise<boolean>} Promise that resolves with true if the file is older than maxAge
 */
export async function isFileOlderThan(filePath, maxAge) {
  try {
    const stats = await fs.stat(filePath);
    const fileAge = Date.now() - stats.mtime.getTime();
    return fileAge > maxAge;
  } catch {
    return true; // If file doesn't exist, consider it older
  }
}

/**
 * Display a sample of users
 * @param {Array} users - Array of users
 * @param {number} sampleSize - Number of users to display
 */
export function displayUserSample(users, sampleSize = 5) {
  if (!users || users.length === 0) {
    console.log('No users to display');
    return;
  }
  
  const sample = users.slice(0, Math.min(sampleSize, users.length));
  
  console.log('\n===== User Sample =====');
  sample.forEach((user, index) => {
    console.log(`\nUser ${index + 1}:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Department: ${user.department || 'N/A'}`);
    console.log(`  State: ${user.state || 'N/A'}`);
    console.log(`  Presence: ${user.presence || 'N/A'}`);
  });
  console.log('\nTotal users:', users.length);
  console.log('======================\n');
}

/**
 * Report progress during data fetching
 * @param {number} page - Current page number
 * @param {number} pageSize - Number of items in the current page
 * @param {number} totalFetched - Total number of items fetched so far
 * @param {number} totalItems - Total number of items available
 */
export function reportProgress(page, pageSize, totalFetched, totalItems) {
  const percent = totalItems ? Math.round((totalFetched / totalItems) * 100) : 0;
  console.log(`Fetched page ${page} (${pageSize} items) - ${totalFetched}/${totalItems} (${percent}%)`);
}

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Get cache file path
 * @param {string} filename - Cache file name
 * @returns {string} Full path to the cache file
 */
export function getCacheFilePath(filename) {
  return path.join(__dirname, '..', config.outputDir, filename);
}

/**
 * Check if cache is valid
 * @param {string} filename - Cache file name
 * @returns {Promise<boolean>} Promise that resolves with true if the cache is valid
 */
export async function isCacheValid(filename) {
  const filePath = getCacheFilePath(filename);
  
  // Check if file exists and is not too old
  const exists = await fileExists(filePath);
  if (!exists) return false;
  
  return !(await isFileOlderThan(filePath, config.cacheExpiration));
}
