import fs from 'fs-extra';
import path from 'path';
import config from '../config/settings.json'; // Assuming settings.json holds the `autoCronDB` config
import cron from 'node-cron';

const MEDIA_DIRECTORY = path.join(__dirname, '../database/');
const { autoCronDB, cronTime } = config; // autoCronDB is the setting to enable/disable the cron job

// Function to clear media files from the database
export const clearDatabase = async (): Promise<void> => {
  try {
    // Check if the media directory exists
    if (!fs.existsSync(MEDIA_DIRECTORY)) {
      console.log('Media directory does not exist.');
      return;
    }

    // Read all files in the media directory
    const files = await fs.readdir(MEDIA_DIRECTORY);

    if (files.length === 0) {
      console.log('No files to delete.');
      return;
    }

    // Iterate over the files and delete them
    for (const file of files) {
      const filePath = path.join(MEDIA_DIRECTORY, file);
      await fs.remove(filePath);
      console.log(`Deleted file: ${file}`);
    }
  } catch (error) {
    console.error('Error clearing media files:', error);
  }
};

// Cron job to clear media files periodically
export const setupCronJob = (): void => {
  if (autoCronDB) {
    const job = cron.schedule(cronTime || '0 0 * * *', async () => {
      console.log('Running scheduled cron job to clear media...');
      await clearDatabase();
    });

    job.start();
    console.log(`Cron job started with schedule: ${cronTime}`);
  } else {
    console.log('Auto clear media cron job is disabled.');
  }
};

// Call setupCronJob to initiate cron job if autoCronDB is true
if (autoCronDB) {
  setupCronJob();
}