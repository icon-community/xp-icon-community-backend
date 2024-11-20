# MongoDB Backup Script with AWS S3 Upload

This script automates the process of backing up a MongoDB database running in a Docker container. It also uploads the backups to an AWS S3 bucket for safe storage and retention.

---

## Features
- Creates compressed backups of your MongoDB database using `mongodump`.
- Stores backups locally in a specified directory.
- Uploads backups to an AWS S3 bucket.
- Automatically cleans up old backups from the local directory (optional).

---

## Prerequisites

### **1. MongoDB in Docker**
- The MongoDB instance must be running in a Docker container.
- Update the `CONTAINER_NAME` variable in the script to match your MongoDB container name.

### **2. AWS CLI**
- Install the AWS CLI:
  ```bash
  sudo apt-get install awscli

  # or

  brew install awscli
```
- Configure the AWS CLI with your AWS credentials:
  ```bash
  aws configure
  ```
  Provide:
  - AWS Access Key ID
  - AWS Secret Access Key
  - Default region (e.g., `us-east-1`)
  - Default output format (e.g., `json`)


### **3. Permissions**
Ensure the IAM user associated with the AWS credentials has the following S3 permissions:
- `s3:PutObject`
- `s3:ListBucket`

### **4. Docker**
Ensure Docker is installed on the host machine.

### **5. Misc installations**
* `sudo apt instal dotenv`

---

## Environment Variables.

Create a `.env` file in the same directory as the script and add the following environment variables:

```bash
# Set variables
BACKUP_DIR=./backups/
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
CONTAINER_NAME=mongodb-prod
BACKUP_FILE="${BACKUP_DIR}/mongo_backup_${TIMESTAMP}.gz"
S3_BUCKET_NAME=my-s3-bucket-name
S3_BACKUP_PATH=s3://${S3_BUCKET_NAME}/mongodb-backups/
```
| Variable           | Description                                                                |
|--------------------|----------------------------------------------------------------------------|
| `BACKUP_DIR`       | Full local backup path.                                                    |
| `CONTAINER_NAME`   | Name of the MongoDB container.                                             |
| `TIMESTAMP`        | Timestamp for uniquely naming backup files.                               |
| `BACKUP_FILE`      | Full path to the backup file.                                              |
| `S3_BUCKET_NAME`   | Name of the AWS S3 bucket where backups will be stored.                   |
| `S3_BACKUP_PATH`   | S3 path for uploading backups.                                             |

---

## How to Use
1. Clone or download the Script. Save the script file as `mongodb_backup.sh`.
2. Make the script executable:
   ```bash
   chmod +x mongodb_backup.sh
   ```
3. Edit the script and update the variables as needed.

4. Automate with Cron
* Schedule the cron job
```bash
crontab -e
```
* Add the following line
```bash
0 * * * * /path/to/mongodb_backup.sh >> /var/log/mongodb_backup.log 2>&1
```
