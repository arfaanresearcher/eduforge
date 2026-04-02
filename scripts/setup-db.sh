#!/bin/bash
echo "Running EduForge database setup..."
npx prisma generate
npx prisma db push
npx prisma db seed
echo "Database ready."
