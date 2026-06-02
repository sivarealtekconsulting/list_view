import { describe, it, expect } from 'vitest';
import jobsData from '../data/suryaJobs.json';


// 1
it('should not have empty job titles', () => {
  const jobTitle = jobsData.jobs.find(
    (job) =>
      !job.title?.trim() ||
      job.title.trim() === '-'
  );

  if (jobTitle) {
    throw new Error(
      `Title is empty or '-' for Job ID: ${jobTitle.id}, Key: ${jobTitle.key}`
    );
  }
});



// 2
it('should not have empty locations', () => {
  const jobLocation = jobsData.jobs.find(
    (job) =>
      !job.location?.trim() ||
      job.location.trim() === '-'
  );

  if (jobLocation) {
    throw new Error(
      `Location is empty or '-' for Job ID: ${jobLocation.id}, Key: ${jobLocation.key}`
    );
  }
});


// 3
it('should not have empty experience values', () => {
  const jobExperience = jobsData.jobs.find(
    (job) =>
      !job.experience?.trim() ||
      job.experience.trim() === '-'
  );

  if (jobExperience) {
    throw new Error(
      `Experience is empty or '-' for Job ID: ${jobExperience.id}, Key: ${jobExperience.key}`
    );
  }
});


// 4
it('should not have empty employment types', () => {
  const jobEmploymentType = jobsData.jobs.find(
    (job) =>
      !job.employmentType?.trim() ||
      job.employmentType.trim() === '-'
  );

  if (jobEmploymentType) {
    throw new Error(
      `Employment Type is empty or '-' for Job ID: ${jobEmploymentType.id}, Key: ${jobEmploymentType.key}`
    );
  }
});



// 5
it('should not have empty status values', () => {
  const jobStatus = jobsData.jobs.find(
    (job) =>
      !job.status?.trim() ||
      job.status.trim() === '-'
  );

  if (jobStatus) {
    throw new Error(
      `Status is empty or '-' for Job ID: ${jobStatus.id}, Key: ${jobStatus.key}`
    );
  }
});


// 6
it('should not have empty client names', () => {
  const jobClientName = jobsData.jobs.find(
    (job) =>
      !job.client?.trim() ||
      job.client.trim() === '-'
  );

  if (jobClientName) {
    throw new Error(
      `Client Name is empty or '-' for Job ID: ${jobClientName.id}, Key: ${jobClientName.key}`
    );
  }
});


// 7
it('should not have empty created dates', () => {
  const jobCreatedDates = jobsData.jobs.find(
    (job) =>
      !job.createdAt?.trim() ||
      job.createdAt.trim() === '-'
  );

  if (jobCreatedDates) {
    throw new Error(
      `Created Date is empty or '-' for Job ID: ${jobCreatedDates.id}, Key: ${jobCreatedDates.key}`
    );
  }
});


// 8
it('should not have empty location types', () => {
  const jobLocationType = jobsData.jobs.find(
    (job) =>
      !job.locationType?.trim() ||
      job.locationType.trim() === '-'
  );

  if (jobLocationType) {
    throw new Error(
      `Location Type is empty or '-' for Job ID: ${jobLocationType.id}, Key: ${jobLocationType.key}`
    );
  }
});


// 9
it('should have valid client rate', () => {
  const jobClientRate = jobsData.jobs.find(
    (job) =>
      job.clientRate === null ||
      job.clientRate === undefined
  );

  if (jobClientRate) {
    throw new Error(
      `Client Rate is missing for Job ID: ${jobClientRate.id}, Key: ${jobClientRate.key}`
    );
  }
});


// 10
it('should have valid pipeline count', () => {
  const jobPipelineCount = jobsData.jobs.find(
    (job) =>
      job.pipeline === null ||
      job.pipeline === undefined
  );

  if (jobPipelineCount) {
    throw new Error(
      `Pipeline Count is missing for Job ID: ${jobPipelineCount.id}, Key: ${jobPipelineCount.key}`
    );
  }
});