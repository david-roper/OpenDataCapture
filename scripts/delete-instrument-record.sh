#!/usr/bin/env bash
# 
# Delete a instrument record database entry

read -p "Enter file path to docker yaml file: " docker_file
read -p "Enter the type of MongoDB instance (development or production): " instance_type
read -p "Enter the instrument record ID to delete: " id


# Run mongosh to delete the document with the given _id
docker compose -f $docker_file exec -T mongo mongosh --quiet --eval <<EOF
use open-data-capture-$instance_type
db.InstrumentRecordModel.deleteOne({ _id: ObjectId($id) })
EOF

