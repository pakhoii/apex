import uuid
import json
from io import BytesIO
from fastapi import UploadFile, HTTPException, status
from minio import Minio
from minio.error import S3Error

# Configuration MinIO
MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "apex_minio"
MINIO_SECRET_KEY = "iloveanime"
MINIO_BUCKET_NAME = "apex"

BUCKET_POLICY = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": ["*"]},
      "Action": ["s3:GetObject"],
      "Resource": [f"arn:aws:s3:::{MINIO_BUCKET_NAME}/*"]
    }
  ]
}

try:
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False # Set to True if using HTTPS
    )
except Exception as e:
    print(f"Error connecting to MinIO: {e}")
    minio_client = None

class StorageService:
    def upload_image(self, file: UploadFile, folder: str) -> str:
        if not minio_client:
            raise HTTPException(status_code=503, detail="Storage service is unavailable")

        try:
            # Check whether the bucket exists, if not create it
            found = minio_client.bucket_exists(MINIO_BUCKET_NAME)
            if not found:
                minio_client.make_bucket(MINIO_BUCKET_NAME)
                minio_client.set_bucket_policy(MINIO_BUCKET_NAME, json.dumps(BUCKET_POLICY))

            # 2. Read file content into memory
            contents = file.file.read()
            file_size = len(contents)
            file_data = BytesIO(contents)

            # 3. Create a unique filename to avoid collisions
            file_extension = file.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            object_name = f"{folder}/{unique_filename}"

            # 4. Upload file to MinIO
            minio_client.put_object(
                MINIO_BUCKET_NAME,
                object_name,
                file_data,
                file_size,
                content_type=file.content_type
            )

            # 5. Return the file URL
            file_url = f"http://{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{object_name}"
            return file_url

        except S3Error as exc:
            print("Error occurred during file upload.", exc)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload file to storage.")
        finally:
            file.file.close()

storage_service = StorageService()