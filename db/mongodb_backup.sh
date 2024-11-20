#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Set the rest of the variables
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/mongo_backup_${TIMESTAMP}.gz"
S3_BACKUP_PATH=s3://${S3_BUCKET_NAME}/mongodb-backups/

# Ensure the backup directory exists, handle errors gracefully
if ! mkdir -p $BACKUP_DIR; then
  echo "Warning: Could not create or access backup directory $BACKUP_DIR. Proceeding..."
fi

# Run the MongoDB dump command inside the container
docker exec $CONTAINER_NAME mongodump --archive --gzip --out /data/backup

# Copy the backup from the container to the host
docker cp $CONTAINER_NAME:/data/backup $BACKUP_FILE

# Upload the backup to S3
if aws s3 cp $BACKUP_FILE $S3_BACKUP_PATH; then
  echo "Backup successfully uploaded to $S3_BACKUP_PATH"
else
  echo "Error: Failed to upload backup to S3"
fi

# Cleanup old backups (optional: keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -name "*.gz" -exec rm {} \;

echo "Backup completed successfully at $TIMESTAMP and saved to $BACKUP_FILE."
