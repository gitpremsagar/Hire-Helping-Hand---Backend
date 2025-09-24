# Job Status Management Fields Explanation

## Overview
The Job model in the freelancing platform includes four Boolean fields that control the lifecycle and visibility of jobs. These fields provide granular control over job status while maintaining data integrity and audit capabilities.

## Status Management Fields

### 1. `isActive` (Boolean, default: true)
**Purpose**: Controls whether the job is currently active and visible to freelancers

- **`true`**: Job is live and accepting proposals
- **`false`**: Job is temporarily inactive (not accepting new proposals)

**Use cases**:
- Temporarily pause a job without deleting it
- Hide jobs during maintenance
- Disable jobs that have reached proposal limits

### 2. `isArchived` (Boolean, default: false)
**Purpose**: Marks jobs that are no longer relevant but should be kept for historical/analytical purposes

- **`true`**: Job is archived (hidden from search, but data preserved)
- **`false`**: Job is not archived

**Use cases**:
- Completed jobs that should be removed from active listings
- Old jobs that are no longer relevant
- Jobs that have been replaced by newer versions
- Maintains historical data for analytics and reporting

### 3. `isDeleted` (Boolean, default: false)
**Purpose**: Soft delete mechanism - marks jobs for deletion without permanently removing data

- **`true`**: Job is marked for deletion (soft delete)
- **`false`**: Job is not deleted

**Use cases**:
- Allows recovery of accidentally deleted jobs
- Maintains referential integrity with related records (proposals, contracts)
- Compliance with data retention policies
- Audit trails for platform administration

### 4. `isPaused` (Boolean, default: false)
**Purpose**: Temporarily suspends a job while keeping it in the system

- **`true`**: Job is paused (not accepting new proposals, but existing proposals remain)
- **`false`**: Job is not paused

**Use cases**:
- Client needs to review existing proposals before continuing
- Temporary halt due to budget or timeline changes
- Waiting for additional information from client
- Brief interruption in the hiring process

## Job Lifecycle Flow

```
Job Creation → isActive: true, isArchived: false, isDeleted: false, isPaused: false
     ↓
Temporary Pause → isPaused: true (job still visible but not accepting new proposals)
     ↓
Resume → isPaused: false
     ↓
Complete/Close → isActive: false, isArchived: true
     ↓
Delete → isDeleted: true (soft delete)
```

## Benefits of This Approach

1. **Flexibility**: Multiple ways to control job visibility and status
2. **Data Integrity**: Soft deletes preserve relationships with proposals and contracts
3. **Analytics**: Historical data remains available for reporting
4. **User Experience**: Clear status indicators for both clients and freelancers
5. **Administrative Control**: Platform administrators can manage job lifecycle effectively

## Implementation Notes

- All fields are Boolean with appropriate default values
- These fields work together to create a comprehensive job lifecycle management system
- This design pattern is common in modern applications where you need granular control over entity states while maintaining data integrity and audit capabilities
- The soft delete mechanism (`isDeleted`) is particularly important for maintaining referential integrity in a relational database context

## Database Schema Reference

```prisma
model Job {
  // ... other fields ...
  isActive    Boolean  @default(true)
  isArchived  Boolean  @default(false)
  isDeleted   Boolean  @default(false)
  isPaused    Boolean  @default(false)
  // ... other fields ...
}
```

## Related Fields

These status fields work in conjunction with other job management fields:
- `status` (JobStatus enum): Overall job status (OPEN, IN_PROGRESS, COMPLETED, etc.)
- `visibility` (JobVisibility enum): Job visibility level (PUBLIC, PRIVATE, INVITE_ONLY)
- `pauseReason` (String): Optional reason for pausing the job
