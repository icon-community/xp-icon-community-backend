#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Function to check if the required environment variables are set correctly
health_check() {
  echo "Performing health check..."

  # List of required variables
  REQUIRED_VARS=("CONTAINER_NAME" "S3_BUCKET_NAME" "MONGO_PORT" "MONGO_USER" "MONGO_PASSWORD" "MONGO_DB_NAME")

  # Check if each variable is set
  for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
      echo "Error: $var is not set in the .env file."
      exit 1
    fi
  done

  echo "Health check passed! All required variables are set."
}

# Set the rest of the variables
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="./backups"
S3_BACKUP_DIR_TEMP="./backups_temp"
BACKUP_FILE_NAME="mongo_backup_${TIMESTAMP}.gz"
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE_NAME}"
S3_BACKUP_PATH=s3://${S3_BUCKET_NAME}/mongodb-backups/


# Function to perform backup
backup() {
  echo "Starting MongoDB backup at $TIMESTAMP..."

  # Ensure the backup directory exists, handle errors gracefully
  if ! mkdir -p $BACKUP_DIR; then
    echo "Warning: Could not create or access backup directory $BACKUP_DIR. Proceeding..."
  fi

  # Run the MongoDB dump command inside the container
  docker exec "$CONTAINER_NAME" sh -c "mongodump --archive=$BACKUP_FILE_NAME --gzip --username=$MONGO_USER --password=$MONGO_PASSWORD --authenticationDatabase admin --db=$MONGO_DB_NAME"

  if [ $? -eq 0 ]; then
    echo "MongoDB dump completed successfully."
  else
    echo "Error: Failed to dump MongoDB data."
    exit 1
  fi

  # Copy the backup from the container to the host
  docker cp $CONTAINER_NAME:$BACKUP_FILE_NAME $BACKUP_FILE

  # Upload the backup to S3
  aws s3 cp $BACKUP_FILE $S3_BACKUP_PATH

  if [ $? -eq 0 ]; then
    echo "Backup uploaded to S3 successfully."
  else
    echo "Error: Failed to upload backup to S3."
    exit 1
  fi

  # Cleanup old backups (optional: keep last 7 days)
  # find $BACKUP_DIR -type f -mtime +7 -name "*.gz" -exec rm {} \;
  find $BACKUP_DIR -type f -mtime +7 -name "*.gz" -exec echo "Deleting old backup file: " {} \; -exec rm {} \;

  echo "Backup completed successfully at $TIMESTAMP and saved to $BACKUP_FILE."
}

# Function to list backups in S3
list_backups_s3() {
  echo "Listing MongoDB backups in S3..."
  aws s3 ls $S3_BACKUP_PATH --recursive
}

# Function to list backups in the local directory
list_backups_local() {
  echo "Listing MongoDB backups in $BACKUP_DIR..."
  ls -lh $BACKUP_DIR
}

# Function to restore a given backup
restore() {
  if [ -z "$1" ]; then
    echo "Error: Please provide the backup file to restore."
    exit 1
  fi

  RESTORE_FILE=$1

  if [ ! -e "$RESTORE_FILE" ]; then
    echo "Error: Backup file $RESTORE_FILE not found in the host."
    exit 1
  fi

  echo "Copying MongoDB backup file to the container..."

  # Copy the backup file to the container
  docker cp "$RESTORE_FILE" "$CONTAINER_NAME:/tmp/$(basename $RESTORE_FILE)"

  if [ $? -ne 0 ]; then
    echo "Error: Failed to copy backup file to the container."
    exit 1
  fi

  echo "Restoring MongoDB backup from $RESTORE_FILE..."

  # Run the MongoDB restore command inside the container

  docker exec "$CONTAINER_NAME" sh -c "mongorestore --archive=/tmp/$(basename $RESTORE_FILE) --gzip --drop --username=$MONGO_USER --password=$MONGO_PASSWORD --authenticationDatabase admin --db=$MONGO_DB_NAME"

  if [ $? -eq 0 ]; then
    echo "MongoDB restore completed successfully."
  else
    echo "Error: Failed to restore MongoDB data."
    exit 1
  fi

  echo "Cleaning up temporary backup file in the container..."
  docker exec "$CONTAINER_NAME" sh -c "rm /tmp/$(basename $RESTORE_FILE)"

  if [ $? -ne 0 ]; then
    echo "Warning: Failed to clean up temporary backup file in the container."
  fi

  echo "Restore completed successfully."
}

# Function to download a backup from S3 and put it in the S3_BACKUP_DIR_TEMP
download_backup() {
  if [ -z "$1" ]; then
    echo "Error: Please provide the backup file to download."
    exit 1
  fi

  DOWNLOAD_FILE=$1

  # Check if the backup file exists in S3
  aws s3 ls $S3_BACKUP_PATH$DOWNLOAD_FILE > /dev/null
  if [ $? -ne 0 ]; then
    echo "Error: Backup file $DOWNLOAD_FILE not found in S3."
    exit 1
  fi

  # Ensure the temporary backup directory exists
  if [ ! -d "$S3_BACKUP_DIR_TEMP" ]; then
    mkdir -p "$S3_BACKUP_DIR_TEMP"
  fi

  echo "Downloading MongoDB backup from S3..."
  aws s3 cp $S3_BACKUP_PATH$DOWNLOAD_FILE $S3_BACKUP_DIR_TEMP

  if [ $? -eq 0 ]; then
    echo "Backup downloaded from S3 successfully."
  else
    echo "Error: Failed to download backup from S3."
    exit 1
  fi

  echo "Download completed successfully."
}

# Function to display help information
help() {
  echo "MongoDB Backup and Restore Script"
  echo
  echo "Usage: ./mongo_backup_manager.sh [command] [options]"
  echo
  echo "Commands:"
  echo "  backup                 Perform a MongoDB backup and upload it to S3."
  echo "  restore [file]         Restore a MongoDB backup from a local file or S3."
  echo "  list_backups_s3        List all backups available in the S3 bucket."
  echo "  list_backups_local     List all backups in the local backup directory."
  echo "  download_backup [file] Download a backup from S3 and store it locally."
  echo "  help                   Display this help message."
  echo
  echo "Options:"
  echo "  -h, --help          Display this help message."
  echo "  [file]              The name of the backup file (e.g., mongo_backup_2024-11-20.gz)."
  echo
  echo "Examples:"
  echo "  ./mongo_backup_manager.sh backup"
  echo "    Performs a backup and uploads it to S3."
  echo
  echo "  ./mongo_backup_manager.sh restore mongo_backup_2024-11-20.gz"
  echo "    Restores the backup 'mongo_backup_2024-11-20.gz' from the local directory or S3."
  echo
  echo "  ./mongo_backup_manager.sh list_backups_s3"
  echo "    Lists all backups available in the S3 bucket."
  echo
  echo "  ./mongo_backup_manager.sh download mongo_backup_2024-11-20.gz"
  echo "    Downloads the backup 'mongo_backup_2024-11-20.gz' from S3 to the local directory."
  echo
  echo "Note:"
  echo "  Ensure the .env file is present in the same directory for environment variable configuration."
  echo "  You can configure the backup directory, S3 bucket name, and MongoDB connection details in the .env file."
}

# Call the help function if the script is run without arguments or with the 'help' command
if [ $# -eq 0 ] || [[ "$1" == "help" ]] || [[ "$1" == "-h" ]]; then
  help
  exit 0
fi

# Main logic to parse arguments and call the corresponding function
if [ "$1" == "backup" ]; then
  # Call the backup function
  health_check
  backup
elif [ "$1" == "list_backups_s3" ]; then
  # Call the list_backups_s3 function
  health_check
  list_backups_s3
elif [ "$1" == "list_backups_local" ]; then
  # Call the list_backups_local function
  health_check
  list_backups_local
elif [ "$1" == "restore" ]; then
  # Call the restore function
  health_check
  restore "$2"
elif [ "$1" == "download_backup" ]; then
  # Call the download_backup function
  health_check
  download_backup "$2"
elif [ "$1" == "help" ]; then
  # Call the help function
  help
else
  # If the command is invalid, print usage
  echo "Usage: $0 {backup|restore|download} [file]"
  exit 1
fi
